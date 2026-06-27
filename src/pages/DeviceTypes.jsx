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
} from "@mui/material";
import { AdminService, DeviceService, isMockActive } from "../api";
import { DataState } from "../components/DataState";

// Fallback list if GET /v1/devices/types is unavailable.
const FALLBACK_TYPES = ["PENDANT", "WRIST_BAND", "WATCH", "PILL_DISPENSER", "UNKNOWN"];

const TYPE_COLOR = {
  PENDANT: "#4F46E5",
  WRIST_BAND: "#10B981",
  WATCH: "#F59E0B",
  PILL_DISPENSER: "#E11D48",
  UNKNOWN: "#8C7E76",
};

const batteryColor = (b) => (b == null ? "#8C7E76" : b <= 20 ? "#EF4444" : b <= 50 ? "#F59E0B" : "#10B981");

const formatSeen = (ms) => {
  if (!ms) return "—";
  const d = new Date(String(ms).length === 10 ? Number(ms) * 1000 : ms);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

export const DeviceTypes = () => {
  const [types, setTypes] = useState(FALLBACK_TYPES);
  const [selectedType, setSelectedType] = useState("PENDANT");
  const [devices, setDevices] = useState([]);
  const [isMock, setIsMock] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Load the valid device types for the filter row.
  useEffect(() => {
    DeviceService.getDeviceTypes()
      .then((res) => {
        if (Array.isArray(res) && res.length) setTypes(res);
      })
      .catch((err) => console.warn("Failed to fetch device types:", err));
  }, []);

  const fetchDevices = useCallback(() => {
    setPageError(null);
    setPageLoading(true);
    AdminService.adminGetDevicesByType(selectedType)
      .then((res) => {
        setPageLoading(false);
        const list = Array.isArray(res) ? res : res?.data ?? [];
        setDevices(
          list.map((d) => ({
            id: d.id || d.imei,
            name: d.deviceName || "Unnamed Device",
            imei: d.imei || d.deviceIdentifier || "—",
            type: d.deviceType || "UNKNOWN",
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
        console.warn("Failed to fetch devices by type:", err);
        setPageLoading(false);
        setDevices([]);
        setPageError(err?.message || "The server could not be reached. Please try again.");
      });
  }, [selectedType]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={fetchDevices}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        {/* Header */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A0E07", letterSpacing: "-0.5px" }}>
              Devices by Type
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
            {devices.length} {selectedType} {devices.length === 1 ? "device" : "devices"}
          </Typography>
        </Box>

        {/* Type filter pills */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {types.map((t) => {
            const active = t === selectedType;
            const color = TYPE_COLOR[t] || TYPE_COLOR.UNKNOWN;
            return (
              <Chip
                key={t}
                label={t}
                onClick={() => setSelectedType(t)}
                variant={active ? "filled" : "outlined"}
                sx={{
                  fontWeight: 700,
                  cursor: "pointer",
                  borderColor: "#EAE5E0",
                  bgcolor: active ? `${color}22` : "#FFFFFF",
                  color: active ? color : "#1A0E07",
                  "&:hover": { bgcolor: `${color}22` },
                }}
              />
            );
          })}
        </Box>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#8C7E76" }}>
                    No {selectedType} devices found.
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((d) => (
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DataState>
  );
};

export default DeviceTypes;
