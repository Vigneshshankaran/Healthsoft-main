import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Divider,
  Switch,
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
  Dialog,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SpeedIcon from "@mui/icons-material/Speed";
import OpacityIcon from "@mui/icons-material/Opacity";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import WarningIcon from "@mui/icons-material/Warning";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import SendIcon from "@mui/icons-material/Send";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ErrorIcon from "@mui/icons-material/Error";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { FallAlertModal } from "../components/FallAlertModal";
import { DataState } from "../components/DataState";
import { SeniorService, DeviceAssignmentService, AlarmService, ComplianceService, AdminService, MonitorService, VitalService } from "../api";
import { useContext } from "react";
import { HealthsoftContext } from "../context/HealthsoftContext";
export const Seniors = ({ currentUserName, currentUserRole }) => {
  const { toast: notify, selectedSeniorId, setSelectedSeniorId } = useContext(HealthsoftContext);
  const [openFallAlert, setOpenFallAlert] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [openAddSeniorDialog, setOpenAddSeniorDialog] = useState(false);
  const [newSeniorFirstName, setNewSeniorFirstName] = useState("");
  const [newSeniorLastName, setNewSeniorLastName] = useState("");
  const [newSeniorEmail, setNewSeniorEmail] = useState("");
  const [newSeniorPhone, setNewSeniorPhone] = useState("");
  const [newSeniorGender, setNewSeniorGender] = useState("Male");
  const [newSeniorDob, setNewSeniorDob] = useState("");
  const [selectedSenior, setSelectedSenior] = useState({
    id: "",
    name: "",
    gender: "",
    age: "",
    dob: "",
    bloodGroup: "",
    room: "",
    residentId: "",
    admissionDate: "",
    mobilityAid: "",
    fallsCount: 0,
    medCompliance: 0,
    devicesCount: 0,
    latestSpo2: 0,
    latestBp: "",
    guardiansCount: 0,
    latestHeartRate: 0,
    latestTemperature: 0,
    latestBloodGlucose: 0,
    latestRespRate: 0
  });
  const [seniorsList, setSeniorsList] = useState([]);
  const [seniorDevices, setSeniorDevices] = useState([]);
  const [seniorAlerts, setSeniorAlerts] = useState([]);
  const [seniorGuardians, setSeniorGuardians] = useState([]);
  const [seniorReports, setSeniorReports] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const loadSeniors = () => {
    setPageError(null);
    const apiCall = currentUserRole === "ADMIN" ? AdminService.adminGetSeniors() : currentUserRole === "MONITOR" ? MonitorService.getMonitorsMySeniors() : SeniorService.getMySeniors();
    apiCall.then((res) => {
      setPageLoading(false);
      if (res && res.length > 0) {
        const list = res.map((s) => {
          const name = s.name || `${s.firstName || s.first_name || ""} ${s.lastName || s.last_name || ""}`.trim() || "Unnamed Senior";
          // Fall back to an explicit age field when DOB is missing; otherwise leave blank rather than showing a misleading 0.
          let age = s.age ?? "";
          let dobStr = "\u2014";
          const rawDob = s.dateOfBirth || s.dob || s.date_of_birth;
          if (rawDob) {
            const dobDate = new Date(rawDob);
            dobStr = dobDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            const diff = Date.now() - dobDate.getTime();
            age = Math.floor(diff / (1e3 * 60 * 60 * 24 * 365.25)) || (s.age ?? "");
          }
          const isMaleVal = s.isMale !== void 0 ? s.isMale : s.is_male;
          const genderVal = s.gender || (isMaleVal !== void 0 ? isMaleVal ? "Male" : "Female" : "\u2014");
          const createdTime = s.createdAt || s.created_at;
          const admissionDateVal = s.admissionDate || s.admission_date || (createdTime ? new Date(createdTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "\u2014");
          const medConditions = s.medicalConditions || s.medical_conditions || "";
          const activeConditionsVal = s.activeConditions || (medConditions ? String(medConditions).split(",").map((c) => c.trim()).filter(Boolean) : []);
          return {
            id: s.id || s.seniorId || s.uuid || "\u2014",
            name,
            gender: genderVal,
            age,
            dob: dobStr,
            bloodGroup: s.bloodGroup || s.blood_group || "\u2014",
            room: s.room || "\u2014",
            residentId: s.residentId || s.id || s.seniorId || s.uuid || "\u2014",
            admissionDate: admissionDateVal,
            mobilityAid: s.mobilityAid || s.mobility_aid || "\u2014",
            fallsCount: s.fallsCount ?? s.falls_count ?? 0,
            medCompliance: s.medCompliance ?? s.med_compliance ?? 0,
            devicesCount: s.devicesCount ?? s.devices_count ?? 0,
            latestSpo2: s.latestSpo2 ?? s.latest_spo2 ?? 0,
            latestBp: s.latestBp || s.latest_bp || "\u2014",
            guardiansCount: s.guardiansCount ?? s.guardians_count ?? 0,
            latestHeartRate: s.latestHeartRate ?? s.latest_heart_rate ?? 0,
            latestTemperature: s.latestTemperature ?? s.latest_temperature ?? 0,
            latestBloodGlucose: s.latestBloodGlucose ?? s.latest_blood_glucose ?? 0,
            latestRespRate: s.latestRespRate ?? s.latest_resp_rate ?? 0,
            nationality: s.nationality || "\u2014",
            language: s.language || "\u2014",
            religion: s.religion || "\u2014",
            primaryPhysician: s.primaryPhysician || s.primary_physician || "\u2014",
            physicianPhone: s.physicianPhone || s.physician_phone || "\u2014",
            caregiver: s.caregiver || "\u2014",
            floorAttendant: s.floorAttendant || s.floor_attendant || "\u2014",
            dietitian: s.dietitian || "\u2014",
            physiotherapist: s.physiotherapist || "\u2014",
            fallRisk: s.fallRisk || s.fall_risk || "\u2014",
            wanderRisk: s.wanderRisk || s.wander_risk || "\u2014",
            cardiacRisk: s.cardiacRisk || s.cardiac_risk || "\u2014",
            activeConditions: activeConditionsVal,
            allergies: s.allergies || ""
          };
        });
        setIsMock(false);
        setSeniorsList(list);
        if (list.length > 0) {
          const matched = list.find(s => s.id === selectedSeniorId) || list[0];
          setSelectedSenior(matched);
          setSelectedSeniorId(matched.id);
        } else {
          setSelectedSenior({
            id: "",
            name: "",
            gender: "",
            age: 0,
            dob: "",
            bloodGroup: "",
            room: "",
            residentId: "",
            admissionDate: "",
            mobilityAid: "",
            fallsCount: 0,
            medCompliance: 0,
            devicesCount: 0,
            latestSpo2: 0,
            latestBp: "",
            guardiansCount: 0,
            latestHeartRate: 0,
            latestTemperature: 0,
            latestBloodGlucose: 0,
            latestRespRate: 0,
            nationality: "\u2014",
            language: "\u2014",
            religion: "\u2014",
            primaryPhysician: "\u2014",
            physicianPhone: "\u2014",
            caregiver: "\u2014",
            floorAttendant: "\u2014",
            dietitian: "\u2014",
            physiotherapist: "\u2014",
            fallRisk: "\u2014",
            wanderRisk: "\u2014",
            cardiacRisk: "\u2014",
            activeConditions: []
          });
        }
      } else {
        throw new Error("No seniors data returned from API");
      }
    }).catch((err) => {
      console.error("Failed to load seniors from API, using mock fallback:", err);
      setIsMock(true);
      setPageLoading(false);
      setPageError(null);
      const mockSeniors = [
        {
          id: "MR",
          name: "Meenakshi Rajan",
          gender: "Female",
          age: 74,
          dob: "October 12, 1951",
          bloodGroup: "O+",
          room: "302-A",
          residentId: "HS-CN-0142",
          admissionDate: "01 Mar 2026",
          mobilityAid: "Cane",
          fallsCount: 1,
          medCompliance: 92,
          devicesCount: 3,
          latestSpo2: 97,
          latestBp: "135/85",
          latestHeartRate: 88,
          latestTemperature: 36.8,
          latestBloodGlucose: 140,
          latestRespRate: 18,
          nationality: "Indian",
          language: "Tamil",
          religion: "Hinduism",
          primaryPhysician: "Dr. R. K. Swamy",
          physicianPhone: "+91 98400 99999",
          caregiver: "Suresh Rajan (Son)",
          floorAttendant: "Karthik M.",
          dietitian: "Ranjini S.",
          physiotherapist: "Suresh N.",
          fallRisk: "Medium",
          wanderRisk: "Low",
          cardiacRisk: "High",
          activeConditions: ["Hypertension", "Type 2 DM"],
          allergies: "Sulfonamides"
        },
        {
          id: "RS",
          name: "Rajagopalan Subramaniam",
          gender: "Male",
          age: 81,
          dob: "January 04, 1945",
          bloodGroup: "A+",
          room: "104-B",
          residentId: "HS-CN-0089",
          admissionDate: "01 Jan 2026",
          mobilityAid: "Walker",
          fallsCount: 0,
          medCompliance: 85,
          devicesCount: 3,
          latestSpo2: 98,
          latestBp: "120/80",
          latestHeartRate: 74,
          latestTemperature: 36.5,
          latestBloodGlucose: 110,
          latestRespRate: 16,
          nationality: "Indian",
          language: "Tamil",
          religion: "Hinduism",
          primaryPhysician: "Dr. A. Subramanian",
          physicianPhone: "+91 98400 88888",
          caregiver: "Ananya Subramaniam (Daughter)",
          floorAttendant: "Ranjini S.",
          dietitian: "Priya K.",
          physiotherapist: "Karthik M.",
          fallRisk: "High",
          wanderRisk: "Medium",
          cardiacRisk: "Low",
          activeConditions: ["Parkinson's (Stage 2)", "Arthritis"],
          allergies: "Penicillin"
        }
      ];
      setSeniorsList(mockSeniors);
      const matched = mockSeniors.find(s => s.id === selectedSeniorId) || mockSeniors[0];
      setSelectedSenior(matched);
      setSelectedSeniorId(matched.id);
    });
  };
  useEffect(() => {
    loadSeniors();
  }, [currentUserRole]);
  useEffect(() => {
    if (selectedSeniorId && seniorsList.length > 0) {
      const found = seniorsList.find(s => s.id === selectedSeniorId);
      if (found) {
        setSelectedSenior(found);
      }
    }
  }, [selectedSeniorId, seniorsList]);
  const [latestVitals, setLatestVitals] = useState(null);
  useEffect(() => {
    if (!selectedSenior || !selectedSenior.id) return;
    setLatestVitals(null);
    DeviceAssignmentService.getSeniorDevices(selectedSenior.id).then((devicesRes) => {
      const list = (devicesRes || []).map((d, idx) => ({
        id: d.id || d.deviceUUID || d.imei || String(idx),
        uuid: d.deviceUUID || d.uuid || d.id || "",
        name: d.deviceName || d.name || "Wearable Device",
        deviceId: d.deviceTypeId ? `#${d.deviceTypeId}` : "\u2014",
        imei: d.imei || d.deviceIdentifier || "\u2014",
        status: d.status || "\u2014",
        // backend value as-is (ACTIVE / REVOKED)
        battery: typeof d.batteryLevel === "number" ? d.batteryLevel : "\u2014",
        firmware: d.firmwareVersion || "\u2014",
        network: d.networkType || "\u2014",
        fallSensor: d.fallAlarmStatus ? "Active" : "\u2014",
        gps: d.positionValid ? "Locked" : "\u2014",
        lastSync: d.serverTimestamp ? new Date(d.serverTimestamp).toLocaleString("en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "\u2014",
        alerts: []
      }));
      setSeniorDevices(list);
      const deviceKeys = new Set(
        list.flatMap((d) => [d.uuid, d.imei]).filter((k) => k && k !== "\u2014")
      );
      AlarmService.getAllAlarms().then((alarmsRes) => {
        const filtered = (alarmsRes || []).filter((a) => deviceKeys.has(a.deviceUUID) || deviceKeys.has(a.ident));
        const alarmList = filtered.map((a, idx) => {
          let dateStr = "\u2014";
          if (a.timestamp) {
            const d = new Date(a.timestamp);
            dateStr = d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
          }
          return {
            id: String(a.id ?? idx),
            date: dateStr,
            type: a.alarmType || "Alarm",
            severity: a.severity || "MEDIUM",
            device: a.deviceUUID ? String(a.deviceUUID).slice(0, 8) : "\u2014",
            description: a.description || "\u2014",
            status: a.resolved ? "Resolved" : "Open",
            resolvedBy: a.resolvedBy || "\u2014"
          };
        });
        setSeniorAlerts(alarmList);
      }).catch((err) => {
        console.warn("Failed to load alarms from API:", err);
        setSeniorAlerts([]);
      });
      const firstDeviceUuid = list.find((d) => d.uuid)?.uuid;
      if (firstDeviceUuid) {
        VitalService.getVitalsSummary({ deviceUUID: firstDeviceUuid, days: 7 }).then((vitalsRes) => {
          const entries = Array.isArray(vitalsRes) ? vitalsRes : vitalsRes?.data ?? vitalsRes?.vitalSummaries ?? [];
          if (Array.isArray(entries) && entries.length > 0) {
            const sorted = [...entries].sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
            const v = sorted[sorted.length - 1];
            setLatestVitals({
              heartRate: v.heartRate,
              spo2: v.spo2,
              temperature: v.temperature,
              glucose: v.glucose,
              bp: v.systolicBp && v.diastolicBp ? `${v.systolicBp}/${v.diastolicBp}` : void 0
            });
          }
        }).catch((err) => {
          console.warn("Failed to load vitals from API:", err);
        });
      }
    }).catch((err) => {
      console.warn("Failed to load devices for senior from API:", err);
      setSeniorDevices([]);
      setSeniorAlerts([]);
    });
    ComplianceService.getReportsOfSenior(selectedSenior.id).then((reportsRes) => {
      const list = (reportsRes || []).map((r, idx) => ({
        id: r.id || String(idx),
        name: r.reportName || "Report",
        type: r.reportType || "\u2014",
        url: r.reportUrl || ""
      }));
      setSeniorReports(list);
    }).catch((err) => {
      console.warn("Failed to load reports for senior from API:", err);
      setSeniorReports([]);
    });
    const mapGuardian = (g, idx, relationship) => ({
      id: g.id || g.userId || String(idx),
      name: g.name || `${g.firstName || g.first_name || ""} ${g.lastName || g.last_name || ""}`.trim() || "Guardian",
      relationship: relationship || g.relationship || "Guardian",
      age: g.age ?? null,
      location: g.location || g.city || "",
      email: g.primaryEmail || g.email || "\u2014",
      phone: g.phoneNumber || g.phone_number ? String(g.phoneNumber || g.phone_number) : "\u2014",
      whatsapp: Boolean(g.whatsapp),
      call: Boolean(g.phoneNumber || g.phone_number),
      notes: g.notes || ""
    });
    if (currentUserRole === "ADMIN") {
      AdminService.adminGetMappings().then((mappingsRes) => {
        const forThisSenior = (mappingsRes || []).filter((m) => {
          const sid = m.seniorId || m.senior?.id || m.senior?.userId || m.seniorUUID;
          return sid === selectedSenior.id;
        });
        const list = forThisSenior.map(
          (m, idx) => mapGuardian(m.guardian || { name: m.guardianName, email: m.guardianEmail }, idx, m.relationship)
        );
        setSeniorGuardians(list);
      }).catch((err) => {
        console.warn("Failed to load guardian mappings from API:", err);
        setSeniorGuardians([]);
      });
    } else if (currentUserRole === "SENIOR") {
      SeniorService.getMyGuardians().then((guardiansRes) => {
        setSeniorGuardians((guardiansRes || []).map((g, idx) => mapGuardian(g, idx)));
      }).catch((err) => {
        console.warn("Failed to load guardians from API:", err);
        setSeniorGuardians([]);
      });
    } else {
      setSeniorGuardians([]);
    }
  }, [selectedSenior, currentUserRole]);
  const [alertTypeFilter, setAlertTypeFilter] = useState("ALL");
  const filteredSeniorAlerts = seniorAlerts.filter(
    (a) => alertTypeFilter === "ALL" || String(a.type).toLowerCase().includes(alertTypeFilter.toLowerCase())
  );
  const vitalsView = {
    heartRate: latestVitals?.heartRate ?? selectedSenior["latestHeartRate"],
    bp: latestVitals?.bp || selectedSenior["latestBp"],
    spo2: latestVitals?.spo2 ?? selectedSenior["latestSpo2"],
    temperature: latestVitals?.temperature ?? selectedSenior["latestTemperature"],
    glucose: latestVitals?.glucose ?? selectedSenior["latestBloodGlucose"],
    respRate: selectedSenior["latestRespRate"]
  };
  const handleExportAlertsCsv = () => {
    const header = ["Date", "Type", "Severity", "Device", "Description", "Status", "Resolved By"];
    const rows = filteredSeniorAlerts.map(
      (a) => [a.date, a.type, a.severity, a.device, a.description, a.status, a.resolvedBy].map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `alerts-${selectedSenior.residentId || "senior"}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const [noteText, setNoteText] = useState("");
  const [noteCategory, setNoteCategory] = useState("GENERAL");
  const [activityLogs, setActivityLogs] = useState([]);
  const [guardianPrefs, setGuardianPrefs] = useState({});
  const currentSeniorIndex = seniorsList.findIndex((s) => s.id === selectedSenior.id);
  const goToPrevSenior = () => {
    if (currentSeniorIndex > 0) {
      const prev = seniorsList[currentSeniorIndex - 1];
      setSelectedSenior(prev);
      setSelectedSeniorId(prev.id);
    }
  };
  const goToNextSenior = () => {
    if (currentSeniorIndex < seniorsList.length - 1) {
      const next = seniorsList[currentSeniorIndex + 1];
      setSelectedSenior(next);
      setSelectedSeniorId(next.id);
    }
  };
  const handleCloseAddSeniorDialog = () => {
    setOpenAddSeniorDialog(false);
    setNewSeniorFirstName("");
    setNewSeniorLastName("");
    setNewSeniorEmail("");
    setNewSeniorPhone("");
    setNewSeniorGender("Male");
    setNewSeniorDob("");
  };
  const handleCreateSenior = () => {
    if (!newSeniorFirstName.trim() || !newSeniorLastName.trim()) {
      notify("First Name and Last Name are required.", "error");
      return;
    }
    // Keep phone as a sanitized string so leading zeros / long numbers are preserved.
    const cleanedPhone = newSeniorPhone.replace(/\D/g, "");
    let dobTimestamp = 0;
    if (newSeniorDob) {
      const dateObj = new Date(newSeniorDob);
      if (!isNaN(dateObj.getTime())) {
        dobTimestamp = dateObj.getTime();
      }
    }
    const payload = {
      firstName: newSeniorFirstName.trim(),
      lastName: newSeniorLastName.trim(),
      phoneNumber: cleanedPhone,
      height: 170,
      weight: 70,
      gender: newSeniorGender.toUpperCase(),
      dateOfBirth: dobTimestamp
    };
    if (newSeniorEmail.trim()) {
      payload.email = newSeniorEmail.trim();
    }
    SeniorService.createSenior(payload).then(() => {
      notify("Senior resident registered successfully.", "success");
      loadSeniors();
      handleCloseAddSeniorDialog();
    }).catch((err) => {
      console.error("Failed to create senior:", err);
      notify(`Failed to create senior: ${err?.message || "Unknown error"}`, "error");
    });
  };
  const handleTabChange = (_, newValue) => {
    setActiveSubTab(newValue);
  };
  const handlePostNote = () => {
    if (!noteText.trim()) return;
    const newLog = {
      id: Date.now().toString(),
      author: currentUserName || "Staff",
      role: currentUserRole || "Staff",
      avatarBg: "#3B82F6",
      time: (/* @__PURE__ */ new Date()).toLocaleString("en-US", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
      category: noteCategory,
      content: noteText.trim()
    };
    setActivityLogs([newLog, ...activityLogs]);
    setNoteText("");
  };
  const totalNotes = activityLogs.length;
  const incidentNotesCount = activityLogs.filter((l) => l.category === "INCIDENT").length;
  const medicalNotesCount = activityLogs.filter((l) => l.category === "MEDICAL").length;
  const lastNoteTime = activityLogs.length > 0 ? activityLogs[0].time : "\u2014";
  if (!pageLoading && !pageError && seniorsList.length === 0) {
    return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Card sx={{ maxWidth: 520, width: "100%", textAlign: "center", py: 6, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
            No seniors found
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            {currentUserRole === "ADMIN" ? "There are no senior residents registered in the system yet. Create a user with the SENIOR role on the Users page, then map a guardian to them on the Guardians page." : "No seniors are mapped to your account yet. Ask an administrator to link you to a senior, or send a mapping request."}
          </Typography>
        </Card>
      </Box>;
  }
  return <DataState loading={pageLoading} error={pageError} onRetry={loadSeniors}>
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
      {
    /* 1. Header Banner Panel */
  }
      <Card
    sx={{
      bgcolor: "#0F172A",
      borderRadius: "12px",
      color: "#FFFFFF",
      p: 3.5,
      display: "flex",
      flexDirection: "column",
      gap: 3,
      boxShadow: "none"
    }}
  >
        <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", md: "center" },
      gap: 2.5
    }}
  >
          {/* Avatar & Basic Details */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                bgcolor: '#FEF3C7',
                color: '#D97706',
                width: 76,
                height: 76,
                fontSize: '28px',
                fontWeight: 800,
                border: '2.5px solid #F59E0B',
                flexShrink: 0
              }}
            >
              {selectedSenior.name ? selectedSenior.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </Avatar>

            {/* Name + subtitle + chips column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {/* Name row + MOCK chip */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {seniorsList.length > 1 ? (
                  <Select
                    value={selectedSenior.id}
                    onChange={(e) => {
                      const found = seniorsList.find((s) => s.id === e.target.value);
                      if (found) { setSelectedSenior(found); setSelectedSeniorId(found.id); }
                    }}
                    size="small"
                    sx={{
                      color: '#FFFFFF', fontWeight: 800, fontSize: '18px',
                      '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                      '.MuiSelect-icon': { color: '#FFFFFF' }, p: 0, ml: -1.5
                    }}
                  >
                    {seniorsList.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                  </Select>
                ) : (
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                    {selectedSenior.name || 'Unknown Senior'}
                  </Typography>
                )}
                {isMock && (
                  <Chip label="MOCK" size="small" sx={{
                    bgcolor: '#000000', color: '#ffffff', fontWeight: 700, fontSize: '8px',
                    height: 16, borderRadius: '3px', px: 0.5,
                    border: '1px solid rgba(255,255,255,0.2)', '& .MuiChip-label': { px: 0.5 }
                  }} />
                )}
              </Box>

              {/* Gender · Age · DOB · Blood Group */}
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                {[
                  selectedSenior.gender && selectedSenior.gender !== '—' ? selectedSenior.gender : null,
                  selectedSenior.age ? `${selectedSenior.age} yrs` : null,
                  selectedSenior.dob && selectedSenior.dob !== '—' ? `DOB: ${selectedSenior.dob}` : null,
                  selectedSenior.bloodGroup && selectedSenior.bloodGroup !== '—' ? `Blood: ${selectedSenior.bloodGroup}` : null,
                ].filter(Boolean).join(' · ') || 'No demographic data'}
              </Typography>

              {/* Chips row */}
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {selectedSenior.room && selectedSenior.room !== '—' && (
                  <Chip
                    icon={<LocationOnIcon sx={{ '&&': { color: '#D97706', fontSize: 13 } }} />}
                    label={selectedSenior.room}
                    size="small"
                    sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }}
                  />
                )}
                {selectedSenior.mobilityAid && selectedSenior.mobilityAid !== '—' && (
                  <Chip label={selectedSenior.mobilityAid} size="small"
                    sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }} />
                )}
                <Chip label="Active Resident" size="small"
                  sx={{ bgcolor: '#D1FAE5', color: '#059669', fontWeight: 700, fontSize: '11px', borderRadius: '6px' }} />
                {selectedSenior.admissionDate && selectedSenior.admissionDate !== '—' && (
                  <Chip label={`Admitted ${selectedSenior.admissionDate}`} size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontWeight: 600, fontSize: '11px', borderRadius: '6px' }} />
                )}
                {selectedSenior.residentId && selectedSenior.residentId !== '—' && (
                  <Chip label={selectedSenior.residentId} size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#E2E8F0', fontWeight: 600, fontSize: '11px', borderRadius: '6px' }} />
                )}
              </Box>
            </Box>
          </Box>

          {
    /* Header Action Buttons */
  }
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center", width: { xs: "100%", md: "auto" } }}>
            {
    /* Prev / Next senior — only when there is more than one resident */
  }
            {seniorsList.length > 1 && <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
    variant="outlined"
    size="small"
    startIcon={<ChevronLeftIcon sx={{ fontSize: 16 }} />}
    onClick={goToPrevSenior}
    disabled={currentSeniorIndex <= 0}
    sx={{
      color: "#FFFFFF",
      borderColor: "rgba(255, 255, 255, 0.2)",
      fontWeight: 700,
      textTransform: "none",
      fontSize: "12px",
      px: 1.5,
      py: 0.75,
      borderRadius: "8px",
      "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.08)" },
      "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.3)", borderColor: "rgba(255, 255, 255, 0.08)" }
    }}
  >
                  Prev
                </Button>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, whiteSpace: "nowrap", px: 0.5 }}>
                  {currentSeniorIndex + 1} of {seniorsList.length}
                </Typography>
                <Button
    variant="outlined"
    size="small"
    endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
    onClick={goToNextSenior}
    disabled={currentSeniorIndex >= seniorsList.length - 1}
    sx={{
      color: "#FFFFFF",
      borderColor: "rgba(255, 255, 255, 0.2)",
      fontWeight: 700,
      textTransform: "none",
      fontSize: "12px",
      px: 1.5,
      py: 0.75,
      borderRadius: "8px",
      "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.08)" },
      "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.3)", borderColor: "rgba(255, 255, 255, 0.08)" }
    }}
  >
                  Next
                </Button>
              </Box>}
            {currentUserRole === "ADMIN" && <Button
    variant="contained"
    onClick={() => setOpenAddSeniorDialog(true)}
    startIcon={<AddIcon />}
    sx={{
      bgcolor: "#EC8D20",
      "&:hover": { bgcolor: "#C77518" },
      color: "#FFFFFF",
      fontWeight: 700,
      textTransform: "none",
      px: 2.5,
      py: 1,
      fontSize: "13px",
      borderRadius: "8px",
      boxShadow: "none"
    }}
  >
                Add Senior
              </Button>}
            <Button
    variant="contained"
    onClick={() => setOpenFallAlert(true)}
    startIcon={<NotificationsActiveIcon />}
    sx={{
      bgcolor: "#EF4444",
      "&:hover": { bgcolor: "#DC2626" },
      color: "#FFFFFF",
      fontWeight: 700,
      textTransform: "none",
      px: 2.5,
      py: 1,
      fontSize: "13px",
      borderRadius: "8px",
      boxShadow: "none"
    }}
  >
              Active Fall Alert
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }} />

        {
    /* Header Stats Grid */
  }
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.fallsCount ?? '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                FALLS THIS YEAR
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {selectedSenior.medCompliance ? `${selectedSenior.medCompliance}%` : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                MED COMPLIANCE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {seniorDevices.length > 0 ? seniorDevices.length : (selectedSenior.devicesCount || '—')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                DEVICES ACTIVE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', lineHeight: 1, mb: 0.5 }}>
                {vitalsView.spo2 ? `${vitalsView.spo2}%` : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                SPO₂ (LATEST)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D97706', lineHeight: 1, mb: 0.5 }}>
                {vitalsView.bp && vitalsView.bp !== '—' ? vitalsView.bp : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                BLOOD PRESSURE
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#FFFFFF', lineHeight: 1, mb: 0.5 }}>
                {seniorGuardians.length > 0 ? seniorGuardians.length : (selectedSenior.guardiansCount || '—')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>
                GUARDIANS
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {
    /* 2. Sub-Tabs */
  }
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mt: -1 }}>
        <Tabs
          value={activeSubTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '13px',
              minWidth: 'auto',
              px: 2.5,
              pb: 1.25,
              color: 'text.secondary',
              textTransform: 'none',
              '&.Mui-selected': { color: 'primary.main' }
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Medical" />
          <Tab label="Devices" />
          <Tab label="Alert History" />
          <Tab label="Guardians" />
          <Tab label="Notes & Activity" />
        </Tabs>
      </Box>

      {
    /* 3. Sub-Tabs Views Content */
  }
      <Box>
        {
    /* SUBTAB 0: Overview (Demographics & Basic Summary) */
  }
        {activeSubTab === 0 && <Grid container spacing={3.5}>
            {
    /* Left Demographics */
  }
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.5 }}>
                  PERSONAL INFORMATION
                </Typography>
                 <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>FULL NAME</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.name}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>GENDER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.gender}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>DATE OF BIRTH</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.dob}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>AGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.age ? `${selectedSenior.age} years` : "—"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>NATIONALITY</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.nationality || "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>BLOOD GROUP</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.bloodGroup}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>PRIMARY LANGUAGE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.language || "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>RELIGION</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.religion || "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>RESIDENT ID</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.residentId}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>ADMISSION DATE</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.admissionDate}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>ROOM</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.room}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>MOBILITY AID</Typography><Typography variant="body2" sx={{ fontWeight: 700, color: "#EC8D20" }}>{selectedSenior.mobilityAid || "\u2014"}</Typography></Box></Grid>
                </Grid>
              </Card>

              {
    /* Vitals Summary */
  }
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px" }}>LATEST VITALS</Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>Live readings</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><FavoriteIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.heartRate || "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>HEART RATE</Typography><Typography variant="caption" sx={{ color: vitalsView.heartRate ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.heartRate ? "Normal range" : "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><SpeedIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.bp || "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>BLOOD PRESSURE</Typography><Typography variant="caption" sx={{ color: vitalsView.bp !== "\u2014" ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.bp !== "\u2014" ? "Normal" : "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><OpacityIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.spo2 ? `${vitalsView.spo2}%` : "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>OXYGEN SAT.</Typography><Typography variant="caption" sx={{ color: vitalsView.spo2 ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.spo2 ? "Normal range" : "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><ThermostatIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.temperature ? `${vitalsView.temperature}\xB0C` : "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>TEMPERATURE</Typography><Typography variant="caption" sx={{ color: vitalsView.temperature ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.temperature ? "Normal" : "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><WaterDropIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.glucose || "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>BLOOD GLUCOSE</Typography><Typography variant="caption" sx={{ color: vitalsView.glucose ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.glucose ? "Normal" : "\u2014"}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><Box sx={{ p: 2, border: "1px solid #EAE5E0", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.5 }}><AirIcon sx={{ color: "#EC8D20", fontSize: 24, mb: 0.5 }} /><Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.1 }}>{vitalsView.respRate || "\u2014"}</Typography><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>RESP. RATE</Typography><Typography variant="caption" sx={{ color: vitalsView.respRate ? "#10B981" : "text.secondary", fontWeight: 600, fontSize: "11px" }}>{vitalsView.respRate ? "Normal" : "\u2014"}</Typography></Box></Grid>
                </Grid>
              </Card>

              {
    /* Care Team */
  }
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.5 }}>CARE TEAM</Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>PRIMARY PHYSICIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.primaryPhysician}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>PHYSICIAN CONTACT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.physicianPhone}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>ASSIGNED CAREGIVER</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.caregiver}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>FLOOR ATTENDANT</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.floorAttendant}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>DIETITIAN</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.dietitian}</Typography></Box></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}><Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>PHYSIOTHERAPIST</Typography><Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary" }}>{selectedSenior.physiotherapist}</Typography></Box></Grid>
                </Grid>
              </Card>
            </Grid>

            {
    /* Right Summary Panel */
  }
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>RISK SUMMARY</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Fall Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.fallRisk === "HIGH" ? "#EF4444" : selectedSenior.fallRisk === "MEDIUM" ? "#F59E0B" : selectedSenior.fallRisk === "LOW" ? "#10B981" : "text.secondary", fontWeight: 700 }}>{selectedSenior.fallRisk}</Typography></Box><Divider sx={{ borderColor: "divider" }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Wander Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.wanderRisk === "HIGH" ? "#EF4444" : selectedSenior.wanderRisk === "MEDIUM" ? "#F59E0B" : selectedSenior.wanderRisk === "LOW" ? "#10B981" : "text.secondary", fontWeight: 700 }}>{selectedSenior.wanderRisk}</Typography></Box><Divider sx={{ borderColor: "divider" }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Cardiac Risk</Typography><Typography variant="caption" sx={{ color: selectedSenior.cardiacRisk === "HIGH" ? "#EF4444" : selectedSenior.cardiacRisk === "MEDIUM" ? "#F59E0B" : selectedSenior.cardiacRisk === "LOW" ? "#10B981" : "text.secondary", fontWeight: 700 }}>{selectedSenior.cardiacRisk}</Typography></Box>
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>EMERGENCY CONTACTS</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {seniorGuardians.length > 0 ? seniorGuardians.map((g, index) => {
    const initials = g.name ? g.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "G";
    const isPrimary = index === 0 || String(g.relationship).toLowerCase().includes("primary");
    const avatarBg = isPrimary ? "#FEF3C7" : "#DBEAFE";
    const avatarColor = isPrimary ? "#D97706" : "#2563EB";
    return <Box key={g.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 28, height: 28, fontSize: "12px", fontWeight: 750 }}>{initials}</Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary", fontSize: "13px" }}>{g.name}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", display: "block" }}>{g.relationship} · {g.phone}</Typography>
                            </Box>
                          </Box>
                        </Box>;
  }) : <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>No emergency contacts listed</Typography>}
                </Box>
              </Card>

              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>ACTIVE CONDITIONS</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {selectedSenior.activeConditions && selectedSenior.activeConditions.length > 0 ? selectedSenior.activeConditions.map((cond) => <Chip key={cond} label={cond} size="small" sx={{ bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 600, fontSize: "11px", borderRadius: "4px" }} />) : <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>None</Typography>}
                </Box>
              </Card>
            </Grid>
          </Grid>}

        {
    /* SUBTAB 1: Medical Details Tab View — all data comes from the backend */
  }
        {activeSubTab === 1 && <Grid container spacing={3.5}>
            {
    /* Left Medical column */
  }
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>

              {
    /* Card 1: Diagnosed Conditions */
  }
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.5 }}>
                  DIAGNOSED CONDITIONS
                </Typography>
                {selectedSenior.activeConditions && selectedSenior.activeConditions.length > 0 ? <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {selectedSenior.activeConditions.map((cond, idx) => <React.Fragment key={cond}>
                        {idx > 0 && <Divider sx={{ borderColor: "divider" }} />}
                        <Box sx={{ py: 2, display: "flex", alignItems: "center", gap: 1 }}>
                          <InfoIcon sx={{ color: "#3B82F6", fontSize: 16 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 750, color: "text.primary" }}>{cond}</Typography>
                        </Box>
                      </React.Fragment>)}
                  </Box> : <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                    No diagnosed conditions on record for this senior.
                  </Typography>}
              </Card>

              {
    /* Card 2: Medications — shown when the backend provides medication data */
  }
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.5 }}>
                  CURRENT MEDICATIONS &amp; COMPLIANCE
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                  No medication records available for this senior yet.
                </Typography>
              </Card>

              {
    /* Card 3: Allergies */
  }
              <Card sx={{ p: 3, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.5 }}>
                  ALLERGIES &amp; CONTRAINDICATIONS
                </Typography>
                {selectedSenior.allergies ? <Box sx={{ p: 1.75, bgcolor: "#FFF1F2", borderRadius: "8px", display: "flex", alignItems: "center", gap: 2, borderLeft: "4px solid #EF4444" }}>
                    <ErrorIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: "#991B1B", fontWeight: 750, fontSize: "13px" }}>
                      {selectedSenior.allergies}
                    </Typography>
                  </Box> : <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                    No known allergies on record.
                  </Typography>}
              </Card>
            </Grid>

            {
    /* Right Medical Sidebar Column */
  }
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              {
    /* Physician Info Card */
  }
              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>
                  PHYSICIAN INFO
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "10px", letterSpacing: "0.5px" }}>PRIMARY PHYSICIAN</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 750, color: "text.primary", mt: 0.25 }}>{selectedSenior.primaryPhysician || "\u2014"}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: "divider" }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "10px", letterSpacing: "0.5px" }}>CONTACT</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650, color: "text.primary", mt: 0.25 }}>{selectedSenior.physicianPhone || "\u2014"}</Typography>
                  </Box>
                </Box>
              </Card>

              {
    /* Health Reports Card — uploaded compliance reports from the backend */
  }
              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>
                  HEALTH REPORTS
                </Typography>
                {seniorReports.length > 0 ? <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {seniorReports.map((report, idx) => <React.Fragment key={report.id}>
                        {idx > 0 && <Divider sx={{ borderColor: "divider" }} />}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>{report.name}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>{report.type}</Typography>
                        </Box>
                      </React.Fragment>)}
                  </Box> : <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>
                    No reports uploaded for this senior.
                  </Typography>}
              </Card>
            </Grid>
          </Grid>}

        {
    /* SUBTAB 2: Devices View Content */
  }
        {activeSubTab === 2 && <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {
    /* Devices Section Header */
  }
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {seniorDevices.length} devices assigned to {selectedSenior.name} - {selectedSenior.residentId}
              </Typography>
            </Box>

            {
    /* Devices Grid list */
  }
            {seniorDevices.length === 0 && <Card sx={{ p: 4, textAlign: "center", border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No devices assigned to this senior. Devices can be assigned from the Devices page.
                </Typography>
              </Card>}
            <Grid container spacing={3.5}>
              {seniorDevices.map((device) => <Grid size={{ xs: 12, md: 6 }} key={device.id}>
                  <Card sx={{ border: "1px solid", borderColor: "divider", boxShadow: "none", borderRadius: "8px", overflow: "hidden" }}>
                    {
    /* Card title banner */
  }
                    <Box sx={{ bgcolor: "#1E293B", p: 2, color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <DeviceHubIcon sx={{ color: "#3B82F6" }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{device.name}</Typography>
                          <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "11px" }}>Device ID: {device.deviceId} · IMEI: {device.imei}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ color: device.status === "ACTIVE" ? "#10B981" : "#EF4444", fontWeight: 700, fontSize: "11px", display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: device.status === "ACTIVE" ? "#10B981" : "#EF4444" }} /> {device.status}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "10px" }}>Last sync: {device.lastSync}</Typography>
                      </Box>
                    </Box>

                    {
    /* Device stats */
  }
                    <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.25 }}>
                      <Grid container spacing={2} sx={{ textAlign: "center" }}>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: device.battery !== "\u2014" && typeof device.battery === "number" && device.battery < 20 ? "#EF4444" : "text.primary" }}>
                            {device.battery !== "\u2014" ? `${device.battery}%` : "\u2014"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>BATTERY</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>{device.alerts ? device.alerts.length : 0}</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>ALERTS SENT</Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", fontSize: "16px", mt: 0.35 }}>Active</Typography>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: "10px" }}>STATUS</Typography>
                        </Grid>
                      </Grid>

                      {device.battery !== "\u2014" && typeof device.battery === "number" && <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: -0.5 }}>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", fontWeight: 600 }}>Battery</Typography>
                          <Box sx={{ flexGrow: 1, height: 6, bgcolor: "divider", borderRadius: "3px", overflow: "hidden" }}>
                            <Box sx={{ width: `${device.battery}%`, height: "100%", bgcolor: device.battery < 20 ? "#EF4444" : "#10B981" }} />
                          </Box>
                          <Typography sx={{ color: device.battery < 20 ? "#EF4444" : "#10B981", fontWeight: 700, fontSize: "11px" }}>{device.battery}%</Typography>
                        </Box>}

                      {
    /* Warning Battery Critical Alert */
  }
                      {device.battery !== "\u2014" && typeof device.battery === "number" && device.battery < 20 && <Box sx={{ p: 1.25, bgcolor: "#FEE2E2", border: "1px solid #FCA5A5", color: "#DC2626", borderRadius: "6px", fontSize: "11px", display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                          <WarningIcon sx={{ fontSize: 14, color: "#EF4444" }} />
                          Battery critical — device may go offline. Please charge or replace immediately.
                        </Box>}

                      {
    /* Metadata details list */
  }
                      <Grid container spacing={1.5} sx={{ border: "1px solid #FAF8F6", bgcolor: "background.default", p: 1.75, borderRadius: "8px" }}>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "10px" }}>FIRMWARE</Typography><Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary" }}>{device.firmware}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "10px" }}>NETWORK</Typography><Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary" }}>{device.network}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "10px" }}>FALL SENSOR</Typography><Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>{device.fallSensor}</Typography></Grid>
                        <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "10px" }}>GPS</Typography><Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>{device.gps}</Typography></Grid>
                      </Grid>

                      {
    /* Alerts Log from device */
  }
                      {device.alerts && device.alerts.length > 0 && <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 1 }}>
                            RECENT ALERTS FROM THIS DEVICE
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {device.alerts.map((alert, idx) => <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }} key={idx}>
                                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: alert.status === "ACTIVE" || alert.status === "CRITICAL" ? "#EF4444" : "#94A3B8" }} />
                                <Typography variant="caption" sx={{ color: "text.secondary", width: 60 }}>{alert.time.split(",")[0] || alert.time}</Typography>
                                <Typography variant="body2" sx={{ color: "text.primary", fontSize: "12px", fontWeight: 650 }}>{alert.type} - <Box component="span" sx={{ color: alert.status === "ACTIVE" || alert.status === "CRITICAL" ? "#EF4444" : "#94A3B8" }}>{alert.status}</Box></Typography>
                              </Box>)}
                          </Box>
                        </Box>}
                    </Box>
                  </Card>
                </Grid>)}
            </Grid>
          </Box>}

        {
    /* SUBTAB 3: Alert History View Table */
  }
        {activeSubTab === 3 && <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
            {
    /* Table title header and filters */
  }
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                All alerts for {selectedSenior.name} - {selectedSenior.residentId} — showing {filteredSeniorAlerts.length} of {seniorAlerts.length} total
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Select
    value={alertTypeFilter}
    onChange={(e) => setAlertTypeFilter(e.target.value)}
    size="small"
    sx={{ minWidth: 120, bgcolor: "#FFFFFF", borderRadius: "6px" }}
  >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="Fall">Fall Detected</MenuItem>
                  <MenuItem value="Dose">Missed Dose</MenuItem>
                  <MenuItem value="Battery">Low Battery</MenuItem>
                  <MenuItem value="Exit">Bed Exit</MenuItem>
                </Select>
                <Button
    variant="outlined"
    size="small"
    onClick={handleExportAlertsCsv}
    sx={{
      color: "text.primary",
      borderColor: "divider",
      bgcolor: "#FFFFFF",
      textTransform: "none",
      fontWeight: 600,
      fontSize: "13px",
      "&:hover": {
        borderColor: "#EC8D20",
        bgcolor: "background.default"
      }
    }}
  >
                  Export CSV
                </Button>
              </Box>
            </Box>

            {
    /* Main Log Table */
  }
            <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none", overflow: "hidden" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "background.default" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>DATE & TIME</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>SEVERITY</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>DEVICE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px", width: "35%" }}>DESCRIPTION</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.75, fontSize: "11px" }}>RESOLVED BY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSeniorAlerts.length === 0 ? <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No alerts logged for this senior.
                      </TableCell>
                    </TableRow> : filteredSeniorAlerts.map((alert) => <TableRow key={alert.id} sx={{ "&:hover": { bgcolor: "#FCFAF8" } }}>
                        <TableCell sx={{ py: 1.75, fontWeight: 700, color: "text.primary", fontSize: "13px" }}>
                          {alert.date}
                        </TableCell>
                        <TableCell sx={{ py: 1.75, fontWeight: 500, fontSize: "13px" }}>{alert.type}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
    label={alert.severity}
    size="small"
    sx={{
      bgcolor: alert.severity === "CRITICAL" ? "#FEE2E2" : alert.severity === "MEDIUM" ? "#FFFBEB" : "#EFF6FF",
      color: alert.severity === "CRITICAL" ? "#DC2626" : alert.severity === "MEDIUM" ? "#D97706" : "#2563EB",
      fontWeight: 800,
      fontSize: "10px",
      borderRadius: "4px",
      height: 20
    }}
  />
                        </TableCell>
                        <TableCell sx={{ py: 1.75, color: "text.secondary", fontSize: "13px" }}>{alert.device}</TableCell>
                        <TableCell sx={{ py: 1.75, color: "text.secondary", fontSize: "13px", lineHeight: 1.4 }}>{alert.description}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
    label={alert.status}
    variant="outlined"
    size="small"
    sx={{
      color: alert.status === "Open" || alert.status === "ACTIVE" ? "#EF4444" : alert.status === "Noted" || alert.status === "Acknowledged" ? "#D97706" : "#10B981",
      borderColor: alert.status === "Open" || alert.status === "ACTIVE" ? "#FCA5A5" : alert.status === "Noted" || alert.status === "Acknowledged" ? "#FCD34D" : "#A7F3D0",
      fontWeight: 700,
      fontSize: "11px",
      borderRadius: "4px"
    }}
  />
                        </TableCell>
                        <TableCell sx={{ py: 1.75, color: "text.secondary", fontSize: "13px" }}>{alert.resolvedBy}</TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>}

        {
    /* SUBTAB 4: Guardians View Content */
  }
        {activeSubTab === 4 && <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {
    /* Guardians Header */
  }
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {seniorGuardians.length} guardians linked to {selectedSenior.name} - {selectedSenior.residentId}
              </Typography>
            </Box>

            {
    /* List of Guardians cards */
  }
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              {seniorGuardians.length === 0 ? <Card sx={{ p: 4, textAlign: "center", border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>No linked guardians found for this senior.</Typography>
                </Card> : seniorGuardians.map((guardian, index) => {
    const initials = guardian.name ? guardian.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "G";
    const isPrimary = index === 0 || String(guardian.relationship).toLowerCase().includes("primary");
    const avatarBg = isPrimary ? "#FEF3C7" : "#DBEAFE";
    const avatarColor = isPrimary ? "#D97706" : "#2563EB";
    const chipLabel = isPrimary ? "Primary Guardian" : "Secondary Guardian";
    const chipBg = isPrimary ? "#EFF6FF" : "#F3F4F6";
    const chipColor = isPrimary ? "#2563EB" : "#4B5563";
    const prefs = guardianPrefs[guardian.id] || {
      fallAlert: false,
      missedDoses: false,
      lowBattery: false,
      geofence: false,
      sosButton: false,
      weeklyReport: false
    };
    const togglePref = (key, val) => {
      setGuardianPrefs((prev) => ({
        ...prev,
        [guardian.id]: {
          ...prefs,
          [key]: val
        }
      }));
    };
    return <Card key={guardian.id} sx={{ p: 3, border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none", display: "flex", flexDirection: "column", gap: 2.5 }}>
                      {
      /* Guardian Header Row */
    }
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 44, height: 44, fontSize: "16px", fontWeight: 800 }}>{initials}</Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 750, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
                              {guardian.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px" }}>
                              {[guardian.age ? `Age ${guardian.age}` : null, guardian.location || null, guardian.email].filter(Boolean).join(" \xB7 ")}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Chip label={chipLabel} size="small" sx={{ bgcolor: chipBg, color: chipColor, fontWeight: 800, fontSize: "10px", borderRadius: "4px", mb: 0.5 }} />
                          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", fontSize: "11px", fontWeight: 550 }}>
                            {guardian.relationship}
                          </Typography>
                        </Box>
                      </Box>

                      {
      /* Details info pills */
    }
                      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <Chip label={`Mobile: ${guardian.phone}`} size="small" sx={{ bgcolor: "background.default", color: "text.secondary", fontWeight: 600, fontSize: "11px", borderRadius: "4px" }} />
                        <Chip label={`Email: ${guardian.email}`} size="small" sx={{ bgcolor: "background.default", color: "text.secondary", fontWeight: 600, fontSize: "11px", borderRadius: "4px" }} />
                        {guardian.location && <Chip label={`City: ${guardian.location}`} size="small" sx={{ bgcolor: "background.default", color: "text.secondary", fontWeight: 600, fontSize: "11px", borderRadius: "4px" }} />}
                        {guardian.whatsapp && <Chip label="WhatsApp: Linked" size="small" sx={{ bgcolor: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "11px", borderRadius: "4px" }} />}
                      </Box>

                      <Divider sx={{ borderColor: "divider" }} />

                      {
      /* Switch notification preferences */
    }
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "10px", letterSpacing: "0.8px", display: "block", mb: 1.5 }}>
                          ALERT NOTIFICATION PREFERENCES
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>🚨 Fall Alert</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.fallAlert ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.fallAlert ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.fallAlert} onChange={(e) => togglePref("fallAlert", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>💊 Missed Doses</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.missedDoses ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.missedDoses ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.missedDoses} onChange={(e) => togglePref("missedDoses", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>🔋 Low Battery</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.lowBattery ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.lowBattery ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.lowBattery} onChange={(e) => togglePref("lowBattery", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>🗺� Geofence Breach</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.geofence ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.geofence ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.geofence} onChange={(e) => togglePref("geofence", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>🆘 SOS Button</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.sosButton ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.sosButton ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.sosButton} onChange={(e) => togglePref("sosButton", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, border: "1px solid #FAF8F6", bgcolor: "background.default", borderRadius: "6px" }}>
                              <Typography sx={{ fontSize: "12px", color: "text.primary", fontWeight: 600 }}>📊 Weekly Report</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Typography variant="caption" sx={{ color: prefs.weeklyReport ? "#059669" : "text.secondary", fontWeight: 700 }}>{prefs.weeklyReport ? "ON" : "OFF"}</Typography>
                                <Switch size="small" checked={prefs.weeklyReport} onChange={(e) => togglePref("weeklyReport", e.target.checked)} />
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {
      /* Recent Notifications logs */
    }
                      {guardian.notes && <Box>
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "10px", letterSpacing: "0.5px", display: "block", mb: 1.5 }}>
                            RECENT NOTIFICATIONS SENT
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="body2" sx={{ color: "text.primary", fontSize: "12px", display: "flex", alignItems: "center", gap: 1 }}>
                                {guardian.notes}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>Recent</Typography>
                            </Box>
                          </Box>
                        </Box>}
                    </Card>;
  })}
            </Box>
          </Box>}

        {
    /* SUBTAB 5: Notes & Activity View Content */
  }
        {activeSubTab === 5 && <Grid container spacing={3.5}>
            {
    /* Left Column: Form & Activity timeline logs */
  }
            <Grid size={{ xs: 12, md: 8.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              
              {
    /* Form Add Note */
  }
              <Card sx={{ p: 3, border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "11px", letterSpacing: "0.5px", display: "block", mb: 1 }}>
                  ADD NOTE
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
    multiline
    rows={3}
    fullWidth
    placeholder={`Add a care note, observation, or incident record for ${selectedSenior.name || "this resident"}...`}
    value={noteText}
    onChange={(e) => setNoteText(e.target.value)}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: "13px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {
    /* Category Selector */
  }
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.5px" }}>
                        CATEGORY:
                      </Typography>
                      <Select
    value={noteCategory}
    onChange={(e) => setNoteCategory(e.target.value)}
    size="small"
    sx={{
      borderRadius: "6px",
      fontSize: "12px",
      minWidth: 120,
      bgcolor: "#FFFFFF",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EC8D20" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#EC8D20" }
    }}
  >
                        <MenuItem value="GENERAL">General</MenuItem>
                        <MenuItem value="INCIDENT">Incident</MenuItem>
                        <MenuItem value="MEDICAL">Medical</MenuItem>
                        <MenuItem value="DEVICE">Device</MenuItem>
                      </Select>
                    </Box>

                    {
    /* Action Button */
  }
                    <Button
    variant="contained"
    onClick={handlePostNote}
    startIcon={<SendIcon sx={{ fontSize: 13 }} />}
    sx={{
      bgcolor: "#EC8D20",
      "&:hover": { bgcolor: "#C77518" },
      color: "#FFFFFF",
      fontWeight: 700,
      fontSize: "13px",
      textTransform: "none",
      px: 3,
      py: 0.85,
      borderRadius: "6px",
      boxShadow: "none"
    }}
  >
                      Post Note
                    </Button>
                  </Box>
                </Box>
              </Card>

              {
    /* Activity Log list card */
  }
              <Card sx={{ p: 3, border: "1px solid #EAE5E0", borderRadius: "8px", boxShadow: "none" }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: "11px", letterSpacing: "0.5px", display: "block", mb: 2.5 }}>
                  ACTIVITY LOG
                </Typography>

                <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  {activityLogs.map((log, index) => <Box key={log.id}>
                      {index > 0 && <Divider sx={{ borderColor: "divider", mb: 3.5 }} />}
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Avatar sx={{ bgcolor: log.avatarBg, width: 32, height: 32, fontSize: "13px", fontWeight: 800 }}>
                          {log.author.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 0.75 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                              <Typography variant="body2" sx={{ fontWeight: 750, color: "text.primary" }}>{log.author}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 550 }}>{log.role}</Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px" }}>· {log.time}</Typography>
                            </Box>
                            <Chip
    label={log.category}
    size="small"
    sx={{
      height: 18,
      fontSize: "10px",
      fontWeight: 800,
      borderRadius: "4px",
      bgcolor: log.category === "INCIDENT" ? "#FEE2E2" : log.category === "MEDICAL" ? "#EFF6FF" : log.category === "DEVICE" ? "#FFFBEB" : "#F3F4F6",
      color: log.category === "INCIDENT" ? "#DC2626" : log.category === "MEDICAL" ? "#2563EB" : log.category === "DEVICE" ? "#D97706" : "#4B5563"
    }}
  />
                          </Box>
                          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", lineHeight: 1.5 }}>
                            {log.content}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>)}
                </Box>
              </Card>

            </Grid>

            {
    /* Right Column Summary & Milestones */
  }
            <Grid size={{ xs: 12, md: 3.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
              {
    /* Quick Summary Counts card */
  }
              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2 }}>
                  QUICK SUMMARY
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Total notes</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 750, fontSize: "13px" }}>{totalNotes}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: "divider" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Incident notes</Typography>
                    <Typography variant="body2" sx={{ color: "#DC2626", fontWeight: 750, fontSize: "13px" }}>{incidentNotesCount}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: "divider" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Medical notes</Typography>
                    <Typography variant="body2" sx={{ color: "#2563EB", fontWeight: 750, fontSize: "13px" }}>{medicalNotesCount}</Typography>
                  </Box>
                  <Divider sx={{ borderColor: "divider" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px", fontWeight: 500 }}>Last entry</Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 700, fontSize: "12px" }}>{lastNoteTime}</Typography>
                  </Box>
                </Box>
              </Card>

              {
    /* Milestones timeline card */
  }
              <Card sx={{ p: 2.5, borderRadius: "8px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
                <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.8px", mb: 2.25 }}>
                  MILESTONES
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                  {selectedSenior.admissionDate && selectedSenior.admissionDate !== "\u2014" && <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                      <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: "50%", bgcolor: "#4F46E5", flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: "text.primary", fontSize: "13px" }}>Admitted</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", display: "block", mt: 0.1 }}>{selectedSenior.admissionDate}</Typography>
                      </Box>
                    </Box>}
                  {seniorDevices.map((device) => <Box key={device.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                      <Box sx={{ mt: 0.5, width: 8, height: 8, borderRadius: "50%", bgcolor: "#10B981", flexShrink: 0 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 750, color: "text.primary", fontSize: "13px" }}>{device.name} assigned</Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "11px", display: "block", mt: 0.1 }}>IMEI: {device.imei}</Typography>
                      </Box>
                    </Box>)}
                  {(!selectedSenior.admissionDate || selectedSenior.admissionDate === "\u2014") && seniorDevices.length === 0 && <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "13px" }}>No milestones recorded yet.</Typography>}
                </Box>
              </Card>
            </Grid>
          </Grid>}
      </Box>

      {
    /* Trigger Dialog Alert Modal — shows the currently selected resident's real data */
  }
      <FallAlertModal
    open={openFallAlert}
    onClose={() => setOpenFallAlert(false)}
    patient={{
      id: selectedSenior.id,
      name: selectedSenior.name,
      age: selectedSenior.age || void 0,
      gender: selectedSenior.gender !== "\u2014" ? selectedSenior.gender : void 0,
      condition: selectedSenior.activeConditions?.[0],
      location: selectedSenior.address || selectedSenior.gps?.place || (selectedSenior.room !== "\u2014" ? selectedSenior.room : void 0),
      device: seniorDevices[0]?.name,
      battery: typeof seniorDevices[0]?.battery === "number" ? seniorDevices[0].battery : void 0,
      alertTime: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }}
    respondedBy={currentUserName ? `${currentUserName}${currentUserRole ? ` (${currentUserRole})` : ""}` : void 0}
  />

      {
    /* Dialog modal for adding new senior */
  }
      <Dialog
    open={openAddSeniorDialog}
    onClose={handleCloseAddSeniorDialog}
    maxWidth="sm"
    fullWidth
    slotProps={{
      paper: {
        sx: {
          borderRadius: "12px",
          p: 1.5
        }
      }
    }}
  >
        {
    /* Custom Header with close button */
  }
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 1, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary", fontSize: "18px" }}>
            Add New Senior
          </Typography>
          <IconButton
    onClick={handleCloseAddSeniorDialog}
    size="small"
    sx={{
      color: "text.secondary",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)"
      }
    }}
  >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {
    /* Row 1: First Name & Last Name */
  }
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    FIRST NAME *
                  </Typography>
                  <TextField
    fullWidth
    placeholder="Enter first name"
    value={newSeniorFirstName}
    onChange={(e) => setNewSeniorFirstName(e.target.value)}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    LAST NAME *
                  </Typography>
                  <TextField
    fullWidth
    placeholder="Enter last name"
    value={newSeniorLastName}
    onChange={(e) => setNewSeniorLastName(e.target.value)}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                </Box>
              </Grid>
            </Grid>

            {
    /* Row 2: Email & Phone */
  }
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    EMAIL
                  </Typography>
                  <TextField
    fullWidth
    placeholder="Enter email address"
    value={newSeniorEmail}
    onChange={(e) => setNewSeniorEmail(e.target.value)}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    PHONE
                  </Typography>
                  <TextField
    fullWidth
    placeholder="+91XXXXXXXXXX"
    value={newSeniorPhone}
    onChange={(e) => setNewSeniorPhone(e.target.value)}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                </Box>
              </Grid>
            </Grid>

            {
    /* Row 3: Gender & Date of Birth */
  }
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    GENDER
                  </Typography>
                  <Select
    value={newSeniorGender}
    onChange={(e) => setNewSeniorGender(e.target.value)}
    size="small"
    fullWidth
    sx={{
      borderRadius: "8px",
      backgroundColor: "#FFFFFF",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#EC8D20" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#EC8D20" }
    }}
  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 750, color: "text.secondary", letterSpacing: "0.5px" }}>
                    DATE OF BIRTH
                  </Typography>
                  <TextField
    fullWidth
    type="date"
    value={newSeniorDob}
    onChange={(e) => setNewSeniorDob(e.target.value)}
    size="small"
    slotProps={{
      inputLabel: {
        shrink: true
      }
    }}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        "& fieldset": { borderColor: "divider" },
        "&:hover fieldset": { borderColor: "#EC8D20" },
        "&.Mui-focused fieldset": { borderColor: "#EC8D20" }
      }
    }}
  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
          <Button
    onClick={handleCloseAddSeniorDialog}
    sx={{
      textTransform: "none",
      fontWeight: 700,
      color: "text.secondary",
      fontSize: "13px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)"
      }
    }}
  >
            Cancel
          </Button>
          <Button
    onClick={handleCreateSenior}
    variant="contained"
    sx={{
      textTransform: "none",
      fontWeight: 700,
      backgroundColor: "#EC8D20",
      "&:hover": {
        backgroundColor: "#C77518"
      },
      fontSize: "13px",
      borderRadius: "6px",
      px: 3,
      boxShadow: "none"
    }}
  >
            Create Senior
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </DataState>;
};
export default Seniors;
