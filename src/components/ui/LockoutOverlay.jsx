import { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HealthsoftContext } from '../../context/HealthsoftContext';

export const LockoutOverlay = () => {
  const { lockoutTicket, lockoutSeconds, seniors, ackCritical } = useContext(HealthsoftContext);

  if (!lockoutTicket) return null;

  const senior = seniors[lockoutTicket.sid];
  const urgent = lockoutSeconds <= 15;
  const escalated = lockoutSeconds === 0;

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'critBlink 1s ease-in-out infinite',
      '@keyframes critBlink': {
        '0%, 100%': { bgcolor: '#6B0000' },
        '50%': { bgcolor: '#C0392B' }
      }
    }}>
      <Box sx={{
        bgcolor: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px',
        p: '40px 48px',
        textAlign: 'center',
        maxWidth: 500,
        width: 'calc(100% - 32px)',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        
        {/* Siren Icon */}
        <Typography sx={{
          fontSize: '58px',
          lineHeight: 1,
          animation: 'critBounce 0.55s ease-in-out infinite',
          '@keyframes critBounce': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.18)' }
          }
        }}>
          🚨
        </Typography>

        {/* Warning Title */}
        <Typography sx={{
          display: 'inline-block',
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          py: 0.5,
          px: 1.8,
          borderRadius: '20px',
          mt: 2,
          mb: 1.2
        }}>
          ⚡ CRITICAL ALERT — IMMEDIATE ACTION REQUIRED
        </Typography>

        {/* Alert details */}
        <Typography sx={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: '"Sora", sans-serif', mb: 0.8, lineHeight: 1.2 }}>
          {lockoutTicket.type.toUpperCase()}
        </Typography>
        
        <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: '"Sora", sans-serif', mb: 1, lineHeight: 1.1 }}>
          {senior?.name}
        </Typography>

        <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', mb: 0.2 }}>
          📍 {lockoutTicket.loc} · {lockoutTicket.time}
        </Typography>

        <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, mb: 2 }}>
          {lockoutTicket.id} · Agent: {lockoutTicket.agent}
        </Typography>

        {/* Escalation Timer */}
        <Typography sx={{
          fontSize: '13px',
          fontWeight: 700,
          color: escalated ? '#FF6B6B' : (urgent ? '#FFD700' : 'rgba(255,255,255,0.55)'),
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.3px',
          mb: 2.2,
          animation: urgent && !escalated ? 'urgentPulse 0.45s ease-in-out infinite' : 'none',
          '@keyframes urgentPulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.3 }
          }
        }}>
          {escalated
            ? '⚠️ ESCALATED TO SUPERVISOR — ACKNOWLEDGE IMMEDIATELY'
            : `Auto-escalating to supervisor in ${lockoutSeconds}s`}
        </Typography>

        {/* Acknowledge Button */}
        <Button
          onClick={ackCritical}
          sx={{
            py: 1.8,
            px: 3.5,
            bgcolor: '#fff',
            color: '#6B0000',
            border: 'none',
            borderRadius: '11px',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            width: '100%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            '&:hover': {
              bgcolor: '#FFE4E1',
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 28px rgba(0,0,0,0.5)'
            },
            '&:active': { transform: 'translateY(0)' }
          }}
        >
          ⚡ &nbsp;I AM RESPONDING NOW
        </Button>

        <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', mt: 1.8, lineHeight: 1.6 }}>
          Dashboard is locked until you acknowledge this alert.<br />Every second counts — a senior needs help right now.
        </Typography>

      </Box>
    </Box>
  );
};
