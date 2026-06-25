import { useContext, useState } from 'react';
import { Box, Typography, Avatar, Tooltip, Menu, MenuItem, Divider } from '@mui/material';
import { HealthsoftContext } from '../../context/HealthsoftContext';

/* ─── System health nodes ─── */
const buildSysNodes = (pendantCount) => [
  { label: 'AWS',    status: 'ok',   msg: 'AWS IoT Core · Lambda · DynamoDB — All healthy · 5 ms' },
  { label: 'Flespi', status: 'ok',   msg: `Flespi GPS Platform · ${pendantCount} pendants tracked · 8 ms` },
  { label: 'ERP DB', status: 'ok',   msg: 'ERP Database · Subscriptions & billing sync OK · 3 ms' },
  { label: 'App',    status: 'warn', msg: 'FCM push — 2 caregiver devices offline · investigating' },
];

export const Topbar = () => {
  const { 
    profile,
    handleLogout,
    timeStr, 
    toast,
    seniors
  } = useContext(HealthsoftContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const seniorCount = Object.keys(seniors).length;
  const SYS_NODES = buildSysNodes(seniorCount);

  // Derive current shift from the live clock (timeStr is "HH:MM:SS").
  const getShift = () => {
    if (!timeStr || timeStr === '--:--:--') {
      return { label: 'Morning', range: '06:00–14:00' };
    }
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (Number.isNaN(hour)) {
      return { label: 'Morning', range: '06:00–14:00' };
    }
    if (hour >= 6 && hour < 14) return { label: 'Morning', range: '06:00–14:00' };
    if (hour >= 14 && hour < 22) return { label: 'Evening', range: '14:00–22:00' };
    return { label: 'Night', range: '22:00–06:00' };
  };
  const shift = getShift();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="header"
      sx={{
        height: 48,
        minHeight: 48,
        bgcolor: '#0E172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
        zIndex: 1100,
      }}
    >
      {/* ── Brand / Logo ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>

        <Box
          component="img"
          src="https://healthsoft.in/assets/healthsoft_logo_thick-DuCtC_SQ.png"
          alt="Healthsoft"
          sx={{
            width: 26,
            height: 26,
            borderRadius: '6px',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />

        <Box sx={{ lineHeight: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Typography
              sx={{
                fontFamily: '"Sora", sans-serif',
                color: '#fff',
                fontWeight: 800,
                fontSize: '14px',
                lineHeight: 1.15,
                letterSpacing: '-0.2px',
              }}
            >
              SeniorCare
            </Typography>
          </Box>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.32)',
              fontSize: '8px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 700,
              lineHeight: 1,
              mt: 0.25,
            }}
          >
            Care Command Centre
          </Typography>
        </Box>
      </Box>

      {/* ── System Health Status Nodes ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 0,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {SYS_NODES.map((node, i) => (
          <Box key={node.label} sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              title={node.msg}
              placement="bottom"
              arrow
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#1E293B',
                    fontSize: '11px',
                    fontWeight: 500,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: '6px',
                    maxWidth: 280,
                  },
                },
                arrow: { sx: { color: '#1E293B' } },
              }}
            >
              <Box
                onClick={() => toast(node.msg, node.status === 'ok' ? 'info' : 'warning')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  px: 1.4,
                  py: 0.5,
                  borderRadius: '6px',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: node.status === 'ok' ? '#22C55E' : '#D68910',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.35 },
                    },
                    animation:
                      node.status === 'warn'
                        ? 'pulse 1.2s ease-in-out infinite'
                        : 'pulse 2.5s ease-in-out infinite',
                  }}
                />
                <Typography
                  sx={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.62)',
                    userSelect: 'none',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {node.label}
                </Typography>
              </Box>
            </Tooltip>

            {i < SYS_NODES.length - 1 && (
              <Box
                sx={{
                  width: '1px',
                  height: 14,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  flexShrink: 0,
                }}
              />
            )}
          </Box>
        ))}

        <Box sx={{ width: '1px', height: 14, bgcolor: 'rgba(255,255,255,0.1)', mx: 0.4 }} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            px: 1.4,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#22C55E',
              flexShrink: 0,
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.35 },
              },
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <Typography
            id="live-ct"
            sx={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.62)',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {Object.keys(seniors).length} seniors live
          </Typography>
        </Box>
      </Box>

      {/* ── Right cluster: Shift + Time + Avatar ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexShrink: 0 }}>

        {/* Shift pill */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.5)',
            px: 1.1,
            py: 0.4,
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.07)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography sx={{ fontSize: '9px', fontWeight: 600, color: 'inherit', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {shift.label} · {shift.range}
          </Typography>
        </Box>

        {/* Live clock */}
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.62)',
            fontVariantNumeric: 'tabular-nums',
            minWidth: 44,
            textAlign: 'right',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
          }}
        >
          {timeStr}
        </Typography>

        {/* Vertical divider */}
        <Box sx={{ width: '1px', height: 18, bgcolor: 'rgba(255,255,255,0.1)' }} />

        {/* Agent avatar */}
        <Tooltip title={`${profile.name} · ${profile.role}`} placement="bottom" arrow>
          <Avatar
            onClick={handleAvatarClick}
            sx={{
              width: 28,
              height: 28,
              bgcolor: '#EC8D20',
              fontSize: '10px',
              fontWeight: 800,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: '"Sora", sans-serif',
              border: '1.5px solid rgba(255,255,255,0.15)',
              transition: 'opacity 0.15s',
              '&:hover': { opacity: 0.85 },
            }}
          >
            {profile.name ? profile.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() : 'PK'}
          </Avatar>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                borderRadius: '8px',
                mt: 1,
                border: '1px solid #D9D9D9',
                minWidth: 130
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => { handleMenuClose(); toast('Operator Profile active', 'info'); }} sx={{ fontSize: '11px', fontWeight: 700 }}>
            {profile.name}
          </MenuItem>
          <Divider sx={{ my: '4px !important' }} />
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); toast('Logged out successfully', 'success'); }} sx={{ fontSize: '11px', fontWeight: 700, color: 'error.main' }}>
            Log Out
          </MenuItem>
        </Menu>

        {/* Agent name */}
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.72)',
            display: { xs: 'none', sm: 'block' },
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {(() => {
            if (!profile.name) return 'Priya K.';
            const parts = profile.name.trim().split(/\s+/).filter(Boolean);
            const first = parts[0] || '';
            const lastInitial = parts[1] && parts[1][0] ? parts[1][0] + '.' : '';
            return lastInitial ? `${first} ${lastInitial}` : first;
          })()}
        </Typography>


      </Box>
    </Box>
  );
};
