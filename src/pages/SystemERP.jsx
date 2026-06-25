import { useContext, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Switch, Chip } from '@mui/material';
import { HealthsoftContext } from '../context/HealthsoftContext';
import { useParams } from 'react-router-dom';
import SensorsIcon from '@mui/icons-material/Sensors';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import CloudIcon from '@mui/icons-material/Cloud';
import MedicationIcon from '@mui/icons-material/Medication';
import WatchIcon from '@mui/icons-material/Watch';
import StorageIcon from '@mui/icons-material/Storage';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

export const SystemERP = () => {
  const { infraToggles, setInfraToggles, showConfirm, toast } = useContext(HealthsoftContext);
  const { systemView: selectedSystemView = 'system' } = useParams();

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
            Infrastructure connectivity statuses and cloud subsystem integration toggles
          </Typography>
        </Box>
      </Box>

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

    </Box>
  );
};
