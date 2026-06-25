import { useContext } from 'react';
import { Box, Typography, Button, Avatar, Chip, Switch, Tab, Tabs, IconButton, Tooltip } from '@mui/material';
import { HealthsoftContext } from '../../context/HealthsoftContext';
import SensorsIcon from '@mui/icons-material/Sensors';
import MedicationIcon from '@mui/icons-material/Medication';
import WatchIcon from '@mui/icons-material/Watch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavigationIcon from '@mui/icons-material/Navigation';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import ChatIcon from '@mui/icons-material/Chat';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';

export const RightPanel = () => {
  const {
    activeRpTab,
    setActiveRpTab,
    selectedSeniorId,
    selectedTicketId,
    seniors,
    setSeniors,
    tickets,
    resolvedTickets,
    setResolvedTickets,
    closedTickets,
    setClosedTickets,
    calling,
    setCalling,
    callSeconds,
    setCallSeconds,
    dispatchedSeniors,
    setDispatchedSeniors,
    toast,
    showConfirm,
    addLog,
    selectTicket,
    setRightPanelOpen,
    thresholds
  } = useContext(HealthsoftContext);

  const s = seniors[selectedSeniorId];
  if (!s) return (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper', borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tooltip title="Collapse Panel" arrow>
          <IconButton size="small" onClick={() => setRightPanelOpen(false)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, p: 3 }}>
        <Typography sx={{ fontSize: '28px', lineHeight: 1 }}>👤</Typography>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>No senior selected</Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', textAlign: 'center', lineHeight: 1.5 }}>Click a ticket from the dashboard to load a senior profile here.</Typography>
      </Box>
    </Box>
  );

  const activeTicket = tickets.find(t => t.id === selectedTicketId);
  const isTicketResolved = activeTicket ? (resolvedTickets.has(activeTicket.id) || activeTicket.pri === 'rv') : false;

  // Escape dynamic values before interpolating into HTML bodies passed to showConfirm.
  const escapeHtml = (str) =>
    String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const handleTabChange = (event, newValue) => {
    setActiveRpTab(newValue);
  };

  const handleCallToggle = () => {
    if (calling) {
      // End call
      setCalling(false);
      const minutes = Math.floor(callSeconds / 60);
      const seconds = String(callSeconds % 60).padStart(2, '0');
      const durStr = `${minutes}:${seconds}`;
      addLog(selectedSeniorId, `📞 Call ended · duration ${durStr}`);
      toast(`Call ended · ${durStr}`, 'success');
      setCallSeconds(0);
    } else {
      // Start call
      setCalling(true);
      setCallSeconds(0);
      addLog(selectedSeniorId, `Outbound call to <strong>${s.name}</strong> — Priya K.`);
      toast(`Calling ${s.name}...`, 'info');
    }
  };

  const handleDispatchAmbulance = async () => {
    if (dispatchedSeniors.has(selectedSeniorId)) {
      toast('Ambulance already dispatched for this ticket', 'warning');
      return;
    }

    const caregiverName = escapeHtml(s.caregiver?.name || 'caregiver');
    const caregiverLocation = escapeHtml(s.caregiver?.location || s.address || 'location on file');

    const res = await showConfirm(
      '🚨 Dispatch Ambulance',
      `<div style="background:rgba(127,127,127,0.12); border-radius:8px; padding:10px 12px; margin:8px 0; font-size:11px">
        <strong>${escapeHtml(s.name)}</strong><br>${escapeHtml(s.address)}<br>Ticket: ${escapeHtml(selectedTicketId)}
       </div>
       Notifies emergency services and alerts <strong>${caregiverName}</strong> (${caregiverLocation}).<br><br>
       Add dispatch note:`,
      '🚨 Dispatch Now',
      'error',
      'textarea'
    );

    if (res.ok) {
      setDispatchedSeniors(prev => {
        const copy = new Set(prev);
        copy.add(selectedSeniorId);
        return copy;
      });
      addLog(selectedSeniorId, `🚨 <strong>Ambulance dispatched</strong> by Priya K.${res.note ? ' — ' + res.note : ''}`);
      toast('🚨 Ambulance dispatched · ETA 8 min · Caregiver notified', 'error');
    }
  };

  const handleAlertFamily = () => {
    addLog(selectedSeniorId, `💬 WhatsApp to <strong>${s.caregiver.name}</strong> (${s.caregiver.location})`);
    toast(`WhatsApp sent to ${s.caregiver.name} ✓`, 'success');
  };

  const handleAddNote = async () => {
    const res = await showConfirm(
      '📋 Add Agent Note',
      `Note for <strong>${escapeHtml(s.name)}</strong>:`,
      'Save Note',
      'success',
      'textarea_note'
    );

    if (res.ok && res.note.trim()) {
      addLog(selectedSeniorId, `📋 Agent note: ${res.note.trim()}`);
      toast('Note saved ✓', 'success');
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket || isTicketResolved) {
      toast('Ticket already resolved', 'info');
      return;
    }

    const res = await showConfirm(
      '✓ Mark Resolved',
      `Mark <strong>${escapeHtml(selectedTicketId)}</strong> as resolved?<br><br>Add resolution note:`,
      'Mark Resolved',
      'success',
      'textarea_resolve'
    );

    if (res.ok) {
      setResolvedTickets(prev => {
        const copy = new Set(prev);
        copy.add(selectedTicketId);
        return copy;
      });
      setCalling(false);
      setCallSeconds(0);
      addLog(selectedSeniorId, `✓ Ticket <strong>${selectedTicketId}</strong> resolved by Priya K.${res.note ? ' — ' + res.note : ''}`);
      toast(`Ticket resolved ✓`, 'success');
    }
  };

  const handleCloseTicket = async () => {
    const res = await showConfirm(
      'Close Ticket',
      `Archive <strong>${escapeHtml(selectedTicketId)}</strong>? Record is not deleted.`,
      'Close Ticket',
      'error'
    );

    if (res.ok) {
      // Build an explicitly-updated set so the next-ticket lookup excludes
      // the just-closed id (the prev `closedTickets` set is stale here).
      const nextClosed = new Set(closedTickets);
      nextClosed.add(selectedTicketId);
      setClosedTickets(nextClosed);

      addLog(selectedSeniorId, `Ticket <strong>${escapeHtml(selectedTicketId)}</strong> closed by Priya K.`);
      toast('Ticket closed and archived', 'info');

      // Select next ticket if available; otherwise leave current selection.
      const next = tickets.find(t => !nextClosed.has(t.id) && t.id !== selectedTicketId);
      if (next) {
        selectTicket(next.id, next.sid);
      }
    }
  };

  const handlePerToggle = (key, label, checked) => {
    setSeniors(prev => {
      const copy = { ...prev };
      copy[selectedSeniorId] = {
        ...copy[selectedSeniorId],
        toggles: {
          ...copy[selectedSeniorId].toggles,
          [key]: checked
        }
      };
      return copy;
    });

    addLog(selectedSeniorId, `Toggle "${label}" set <strong>${checked ? 'ON' : 'OFF'}</strong> by Priya K.`);
    toast(`${label}: ${checked ? 'enabled ✓' : 'disabled ⚠️'} for ${s.name}`, checked ? 'success' : 'warning');
  };

  const handlePauseSub = async () => {
    const res = await showConfirm(
      '⚠️ Pause Subscription',
      `Pause <strong>${escapeHtml(s.erp?.plan)}</strong> for <strong>${escapeHtml(s.name)}</strong>?<br>All monitoring stops immediately.`,
      'Pause Subscription',
      'error'
    );

    if (res.ok) {
      setSeniors(prev => {
        const copy = { ...prev };
        copy[selectedSeniorId] = {
          ...copy[selectedSeniorId],
          erp: { ...copy[selectedSeniorId].erp, status: 'Paused' }
        };
        return copy;
      });
      addLog(selectedSeniorId, '⚠️ Subscription <strong>paused</strong> by Priya K.');
      toast(`Subscription paused for ${s.name}`, 'warning');
    }
  };

  // Battery status helper
  const getBatteryColor = (bat) => {
    if (bat > 40) return '#4A8C6F'; // Sage Teal
    if (bat > 20) return '#EC8D20'; // Healthsoft Orange
    return '#E8654A'; // Warm Coral
  };

  // Formatted timer string
  const formatTime = (s) => {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  // --- RENDERING TABS ---

  const renderProfile = () => {
    const d = s.devices;
    const isDispatched = dispatchedSeniors.has(selectedSeniorId);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
        
        {/* Profile Header */}
        <Box sx={{ p: 1.8, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '13px', fontWeight: 700, color: 'primary.contrastText' }}>
              {s.initials}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>{s.name}</Typography>
                <Chip
                  label="MOCK"
                  size="small"
                  sx={{
                    bgcolor: '#000000',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '8px',
                    height: 14,
                    borderRadius: '3px',
                    px: 0.5,
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{s.age} yrs · {s.gender} · {s.hsId}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Address</Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>
                {s.address.split(',').slice(0, 2).join(',')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Medical</Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>{s.medical}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Subscribed</Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: 'text.primary', textAlign: 'right' }}>{s.subscribed}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Ticket</Typography>
              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: isTicketResolved ? 'success.main' : 'error.main', textAlign: 'right' }}>
                {selectedTicketId} · {isTicketResolved ? 'Resolved' : 'Active'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Location Section */}
        <Box sx={{ px: 1.8, pb: 1.8, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Last location
              </Typography>
              <Chip
                label="MOCK"
                size="small"
                sx={{
                  bgcolor: '#000000',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '8px',
                  height: 14,
                  borderRadius: '3px',
                  px: 0.5,
                  '& .MuiChip-label': { px: 0.5 }
                }}
              />
            </Box>
            <Chip label="Flespi" size="small" sx={{ height: 16, fontSize: '9px', fontWeight: 700, bgcolor: 'rgba(58,124,184,0.12)', color: 'info.main', borderRadius: '4px', '& .MuiChip-label': { px: 0.6 } }} />
          </Box>
          
          {/* Vector Map */}
          <Box 
            onClick={() => toast(`Opening ${s.gps.place} in Maps...`, 'info')}
            sx={{
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              height: 105,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Grid layout */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(14,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,23,42,0.05) 1px, transparent 1px)',
              backgroundSize: '18px 18px'
            }} />
            
            {/* SVG Overlay */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 280 105">
              <line x1="0" y1="52" x2="280" y2="52" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="140" y1="0" x2="140" y2="105" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              <line x1="0" y1="26" x2="280" y2="26" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="0" y1="78" x2="280" y2="78" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="70" y1="0" x2="70" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="210" y1="0" x2="210" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              
              {/* Radar Circle */}
              <circle cx={s.gps.cx} cy={s.gps.cy} r="22" fill="rgba(232, 101, 74, 0.1)" stroke="#E8654A" strokeWidth="1.5" strokeDasharray="3,2" />
              <circle cx={s.gps.cx} cy={s.gps.cy} r="4" fill="#E8654A" />
              <circle cx={s.gps.cx} cy={s.gps.cy} r="8" fill="rgba(232, 101, 74, 0.25)" />
              
              {/* Labels */}
              <text x={s.gps.cx + 10} y={s.gps.cy - 5} fill="#EC8D20" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
                {s.name.split(' ')[0]}
              </text>
              <text x={s.gps.cx + 10} y={s.gps.cy + 6} fill="#202B41" fontSize="7" fontFamily="Plus Jakarta Sans, sans-serif">
                {s.gps.place.split(',')[0]}
              </text>
            </svg>
          </Box>
          <Typography sx={{ fontSize: '9px', color: 'text.secondary', textAlign: 'center', mt: 0.4 }}>
            {s.gps.lat}, {s.gps.lng}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.8, mt: 0.8 }}>
            <Button
              onClick={() => {
                toast(`Refreshing GPS for ${s.name}...`, 'info');
                setTimeout(() => toast('GPS refreshed ✓ · accuracy 6m', 'success'), 1200);
              }}
              startIcon={<RefreshIcon sx={{ fontSize: 13 }} />}
              sx={{ flex: 1, fontSize: '10px', py: 0.6, bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '6px', '&:hover': { bgcolor: 'action.hover' } }}
            >
              Refresh
            </Button>
            <Button
              onClick={() => toast(`Opening ${s.gps.place} in Maps...`, 'info')}
              startIcon={<NavigationIcon sx={{ fontSize: 13 }} />}
              sx={{ flex: 1, fontSize: '10px', py: 0.6, bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '6px', '&:hover': { bgcolor: 'action.hover' } }}
            >
              Navigate
            </Button>
          </Box>
        </Box>

        {/* Devices details */}
        <Box sx={{ px: 1.8, pb: 1.8, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Devices
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>

          {/* Pendant Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SensorsIcon sx={{ fontSize: 18, color: 'info.main' }} />
              <Box>
                <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>Pendant (EV-07B)</Typography>
                <Typography sx={{ fontSize: '9px', color: 'text.secondary' }}>{d.pendant?.sn || '—'} · IMEI …{String(d.pendant?.imei || '').slice(-6) || '—'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: d.pendant?.online ? getBatteryColor(d.pendant?.battery) : 'divider' }} />
              <Box sx={{ width: 28, height: 4, bgcolor: 'divider', borderRadius: '3px', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', bgcolor: getBatteryColor(d.pendant?.battery), width: `${d.pendant?.battery ?? 0}%` }} />
              </Box>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 600 }}>{d.pendant?.battery ?? 0}%</Typography>
            </Box>
          </Box>

          {/* Dispenser Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', pb: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MedicationIcon sx={{ fontSize: 18, color: 'success.main' }} />
              <Box>
                <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>Pill Dispenser</Typography>
                <Typography sx={{ fontSize: '9px', color: 'text.secondary' }}>{d.dispenser?.sn || '—'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: d.dispenser?.online ? 'success.main' : 'error.main' }} />
              <Typography sx={{ fontSize: '10px', color: d.dispenser?.online ? 'success.main' : 'error.main', fontWeight: 600 }}>
                {d.dispenser?.online ? 'Online' : 'Offline'}
              </Typography>
            </Box>
          </Box>

          {/* Band Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WatchIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Box>
                <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>Health Band</Typography>
                <Typography sx={{ fontSize: '9px', color: 'text.secondary' }}>{d.band?.sn || '—'} · {d.band?.hr ?? '—'}bpm · SpO₂{d.band?.spo2 ?? '—'}%</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: d.band?.online ? getBatteryColor(d.band?.battery) : 'divider' }} />
              <Box sx={{ width: 28, height: 4, bgcolor: 'divider', borderRadius: '3px', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', bgcolor: getBatteryColor(d.band?.battery), width: `${d.band?.battery ?? 0}%` }} />
              </Box>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 600 }}>{d.band?.battery ?? 0}%</Typography>
            </Box>
          </Box>
        </Box>

        {/* Caregiver Details */}
        <Box sx={{ px: 1.8, pb: 1.8, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Caregiver
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          <Box sx={{ bgcolor: 'background.default', borderRadius: '8px', p: 1.2 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'text.primary' }}>{s.caregiver.name}</Typography>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary', mb: 1 }}>
              {s.caregiver.relation} · {s.caregiver.location}<br />{s.caregiver.phone}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.6 }}>
              <Button
                onClick={handleAlertFamily}
                sx={{ flex: 1, fontSize: '10px', py: 0.6, bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '6px', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
                startIcon={<ChatIcon sx={{ fontSize: 14 }} />}
              >
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  toast(`Calling ${s.caregiver.name} (${s.caregiver.phone})...`, 'info');
                  addLog(selectedSeniorId, `📞 Call to caregiver <strong>${s.caregiver.name}</strong> initiated`);
                }}
                sx={{ flex: 1, fontSize: '10px', py: 0.6, bgcolor: 'secondary.main', color: '#fff', borderRadius: '6px', fontWeight: 700, '&:hover': { bgcolor: 'secondary.dark' } }}
                startIcon={<PhoneIcon sx={{ fontSize: 14 }} />}
              >
                Call Now
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Action Panel */}
        <Box sx={{ px: 1.8, pb: 1.8, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px', mb: 0.5 }}>
            Actions
          </Typography>

          <Button
            onClick={handleDispatchAmbulance}
            startIcon={<LocalHospitalIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: isDispatched ? 'success.main' : 'error.main', color: '#fff', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: isDispatched ? 'success.dark' : 'error.dark' } }}
          >
            {isDispatched ? 'Dispatched ✓' : 'Dispatch Ambulance'}
          </Button>

          <Button
            onClick={handleCallToggle}
            startIcon={calling ? <PhoneDisabledIcon sx={{ fontSize: 15 }} /> : <PhoneIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: calling ? 'error.main' : 'primary.main', color: '#fff', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: calling ? 'error.dark' : 'primary.dark' } }}
          >
            {calling ? `End Call • ${formatTime(callSeconds)}` : 'Call Senior'}
          </Button>

          <Button
            onClick={handleAlertFamily}
            startIcon={<ChatIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: 'primary.main', color: '#fff', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Alert Family
          </Button>

          <Button
            onClick={handleAddNote}
            startIcon={<NoteAddIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: 'info.main', color: '#fff', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: 'info.dark' } }}
          >
            Add Note
          </Button>

          <Button
            onClick={handleResolveTicket}
            disabled={isTicketResolved}
            startIcon={<TaskAltIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: 'success.main', color: '#fff', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: 'success.dark' } }}
          >
            Mark Resolved
          </Button>

          <Button
            onClick={handleCloseTicket}
            startIcon={<CloseIcon sx={{ fontSize: 15 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 1, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', '&:hover': { bgcolor: 'action.hover' } }}
          >
            Close Ticket
          </Button>
        </Box>

      </Box>
    );
  };

  const renderControls = () => {
    const toggleOpt = (key, label, sub) => (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.9, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{label}</Typography>
          <Typography sx={{ fontSize: '10px', color: 'text.secondary', mt: 0.1 }}>{sub}</Typography>
        </Box>
        <Switch 
          checked={!!s.toggles[key]} 
          onChange={(e) => handlePerToggle(key, label, e.target.checked)}
          size="small"
          color="success"
        />
      </Box>
    );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, p: 1.8 }}>
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
            <SensorsIcon sx={{ fontSize: 13, color: 'info.main' }} />
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Pendant — {s.name.split(' ')[0]}
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          {toggleOpt('fall', 'Fall detection alerts', 'P1 ticket on fall.alarm.start')}
          {toggleOpt('sos', 'SOS button alerts', 'P1 ticket on sos.press')}
          {toggleOpt('geo', 'Geo-fence monitoring', 'Alert if outside home zone (Flespi)')}
        </Box>

        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
            <MedicationIcon sx={{ fontSize: 13, color: 'success.main' }} />
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Pill Dispenser — {s.name.split(' ')[0]}
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          {toggleOpt('missedDose', 'Missed dose alerts', 'Ticket if dose not dispensed in window')}
          {toggleOpt('doseConfirm', 'Dose confirmation to app', 'Push on each successful dispense')}
        </Box>

        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
            <WatchIcon sx={{ fontSize: 13, color: 'primary.main' }} />
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Health Band — {s.name.split(' ')[0]}
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          {toggleOpt('hr', 'Heart rate alerts', `Alert if HR exceeds ${thresholds?.hr ?? 130}bpm threshold`)}
          {toggleOpt('spo2', 'SpO₂ low alerts', `Alert if oxygen drops below ${thresholds?.spo2 ?? 90}%`)}
          {toggleOpt('inactivity', 'Inactivity alerts', `Alert if no movement for ${thresholds?.inactivity ?? 4}+ hrs (daytime)`)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px', mb: 0.5 }}>
            Quick Actions
          </Typography>
          <Button
            onClick={() => toast(`Geo-fence editor opened for ${s.name}`, 'info')}
            startIcon={<LocationOnIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.8, fontSize: '11px', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Edit Geo-fence Boundary
          </Button>
          <Button
            onClick={() => toast(`Medication schedule opened for ${s.name}`, 'info')}
            startIcon={<MedicationIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.8, fontSize: '11px', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Edit Medication Schedule
          </Button>
          <Button
            onClick={() => toast('Notification preferences opened', 'info')}
            startIcon={<SettingsIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.8, fontSize: '11px', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Notification Preferences
          </Button>
        </Box>
      </Box>
    );
  };

  const renderERP = () => {
    const isPaused = s.erp.status === 'Paused';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, p: 1.8 }}>
        
        {/* Subscription */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Subscription
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, borderBottom: '1px solid', borderColor: 'background.default' }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Plan</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.erp.plan}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, borderBottom: '1px solid', borderColor: 'background.default' }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Status</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: isPaused ? '#EC8D20' : '#4A8C6F' }}>{s.erp.status}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, borderBottom: '1px solid', borderColor: 'background.default' }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Billing</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.erp.billing}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, borderBottom: '1px solid', borderColor: 'background.default' }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Amount</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.erp.amount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, borderBottom: '1px solid', borderColor: 'background.default' }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Next billing</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.erp.nextBilling}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Invoices</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.erp.invoices} on file</Typography>
          </Box>

          <Button
            onClick={() => toast(`Invoice history for ${s.name} — ${s.erp.invoices} invoice(s)`, 'info')}
            startIcon={<DescriptionIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.6, fontSize: '11px', mt: 1, '&:hover': { bgcolor: 'action.hover' } }}
          >
            View Invoices
          </Button>
          <Button
            onClick={() => toast(`Billing portal opened for ${s.name}`, 'info')}
            startIcon={<CreditCardIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.6, fontSize: '11px', mt: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Update Billing
          </Button>
          <Button
            onClick={handlePauseSub}
            startIcon={<PauseCircleIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'rgba(232,101,74,0.12)', color: '#E8654A', border: '1px solid', borderColor: '#E8654A', py: 0.6, fontSize: '11px', mt: 0.5, '&:hover': { bgcolor: '#E8654A', color: '#fff' } }}
          >
            Pause Subscription
          </Button>
        </Box>

        {/* Device assignments */}
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Device Assignments
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          <Box sx={{ bgcolor: 'background.default', borderRadius: '7px', p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
              <SensorsIcon sx={{ fontSize: 13, color: 'info.main' }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>Pendant (EV-07B)</Typography>
            </Box>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>S/N: {s.devices.pendant.sn} · IMEI: {s.devices.pendant.imei}</Typography>
          </Box>
          <Box sx={{ bgcolor: 'background.default', borderRadius: '7px', p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
              <MedicationIcon sx={{ fontSize: 13, color: 'success.main' }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>Pill Dispenser</Typography>
            </Box>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>S/N: {s.devices.dispenser.sn} · {s.devices.dispenser.model}</Typography>
          </Box>
          <Box sx={{ bgcolor: 'background.default', borderRadius: '7px', p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
              <WatchIcon sx={{ fontSize: 13, color: 'primary.main' }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>Health Band</Typography>
            </Box>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>S/N: {s.devices.band.sn}</Typography>
          </Box>
          <Button
            onClick={() => toast('Contact ops team: ops@healthsoft.in to reassign device', 'info')}
            startIcon={<SwapHorizIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.6, fontSize: '11px', mt: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Reassign Device
          </Button>
        </Box>

        {/* Account Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Account
            </Typography>
            <Chip
              label="MOCK"
              size="small"
              sx={{
                bgcolor: '#000000',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '8px',
                height: 14,
                borderRadius: '3px',
                px: 0.5,
                '& .MuiChip-label': { px: 0.5 }
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Senior ID</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.hsId}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Since</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.subscribed}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Primary contact</Typography>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.primary' }}>{s.caregiver.name}</Typography>
          </Box>
          <Button
            onClick={() => toast(`Opening full ERP profile ${s.hsId}...`, 'info')}
            startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.6, fontSize: '11px', mt: 1, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Open Full ERP Profile
          </Button>
          <Button
            onClick={() => toast(`PDF report generating for ${s.name}...`, 'info')}
            startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            sx={{ width: '100%', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', py: 0.6, fontSize: '11px', mt: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Export PDF Report
          </Button>
        </Box>

      </Box>
    );
  };

  const renderLog = () => {
    return (
      <Box sx={{ p: 1.8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.8 }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 700, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Activity Log
          </Typography>
          <Button
            onClick={() => toast('Log exported as CSV ✓', 'success')}
            sx={{ fontSize: '9px', py: 0.2, px: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default', color: 'text.primary', minWidth: 'auto', fontWeight: 700, '&:hover': { bgcolor: 'action.hover' } }}
          >
            Export
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {s.log.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, pb: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
              <Typography sx={{ fontSize: '9px', color: 'text.secondary', fontVariantNumeric: 'tabular-nums', width: 28, flexShrink: 0, pt: '1px' }}>
                {item.time}
              </Typography>
              <Typography
                sx={{ fontSize: '10px', lineHeight: 1.4, color: 'text.primary', '& strong': { color: 'text.primary', fontWeight: 700 } }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{
      width: 280,
      bgcolor: 'background.paper',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* Close button for responsive drawers */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tooltip title="Collapse Panel" arrow>
          <IconButton size="small" onClick={() => setRightPanelOpen(false)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* RP Tab bar */}
      <Tabs 
        value={activeRpTab} 
        onChange={handleTabChange} 
        variant="fullWidth"
        sx={{
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 34,
          '& .MuiTab-root': {
            fontSize: '10px',
            fontWeight: 700,
            color: 'text.secondary',
            py: 0.8,
            minHeight: 34,
            textTransform: 'none'
          },
          '& .Mui-selected': {
            color: 'text.primary !important',
            bgcolor: 'background.paper'
          },
          '& .MuiTabs-indicator': {
            bgcolor: 'primary.main',
            height: 2
          }
        }}
      >
        <Tab value="profile" label="Profile" />
        <Tab value="controls" label="Controls" />
        <Tab value="erp" label="ERP" />
        <Tab value="log" label="Log" />
      </Tabs>

      {/* RP Tab Scroll Content */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {activeRpTab === 'profile' && renderProfile()}
        {activeRpTab === 'controls' && renderControls()}
        {activeRpTab === 'erp' && renderERP()}
        {activeRpTab === 'log' && renderLog()}
      </Box>

    </Box>
  );
};
