import React, { useState, useEffect, useCallback, useContext } from 'react';
import { HealthsoftContext } from '../context/HealthsoftContext';
import {
  Dialog,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ─── Elapsed timer formatter ──────────────────────────────────────────────────
function fmtTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

// ─── Section label ────────────────────────────────────────────────────────────
const Label = ({ children }) => (
  <Typography
    sx={{
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.35)',
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

// ─── Log info row ─────────────────────────────────────────────────────────────
const InfoRow = ({
  label,
  value,
  valueColor,
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 0.85,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      '&:last-child': { borderBottom: 'none', pb: 0 },
    }}
  >
    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>
      {label}
    </Typography>
    <Typography
      sx={{
        color: valueColor ?? '#fff',
        fontSize: '0.8rem',
        fontWeight: 600,
        textAlign: 'right',
        maxWidth: '55%',
      }}
    >
      {value}
    </Typography>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const FallAlertModal = ({ open, onClose, patient, respondedBy }) => {
  const { addLog, toast } = useContext(HealthsoftContext);
  const [step, setStep] = useState('action');
  const [elapsed, setElapsed] = useState(0);

  // Normalize incoming data — anything missing shows as "—", never fake values
  const PATIENT = {
    name: patient?.name || '—',
    initials: patient?.name
      ? patient.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
      : '?',
    age: patient?.age ?? '—',
    gender: patient?.gender || '—',
    condition: patient?.condition || '',
    // Home-care seniors have an address/location, not a hospital room
    location: patient?.location || patient?.address || patient?.gps?.place || '—',
    device: patient?.device || '—',
    battery: typeof patient?.battery === 'number' ? `${patient.battery}%` : '—',
    alertTime: patient?.alertTime || '—',
  };
  const responder = respondedBy || '—';

  // Stable id for log entries — fall back to initials when no id is supplied
  const seniorId = patient?.id ?? PATIENT.initials;

  const isActivePhase = step === 'action' || step === 'calling';

  // Run the elapsed timer only while the alert is unresolved (active/calling).
  // Once confirmed or marked false-alarm, the timer freezes.
  useEffect(() => {
    if (!open || !isActivePhase) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open, isActivePhase]);

  // Reset the elapsed counter each time the modal is freshly opened
  useEffect(() => {
    if (open) setElapsed(0);
  }, [open]);

  const handleClose = useCallback(() => {
    setStep('action');
    setElapsed(0);
    onClose();
  }, [onClose]);

  const handleConfirmFall = useCallback(() => {
    setStep('confirmed');
    addLog?.(seniorId, '🚑 Fall <strong>confirmed</strong> — emergency response initiated');
    toast?.('🚑 Fall confirmed — emergency response initiated', 'error');
  }, [addLog, toast, seniorId]);

  const handleFalseAlarm = useCallback(() => {
    setStep('false-alarm');
    addLog?.(seniorId, '✓ Fall alert marked <strong>false alarm</strong> — senior verified safe');
    toast?.('✓ Fall alert marked false alarm — senior verified safe', 'success');
  }, [addLog, toast, seniorId]);

  const isDanger = isActivePhase;

  // Background color based on step
  const bg = isDanger ? '#1C0A0A' : '#0C1A0C';
  const borderColor = isDanger ? 'rgba(220,38,38,0.4)' : 'rgba(22,163,74,0.4)';

  return (
    <Dialog
      open={open}
      onClose={() => {}} // intentionally blocking
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: bg,
            border: `1px solid ${borderColor}`,
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
            maxWidth: 540,
            width: '100%',
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto',
            m: '20px auto',
            transition: 'background-color 0.4s, border-color 0.4s',
          },
        },
        backdrop: {
          sx: {
            bgcolor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
          },
        },
      }}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          HEADER BANNER
      ───────────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          bgcolor: isDanger ? 'rgba(220,38,38,0.12)' : 'rgba(22,163,74,0.12)',
          borderBottom: `1px solid ${borderColor}`,
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Status icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            bgcolor: isDanger ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)',
            border: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isDanger ? (
            <WarningAmberIcon sx={{ color: '#F87171', fontSize: 24 }} />
          ) : step === 'confirmed' ? (
            <LocalHospitalIcon sx={{ color: '#4ADE80', fontSize: 24 }} />
          ) : (
            <CheckCircleIcon sx={{ color: '#4ADE80', fontSize: 24 }} />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              color: isDanger ? '#F87171' : '#4ADE80',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              mb: 0.25,
            }}
          >
            {isDanger
              ? '● Fall Alert — Action Required'
              : step === 'confirmed'
              ? '● Incident Confirmed — Ambulance En Route'
              : '● Alert Resolved — Marked as False Alarm'}
          </Typography>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.15rem', lineHeight: 1.2 }}>
            {isDanger
              ? `Fall Detected — ${PATIENT.name}`
              : step === 'confirmed'
              ? 'Ambulance Dispatched'
              : 'Marked as False Alarm'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.73rem', mt: 0.3 }}>
            {isDanger
              ? `Impact reported by device ${PATIENT.device} · ${PATIENT.location}`
              : step === 'confirmed'
              ? 'Emergency services notified'
              : 'Alert closed · Event recorded for calibration review'}
          </Typography>
        </Box>
      </Box>

      {/* ─────────────────────────────────────────────────────────────────────
          PATIENT INFO CARD
      ───────────────────────────────────────────────────────────────────── */}
      <Box sx={{ px: 3, pt: 2.5, pb: 0 }}>
        <Label>Patient</Label>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: isDanger ? 'rgba(220,38,38,0.25)' : 'rgba(22,163,74,0.25)',
                border: `1px solid ${borderColor}`,
                color: isDanger ? '#FCA5A5' : '#86EFAC',
                fontWeight: 800,
                fontSize: '0.78rem',
                width: 42,
                height: 42,
              }}
            >
              {PATIENT.initials}
            </Avatar>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                {PATIENT.name}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', mt: 0.1 }}>
                {PATIENT.age} yrs · {PATIENT.gender}
              </Typography>
              {PATIENT.condition && (
                <Chip
                  label={PATIENT.condition}
                  size="small"
                  sx={{
                    mt: 0.5,
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    bgcolor: isDanger ? 'rgba(220,38,38,0.2)' : 'rgba(22,163,74,0.2)',
                    color: isDanger ? '#FCA5A5' : '#86EFAC',
                    border: isDanger
                      ? '1px solid rgba(220,38,38,0.3)'
                      : '1px solid rgba(22,163,74,0.3)',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right', maxWidth: '50%' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
              LOCATION
            </Typography>
            <Typography sx={{ color: '#FBBF24', fontWeight: 800, fontSize: '0.85rem', mt: 0.25 }}>
              {PATIENT.location}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', mt: 0.25 }}>
              {PATIENT.device}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─────────────────────────────────────────────────────────────────────
          ALERT METRICS ROW
      ───────────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1.25,
          px: 3,
          pt: 1.5,
        }}
      >
        {/* Triggered at */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            px: 1.5,
            py: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', fontWeight: 600 }}>
              TRIGGERED
            </Typography>
          </Box>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>
            {PATIENT.alertTime}
          </Typography>
        </Box>

        {/* Elapsed */}
        <Box
          sx={{
            bgcolor: isDanger ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.04)',
            border: isDanger ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            px: 1.5,
            py: 1.25,
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', fontWeight: 600, mb: 0.5 }}>
            ELAPSED
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Courier New", monospace',
              color: isDanger ? '#FC8181' : '#86EFAC',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '1.5px',
            }}
          >
            {fmtTime(elapsed)}
          </Typography>
        </Box>

        {/* Battery */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '8px',
            px: 1.5,
            py: 1.25,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <BatteryChargingFullIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', fontWeight: 600 }}>
              BATTERY
            </Typography>
          </Box>
          <Typography sx={{ color: '#34D399', fontWeight: 700, fontSize: '0.85rem' }}>
            {PATIENT.battery}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 3, mt: 2, borderColor: 'rgba(255,255,255,0.07)' }} />

      {/* ─────────────────────────────────────────────────────────────────────
          STEP: action
      ───────────────────────────────────────────────────────────────────── */}
      {step === 'action' && (
        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
          <Label>Response Required</Label>

          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
            Has the senior fallen?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', mb: 2.5, lineHeight: 1.6 }}>
            Confirming will dispatch an ambulance immediately and auto-create an ERP incident ticket.
            Mark as false alarm if the senior is safe.
          </Typography>

          {/* Primary actions */}
          <Box sx={{ display: 'flex', gap: 1.25, mb: 1.25 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirmFall}
              startIcon={<LocalHospitalIcon />}
              sx={{
                py: 1.4,
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'none',
                bgcolor: '#DC2626',
                '&:hover': { bgcolor: '#B91C1C' },
                boxShadow: 'none',
              }}
            >
              Yes — Confirm Fall
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleFalseAlarm}
              startIcon={<CheckCircleIcon />}
              sx={{
                py: 1.4,
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'none',
                bgcolor: '#16A34A',
                '&:hover': { bgcolor: '#15803D' },
                boxShadow: 'none',
              }}
            >
              No — False Alarm
            </Button>
          </Box>

          {/* Secondary action */}
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setStep('calling')}
            startIcon={<PhoneInTalkIcon />}
            sx={{
              py: 1.2,
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              color: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.15)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.3)',
                bgcolor: 'rgba(255,255,255,0.05)',
              },
            }}
          >
            Call senior's phone first
          </Button>
        </Box>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          STEP: calling
      ───────────────────────────────────────────────────────────────────── */}
      {step === 'calling' && (
        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
          <Button
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
            onClick={() => setStep('action')}
            sx={{
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'none',
              fontSize: '0.75rem',
              mb: 2,
              p: 0,
              '&:hover': { color: 'rgba(255,255,255,0.7)', bgcolor: 'transparent' },
            }}
          >
            Back to alert
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(79,70,229,0.12)',
              border: '1px solid rgba(79,70,229,0.25)',
              borderRadius: '10px',
              px: 2.5,
              py: 2,
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PhoneInTalkIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                Calling {PATIENT.name}...
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.73rem', mt: 0.25 }}>
                Calling senior's phone · {PATIENT.device} speaker active
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setStep('action')}
              sx={{
                py: 1.35,
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'none',
                bgcolor: '#D97706',
                '&:hover': { bgcolor: '#B45309' },
                boxShadow: 'none',
              }}
            >
              Call answered — proceed to respond
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setStep('action')}
              sx={{
                py: 1.2,
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                color: 'rgba(255,255,255,0.5)',
                borderColor: 'rgba(255,255,255,0.15)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              No answer — go back and respond
            </Button>
          </Box>
        </Box>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          STEP: confirmed fall
      ───────────────────────────────────────────────────────────────────── */}
      {step === 'confirmed' && (
        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
          <Label>Incident Record</Label>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              px: 2,
              pt: 1,
              pb: 0.5,
              mb: 2,
            }}
          >
            <InfoRow label="Patient"       value={`${PATIENT.name} · ${PATIENT.location}`} />
            <InfoRow label="Type"          value="Fall — Impact Confirmed" />
            <InfoRow label="Triggered"     value={`${PATIENT.alertTime} · ${PATIENT.device}`} />
            <InfoRow label="Confirmed by"  value={responder} />
            <InfoRow label="Status"        value="Open — Emergency Response" valueColor="#4ADE80" />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClose}
            sx={{
              py: 1.35,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              bgcolor: '#16A34A',
              '&:hover': { bgcolor: '#15803D' },
              boxShadow: 'none',
            }}
          >
            Close & Return to Dashboard
          </Button>
        </Box>
      )}

      {/* ─────────────────────────────────────────────────────────────────────
          STEP: false alarm
      ───────────────────────────────────────────────────────────────────── */}
      {step === 'false-alarm' && (
        <Box sx={{ px: 3, pt: 2, pb: 3 }}>
          <Label>Log Entry — Auto Created</Label>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              px: 2,
              pt: 1,
              pb: 0.5,
              mb: 2,
            }}
          >
            <InfoRow label="Patient"    value={`${PATIENT.name} · ${PATIENT.location}`} />
            <InfoRow label="Marked by"  value={responder} />
            <InfoRow label="Elapsed"    value={fmtTime(elapsed)} />
            <InfoRow label="Status"     value="False Alarm — Logged & Closed" valueColor="#FBBF24" />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClose}
            sx={{
              py: 1.35,
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'none',
              bgcolor: '#16A34A',
              '&:hover': { bgcolor: '#15803D' },
              boxShadow: 'none',
            }}
          >
            Close & Return to Dashboard
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default FallAlertModal;
