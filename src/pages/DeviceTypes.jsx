import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Card,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import BlockIcon from "@mui/icons-material/Block";
import { AdminService, DeviceService, isMockActive } from "../api";
import { DataState } from "../components/DataState";
import { useFeedback } from "../hooks/useFeedback";


const TYPE_TITLE = {
  PENDANT: "Pendant Devices",
  WRIST_BAND: "Wrist Band Devices",
  WATCH: "Watch Devices",
  PILL_DISPENSER: "Pill Dispenser Devices",
  UNKNOWN: "Unknown Devices",
};

const batteryColor = (b) => (b == null ? "#8C7E76" : b <= 20 ? "#EF4444" : b <= 50 ? "#F59E0B" : "#10B981");

const formatSeen = (ms) => {
  if (!ms) return "—";
  const d = new Date(String(ms).length === 10 ? Number(ms) * 1000 : ms);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

import { useParams } from "react-router-dom";

export const DeviceTypes = () => {
  const { typeFilter } = useParams();
  const selectedType = typeFilter ? typeFilter.toUpperCase() : "PENDANT";
  const [devices, setDevices] = useState([]);
  const [isMock, setIsMock] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { notify, confirm } = useFeedback();

  // Edit Device dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const handleOpenEditDialog = (device) => {
    setEditForm({
      id: device.id,
      name: device.name,
      imei: device.imei,
      model: device.model || "",
      network: device.network || "4G",
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditForm(null);
    setEditSaving(false);
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    if (!editForm.name.trim()) {
      notify("Device name is required.", "error");
      return;
    }

    const payload = {
      deviceName: editForm.name.trim(),
      model: editForm.model.trim() || undefined,
      networkType: editForm.network || "4G",
      deviceType: selectedType,
      imei: editForm.imei,
    };

    setEditSaving(true);
    DeviceService.updateDevice(editForm.id, payload)
      .then(() => {
        notify("Device updated successfully.", "success");
        fetchDevices();
        handleCloseEditDialog();
      })
      .catch((err) => {
        console.error("Failed to update device:", err);
        notify(`Update failed: ${err?.message || "Unknown error"}`, "error");
        setEditSaving(false);
      });
  };

  const handleRotateCredentials = async (device) => {
    const ok = await confirm({
      title: "Rotate credentials?",
      message: `Are you sure you want to rotate access credentials for ${device.name}?`,
      confirmText: "Rotate",
    });
    if (!ok) return;
    DeviceService.rotateDeviceCredentials(device.id)
      .then(() => {
        notify("Credentials rotated successfully.", "success");
      })
      .catch((err) => {
        console.error("Failed to rotate credentials:", err);
        notify(`Rotation failed: ${err?.message || "Unknown error"}`, "error");
      });
  };

  const handleRevokeDevice = async (device) => {
    const ok = await confirm({
      title: "Revoke device?",
      message: `Are you sure you want to revoke ${device.name}? It will stop sending telemetry data. This cannot be undone.`,
      confirmText: "Revoke",
      danger: true,
    });
    if (!ok) return;
    DeviceService.revokeDevice(device.id)
      .then(() => {
        notify("Device revoked.", "success");
        fetchDevices();
      })
      .catch((err) => {
        console.error("Failed to revoke device:", err);
        notify(`Revocation failed: ${err?.message || "Unknown error"}`, "error");
      });
  };

  useEffect(() => {
    setSearchQuery("");
  }, [typeFilter]);

  const fetchDevices = useCallback(() => {
    setPageError(null);
    setPageLoading(true);
    AdminService.adminGetDevices()
      .then((res) => {
        setPageLoading(false);
        const list = Array.isArray(res) ? res : res?.data ?? [];
        
        // Filter by selectedType on the frontend to guarantee identical data
        const filteredList = list.filter((d) => {
          const type = (d.deviceType || d.type || "UNKNOWN").toUpperCase();
          return type === selectedType;
        });

        setDevices(
          filteredList.map((d) => ({
            id: d.id || d.imei,
            name: d.deviceName || "Unnamed Device",
            imei: d.imei || d.deviceIdentifier || "—",
            type: d.deviceType || d.type || "UNKNOWN",
            status: d.status || "—",
            battery: d.batteryLevel,
            model: d.model || "—",
            network: d.networkType || "—",
            seenAt: d.lastSeen || null,
          }))
        );
        setIsMock(isMockActive());
      })
      .catch((err) => {
        console.warn("Failed to fetch devices:", err);
        setPageLoading(false);
        setDevices([]);
        setPageError(err?.message || "The server could not be reached. Please try again.");
      });
  }, [selectedType]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const filteredDevices = devices.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.name.toLowerCase().includes(q) ||
      d.imei.toLowerCase().includes(q) ||
      d.model.toLowerCase().includes(q) ||
      d.network.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    );
  });

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={fetchDevices}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        {/* Header */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A0E07", letterSpacing: "-0.5px" }}>
              {TYPE_TITLE[selectedType] || "Device Registry"}
            </Typography>
            {isMock && (
              <Chip
                label="MOCK"
                size="small"
                sx={{ bgcolor: "#000", color: "#fff", fontWeight: 700, fontSize: "8px", height: 16, borderRadius: "3px", "& .MuiChip-label": { px: 0.5 } }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "#8C7E76", mt: 0.5 }}>
            {devices.length} active {selectedType.toLowerCase().replace('_', ' ')}s currently monitored.
          </Typography>
        </Box>


        {/* Search Bar */}
        <Card sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
          <TextField
            placeholder={`Search by device name, identifier/IMEI, status, or model...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              flex: "1 1 300px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "& fieldset": { borderColor: "divider" }
              }
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                  </InputAdornment>
                )
              }
            }}
          />
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, ml: "auto" }}>
            Showing {filteredDevices.length} of {devices.length} devices
          </Typography>
        </Card>

        {/* Devices table */}
        <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#FAF8F6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>DEVICE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>BATTERY</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>MODEL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>NETWORK</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>LAST SEEN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }} align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#8C7E76" }}>
                    No {selectedType.toLowerCase().replace('_', ' ')} devices found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDevices.map((d) => (
                  <TableRow key={d.id} sx={{ "&:hover": { backgroundColor: "#FCFAF8" } }}>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ fontWeight: 650, color: "#1A0E07", fontSize: "0.9rem" }}>{d.name}</Typography>
                      <Typography variant="body2" sx={{ color: "#8C7E76", fontSize: "0.75rem" }}>IMEI {d.imei}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ color: d.status === "ACTIVE" ? "#10B981" : d.status === "REVOKED" ? "#EF4444" : "#8C7E76", fontWeight: 700, fontSize: "0.85rem" }}>
                        {d.status}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ color: batteryColor(d.battery), fontWeight: 700, fontSize: "0.85rem" }}>
                        {d.battery != null ? `${d.battery}%` : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75, color: "#1A0E07", fontSize: "0.85rem" }}>{d.model}</TableCell>
                    <TableCell sx={{ py: 1.75, color: "#1A0E07", fontSize: "0.85rem" }}>{d.network}</TableCell>
                    <TableCell sx={{ py: 1.75, color: "#1A0E07", fontSize: "0.85rem" }}>{formatSeen(d.seenAt)}</TableCell>
                    <TableCell sx={{ py: 1.75 }} align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Edit Device">
                          <IconButton size="small" onClick={() => handleOpenEditDialog(d)} sx={{ color: "text.secondary" }}>
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rotate Credentials">
                          <IconButton size="small" onClick={() => handleRotateCredentials(d)} sx={{ color: "text.secondary" }}>
                            <RefreshIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        {d.status !== "REVOKED" && (
                          <Tooltip title="Revoke Device">
                            <IconButton size="small" onClick={() => handleRevokeDevice(d)} sx={{ color: "error.main" }}>
                              <BlockIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Device Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: "secondary.main" }}>
          Edit Device details
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1.5 }}>
          {editForm && (
            <>
              <TextField
                label="Device Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                fullWidth
                size="small"
              />
              <TextField
                label="IMEI / Identifier"
                value={editForm.imei}
                disabled
                fullWidth
                size="small"
                helperText="Identifier/IMEI cannot be modified"
              />
              <TextField
                label="Model"
                value={editForm.model}
                onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                fullWidth
                size="small"
              />
              <FormControl size="small" fullWidth>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5 }}>
                  Network Type
                </Typography>
                <Select
                  value={editForm.network}
                  onChange={(e) => setEditForm({ ...editForm, network: e.target.value })}
                >
                  <MenuItem value="4G">4G</MenuItem>
                  <MenuItem value="Wi-Fi">Wi-Fi</MenuItem>
                  <MenuItem value="Ethernet">Ethernet</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseEditDialog} sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={editSaving}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#EC8D20",
              "&:hover": { backgroundColor: "#C77518" },
              boxShadow: "none",
            }}
          >
            {editSaving ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </DataState>
  );
};

export default DeviceTypes;
