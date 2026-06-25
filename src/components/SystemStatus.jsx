import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, Chip, Divider } from '@mui/material';
import { ActuatorService, AdminService, SeniorService, AlarmService } from '../api';

export const SystemStatus = ({ role }) => {
  const [platformStatus, setPlatformStatus] = useState('Offline');
  const [counts, setCounts] = useState({
    seniors: 0,
    guardians: 0,
    monitors: 0,
    admins: 0,
    devices: 0,
    approvals: 0,
    alarms: 0,
  });

  useEffect(() => {
    // 1. Fetch Actuator Health
    ActuatorService.getHealth()
      .then((res) => {
        if (res && (res.status === 'UP' || res.status === 'Operational' || res.status?.status === 'UP')) {
          setPlatformStatus('Operational');
        } else {
          setPlatformStatus('Degraded');
        }
      })
      .catch(() => {
        setPlatformStatus('Offline');
      });

    // 2. Fetch counts
    const isClientAdmin = role === 'ADMIN';

    if (isClientAdmin) {
      AdminService.adminGetCounts()
        .then((res) => {
          if (res) {
            setCounts({
              seniors: res?.totalSeniors ?? res?.seniors ?? 0,
              guardians: res?.totalGuardians ?? res?.guardians ?? 0,
              monitors: res?.totalMonitors ?? res?.monitors ?? 0,
              admins: res?.totalAdmins ?? res?.admins ?? 0,
              devices: res?.totalDevices ?? res?.devices ?? 0,
              approvals: res?.pendingMappings ?? res?.approvals ?? 0,
              alarms: res?.totalAlerts ?? res?.alarms ?? 0,
            });
          }
        })
        .catch((err) => {
          console.error('Failed to load system status counts:', err);
        });
    } else {
      // Fetch user-level personal counts
      Promise.all([
        SeniorService.getMySeniors().catch(() => []),
        SeniorService.getMyGuardians().catch(() => []),
        SeniorService.getMyMonitors().catch(() => []),
        AlarmService.getAllAlarms().catch(() => []),
      ])
        .then(([seniorsRes, guardiansRes, monitorsRes, alarmsRes]) => {
          // Responses may be arrays, wrapped objects ({ data: [...] }), or null.
          const toArray = (x) => (Array.isArray(x) ? x : (x?.data ?? []));
          const seniorsArr = toArray(seniorsRes);
          const guardiansArr = toArray(guardiansRes);
          const monitorsArr = toArray(monitorsRes);
          const alarmsArr = toArray(alarmsRes);
          setCounts({
            seniors: seniorsArr.length,
            guardians: guardiansArr.length,
            monitors: monitorsArr.length,
            admins: 0,
            devices: seniorsArr.reduce((acc, s) => acc + (Number(s?.devicesCount) || 0), 0),
            approvals: 0,
            alarms: alarmsArr.length,
          });
        })
        .catch((err) => {
          console.error('Failed to load user system status counts:', err);
        });
    }
  }, [role]);

  const isOperational = platformStatus === 'Operational';
  const statusColor = isOperational ? '#4A8C6F' : '#E8654A';

  return (
    <Card sx={{ height: '100%', p: 2.25 }}>
      {/* Card Header with Live indicator */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            fontFamily: '"Sora", sans-serif',
          }}
        >
          System Status
        </Typography>

        {/* Connection indicator — reflects the real health check result */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: statusColor,
              animation: isOperational ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { transform: 'scale(0.95)', opacity: 0.8 },
                '50%': { transform: 'scale(1.3)', opacity: 1 },
                '100%': { transform: 'scale(0.95)', opacity: 0.8 },
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: statusColor,
              fontSize: '0.8rem',
            }}
          >
            {isOperational ? 'Live' : platformStatus}
          </Typography>
        </Box>
      </Box>

      {/* Status Table List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        {/* Row 1: Platform */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Platform
          </Typography>
          <Chip
            label={platformStatus}
            size="small"
            sx={{
              backgroundColor: isOperational ? 'rgba(74, 140, 111, 0.1)' : 'rgba(232, 101, 74, 0.1)',
              color: statusColor,
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
        <Divider sx={{ borderColor: 'action.hover' }} />

        {/* Row 2: User Coverage */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            User Coverage
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {counts.seniors} seniors - {counts.guardians} guardians - {counts.monitors} monitors
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'action.hover' }} />

        {/* Row 3: Device Fleet */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Device Fleet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {counts.devices} registered
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'action.hover' }} />

        {/* Row 4: Pending Approvals */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Pending Approvals
          </Typography>
          <Chip
            label={counts.approvals > 0 ? `${counts.approvals} pending` : 'None'}
            size="small"
            sx={{
              backgroundColor: counts.approvals > 0 ? 'rgba(236, 141, 32, 0.1)' : 'rgba(74, 140, 111, 0.1)',
              color: counts.approvals > 0 ? 'primary.main' : 'success.main',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
        <Divider sx={{ borderColor: 'action.hover' }} />

        {/* Row 5: Active Alarms */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Active Alarms
          </Typography>
          <Chip
            label={`${counts.alarms} events`}
            size="small"
            sx={{
              backgroundColor: counts.alarms > 0 ? 'rgba(232, 101, 74, 0.1)' : 'rgba(74, 140, 111, 0.1)',
              color: counts.alarms > 0 ? 'error.main' : 'success.main',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default SystemStatus;
