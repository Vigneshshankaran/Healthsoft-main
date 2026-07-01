import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
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
  DialogContent,
  DialogActions,
  Select,
  Autocomplete,
  MenuItem,
  IconButton,
  Grid,
  TextField
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { AdminService, SeniorService } from "../api";
import { DataState } from "../components/DataState";
import { useFeedback } from "../hooks/useFeedback";
export const Guardians = () => {
  const { notify, confirm } = useFeedback();
  const [mappings, setMappings] = useState([]);
  const [isMock, setIsMock] = useState(false);
  const [seniors, setSeniors] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [availableGuardians, setAvailableGuardians] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [selectedSeniorId, setSelectedSeniorId] = useState("");
  const [selectedGuardianId, setSelectedGuardianId] = useState("");
  const [openAddSeniorDialog, setOpenAddSeniorDialog] = useState(false);
  const [newSeniorFirstName, setNewSeniorFirstName] = useState("");
  const [newSeniorLastName, setNewSeniorLastName] = useState("");
  const [newSeniorEmail, setNewSeniorEmail] = useState("");
  const [newSeniorPhone, setNewSeniorPhone] = useState("");
  const [newSeniorGender, setNewSeniorGender] = useState("Male");
  const [newSeniorDob, setNewSeniorDob] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const fetchDropdownUsers = () => {
    AdminService.adminGetUsers().then((res) => {
      if (res) {
        const loadedSeniors = [];
        const loadedGuardians = [];
        res.forEach((u, index) => {
          const id = u.id || u.userId || `user-${index}`;
          const name = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User";
          const email = u.primaryEmail || u.email || "\u2014";
          const phone = u.phoneNumber || u.phone_number ? String(u.phoneNumber || u.phone_number) : "\u2014";
          if (u.role === "SENIOR") {
            loadedSeniors.push({ id, name, email, phone });
          } else if (u.role === "GUARDIAN") {
            loadedGuardians.push({ id, name, email, phone });
          }
        });
        setSeniors(loadedSeniors);
        setGuardians(loadedGuardians);
      }
    }).catch((err) => {
      console.error("Failed to load users for dropdowns:", err);
    });
  };
  useEffect(() => {
    fetchMappings();
    fetchDropdownUsers();
  }, []);

  useEffect(() => {
    if (selectedSeniorId) {
      AdminService.adminGetGuardiansAvailableForSenior(selectedSeniorId)
        .then((res) => {
          if (res) {
            const loaded = res.map((u, index) => {
              const id = u.id || u.userId || `guardian-${index}`;
              const name = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User";
              const email = u.primaryEmail || u.email || "\u2014";
              const phone = u.phoneNumber || u.phone_number ? String(u.phoneNumber || u.phone_number) : "\u2014";
              return { id, name, email, phone };
            });
            setAvailableGuardians(loaded);
          }
        })
        .catch((err) => {
          console.error("Failed to load available guardians:", err);
          // Mock fallback: filter all guardians
          const fallback = guardians.map(g => ({ id: g.id, name: g.name, email: g.email, phone: g.phone || "\u2014" }));
          setAvailableGuardians(fallback);
        });
    } else {
      setAvailableGuardians([]);
    }
  }, [selectedSeniorId, guardians]);
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
      fetchDropdownUsers();
      handleCloseAddSeniorDialog();
    }).catch((err) => {
      console.error("Failed to create senior:", err);
      notify(`Failed to create senior: ${err?.message || "Unknown error"}`, "error");
    });
  };
  const fetchMappings = () => {
    setPageError(null);
    AdminService.adminGetMappings().then((res) => {
      setPageLoading(false);
      if (res && res.length > 0) {
        const mapped = res.map((m, index) => {
          const senior = m.senior || {};
          const guardian = m.guardian || {};
          const sFirst = senior.firstName || senior.first_name || "";
          const sLast = senior.lastName || senior.last_name || "";
          const seniorName = sFirst || sLast ? `${sFirst} ${sLast}`.trim() : m.seniorName || "Senior";
          const seniorEmail = senior.primaryEmail || senior.email || m.seniorEmail || "\u2014";
          const sPhone = senior.phoneNumber || senior.phone_number;
          const seniorPhone = sPhone ? String(sPhone) : m.seniorPhone || "\u2014";
          const gFirst = guardian.firstName || guardian.first_name || "";
          const gLast = guardian.lastName || guardian.last_name || "";
          const guardianName = gFirst || gLast ? `${gFirst} ${gLast}`.trim() : m.guardianName || "Guardian";
          const guardianEmail = guardian.primaryEmail || guardian.email || m.guardianEmail || "\u2014";
          let dateStr = "\u2014";
          const rawDate = m.createdAt || m.created_at || m.createdDate || m.date;
          if (rawDate) {
            const d = new Date(rawDate);
            dateStr = d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
          }
          return {
            id: m.id || m.mappingId || `mapping-${index}`,
            seniorName,
            seniorEmail,
            seniorPhone,
            guardianName,
            guardianEmail,
            status: m.status || "APPROVED",
            date: dateStr
          };
        });
        setIsMock(false);
        setMappings(mapped);
      } else {
        throw new Error("No mappings returned from API");
      }
    }).catch((err) => {
      console.error("Failed to fetch mappings from API, using mock fallback:", err);
      setIsMock(true);
      setPageLoading(false);
      setPageError(null);
      const mockMappings = [
        { id: "1", seniorName: "Meenakshi Rajan", seniorEmail: "meenakshi.r@healthsoft.in", seniorPhone: "9840012342", guardianName: "Suresh Rajan", guardianEmail: "suresh.rajan@gmail.com", status: "APPROVED", date: "Mar 01, 2026" },
        { id: "2", seniorName: "Rajagopalan Subramaniam", seniorEmail: "rajagopalan.s@healthsoft.in", seniorPhone: "9840012345", guardianName: "Ananya Subramaniam", guardianEmail: "ananya.s@gmail.com", status: "APPROVED", date: "Jan 01, 2026" },
        { id: "3", seniorName: "Kamakshi Venkataraman", seniorEmail: "kamakshi.v@healthsoft.in", seniorPhone: "9840012348", guardianName: "Ravi Venkataraman", guardianEmail: "ravi.v@gmail.com", status: "APPROVED", date: "Apr 01, 2026" },
        { id: "4", seniorName: "Doraiswamy Pillai", seniorEmail: "doraiswamy.p@healthsoft.in", seniorPhone: "9840012349", guardianName: "Malathi Pillai", guardianEmail: "malathi.p@gmail.com", status: "PENDING", date: "Dec 01, 2025" }
      ];
      setMappings(mockMappings);
    });
  };
  const handleDelink = async (id) => {
    const ok = await confirm({
      title: "Remove this guardian link?",
      message: "The guardian will no longer be connected to this senior.",
      confirmText: "Remove",
      danger: true
    });
    if (!ok) return;
    SeniorService.deleteMapping(id).then(() => {
      notify("Guardian link removed.", "success");
      fetchMappings();
    }).catch((err) => {
      console.error("Failed to delete mapping from API:", err);
      notify(`Failed to remove link: ${err?.message || "Unknown error from server"}`, "error");
    });
  };
  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setSelectedSeniorId("");
    setSelectedGuardianId("");
  };
  const handleLinkSenior = () => {
    if (!selectedSeniorId || !selectedGuardianId) return;
    const payload = {
      guardianId: selectedGuardianId,
      seniorId: selectedSeniorId
    };
    AdminService.adminMapGuardianSenior(payload).then(() => {
      notify("Guardian linked to senior.", "success");
      fetchMappings();
      handleCloseLinkDialog();
    }).catch((err) => {
      console.error("Failed to map guardian to senior in API:", err);
      notify(`Failed to link guardian: ${err?.message || "Unknown error from server"}`, "error");
    });
  };
  const handleTabChange = (_, newValue) => {
    setActiveSubTab(newValue);
  };
  const filteredMappings = mappings.filter((m) => {
    if (activeSubTab === 0) return true;
    if (activeSubTab === 1) return m.status === "PENDING";
    if (activeSubTab === 2) return m.status === "APPROVED";
    if (activeSubTab === 3) return m.status === "REJECTED";
    return true;
  });
  const getGroupedRows = () => {
    const grouped = {};
    filteredMappings.forEach((m) => {
      if (!grouped[m.seniorName]) grouped[m.seniorName] = [];
      grouped[m.seniorName].push(m);
    });
    const rows = [];
    Object.keys(grouped).forEach((seniorName) => {
      grouped[seniorName].forEach((item, index) => {
        rows.push({ mapping: item, isFirstOfGroup: index === 0, groupCount: grouped[seniorName].length });
      });
    });
    return rows;
  };
  const groupedRows = getGroupedRows();
  const pendingCount = mappings.filter((m) => m.status === "PENDING").length;
  const selectedSenior = seniors.find((s) => s.id === selectedSeniorId);
  const selectedGuardian = availableGuardians.find((g) => g.id === selectedGuardianId) || guardians.find((g) => g.id === selectedGuardianId);
  const canCreate = !!selectedSeniorId && !!selectedGuardianId;
  return <DataState loading={pageLoading} error={pageError} onRetry={fetchMappings}>
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
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A0E07", letterSpacing: "-0.5px" }}>
              Guardians
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
            {mappings.length} mapping(s) — {pendingCount} pending approval
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
          <Button
    variant="outlined"
    startIcon={<LinkIcon sx={{ color: "#EC8D20" }} />}
    onClick={() => setOpenLinkDialog(true)}
    sx={{
      borderColor: "#EC8D20",
      color: "#EC8D20",
      fontWeight: 650,
      backgroundColor: "#FFFFFF",
      textTransform: "none",
      "&:hover": { borderColor: "#4E2818", backgroundColor: "#FAF8F6" }
    }}
  >
            Link Senior
          </Button>

          <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenAddSeniorDialog(true)}
    sx={{
      backgroundColor: "#EC8D20",
      fontWeight: 650,
      textTransform: "none",
      "&:hover": { backgroundColor: "#C77518" }
    }}
  >
            Add Senior
          </Button>
        </Box>
      </Box>

      {
    /* Subtab Navigation */
  }
      <Box sx={{ borderBottom: 1, borderColor: "#EAE5E0" }}>
        <Tabs
    value={activeSubTab}
    onChange={handleTabChange}
    sx={{
      "& .MuiTabs-indicator": { backgroundColor: "#EC8D20" },
      "& .MuiTab-root": {
        fontWeight: 700,
        fontSize: "13px",
        color: "text.secondary",
        textTransform: "none",
        minWidth: 80,
        "&.Mui-selected": { color: "#EC8D20" }
      }
    }}
  >
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
      </Box>

      {
    /* Mappings Table */
  }
      <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", boxShadow: "none" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#FAF8F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "30%" }}>SENIOR</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "35%" }}>LINKED TO</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "20%" }}>STATUS & DATE</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", py: 1.5, width: "15%" }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedRows.length === 0 ? <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  No mappings found
                </TableCell>
              </TableRow> : groupedRows.map(({ mapping, isFirstOfGroup, groupCount }) => <TableRow
    key={mapping.id}
    sx={{ borderBottom: "1px solid #EAE5E0", "&:hover": { backgroundColor: "#FCFAF8" } }}
  >
                  {isFirstOfGroup && <TableCell
    rowSpan={groupCount}
    sx={{ verticalAlign: "top", py: 2.5, borderRight: "1px solid #EAE5E0", backgroundColor: "#FFFFFF" }}
  >
                      <Typography sx={{ fontWeight: 750, color: "text.primary", fontSize: "13px" }}>
                        {mapping.seniorName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px", mt: 0.25 }}>
                        {mapping.seniorEmail}
                      </Typography>
                      <Chip
    label={`${groupCount} ${groupCount === 1 ? "link" : "links"}`}
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

                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: "#EC8D20", color: "#FFFFFF", width: 32, height: 32, fontSize: "13px", fontWeight: 700 }}>
                        {mapping.guardianName.substring(0, 1).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 650, color: "text.primary", fontSize: "13px" }}>
                          {mapping.guardianName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "12px" }}>
                          {mapping.guardianEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Chip
    label={mapping.status}
    size="small"
    sx={{
      backgroundColor: mapping.status === "APPROVED" ? "#ECFDF5" : "#FEF2F2",
      color: mapping.status === "APPROVED" ? "#10B981" : "#EF4444",
      fontWeight: 700,
      fontSize: "11px",
      borderRadius: "4px",
      mb: 0.5
    }}
  />
                    <Typography sx={{ color: "text.secondary", fontSize: "12px", fontWeight: 500 }}>
                      {mapping.date}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Button
    variant="outlined"
    size="small"
    startIcon={<LinkOffIcon sx={{ color: "#EF4444", fontSize: 15 }} />}
    onClick={() => handleDelink(mapping.id)}
    sx={{
      borderColor: "#FCA5A5",
      color: "#EF4444",
      fontWeight: 650,
      fontSize: "12px",
      py: 0.5,
      px: 1.25,
      backgroundColor: "#FFFFFF",
      textTransform: "none",
      "&:hover": { backgroundColor: "#FEF2F2", borderColor: "#EF4444" }
    }}
  >
                      De-Link
                    </Button>
                  </TableCell>
                </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      {
    /* ── Link Senior to Guardian Dialog ── */
  }
      <Dialog
    open={openLinkDialog}
    onClose={handleCloseLinkDialog}
    maxWidth="lg"
    fullWidth
    slotProps={{
      paper: {
        sx: {
          borderRadius: "18px",
          overflow: "hidden",
          minHeight: "460px"
        }
      }
    }}
  >
        {
    /* Custom Header */
  }
        <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      px: 5,
      pt: 4,
      pb: 3,
      borderBottom: "1px solid #F0EBE6"
    }}
  >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
    sx={{
      width: 56,
      height: 56,
      borderRadius: "14px",
      backgroundColor: "#FFF2EC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }}
  >
              <LinkIcon sx={{ color: "#EC8D20", fontSize: 30 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "20px", lineHeight: 1.2 }}>
                Link Senior to Guardian
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: "14px", mt: 0.5 }}>
                Select a Senior and a Guardian to create a mapping
              </Typography>
            </Box>
          </Box>
          <IconButton
    onClick={handleCloseLinkDialog}
    size="medium"
    sx={{ color: "text.secondary", "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" } }}
  >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 5, pt: 5, pb: 4 }}>
          {
    /* Two-panel selector row */
  }
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>

            {
    /* Left panel — SENIOR */
  }
            <Box
    sx={{
      flex: 1,
      border: "2px solid #EAE5E0",
      borderRadius: "14px",
      p: 3,
      backgroundColor: "#FAFAFA",
      transition: "border-color 0.2s",
      ...selectedSeniorId && { borderColor: "#EC8D20" }
    }}
  >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PersonIcon sx={{ fontSize: 20, color: "#EC8D20" }} />
                <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "text.secondary", letterSpacing: "1px" }}>
                  SENIOR
                </Typography>
              </Box>
              <Autocomplete
                options={seniors}
                getOptionLabel={(option) => option.name}
                value={seniors.find(s => s.id === selectedSeniorId) || null}
                onChange={(event, newValue) => {
                  setSelectedSeniorId(newValue ? newValue.id : "");
                  setSelectedGuardianId("");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Senior"
                    placeholder="Search by name or phone..."
                    size="small"
                    sx={{
                      fontSize: "13px",
                      backgroundColor: "#FFFFFF",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "7px",
                        fontSize: "13px",
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps} style={{ fontSize: "13px" }}>
                      <Typography noWrap sx={{ fontSize: "13px", width: "100%" }}>
                        {option.name} {option.phone && option.phone !== '—' ? ` | ${option.phone}` : ''}
                      </Typography>
                    </li>
                  );
                }}
                filterOptions={(options, state) => {
                  const query = state.inputValue.toLowerCase();
                  return options.filter(option =>
                    option.name.toLowerCase().includes(query) ||
                    (option.phone && option.phone.includes(query)) ||
                    option.email.toLowerCase().includes(query)
                  );
                }}
              />
              {selectedSenior && <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Avatar sx={{ bgcolor: "#EC8D20", width: 32, height: 32, fontSize: "13px", fontWeight: 700 }}>
                    {selectedSenior.name[0]}
                  </Avatar>
                  <Typography sx={{ fontSize: "13px", color: "text.secondary", fontWeight: 500 }}>
                    {selectedSenior.phone && selectedSenior.phone !== '—' ? selectedSenior.phone : selectedSenior.email}
                  </Typography>
                </Box>}
            </Box>

            {
    /* Arrow connector */
  }
            <Box
    sx={{
      width: 48,
      height: 48,
      mt: 5,
      borderRadius: "50%",
      backgroundColor: canCreate ? "#EC8D20" : "#FFF2EC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "background-color 0.3s"
    }}
  >
              <ArrowForwardIcon sx={{ fontSize: 22, color: canCreate ? "#FFFFFF" : "#EC8D20" }} />
            </Box>

            {
    /* Right panel — GUARDIAN */
  }
            <Box
    sx={{
      flex: 1,
      border: "2px solid #EAE5E0",
      borderRadius: "14px",
      p: 3,
      backgroundColor: selectedSeniorId ? "#FAFAFA" : "#F5F3F2",
      opacity: selectedSeniorId ? 1 : 0.6,
      transition: "opacity 0.2s, background-color 0.2s, border-color 0.2s",
      ...selectedGuardianId && { borderColor: "#EC8D20" }
    }}
  >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PeopleAltIcon sx={{ fontSize: 20, color: "#EC8D20" }} />
                <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "text.secondary", letterSpacing: "1px" }}>
                  GUARDIAN
                </Typography>
              </Box>
              <Autocomplete
                options={availableGuardians}
                getOptionLabel={(option) => option.name}
                value={availableGuardians.find(g => g.id === selectedGuardianId) || null}
                onChange={(event, newValue) => {
                  setSelectedGuardianId(newValue ? newValue.id : "");
                }}
                disabled={!selectedSeniorId}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Guardian"
                    placeholder={selectedSeniorId ? "Search by name, phone or email..." : "Select a Senior first"}
                    size="small"
                    sx={{
                      fontSize: "13px",
                      backgroundColor: "#FFFFFF",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "7px",
                        fontSize: "13px",
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps} style={{ fontSize: "13px" }}>
                      <Typography noWrap sx={{ fontSize: "13px", width: "100%" }}>
                        {option.name} {option.phone && option.phone !== '—' ? ` | ${option.phone}` : ''} {option.email && option.email !== '—' ? ` | ${option.email}` : ''}
                      </Typography>
                    </li>
                  );
                }}
                filterOptions={(options, state) => {
                  const query = state.inputValue.toLowerCase();
                  return options.filter(option =>
                    option.name.toLowerCase().includes(query) ||
                    (option.phone && option.phone.includes(query)) ||
                    option.email.toLowerCase().includes(query)
                  );
                }}
              />
              {selectedGuardian && <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Avatar sx={{ bgcolor: "#EC8D20", width: 32, height: 32, fontSize: "13px", fontWeight: 700 }}>
                    {selectedGuardian.name[0]}
                  </Avatar>
                  <Typography sx={{ fontSize: "13px", color: "text.secondary", fontWeight: 500 }}>
                    {selectedGuardian.email && selectedGuardian.email !== '—' ? selectedGuardian.email : selectedGuardian.phone}
                  </Typography>
                </Box>}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 5, pb: 4, pt: 2, gap: 1.5 }}>
          <Button
    onClick={handleCloseLinkDialog}
    sx={{
      textTransform: "none",
      fontWeight: 600,
      color: "text.secondary",
      fontSize: "13px",
      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" }
    }}
  >
            Cancel
          </Button>
          <Button
    onClick={handleLinkSenior}
    disabled={!canCreate}
    startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
    sx={{
      textTransform: "none",
      fontWeight: 700,
      fontSize: "13px",
      borderRadius: "8px",
      px: 2.5,
      py: 1,
      backgroundColor: "#EC8D20",
      color: "#FFFFFF",
      boxShadow: "none",
      "&:hover": { backgroundColor: "#C77518", boxShadow: "none" },
      "&.Mui-disabled": { backgroundColor: "#F0E0D6", color: "text.secondary" }
    }}
  >
            Create Link
          </Button>
        </DialogActions>
      </Dialog>

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
        "& fieldset": { borderColor: "#EAE5E0" },
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
        "& fieldset": { borderColor: "#EAE5E0" },
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
        "& fieldset": { borderColor: "#EAE5E0" },
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
        "& fieldset": { borderColor: "#EAE5E0" },
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
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#EAE5E0" },
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
        "& fieldset": { borderColor: "#EAE5E0" },
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
export default Guardians;
