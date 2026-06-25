import React, { useState, useEffect } from 'react';
import { Grid, Card, Box, Typography, Link } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ElderlyIcon from '@mui/icons-material/Elderly';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AdminService, SeniorService, AlarmService } from '../api';

export const MetricsGrid = ({ role, onNavigate }) => {
  const [counts, setCounts] = useState({
    users: 0,
    seniors: 0,
    devices: 0,
    approvals: 0,
    alarms: 0,
  });

  useEffect(() => {
    const isClientAdmin = role === 'ADMIN';

    if (isClientAdmin) {
      AdminService.adminGetCounts()
        .then((res) => {
          if (res) {
            setCounts({
              users: res?.totalUsers ?? res?.users ?? 0,
              seniors: res?.totalSeniors ?? res?.seniors ?? 0,
              devices: res?.totalDevices ?? res?.devices ?? 0,
              approvals: res?.pendingMappings ?? res?.approvals ?? 0,
              alarms: res?.totalAlerts ?? res?.alarms ?? 0,
            });
          }
        })
        .catch((err) => {
          console.error('Failed to load counts from API:', err);
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
            users: guardiansArr.length + monitorsArr.length, // Total relationship contacts
            seniors: seniorsArr.length,
            devices: seniorsArr.reduce((acc, s) => acc + (Number(s?.devicesCount) || 0), 0),
            approvals: 0, // Pending approvals not applicable for family/caregivers
            alarms: alarmsArr.length,
          });
        })
        .catch((err) => {
          console.error('Failed to load user-level counts:', err);
        });
    }
  }, [role]);

  const isAdmin = role === 'ADMIN';

  const metrics = [
    {
      id: 'users',
      title: 'TOTAL USERS',
      value: counts.users,
      icon: <PeopleIcon />,
      linkText: 'View all users',
      tab: 'users',
    },
    {
      id: 'seniors',
      title: 'REGISTERED SENIORS',
      value: counts.seniors,
      icon: <ElderlyIcon />,
      linkText: 'View seniors',
      tab: 'seniors',
    },
    {
      id: 'devices',
      title: 'ACTIVE DEVICES',
      value: counts.devices,
      icon: <SmartphoneIcon />,
      linkText: 'Manage devices',
      tab: 'devices',
    },
    ...(isAdmin
      ? [
          {
            id: 'approvals',
            title: 'PENDING APPROVALS',
            value: counts.approvals,
            icon: <HourglassEmptyIcon />,
            linkText: 'Review approvals',
            tab: 'guardians',
          },
        ]
      : []),
    {
      id: 'alarms',
      title: 'ACTIVE ALARMS',
      value: counts.alarms,
      icon: <NotificationsActiveIcon />,
      linkText: 'Review alarms',
      tab: 'alerts',
      isAlert: counts.alarms > 0,
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {metrics.map((metric) => {
        const isRedAlert = metric.isAlert;
        const mainColor = isRedAlert ? '#E8654A' : '#EC8D20';
        const cardBg = isRedAlert ? '#FFF5F3' : '#FFFFFF';
        const borderColor = isRedAlert ? 'rgba(232, 101, 74, 0.4)' : '#D9D9D9';
        const valueColor = isRedAlert ? '#E8654A' : '#202B41';
        const iconBg = isRedAlert ? 'rgba(232, 101, 74, 0.15)' : '#F7F0E6';
        const iconColor = isRedAlert ? '#E8654A' : '#EC8D20';

        return (
          <Grid size={{ xs: 12, sm: 6, md: isAdmin ? 2.4 : 3 }} key={metric.id}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: cardBg,
                borderColor: borderColor,
                boxShadow: 'none',
                borderRadius: '10px',
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  borderColor: mainColor,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                },
              }}
            >
              {/* Header: Title and Icon */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isRedAlert ? '#E8654A' : 'text.secondary',
                    letterSpacing: '1px',
                  }}
                >
                  {metric.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: iconBg,
                    color: iconColor,
                    fontSize: '18px',
                  }}
                >
                  {metric.icon}
                </Box>
              </Box>

              {/* Metric Value */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: valueColor,
                  mb: 1.5,
                  fontSize: '1.85rem',
                  lineHeight: 1.1,
                  fontFamily: '"Sora", sans-serif',
                }}
              >
                {metric.value}
              </Typography>

              <Box sx={{ mt: 'auto' }}>
                <Link
                  component="button"
                  onClick={() => onNavigate(metric.tab)}
                  underline="none"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    color: isRedAlert ? '#E8654A' : '#EC8D20',
                    textAlign: 'left',
                    '&:hover': {
                      color: isRedAlert ? '#B8452D' : '#C77413',
                      '& .arrow-icon': {
                        transform: 'translateX(2px)',
                      },
                    },
                  }}
                >
                  {metric.linkText}
                  <ArrowForwardIcon
                    className="arrow-icon"
                    sx={{
                      fontSize: 12,
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </Link>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MetricsGrid;
