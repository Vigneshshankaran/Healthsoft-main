import { useContext, useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { HealthsoftContext } from '../context/HealthsoftContext';
import { useParams, useNavigate } from 'react-router-dom';
import SensorsIcon from '@mui/icons-material/Sensors';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import CloudIcon from '@mui/icons-material/Cloud';
import MedicationIcon from '@mui/icons-material/Medication';
import WatchIcon from '@mui/icons-material/Watch';
import StorageIcon from '@mui/icons-material/Storage';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { CRMService } from '../api';

export const SystemERP = () => {
  const { infraToggles, setInfraToggles, showConfirm, toast } = useContext(HealthsoftContext);
  const { systemView: selectedSystemView = 'system' } = useParams();
  const navigate = useNavigate();

  // CRM Leads Management state
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [selectedLead, setSelectedLead] = useState(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    status: "Lead",
    email_id: "",
    phone: "",
    phone_ext: "+91",
    mobile_no: "",
    whatsapp_no: "",
    custom_is_caregiver: 1,
    custom_is_senior: 0,
  });

  const fetchLeads = useCallback(() => {
    setLeadsLoading(true);
    setLeadsError(null);
    const ids = [];
    for (let i = 10; i <= 60; i++) {
      ids.push(`CRM-LEAD-2026-${String(i).padStart(5, '0')}`);
    }
    Promise.all(
      ids.map(name =>
        CRMService.getLead(name)
          .then(res => res?.data ?? res)
          .catch(() => null)
      )
    ).then(results => {
      setLeadsLoading(false);
      const validLeads = results.filter(l => l && l.name);
      setLeads(validLeads);
    });
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFetchLeadByName = (name) => {
    if (!name.trim()) {
      toast("Please enter a Lead Identifier.", "error");
      return;
    }
    setLeadsLoading(true);
    setLeadsError(null);
    CRMService.getLead(name.trim())
      .then((res) => {
        setLeadsLoading(false);
        const lead = res?.data ?? res;
        if (lead && lead.name) {
          setLeads((prev) => {
            const exists = prev.some((l) => l.name === lead.name);
            if (exists) {
              return prev.map((l) => (l.name === lead.name ? lead : l));
            } else {
              return [lead, ...prev];
            }
          });
          toast(`Successfully loaded lead ${lead.name}`, "success");
        } else {
          toast("Lead not found or invalid response.", "error");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch lead:", err);
        setLeadsLoading(false);
        toast(`Failed to load lead: Lead ${name.trim()} not found`, "error");
      });
  };

  const handleOpenDetails = (leadName) => {
    CRMService.getLead(leadName)
      .then((res) => {
        const lead = res?.data ?? res;
        setSelectedLead(lead);
        setOpenDetailsDialog(true);
      })
      .catch((err) => {
        console.error("Failed to fetch lead details:", err);
        toast(`Failed to load details: ${err?.message || "Unknown error"}`, "error");
      });
  };

  const handleOpenEdit = (lead) => {
    setSelectedLead(lead);
    setLeadForm({
      name: lead.name,
      first_name: lead.first_name || "",
      middle_name: lead.middle_name || "",
      last_name: lead.last_name || "",
      status: lead.status || "Lead",
      email_id: lead.email_id || "",
      phone: lead.phone || "",
      phone_ext: lead.phone_ext || "+91",
      mobile_no: lead.mobile_no || "",
      whatsapp_no: lead.whatsapp_no || "",
      custom_is_caregiver: lead.custom_is_caregiver ?? 1,
      custom_is_senior: lead.custom_is_senior ?? 0,
    });
    setOpenEditDialog(true);
  };

  const handleOpenCreate = () => {
    setLeadForm({
      name: `CRM-LEAD-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      first_name: "",
      middle_name: "",
      last_name: "",
      status: "Lead",
      email_id: "",
      phone: "",
      phone_ext: "+91",
      mobile_no: "",
      whatsapp_no: "",
      custom_is_caregiver: 1,
      custom_is_senior: 0,
    });
    setOpenCreateDialog(true);
  };

  const handleSaveEdit = () => {
    if (!leadForm.first_name.trim() || !leadForm.last_name.trim()) {
      toast("First name and Last name are required.", "error");
      return;
    }

    const payload = {
      first_name: leadForm.first_name.trim(),
      middle_name: leadForm.middle_name.trim() || undefined,
      last_name: leadForm.last_name.trim(),
      status: leadForm.status,
      email_id: leadForm.email_id.trim(),
      phone: leadForm.phone.trim(),
      phone_ext: leadForm.phone_ext,
      mobile_no: leadForm.mobile_no.trim() || leadForm.phone.trim(),
      whatsapp_no: leadForm.whatsapp_no.trim() || leadForm.phone.trim(),
      custom_is_caregiver: Number(leadForm.custom_is_caregiver),
      custom_is_senior: Number(leadForm.custom_is_senior),
    };

    CRMService.updateLead(selectedLead.name, payload)
      .then(() => {
        toast("Lead updated successfully.", "success");
        setOpenEditDialog(false);
        fetchLeads();
      })
      .catch((err) => {
        console.error("Failed to update lead:", err);
        toast(`Update failed: ${err?.message || "Unknown error"}`, "error");
      });
  };

  const handleCreateLead = () => {
    if (!leadForm.name.trim()) {
      toast("Lead Identifier is required.", "error");
      return;
    }
    if (!leadForm.first_name.trim() || !leadForm.last_name.trim()) {
      toast("First name and Last name are required.", "error");
      return;
    }

    const payload = {
      name: leadForm.name.trim(),
      first_name: leadForm.first_name.trim(),
      middle_name: leadForm.middle_name.trim() || undefined,
      last_name: leadForm.last_name.trim(),
      status: leadForm.status,
      email_id: leadForm.email_id.trim(),
      phone: leadForm.phone.trim(),
      phone_ext: leadForm.phone_ext,
      mobile_no: leadForm.mobile_no.trim() || leadForm.phone.trim(),
      whatsapp_no: leadForm.whatsapp_no.trim() || leadForm.phone.trim(),
      custom_is_caregiver: Number(leadForm.custom_is_caregiver),
      custom_is_senior: Number(leadForm.custom_is_senior),
    };

    CRMService.createLead(payload)
      .then(() => {
        toast("Lead created successfully.", "success");
        setOpenCreateDialog(false);
        fetchLeads();
      })
      .catch((err) => {
        console.error("Failed to create lead:", err);
        toast(`Creation failed: ${err?.message || "Unknown error"}`, "error");
      });
  };

  const handleTabChange = (_, val) => {
    if (val === 0) {
      navigate('/system/system');
    } else {
      navigate('/system/erp');
    }
  };

  const activeTab = selectedSystemView === 'erp' ? 1 : 0;

  useEffect(() => {
    if (selectedSystemView) {
      const el = document.getElementById(`section-${selectedSystemView}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSystemView]);

  const handleSvcToggle = async (key, label, critical) => {
    const prevVal = infraToggles[key];
    const newVal = !prevVal;

    if (prevVal && critical) {
      // Prompt user for confirmation on disabling critical service
      const res = await showConfirm(
        `⚠️ Disable ${label}?`,
        `Disabling <strong>${label}</strong> will affect all seniors. This is logged and may require supervisor approval.`,
        'Disable',
        'error'
      );
      if (!res.ok) {
        return; // keeps previous value
      }
      toast(`⚠️ ${label} disabled — audit logged`, 'error');
    } else {
      toast(`${label} ${newVal ? 're-enabled ✓' : 'disabled'}`, newVal ? 'success' : 'info');
    }

    setInfraToggles(prev => ({ ...prev, [key]: newVal }));
  };

  const FlowNode = ({ icon, name, stat, latency, clickMsg, type = 'fok' }) => (
    <Box
      onClick={() => toast(clickMsg, type === 'fok' ? 'info' : 'warning')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: type === 'fok' ? '#1A7A4A' : '#D68910',
        width: '100%',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: 'text.secondary' }
      }}
    >
      <Box sx={{
        width: 26,
        height: 26,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'action.hover',
        fontSize: '13px'
      }}>
        {icon}
      </Box>
      <Box sx={{ overflow: 'hidden' }}>
        <Typography noWrap sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{name}</Typography>
        <Typography noWrap sx={{ fontSize: '10px', color: 'text.secondary' }}>{stat}</Typography>
      </Box>
      {latency && (
        <Typography sx={{ ml: 'auto', fontSize: '10px', fontWeight: 700, color: type === 'fok' ? '#1A7A4A' : '#D68910' }}>
          {latency}
        </Typography>
      )}
    </Box>
  );

  const ToggleRow = ({ label, sub, toggleKey, critical }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.9, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
      <Box>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{label}</Typography>
        <Typography sx={{ fontSize: '10px', color: 'text.secondary', mt: 0.1 }}>{sub}</Typography>
      </Box>
      <Switch
        checked={!!infraToggles[toggleKey]}
        onChange={() => handleSvcToggle(toggleKey, label, critical)}
        size="small"
        color="success"
      />
    </Box>
  );

  return (
    <Box sx={{ p: 1.8, display: 'flex', flexDirection: 'column', gap: 1.8, overflowY: 'auto', bgcolor: 'background.default', flex: 1 }}>

      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              System & ERP
            </Typography>
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
          </Box>
          <Typography variant="body2" sx={{ color: "#8C7E76", fontWeight: 500, mt: 0.5 }}>
            Infrastructure connectivity statuses and CRM lead subscription flows
          </Typography>
        </Box>
      </Box>

      {/* Tab bar selection */}
      <Box sx={{ borderBottom: 1, borderColor: '#EAE5E0' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#8C7E76',
              textTransform: 'none',
              minWidth: 100,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          <Tab label="System Health" />
          <Tab label="CRM Leads" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <>
          {/* Live Data Pipeline Flowcharts */}
          <Typography id="section-system" sx={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary', mb: 0.5 }}>
            Live Data Pipeline
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Row 1 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 0.8 }}>
              <FlowNode icon={<SensorsIcon sx={{ fontSize: 15 }} />} name="Pendant (EV-07B)" stat="47 units · GPS via Flespi" latency="12ms" clickMsg="47 EV-07B pendants · 44 GPS active · Avg battery 71%" />
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>→</Typography>
              <FlowNode icon={<GpsFixedIcon sx={{ fontSize: 15 }} />} name="Flespi Platform" stat="GPS relay · geo-fence" latency="8ms" clickMsg="Flespi: ✓ Connected · 47 pendants · 47 msg/min · GPS acc: avg 8m" />
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>→</Typography>
              <FlowNode icon={<CloudIcon sx={{ fontSize: 15 }} />} name="AWS IoT Core" stat="Rules engine · Lambda" latency="5ms" clickMsg="AWS IoT Core · Lambda · DynamoDB · SNS — All healthy" />
            </Box>

            {/* Row 2 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 0.8 }}>
              <FlowNode icon={<MedicationIcon sx={{ fontSize: 15 }} />} name="Pill Dispenser" stat="38 units · MQTT direct" latency="18ms" clickMsg="38 dispensers · 38 online · Adherence 96%" />
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>→</Typography>
              <Box sx={{ width: '100%' }}>
                <FlowNode icon={<CloudIcon sx={{ fontSize: 15 }} />} name="AWS Central Bus" stat="Processing all device events" latency="5ms" clickMsg="AWS: Central event bus · processing all device events" />
              </Box>
            </Box>

            {/* Row 3 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 0.8 }}>
              <FlowNode icon={<WatchIcon sx={{ fontSize: 15 }} />} name="Health Band" stat="41 units · BLE → phone" latency="22ms" clickMsg="41 bands · 41 synced today · 2 low battery · 1 active HR alert" />
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>→</Typography>
              <Box sx={{ width: '100%' }}>
                <FlowNode icon={<CloudIcon sx={{ fontSize: 15 }} />} name="AWS Health Pipeline" stat="Health data pipeline" latency="5ms" clickMsg="AWS health data pipeline · aggregation active" />
              </Box>
            </Box>

            {/* Row 4 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: '100%' }}>
                <FlowNode icon={<CloudIcon sx={{ fontSize: 15 }} />} name="AWS Processing" stat="All pipelines healthy" clickMsg="AWS central processing — all pipelines healthy" />
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>↔</Typography>
              <Box id="section-erp" sx={{ width: '100%' }}>
                <FlowNode icon={<StorageIcon sx={{ fontSize: 15 }} />} name="ERP DB" stat="Subscriptions · billing" latency="3ms" clickMsg="ERP DB: ✓ Online · Last sync 3s ago · 47 active subscriptions" />
              </Box>
            </Box>

            {/* Row 5 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: '100%' }}>
                <FlowNode icon={<CloudIcon sx={{ fontSize: 15 }} />} name="AWS → CCC" stat="WebSocket · this panel" clickMsg="WebSocket to CCC — latency 2ms" />
              </Box>
              <Typography sx={{ color: 'text.secondary', fontSize: '12px', transform: { xs: 'rotate(90deg)', md: 'none' }, my: { xs: 0.5, md: 0 } }}>→</Typography>
              <FlowNode icon={<PhoneAndroidIcon sx={{ fontSize: 15 }} />} name="Mobile App" stat="FCM push · 2 offline" latency="delayed" clickMsg="FCM push: ⚠️ 2 caregiver devices offline · iOS OK · Android 2 offline" type="fwarn" />
            </Box>
          </Box>

          {/* Cloud Services Toggles */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, mt: 1 }}>

            {/* AWS Services Card */}
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudIcon sx={{ fontSize: 17 }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>AWS Services</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>IoT Core · Lambda · SNS · DynamoDB</Typography>
                    </Box>
                  </Box>
                  <Chip label="All healthy" size="small" sx={{ bgcolor: 'rgba(74,140,111,0.12)', color: 'success.main', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>
                <ToggleRow label="IoT Core ingestion" sub="Accept device telemetry from all sources" toggleKey="awsIot" critical={true} />
                <ToggleRow label="SNS alert dispatch" sub="Push SMS/email on SOS/fall to caregivers" toggleKey="awsSns" critical={true} />
                <ToggleRow label="Lambda rules engine" sub="Auto-process events and route tickets" toggleKey="awsLambda" critical={true} />
                <ToggleRow label="ERP sync" sub="Bidirectional subscription/device data sync" toggleKey="awsErp" critical={false} />
              </CardContent>
            </Card>

            {/* Flespi GPS Card */}
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GpsFixedIcon sx={{ fontSize: 17 }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Flespi GPS Platform</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Pendant GPS relay · geo-fence engine</Typography>
                    </Box>
                  </Box>
                  <Chip label="Connected" size="small" sx={{ bgcolor: 'rgba(74,140,111,0.12)', color: 'success.main', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>
                <ToggleRow label="Live GPS relay to AWS" sub="Stream pendant location every 30s" toggleKey="flespiGps" critical={true} />
                <ToggleRow label="Geo-fence engine" sub="Flespi evaluates zone boundaries, pushes breach event" toggleKey="flespiGeo" critical={true} />
                <ToggleRow label="Historical track logging" sub="Store 30-day GPS history per pendant" toggleKey="flespiHist" critical={false} />
              </CardContent>
            </Card>

            {/* Mobile App Push Card */}
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneAndroidIcon sx={{ fontSize: 17 }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Mobile App</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>FCM push · caregiver & senior</Typography>
                    </Box>
                  </Box>
                  <Chip label="2 offline" size="small" sx={{ bgcolor: 'rgba(214,137,16,0.12)', color: '#D68910', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>
                <ToggleRow label="SOS push notifications" sub="Immediate push to caregiver app on SOS" toggleKey="mobileSos" critical={true} />
                <ToggleRow label="Missed dose push" sub="App notification on missed dispense" toggleKey="mobileMissed" critical={false} />
                <ToggleRow label="Health alerts push" sub="HR / SpO₂ abnormal → caregiver app" toggleKey="mobileHealth" critical={false} />
                <ToggleRow label="Weekly summary push" sub="Sunday health report to caregiver" toggleKey="mobileWeekly" critical={false} />
              </CardContent>
            </Card>
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Leads Header & Action Bar */}
          <Card sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
            <TextField
              placeholder="Enter Lead ID (e.g. CRM-LEAD-2026-00010) to load, or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFetchLeadByName(searchQuery);
                }
              }}
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
            <Button
              variant="outlined"
              onClick={() => handleFetchLeadByName(searchQuery)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "8px",
                borderColor: "#EC8D20",
                color: "#EC8D20",
                "&:hover": { borderColor: "#C77518", backgroundColor: "rgba(236,141,32,0.04)" }
              }}
            >
              Fetch Lead
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: "8px",
                backgroundColor: "#EC8D20",
                "&:hover": { backgroundColor: "#C77518" },
                boxShadow: "none",
                ml: "auto",
              }}
            >
              Register Lead
            </Button>
          </Card>

          {/* CRM Leads Table */}
          <TableContainer component={Paper} sx={{ border: "1px solid #EAE5E0", boxShadow: "none" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: "#FAF8F6" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>LEAD NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>FIRST NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>LAST NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>PHONE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }}>ROLE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#8C7E76", py: 1.5 }} align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leadsLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : leadsError ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: "error.main", fontWeight: 700 }}>
                      {leadsError}
                    </TableCell>
                  </TableRow>
                ) : leads.filter(l => {
                  const q = searchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    (l.name || "").toLowerCase().includes(q) ||
                    (l.first_name || "").toLowerCase().includes(q) ||
                    (l.last_name || "").toLowerCase().includes(q) ||
                    (l.email_id || "").toLowerCase().includes(q) ||
                    (l.phone || "").toLowerCase().includes(q)
                  );
                }).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#8C7E76" }}>
                      No CRM leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads
                    .filter(l => {
                      const q = searchQuery.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        (l.name || "").toLowerCase().includes(q) ||
                        (l.first_name || "").toLowerCase().includes(q) ||
                        (l.last_name || "").toLowerCase().includes(q) ||
                        (l.email_id || "").toLowerCase().includes(q) ||
                        (l.phone || "").toLowerCase().includes(q)
                      );
                    })
                    .map((l) => (
                      <TableRow key={l.name} sx={{ "&:hover": { backgroundColor: "#FCFAF8" } }}>
                        <TableCell sx={{ py: 1.75, fontWeight: 700, color: "text.primary" }}>{l.name}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>{l.first_name}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>{l.last_name}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>{l.email_id || "—"}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>{l.phone_ext ? `${l.phone_ext} ` : ""}{l.phone}</TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Chip
                            label={l.status || "Lead"}
                            size="small"
                            sx={{
                              bgcolor: l.status === "Lead" ? "rgba(236,141,32,0.12)" : "rgba(16,185,129,0.12)",
                              color: l.status === "Lead" ? "#EC8D20" : "#10B981",
                              fontWeight: 700,
                              fontSize: "11px",
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }}>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            {l.custom_is_caregiver === 1 && <Chip label="Caregiver" size="small" sx={{ fontSize: "10px" }} />}
                            {l.custom_is_senior === 1 && <Chip label="Senior" size="small" sx={{ fontSize: "10px" }} />}
                            {l.custom_is_caregiver !== 1 && l.custom_is_senior !== 1 && "—"}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1.75 }} align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => handleOpenDetails(l.name)} sx={{ color: "text.secondary" }}>
                                <VisibilityIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Lead">
                              <IconButton size="small" onClick={() => handleOpenEdit(l)} sx={{ color: "text.secondary" }}>
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Lead Details</DialogTitle>
        <DialogContent sx={{ pt: 1.5 }}>
          {selectedLead && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Lead Identifier</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedLead.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>First Name</Typography>
                <Typography variant="body2">{selectedLead.first_name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Middle Name</Typography>
                <Typography variant="body2">{selectedLead.middle_name || "—"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Last Name</Typography>
                <Typography variant="body2">{selectedLead.last_name}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Email Address</Typography>
                <Typography variant="body2">{selectedLead.email_id || "—"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Phone Number</Typography>
                <Typography variant="body2">{selectedLead.phone_ext ? `${selectedLead.phone_ext} ` : ""}{selectedLead.phone}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Status</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>{selectedLead.status}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", pb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>Role Types</Typography>
                <Box>
                  {selectedLead.custom_is_caregiver === 1 && <Chip label="Caregiver" size="small" sx={{ mr: 0.5 }} />}
                  {selectedLead.custom_is_senior === 1 && <Chip label="Senior" size="small" />}
                  {selectedLead.custom_is_caregiver !== 1 && selectedLead.custom_is_senior !== 1 && "—"}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenDetailsDialog(false)} sx={{ textTransform: "none", fontWeight: 700 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Lead Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New CRM Lead</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1.5 }}>
          <TextField
            label="Lead Identifier"
            value={leadForm.name}
            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
            fullWidth
            size="small"
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="First Name"
              value={leadForm.first_name}
              onChange={(e) => setLeadForm({ ...leadForm, first_name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Middle Name (Optional)"
              value={leadForm.middle_name}
              onChange={(e) => setLeadForm({ ...leadForm, middle_name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name"
              value={leadForm.last_name}
              onChange={(e) => setLeadForm({ ...leadForm, last_name: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
          <TextField
            label="Email Address"
            value={leadForm.email_id}
            onChange={(e) => setLeadForm({ ...leadForm, email_id: e.target.value })}
            fullWidth
            size="small"
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Ext"
              value={leadForm.phone_ext}
              onChange={(e) => setLeadForm({ ...leadForm, phone_ext: e.target.value })}
              sx={{ width: 80 }}
              size="small"
            />
            <TextField
              label="Phone Number"
              value={leadForm.phone}
              onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
          <FormControl size="small" fullWidth>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5 }}>
              Lead Status
            </Typography>
            <Select
              value={leadForm.status}
              onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
            >
              <MenuItem value="Lead">Lead</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Is Caregiver</Typography>
            <Switch
              checked={leadForm.custom_is_caregiver === 1}
              onChange={(e) => setLeadForm({ ...leadForm, custom_is_caregiver: e.target.checked ? 1 : 0 })}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Is Senior</Typography>
            <Switch
              checked={leadForm.custom_is_senior === 1}
              onChange={(e) => setLeadForm({ ...leadForm, custom_is_senior: e.target.checked ? 1 : 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenCreateDialog(false)} sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}>Cancel</Button>
          <Button
            onClick={handleCreateLead}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#EC8D20",
              "&:hover": { backgroundColor: "#C77518" },
              boxShadow: "none",
            }}
          >
            Create Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit CRM Lead details</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1.5 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="First Name"
              value={leadForm.first_name}
              onChange={(e) => setLeadForm({ ...leadForm, first_name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Middle Name (Optional)"
              value={leadForm.middle_name}
              onChange={(e) => setLeadForm({ ...leadForm, middle_name: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="Last Name"
              value={leadForm.last_name}
              onChange={(e) => setLeadForm({ ...leadForm, last_name: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
          <TextField
            label="Email Address"
            value={leadForm.email_id}
            onChange={(e) => setLeadForm({ ...leadForm, email_id: e.target.value })}
            fullWidth
            size="small"
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Ext"
              value={leadForm.phone_ext}
              onChange={(e) => setLeadForm({ ...leadForm, phone_ext: e.target.value })}
              sx={{ width: 80 }}
              size="small"
            />
            <TextField
              label="Phone Number"
              value={leadForm.phone}
              onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>
          <FormControl size="small" fullWidth>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mb: 0.5 }}>
              Lead Status
            </Typography>
            <Select
              value={leadForm.status}
              onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
            >
              <MenuItem value="Lead">Lead</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Is Caregiver</Typography>
            <Switch
              checked={leadForm.custom_is_caregiver === 1}
              onChange={(e) => setLeadForm({ ...leadForm, custom_is_caregiver: e.target.checked ? 1 : 0 })}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>Is Senior</Typography>
            <Switch
              checked={leadForm.custom_is_senior === 1}
              onChange={(e) => setLeadForm({ ...leadForm, custom_is_senior: e.target.checked ? 1 : 0 })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}>Cancel</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              backgroundColor: "#EC8D20",
              "&:hover": { backgroundColor: "#C77518" },
              boxShadow: "none",
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default SystemERP;
