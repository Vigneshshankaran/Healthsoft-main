import { useState, useEffect, useMemo } from "react";
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
  Link,
} from "@mui/material";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AdminService, isMockActive } from "../api";
import { DataState } from "../components/DataState";

// Colour per device type — keeps the map markers and table chips in sync.
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
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

export const Locations = () => {
  const [rows, setRows] = useState([]);
  const [isMock, setIsMock] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    setPageError(null);
    setPageLoading(true);
    AdminService.adminGetEligibleSeniorDeviceLocations()
      .then((res) => {
        setPageLoading(false);
        if (!Array.isArray(res)) throw new Error("Unexpected response shape");
        const mapped = res
          .map((r) => {
            const dev = r.device || {};
            const loc = r.deviceLocation || {};
            // deviceLocation keys are DOTTED strings — bracket access only.
            const lat = loc["position.latitude"];
            const lng = loc["position.longitude"];
            return {
              id: dev.id || loc.id || dev.imei,
              name: dev.deviceName || loc["device.name"] || "Device",
              type: dev.deviceType || "UNKNOWN",
              imei: dev.imei || loc.ident || "—",
              battery: dev.batteryLevel,
              status: dev.status || "—",
              lat: typeof lat === "number" ? lat : null,
              lng: typeof lng === "number" ? lng : null,
              // backend timestamp is in SECONDS
              seenAt: loc.timestamp ? loc.timestamp * 1000 : dev.lastSeen || null,
            };
          })
          .filter((r) => r.lat != null && r.lng != null);
        setRows(mapped);
        // Mock fallback inside client.js flips this flag; reflect it for the badge.
        setIsMock(isMockActive());
      })
      .catch((err) => {
        console.warn("Failed to load device locations, showing empty:", err);
        setPageLoading(false);
        setRows([]);
        setPageError(null);
      });
  };

  // Centre the map on the mean of all points (fallback: Chennai).
  const center = useMemo(() => {
    if (rows.length === 0) return [13.0827, 80.2707];
    const lat = rows.reduce((a, r) => a + r.lat, 0) / rows.length;
    const lng = rows.reduce((a, r) => a + r.lng, 0) / rows.length;
    return [lat, lng];
  }, [rows]);

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={fetchLocations}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        {/* Header */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A0E07", letterSpacing: "-0.5px" }}>
              Device Locations
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
            {rows.length} active {rows.length === 1 ? "device" : "devices"} with a recent GPS fix
          </Typography>
        </Box>

        {/* Map */}
        <Box sx={{ height: 420, borderRadius: "12px", overflow: "hidden", border: "1px solid #EAE5E0" }}>
          <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {rows.map((r) => (
              <CircleMarker
                key={r.id}
                center={[r.lat, r.lng]}
                radius={9}
                pathOptions={{ color: "#fff", weight: 2, fillColor: TYPE_COLOR[r.type] || TYPE_COLOR.UNKNOWN, fillOpacity: 0.9 }}
              >
                <Popup>
                  <Box sx={{ minWidth: 160 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem" }}>{r.name}</Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "#8C7E76" }}>{r.type} · IMEI {r.imei}</Typography>
                    <Typography sx={{ fontSize: "0.72rem", mt: 0.5 }}>
                      Battery: <b style={{ color: batteryColor(r.battery) }}>{r.battery != null ? `${r.battery}%` : "—"}</b>
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem" }}>Last seen: {formatSeen(r.seenAt)}</Typography>
                    <Link href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noopener" sx={{ fontSize: "0.72rem" }}>
                      Open in Google Maps ↗
                    </Link>
                  </Box>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </Box>

        {/* Detail table */}
        <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#FAF8F6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>DEVICE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>TYPE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>BATTERY</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>LAST SEEN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>LOCATION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#8C7E76" }}>
                    No devices with a recent GPS fix.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id} sx={{ "&:hover": { backgroundColor: "#FCFAF8" } }}>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ fontWeight: 650, color: "#1A0E07", fontSize: "0.9rem" }}>{r.name}</Typography>
                      <Typography variant="body2" sx={{ color: "#8C7E76", fontSize: "0.75rem" }}>IMEI {r.imei}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Chip
                        label={r.type}
                        size="small"
                        sx={{ bgcolor: `${TYPE_COLOR[r.type] || TYPE_COLOR.UNKNOWN}22`, color: TYPE_COLOR[r.type] || TYPE_COLOR.UNKNOWN, fontWeight: 700, fontSize: "0.7rem", borderRadius: "4px" }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ color: batteryColor(r.battery), fontWeight: 700, fontSize: "0.85rem" }}>
                        {r.battery != null ? `${r.battery}%` : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ color: "#1A0E07", fontSize: "0.85rem" }}>{formatSeen(r.seenAt)}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Link href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noopener" sx={{ fontSize: "0.85rem" }}>
                        {r.lat.toFixed(4)}, {r.lng.toFixed(4)} ↗
                      </Link>
                    </TableCell>
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

export default Locations;
