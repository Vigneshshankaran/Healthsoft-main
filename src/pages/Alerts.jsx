import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Tabs,
  Tab,
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
  InputAdornment,
  Chip
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { AlarmService, AdminService } from "../api";
import { DataState } from "../components/DataState";
import { HealthsoftContext } from "../context/HealthsoftContext";
const StatusCard = ({ value, label, icon, color, bgColor }) => {
  return <Card
    sx={{
      p: 1.25,
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      height: "100%",
      borderColor: "#EAE5E0",
      borderRadius: "8px",
      boxShadow: "none",
      bgcolor: "#FFFFFF",
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        borderColor: color,
        bgcolor: "#FAF8F6"
      }
    }}
  >
      <Box
    sx={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      bgcolor: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color
    }}
  >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
    sx={{
      fontWeight: 800,
      color,
      fontSize: "16px",
      lineHeight: 1,
      mb: 0.25
    }}
  >
          {value}
        </Typography>
        <Typography
    variant="caption"
    sx={{
      color: "text.secondary",
      fontWeight: 700,
      fontSize: "10px",
      lineHeight: 1,
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }}
  >
          {label}
        </Typography>
      </Box>
    </Card>;
};
const ALERTS_POLL_INTERVAL = 3e4;
export const Alerts = ({ role }) => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [systemSearch, setSystemSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [alarmTypeFilter, setAlarmTypeFilter] = useState("ALL");
  const [alarmDeviceSearch, setAlarmDeviceSearch] = useState("");
  const [alarmIdentifierSearch, setAlarmIdentifierSearch] = useState("");
  const [alarmSerialSearch, setAlarmSerialSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { alarms: logs, setAlarms: setLogs } = useContext(HealthsoftContext);
  const [isMock, setIsMock] = useState(false);
  const fetchAlerts = () => {
    const isClientAdmin = role === "ADMIN";
    const apiCall = isClientAdmin ? AdminService.adminGetAlarmEvents() : AlarmService.getAllAlarms();
    apiCall.then((res) => {
      setPageLoading(false);
      setPageError(null);
      if (res && res.length > 0) {
        const mapped = res.map((a, index) => {
          let type = "Alarm";
          if (a["fall.alarm.start"] || a["fall.alarm.stop"]) type = "Fall";
          else if (a["alarm.panic.start"] || a["alarm.panic.stop"]) type = "Panic";
          else if (a["startup.alarm"]) type = "Startup";
          else if (a["geofence.alarm.1"] || a["geofence.alarm.2"]) type = "Geofence";
          else if (a.alarmType) {
            const at = String(a.alarmType).toLowerCase();
            if (at.includes("startup")) type = "Startup";
            else if (at.includes("fall")) type = "Fall";
            else if (at.includes("panic") || at.includes("sos")) type = "Panic";
            else if (at.includes("geofence")) type = "Geofence";
          }
          let dateStr = "\u2014";
          if (a.timestamp) {
            const ts = String(a.timestamp).length === 10 ? a.timestamp * 1e3 : a.timestamp;
            const d = new Date(ts);
            dateStr = d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
          }
          return {
            id: a.id != null ? String(a.id) : `alarm-${index}`,
            type,
            device: a["device.name"] || a.deviceUUID || "Device",
            identifier: a.ident || (a.deviceUUID ? String(a.deviceUUID).slice(0, 8) : "\u2014"),
            serial: a["device.serial.number"] || "\u2014",
            timestamp: dateStr,
            severity: a.severity || "MEDIUM",
            resolved: a.isResolved !== void 0 ? a.isResolved : a.resolved || false
          };
        });
        setIsMock(false);
        setLogs(mapped);
      } else {
        throw new Error("No alarms data returned from API");
      }
    }).catch((err) => {
      console.error("Failed to load alarms from API, using mock fallback:", err);
      setIsMock(true);
      setPageLoading(false);
      setPageError(null);
      const mockAlarms = [
        { id: "1", type: "Fall", device: "Pendant (EV07-0142)", identifier: "35262533", serial: "EV07-0142", timestamp: "Jun 24, 2026, 09:42 AM", severity: "HIGH", resolved: false },
        { id: "2", type: "Geofence", device: "Pendant (EV07-0089)", identifier: "35262533", serial: "EV07-0089", timestamp: "Jun 24, 2026, 09:35 AM", severity: "HIGH", resolved: false },
        { id: "3", type: "Alarm", device: "Health Band (HG-0211)", identifier: "HG-0211", serial: "HG-0211", timestamp: "Jun 24, 2026, 09:30 AM", severity: "MEDIUM", resolved: false },
        { id: "4", type: "Alarm", device: "Pill Dispenser (KP-20)", identifier: "KP20-0067", serial: "KP20-0067", timestamp: "Jun 24, 2026, 08:00 AM", severity: "LOW", resolved: true }
      ];
      setLogs(mockAlarms);
    });
  };
  useEffect(() => {
    fetchAlerts();
    const pollId = setInterval(fetchAlerts, ALERTS_POLL_INTERVAL);
    return () => clearInterval(pollId);
  }, [role]);
  const handleRefresh = () => {
    fetchAlerts();
  };
  const handleTabChange = (_, newValue) => {
    setActiveSubTab(newValue);
  };
  const filteredLogs = logs.filter((log) => {
    const matchesType = alarmTypeFilter === "ALL" || log.type === alarmTypeFilter;
    const matchesDevice = log.device.toLowerCase().includes(alarmDeviceSearch.toLowerCase());
    const matchesIdentifier = log.identifier.includes(alarmIdentifierSearch);
    const matchesSerial = log.serial.includes(alarmSerialSearch);
    return matchesType && matchesDevice && matchesIdentifier && matchesSerial;
  });
  const openLogs = logs.filter((log) => {
    if (log.resolved === true) return false;
    const matchesSearch = systemSearch === "" || 
      log.type.toLowerCase().includes(systemSearch.toLowerCase()) ||
      log.device.toLowerCase().includes(systemSearch.toLowerCase()) ||
      log.identifier.toLowerCase().includes(systemSearch.toLowerCase());
    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    const matchesType = typeFilter === "ALL" || log.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });
  const getLogDotColor = (type) => {
    switch (type) {
      case "Panic":
        return "#EF4444";
      // Red
      case "Fall":
        return "#F97316";
      // Orange
      case "Alarm":
        return "#3B82F6";
      // Blue
      case "Startup":
        return "#3B82F6";
      // Blue
      default:
        return "text.secondary";
    }
  };
  const criticalCount = logs.filter((l) => String(l.severity).toUpperCase() === "CRITICAL").length;
  const highCount = logs.filter((l) => String(l.severity).toUpperCase() === "HIGH").length;
  const mediumCount = logs.filter((l) => String(l.severity).toUpperCase() === "MEDIUM").length;
  const lowCount = logs.filter((l) => String(l.severity).toUpperCase() === "LOW").length;
  const acknowledgedCount = logs.filter((l) => l.resolved === true).length;
  const totalOpenCount = logs.filter((l) => l.resolved !== true).length;
  const panicCount = logs.filter((l) => l.type === "Panic").length;
  const fallCount = logs.filter((l) => l.type === "Fall").length;
  const geofenceCount = logs.filter((l) => l.type === "Geofence").length;
  const startupCount = logs.filter((l) => l.type === "Startup").length;
  return <DataState loading={pageLoading} error={pageError} onRetry={fetchAlerts}>
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
      {
    /* Header Row */
  }
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#1A0E07",
                letterSpacing: "-0.5px",
                lineHeight: 1.2
              }}
            >
              System Alerts
            </Typography>
            {isMock && (
              <Chip
                label="MOCK"
                size="small"
                sx={{
                  bgcolor: '#000000',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '8px',
                  height: 16,
                  borderRadius: '3px',
                  px: 0.5,
                  '& .MuiChip-label': { px: 0.5 }
                }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "#8C7E76", fontWeight: 500, mt: 0.5 }}>
            Monitor device health events and alarm activity
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
    variant="outlined"
    startIcon={<AutorenewIcon sx={{ color: "text.primary" }} />}
    onClick={handleRefresh}
    sx={{
      px: 2,
      py: 1,
      color: "text.primary",
      borderColor: "#EAE5E0",
      backgroundColor: "#FFFFFF",
      fontWeight: 600,
      fontSize: "13px",
      textTransform: "none",
      "&:hover": { borderColor: "#EC8D20", backgroundColor: "#FAF8F6" }
    }}
  >
            Refresh
          </Button>
        </Box>
      </Box>

      {
    /* Unified Status Cards Grid */
  }
      <Grid container spacing={1.5}>
        {
    /* Row 1 Status Cards (Critical, High, Medium, Low, Acknowledged, Total Open) */
  }
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={criticalCount} label="Critical" icon={<ErrorIcon sx={{ fontSize: 16 }} />} color="#EF4444" bgColor="#FFE4E6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={highCount} label="High" icon={<WarningIcon sx={{ fontSize: 16 }} />} color="#F97316" bgColor="#FFEDD5" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={mediumCount} label="Medium" icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} color="#EAB308" bgColor="#FEF9C3" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={lowCount} label="Low" icon={<RemoveCircleIcon sx={{ fontSize: 16 }} />} color="#A855F7" bgColor="#F3E8FF" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={acknowledgedCount} label="Acknowledged" icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} color="#22C55E" bgColor="#DCFCE7" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatusCard value={totalOpenCount} label="Total Open" icon={<AssignmentIcon sx={{ fontSize: 16 }} />} color="#3B82F6" bgColor="#DBEAFE" />
        </Grid>

        {
    /* Row 2 Status Cards (Panic, Fall, Geofence, Startup) */
  }
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={panicCount} label="Panic" icon={<NotificationsIcon sx={{ fontSize: 16 }} />} color="#E11D48" bgColor="#FFE4E6" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={fallCount} label="Fall" icon={<DirectionsRunIcon sx={{ fontSize: 16 }} />} color="#F97316" bgColor="#FFEDD5" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={geofenceCount} label="Geofence" icon={<LocationOnIcon sx={{ fontSize: 16 }} />} color="#EAB308" bgColor="#FEF9C3" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatusCard value={startupCount} label="Startup" icon={<SyncIcon sx={{ fontSize: 16 }} />} color="#16A34A" bgColor="#DCFCE7" />
        </Grid>
      </Grid>

      {
    /* Sub Tabs Container */
  }
      <Box>
        <Box sx={{ borderBottom: "1px solid #EAE5E0", mb: 3 }}>
          <Tabs
    value={activeSubTab}
    onChange={handleTabChange}
    textColor="primary"
    indicatorColor="primary"
    sx={{
      "& .MuiTab-root": {
        fontWeight: 700,
        fontSize: "13px",
        minWidth: "auto",
        px: 3,
        pb: 1.25,
        color: "text.secondary"
      }
    }}
  >
            <Tab label="System Alerts" />
            <Tab label={`Alarm Events (${logs.length})`} />
          </Tabs>
        </Box>

        {
    /* SUBTAB 0: System Alerts View */
  }
        {activeSubTab === 0 && <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {
    /* Clean filter panel */
  }
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <TextField
    placeholder="Search by type, message, device..."
    value={systemSearch}
    onChange={(e) => setSystemSearch(e.target.value)}
    size="small"
    sx={{
      flexGrow: 1,
      minWidth: 260,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        borderColor: "#EAE5E0"
      }
    }}
    slotProps={{
      input: {
        startAdornment: <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                      </InputAdornment>
      }
    }}
  />
              <Select
    value={severityFilter}
    onChange={(e) => setSeverityFilter(e.target.value)}
    size="small"
    sx={{
      minWidth: 160,
      bgcolor: "#FFFFFF",
      borderRadius: "8px"
    }}
  >
                <MenuItem value="ALL">All Severities</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
              </Select>
              <Select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    size="small"
    sx={{
      minWidth: 160,
      bgcolor: "#FFFFFF",
      borderRadius: "8px"
    }}
  >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="Panic">Panic</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
                <MenuItem value="Geofence">Geofence</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>
            </Box>

            {openLogs.length === 0 ? (
              <Card
                sx={{
                  py: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  bgcolor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #EAE5E0",
                  boxShadow: "none"
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "13px"
                  }}
                >
                  No open alerts found
                </Typography>
              </Card>
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  border: "1px solid #EAE5E0",
                  borderRadius: "12px",
                  boxShadow: "none",
                  overflow: "hidden"
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: "#FAF8F6" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>TYPE</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>DEVICE</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>IDENTIFIER</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>SERIAL</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>TIMESTAMP</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>SEVERITY</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openLogs.map((log) => (
                      <TableRow
                        key={log.id}
                        sx={{
                          "&:hover": { bgcolor: "#FAF8F6" },
                          "&:last-child td, &:last-child th": { border: 0 },
                          transition: "background-color 0.15s ease"
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: getLogDotColor(log.type),
                                flexShrink: 0
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: "13px" }}>
                              {log.type}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.device}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.identifier}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.serial}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.timestamp}</TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip 
                            label={log.severity} 
                            size="small" 
                            sx={{ 
                              height: 20, 
                              fontSize: '10px', 
                              fontWeight: 700,
                              bgcolor: log.severity === 'HIGH' || log.severity === 'CRITICAL' ? 'rgba(232,101,74,0.12)' : 'rgba(236,141,32,0.12)',
                              color: log.severity === 'HIGH' || log.severity === 'CRITICAL' ? '#E8654A' : '#EC8D20',
                              borderRadius: '4px'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>}

        {
    /* SUBTAB 1: Alarm Events */
  }
        {activeSubTab === 1 && <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {
    /* Filter controls panel */
  }
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <Select
    value={alarmTypeFilter}
    onChange={(e) => setAlarmTypeFilter(e.target.value)}
    size="small"
    sx={{
      minWidth: 120,
      bgcolor: "#FFFFFF",
      borderRadius: "8px"
    }}
  >
                <MenuItem value="ALL">All Types</MenuItem>
                <MenuItem value="Alarm">Alarm</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
                <MenuItem value="Panic">Panic</MenuItem>
                <MenuItem value="Startup">Startup</MenuItem>
              </Select>

              <TextField
    placeholder="Device name..."
    value={alarmDeviceSearch}
    onChange={(e) => setAlarmDeviceSearch(e.target.value)}
    size="small"
    sx={{
      minWidth: 150,
      flexGrow: 1,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": { borderRadius: "8px" }
    }}
  />

              <TextField
    placeholder="Identifier..."
    value={alarmIdentifierSearch}
    onChange={(e) => setAlarmIdentifierSearch(e.target.value)}
    size="small"
    sx={{
      minWidth: 150,
      flexGrow: 1,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": { borderRadius: "8px" }
    }}
  />

              <TextField
    placeholder="Serial number..."
    value={alarmSerialSearch}
    onChange={(e) => setAlarmSerialSearch(e.target.value)}
    size="small"
    sx={{
      minWidth: 150,
      flexGrow: 1,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": { borderRadius: "8px" }
    }}
  />

              <TextField
    type="datetime-local"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    size="small"
    sx={{
      width: 220,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": { borderRadius: "8px" }
    }}
  />

              <TextField
    type="datetime-local"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    size="small"
    sx={{
      width: 220,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-root": { borderRadius: "8px" }
    }}
  />
            </Box>

            {
    /* Clean flat Table Container */
  }
            <TableContainer
    component={Paper}
    sx={{
      border: "1px solid #EAE5E0",
      borderRadius: "12px",
      boxShadow: "none",
      overflow: "hidden"
    }}
  >
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "#FAF8F6" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>DEVICE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>IDENTIFIER</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>SERIAL</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "11px", letterSpacing: "0.5px", py: 2 }}>TIMESTAMP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.length === 0 ? <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                        No logs match the current filters.
                      </TableCell>
                    </TableRow> : filteredLogs.map((log) => <TableRow
    key={log.id}
    sx={{
      "&:hover": { bgcolor: "#FAF8F6" },
      "&:last-child td, &:last-child th": { border: 0 },
      transition: "background-color 0.15s ease"
    }}
  >
                        {
    /* Type column with indicator dot */
  }
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: "50%",
      bgcolor: getLogDotColor(log.type),
      flexShrink: 0
    }}
  />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", fontSize: "13px" }}>
                              {log.type}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.device}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.identifier}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.serial}</TableCell>
                        <TableCell sx={{ color: "text.secondary", fontWeight: 500, py: 1.5, fontSize: "13px" }}>{log.timestamp}</TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>}
      </Box>

    </Box>
    </DataState>;
};
export default Alerts;
