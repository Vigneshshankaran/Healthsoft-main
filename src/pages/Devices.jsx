import { useContext, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Switch, TextField, Button, InputAdornment, Chip, Tabs, Tab } from '@mui/material';
import { HealthsoftContext } from '../context/HealthsoftContext';
import { useParams } from 'react-router-dom';
import SensorsIcon from '@mui/icons-material/Sensors';
import MedicationIcon from '@mui/icons-material/Medication';
import WatchIcon from '@mui/icons-material/Watch';
import TuneIcon from '@mui/icons-material/Tune';
import DevicesManagement from '../components/DevicesManagement';

export const Devices = () => {
  const { thresholds, setThresholds, toast } = useContext(HealthsoftContext);
  const { deviceType } = useParams();
  const [activeMainTab, setActiveMainTab] = useState(0);

  useEffect(() => {
    if (deviceType) {
      setActiveMainTab(0);
      const el = document.getElementById(`card-${deviceType}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [deviceType]);

  const handleToggle = (label, device, on) => {
    const safety = ['Fall detection alerts', 'SOS button alerts', 'GPS tracking (Flespi)', 'Heart rate alerts', 'SpO₂ low alerts'];
    if (!on && safety.includes(label)) {
      toast(`⚠️ WARNING: ${label} disabled for all ${device}s`, 'warning');
    } else {
      toast(`${label} ${on ? 'enabled ✓' : 'disabled'} for all ${device}s`, on ? 'success' : 'info');
    }
  };

  const handleBlurThreshold = (key, label) => {
    toast(`${label} threshold saved ✓`, 'success');
  };

  const handleSaveAll = () => {
    toast('All thresholds saved and applied ✓', 'success');
  };

  // Helper toggle row component
  const ToggleRow = ({ label, sub, device }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.9, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
      <Box>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{label}</Typography>
        <Typography sx={{ fontSize: '10px', color: 'text.secondary', mt: 0.1 }}>{sub}</Typography>
      </Box>
      <Switch
        defaultChecked={label !== 'WhatsApp alerts' && label !== 'WhatsApp missed dose alerts'}
        onChange={(e) => handleToggle(label, device, e.target.checked)}
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
              Devices
            </Typography>
            {activeMainTab === 0 && (
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
            Configure thresholds, registry, health, and assignments
          </Typography>
        </Box>
      </Box>

      {/* Main Subtabs Selection */}
      <Box sx={{ borderBottom: 1, borderColor: '#EAE5E0' }}>
        <Tabs
          value={activeMainTab}
          onChange={(_, val) => setActiveMainTab(val)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            },
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#8C7E76',
              textTransform: 'none',
              minWidth: 90,
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          <Tab label="Controls" />
          <Tab label="Registry" />
          <Tab label="Health" />
          <Tab label="Assignments" />
        </Tabs>
      </Box>

      {activeMainTab === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>

          {/* Pendants Control Card */}
          <Box id="card-pendants">
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SensorsIcon sx={{ fontSize: 22, color: 'info.main' }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Pendant (EV-07B Guard Rail)</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>47 units · GPS via Flespi · SIM-enabled · Fall detection</Typography>
                    </Box>
                  </Box>
                  <Chip label="47 online" size="small" sx={{ bgcolor: 'rgba(74,140,111,0.12)', color: 'success.main', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>

                {/* Metrics */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, mb: 1.8 }}>
                  {[{ label: 'Online', val: 47, col: 'success.main' }, { label: 'Low battery', val: 3, col: '#D68910' }, { label: 'Offline', val: 0, col: 'text.secondary' }].map(m => (
                    <Box key={m.label} sx={{ bgcolor: 'action.hover', borderRadius: '7px', py: 1, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '16px', fontWeight: 800, fontFamily: '"Sora", sans-serif', color: m.col }}>{m.val}</Typography>
                      <Typography sx={{ fontSize: '9px', color: 'text.secondary', mt: 0.2, fontWeight: 600 }}>{m.label}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Toggles */}
                <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary', mb: 1 }}>
                  Global controls — all pendants
                </Typography>
                <ToggleRow label="Fall detection alerts" sub="P1 ticket on fall.alarm.start from AWS IoT" device="pendant" />
                <ToggleRow label="SOS button alerts" sub="P1 ticket on sos.press event" device="pendant" />
                <ToggleRow label="Geo-fence monitoring" sub="Alert when pendant exits home zone (Flespi)" device="pendant" />
                <ToggleRow label="GPS tracking via Flespi" sub="Live position updates every 30 seconds" device="pendant" />
                <ToggleRow label="Low battery alerts" sub="Notify when battery drops below 20%" device="pendant" />
                <ToggleRow label="Offline alerts" sub="Alert if pendant loses AWS connection 15+ min" device="pendant" />

              </CardContent>
            </Card>
          </Box>

          {/* Pill Dispenser Control Card */}
          <Box id="card-dispensers">
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MedicationIcon sx={{ fontSize: 22, color: 'success.main' }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Pill Dispenser (The Keeper)</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>38 units · Wi-Fi · Direct AWS MQTT</Typography>
                    </Box>
                  </Box>
                  <Chip label="38 online" size="small" sx={{ bgcolor: 'rgba(74,140,111,0.12)', color: 'success.main', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>

                {/* Metrics */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, mb: 1.8 }}>
                  {[{ label: 'Online', val: 38, col: 'success.main' }, { label: 'Missed today', val: 2, col: 'primary.main' }, { label: 'Adherence', val: '96%', col: 'text.primary' }].map(m => (
                    <Box key={m.label} sx={{ bgcolor: 'action.hover', borderRadius: '7px', py: 1, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '16px', fontWeight: 800, fontFamily: '"Sora", sans-serif', color: m.col }}>{m.val}</Typography>
                      <Typography sx={{ fontSize: '9px', color: 'text.secondary', mt: 0.2, fontWeight: 600 }}>{m.label}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Toggles */}
                <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary', mb: 1 }}>
                  Global controls — all dispensers
                </Typography>
                <ToggleRow label="Missed dose alerts" sub="Ticket if dose not dispensed within window" device="dispenser" />
                <ToggleRow label="Dose confirmation push" sub="App notification on each successful dispense" device="dispenser" />
                <ToggleRow label="Auto-refill reminders" sub="Alert caregiver when pills < 7-day supply" device="dispenser" />
                <ToggleRow label="WhatsApp alerts" sub="WhatsApp message to caregiver on missed dose" device="dispenser" />

              </CardContent>
            </Card>
          </Box>

          {/* Health Bands Control Card */}
          <Box id="card-bands">
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WatchIcon sx={{ fontSize: 22, color: 'primary.main' }} />
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Health Band (Health Guard)</Typography>
                      <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>41 units · BLE → phone → AWS · ECG, SpO₂, HR</Typography>
                    </Box>
                  </Box>
                  <Chip label="2 low battery" size="small" sx={{ bgcolor: 'rgba(214,137,16,0.12)', color: '#D68910', fontWeight: 700, fontSize: '10px', height: 20 }} />
                </Box>

                {/* Metrics */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, mb: 1.8 }}>
                  {[{ label: 'Synced today', val: 41, col: 'success.main' }, { label: 'Low battery', val: 2, col: '#D68910' }, { label: 'HR alert', val: 1, col: 'info.main' }].map(m => (
                    <Box key={m.label} sx={{ bgcolor: 'action.hover', borderRadius: '7px', py: 1, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '16px', fontWeight: 800, fontFamily: '"Sora", sans-serif', color: m.col }}>{m.val}</Typography>
                      <Typography sx={{ fontSize: '9px', color: 'text.secondary', mt: 0.2, fontWeight: 600 }}>{m.label}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Toggles */}
                <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'text.primary', mb: 1 }}>
                  Global controls — all bands
                </Typography>
                <ToggleRow label="Heart rate alerts" sub="Alert if HR exceeds threshold or drops below 45" device="band" />
                <ToggleRow label="SpO₂ low alerts" sub="Alert if blood oxygen drops below 90%" device="band" />
                <ToggleRow label="ECG anomaly detection" sub="Flag irregular ECG readings from AWS pipeline" device="band" />
                <ToggleRow label="Inactivity alerts" sub="Alert if no movement for threshold hours (daytime)" device="band" />
                <ToggleRow label="Weekly health summary" sub="Email summary to caregiver every Sunday" device="band" />

              </CardContent>
            </Card>
          </Box>

          {/* Global Thresholds Card */}
          <Box>
            <Card sx={{ borderRadius: '10px', bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: '14px 18px !important' }}>

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TuneIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>Alert Thresholds</Typography>
                    <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Global defaults — overridable per senior in Controls tab</Typography>
                  </Box>
                </Box>

                {/* Threshold Fields */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  {[
                    { label: 'HR alert threshold', suffix: 'bpm', key: 'hr', val: thresholds.hr },
                    { label: 'SpO₂ alert threshold', suffix: '%', key: 'spo2', val: thresholds.spo2 },
                    { label: 'Low battery alert', suffix: '%', key: 'battery', val: thresholds.battery },
                    { label: 'Geo-fence radius', suffix: 'm', key: 'geofence', val: thresholds.geofence },
                    { label: 'Inactivity timeout', suffix: 'hrs', key: 'inactivity', val: thresholds.inactivity },
                    { label: 'Missed dose window', suffix: 'min', key: 'doseWindow', val: thresholds.doseWindow }
                  ].map(f => (
                    <Box key={f.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 500, color: 'text.primary' }}>{f.label}</Typography>
                      <TextField
                        size="small"
                        type="number"
                        value={f.val}
                        onChange={(e) => setThresholds(prev => ({ ...prev, [f.key]: parseInt(e.target.value) || 0 }))}
                        onBlur={() => handleBlurThreshold(f.key, f.label)}
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end" sx={{ '& .MuiTypography-root': { fontSize: '10px' } }}>{f.suffix}</InputAdornment>,
                          }
                        }}
                        sx={{
                          width: 85,
                          '& .MuiInputBase-input': {
                            fontSize: '11px',
                            fontWeight: 700,
                            textAlign: 'center',
                            p: '4px 6px',
                            color: 'text.primary'
                          },
                          '& .MuiInputBase-root': { bgcolor: 'action.hover', borderRadius: '6px' },
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' },
                          '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Button
                  onClick={handleSaveAll}
                  sx={{
                    width: '100%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    py: 1,
                    fontSize: '11px',
                    fontWeight: 700,
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Save All Thresholds
                </Button>

              </CardContent>
            </Card>
          </Box>

        </Box>
      ) : (
        <DevicesManagement activeSubTab={activeMainTab - 1} />
      )}
    </Box>
  );
};
