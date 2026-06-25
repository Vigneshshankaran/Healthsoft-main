import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { AdminService, MonitorService } from "../api";
import { DataState } from "../components/DataState";
import { useFeedback } from "../hooks/useFeedback";
export const Monitors = () => {
  const { notify, confirm } = useFeedback();
  const [assignments, setAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeniorFilter, setSelectedSeniorFilter] = useState("ALL");
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignSeniorId, setAssignSeniorId] = useState("");
  const [assignMonitorId, setAssignMonitorId] = useState("");
  const [seniorOptions, setSeniorOptions] = useState([]);
  const [monitorOptions, setMonitorOptions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  useEffect(() => {
    fetchMonitorAssignments();
  }, []);
  const personName = (p) => p?.name || `${p?.firstName || p?.first_name || ""} ${p?.lastName || p?.last_name || ""}`.trim();
  const personEmail = (p) => p?.primaryEmail || p?.email || "";
  const personPhone = (p) => {
    const ph = p?.phoneNumber || p?.phone_number;
    return ph ? String(ph) : "";
  };
  const fetchMonitorAssignments = () => {
    setPageError(null);
    Promise.all([
      AdminService.adminGetMonitorMappings(),
      AdminService.adminGetUsers().catch(() => [])
    ]).then(([res, users]) => {
      setPageLoading(false);
      const usersById = {};
      const seniors = [];
      const monitors = [];
      (users || []).forEach((u) => {
        const id = u.id || u.userId;
        if (!id) return;
        usersById[id] = u;
        const option = { id, name: personName(u) || "User", email: personEmail(u) || "\u2014" };
        if (u.role === "SENIOR") seniors.push(option);
        else if (u.role === "MONITOR") monitors.push(option);
      });
      setSeniorOptions(seniors);
      setMonitorOptions(monitors);
      
      const list = (res || []).map((m, idx) => {
        const senior = m.senior || usersById[m.seniorId || m.seniorUUID] || {};
        const monitor = m.monitor || usersById[m.monitorId || m.monitorUUID] || {};
        let dateStr = "\u2014";
        const rawDate = m.createdAt || m.created_at || m.createdDate || m.date;
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
          }
        }
        return {
          id: m.id || m.mappingId || String(idx),
          seniorName: m.seniorName || personName(senior) || "Senior",
          seniorEmail: m.seniorEmail || personEmail(senior) || "\u2014",
          seniorPhone: m.seniorPhone || personPhone(senior) || "\u2014",
          monitorName: m.monitorName || personName(monitor) || "Monitor",
          monitorEmail: m.monitorEmail || personEmail(monitor) || "\u2014",
          createdDate: dateStr
        };
      });
      setAssignments(list);
    }).catch((err) => {
      console.error("Failed to fetch monitor assignments from API:", err);
      setPageLoading(false);
      setPageError(err?.message || "Failed to load monitor assignments from server.");
    });
  };
  const handleRevoke = async (id) => {
    const ok = await confirm({
      title: "Revoke this monitor assignment?",
      message: "The monitor will no longer be able to watch this senior.",
      confirmText: "Revoke",
      danger: true
    });
    if (!ok) return;
    MonitorService.deleteMonitorMapping(id).then(() => {
      notify("Monitor assignment revoked.", "success");
      fetchMonitorAssignments();
    }).catch((err) => {
      console.error("Failed to revoke monitor mapping from API:", err);
      notify(`Failed to revoke assignment: ${err?.message || "Unknown error from server"}`, "error");
    });
  };
  const handleAssignMonitor = () => {
    if (!assignSeniorId || !assignMonitorId) return;
    MonitorService.assignMonitor({
      seniorId: assignSeniorId,
      monitorId: assignMonitorId
    }).then(() => {
      fetchMonitorAssignments();
      setOpenAssignDialog(false);
      setAssignSeniorId("");
      setAssignMonitorId("");
    }).catch((err) => {
      console.error("Failed to assign monitor in API:", err);
      notify(`Failed to assign monitor: ${err?.message || "Unknown error from server"}`, "error");
    });
  };
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.seniorName.toLowerCase().includes(searchQuery.toLowerCase()) || a.monitorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSenior = selectedSeniorFilter === "ALL" || a.seniorName === selectedSeniorFilter;
    return matchesSearch && matchesSenior;
  });
  const getGroupedRows = () => {
    const grouped = {};
    filteredAssignments.forEach((a) => {
      if (!grouped[a.seniorName]) {
        grouped[a.seniorName] = [];
      }
      grouped[a.seniorName].push(a);
    });
    const rows = [];
    Object.keys(grouped).forEach((seniorName) => {
      const items = grouped[seniorName];
      items.forEach((item, index) => {
        rows.push({
          assignment: item,
          isFirstOfGroup: index === 0,
          groupCount: items.length
        });
      });
    });
    return rows;
  };
  const groupedRows = getGroupedRows();
  const uniqueSeniorsCount = Array.from(new Set(assignments.map((a) => a.seniorName))).length;
  return <DataState loading={pageLoading} error={pageError} onRetry={fetchMonitorAssignments}>
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
      {
    /* Top Header */
  }
      <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "stretch", sm: "flex-start" },
      gap: { xs: 2, sm: 0 }
    }}
  >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#1A0E07",
                letterSpacing: "-0.5px"
              }}
            >
              Monitor Assignments
            </Typography>
            {/* Mock tag removed */}
          </Box>
          <Typography
    variant="body2"
    sx={{
      color: "#8C7E76",
      fontWeight: 500,
      mt: 0.5
    }}
  >
            {assignments.length} mapping(s) across {uniqueSeniorsCount} senior(s)
          </Typography>
        </Box>

        {
    /* Action Button with Solid Black Icon */
  }
        <Button
    variant="contained"
    startIcon={<LinkIcon sx={{ color: "#FFFFFF" }} />}
    onClick={() => setOpenAssignDialog(true)}
    sx={{
      backgroundColor: "#EC8D20",
      // Orange background matching theme
      fontWeight: 650,
      alignSelf: { xs: "stretch", sm: "flex-start" },
      "&:hover": {
        backgroundColor: "#C77518"
      }
    }}
  >
          Assign Monitor
        </Button>
      </Box>

      {
    /* Search Filter Row */
  }
      <Box
    sx={{
      display: "flex",
      gap: 2,
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" }
    }}
  >
        <TextField
    placeholder="Filter by senior or monitor name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    size="small"
    sx={{
      flexGrow: 1,
      backgroundColor: "#FFFFFF",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        borderColor: "#EAE5E0"
      }
    }}
  />

        <Select
    value={selectedSeniorFilter}
    onChange={(e) => setSelectedSeniorFilter(e.target.value)}
    size="small"
    sx={{
      minWidth: 160,
      backgroundColor: "#FFFFFF",
      borderRadius: "8px"
    }}
  >
          <MenuItem value="ALL">All seniors</MenuItem>
          {Array.from(new Set(assignments.map((a) => a.seniorName))).map((name) => <MenuItem key={name} value={name}>
              {name}
            </MenuItem>)}
        </Select>
      </Box>

      {
    /* Assignments Table */
  }
      <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", boxShadow: "none" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#FAF8F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "30%" }}>SENIOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "35%" }}>MONITOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "20%" }}>CREATED</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "15%" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedRows.length === 0 ? <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No assignments found
                </TableCell>
              </TableRow> : groupedRows.map(({ assignment, isFirstOfGroup, groupCount }) => <TableRow
    key={assignment.id}
    sx={{
      borderBottom: "1px solid #EAE5E0",
      "&:hover": { backgroundColor: "#FCFAF8" }
    }}
  >
                  {
    /* Column 1: SENIOR (rowSpan grouping) */
  }
                  {isFirstOfGroup && <TableCell
    rowSpan={groupCount}
    sx={{
      verticalAlign: "top",
      py: 2.5,
      borderRight: "1px solid #EAE5E0",
      backgroundColor: "#FFFFFF"
    }}
  >
                      <Typography sx={{ fontWeight: 750, color: "text.primary", fontSize: "13px" }}>
                        {assignment.seniorName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mt: 0.25 }}>
                        {assignment.seniorEmail}
                      </Typography>
                      <Chip
    label={`${groupCount} ${groupCount === 1 ? "monitor" : "monitors"}`}
    size="small"
    sx={{
      mt: 1.5,
      backgroundColor: "#FFF2EC",
      color: "#EC8D20",
      fontWeight: 700,
      fontSize: "11px",
      height: 18
    }}
  />
                    </TableCell>}

                  {
    /* Column 2: MONITOR */
  }
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
    sx={{
      bgcolor: "#EC8D20",
      // Orange avatar
      color: "#FFFFFF",
      width: 32,
      height: 32,
      fontSize: "13px",
      fontWeight: 700
    }}
  >
                        {assignment.monitorName.substring(0, 1).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 650, color: "text.primary", fontSize: "13px" }}>
                          {assignment.monitorName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px" }}>
                          {assignment.monitorEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {
    /* Column 3: CREATED */
  }
                  <TableCell sx={{ py: 2, color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>
                    {assignment.createdDate}
                  </TableCell>

                  {
    /* Column 4: ACTIONS (Revoke with Solid Black Icon) */
  }
                  <TableCell sx={{ py: 2 }}>
                    <Button
    variant="outlined"
    size="small"
    startIcon={<LinkOffIcon sx={{ color: "text.primary" }} />}
    onClick={() => handleRevoke(assignment.id)}
    sx={{
      borderColor: "#FCA5A5",
      color: "#EF4444",
      fontWeight: 650,
      fontSize: "12px",
      py: 0.5,
      px: 1.25,
      backgroundColor: "#FFFFFF",
      textTransform: "none",
      "&:hover": {
        backgroundColor: "#FEF2F2",
        borderColor: "#EF4444"
      }
    }}
  >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      {
    /* Assign Monitor Dialog Modal */
  }
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle sx={{ fontWeight: 750 }}>Assign Monitor to Senior</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.25, pt: 1.5, minWidth: 340 }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5, display: "block" }}>
              SENIOR
            </Typography>
            <Select
    fullWidth
    size="small"
    value={assignSeniorId}
    onChange={(e) => setAssignSeniorId(e.target.value)}
    displayEmpty
  >
              <MenuItem value="" disabled>
                {seniorOptions.length === 0 ? "No seniors found" : "Select a senior..."}
              </MenuItem>
              {seniorOptions.map((s) => <MenuItem key={s.id} value={s.id}>
                  {s.name} — {s.email}
                </MenuItem>)}
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5, display: "block" }}>
              MONITOR
            </Typography>
            <Select
    fullWidth
    size="small"
    value={assignMonitorId}
    onChange={(e) => setAssignMonitorId(e.target.value)}
    displayEmpty
  >
              <MenuItem value="" disabled>
                {monitorOptions.length === 0 ? "No monitors found" : "Select a monitor..."}
              </MenuItem>
              {monitorOptions.map((m) => <MenuItem key={m.id} value={m.id}>
                  {m.name} — {m.email}
                </MenuItem>)}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
    onClick={handleAssignMonitor}
    variant="contained"
    disabled={!assignSeniorId || !assignMonitorId}
    sx={{ backgroundColor: "#EC8D20", "&:hover": { backgroundColor: "#C77518" } }}
  >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </DataState>;
};
export default Monitors;
