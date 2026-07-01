import { useContext, useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Chip, useTheme, useMediaQuery, Tooltip, IconButton, Badge, Collapse } from '@mui/material';
import { HealthsoftContext } from '../../context/HealthsoftContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BadgeIcon from '@mui/icons-material/Badge';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DevicesIcon from '@mui/icons-material/Devices';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Sidebar = () => {
  const {
    tickets,
    closedTickets,
    resolvedTickets,
    sidebarOpen,
    setSidebarOpen,
    seniors,
    alarms
  } = useContext(HealthsoftContext);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isCollapsed = !sidebarOpen && isDesktop;

  const isDeviceMgmtActive =
    location.pathname.startsWith('/devices') ||
    location.pathname.startsWith('/device-types') ||
    location.pathname.startsWith('/locations');

  const [deviceMgmtOpen, setDeviceMgmtOpen] = useState(isDeviceMgmtActive);

  useEffect(() => {
    if (isDeviceMgmtActive) {
      setDeviceMgmtOpen(true);
    }
  }, [location.pathname, isDeviceMgmtActive]);

  // Count open alerts (priority not rv, and not in closed or resolved)
  const openCount = tickets.filter(t => !closedTickets.has(t.id) && t.pri !== 'rv' && !resolvedTickets.has(t.id)).length;
  const openAlarmsCount = alarms.filter(a => !a.resolved).length;

  const sections = [
    {
      title: 'Monitor',
      items: [
        {
          id: 'dashboard',
          text: 'Dashboard',
          icon: <DashboardIcon sx={{ fontSize: 16 }} />,
          badge: openCount,
          badgeType: 'error',
          action: () => navigate('/dashboard')
        },
        {
          id: 'seniors',
          text: 'Seniors',
          icon: <PeopleIcon sx={{ fontSize: 16 }} />,
          badge: Object.keys(seniors).length,
          badgeType: 'muted',
          action: () => navigate('/seniors')
        },
        {
          id: 'alerts',
          text: 'Alerts',
          icon: <NotificationsActiveIcon sx={{ fontSize: 16 }} />,
          badge: openAlarmsCount,
          badgeType: 'error',
          action: () => navigate('/alerts')
        }
      ]
    },
    {
      title: 'People',
      items: [
        {
          id: 'users',
          text: 'Users',
          icon: <ManageAccountsIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/users')
        },
        {
          id: 'guardians',
          text: 'Guardians',
          icon: <SupervisorAccountIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/guardians')
        },
        {
          id: 'monitors',
          text: 'Monitors',
          icon: <BadgeIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/monitors')
        }
      ]
    },
    {
      title: 'Infrastructure',
      items: [
        {
          id: 'device-mgmt',
          text: 'Device Management',
          icon: <DevicesIcon sx={{ fontSize: 16 }} />,
          isGroup: true,
          subItems: [
            { id: 'devices', text: 'Devices', action: () => navigate('/devices') },
            { id: 'pendants', text: 'Pendants', action: () => navigate('/device-types/PENDANT') },
            { id: 'wrist-bands', text: 'Wrist Bands', action: () => navigate('/device-types/WRIST_BAND') },
            { id: 'watches', text: 'Watches', action: () => navigate('/device-types/WATCH') },
            { id: 'dispensers', text: 'Dispensers', action: () => navigate('/device-types/PILL_DISPENSER') },
            { id: 'unknown-devices', text: 'Unknown Devices', action: () => navigate('/device-types/UNKNOWN') },
            { id: 'locations', text: 'Locations', action: () => navigate('/locations') }
          ]
        },
        {
          id: 'system',
          text: 'System Health',
          icon: <SettingsSuggestIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/system/system')
        },
        {
          id: 'erp',
          text: 'ERP / Billing',
          icon: <ReceiptLongIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/system/erp')
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'profile',
          text: 'Profile',
          icon: <AccountCircleIcon sx={{ fontSize: 16 }} />,
          action: () => navigate('/profile')
        }
      ]
    }
  ];

  return (
    <Box sx={{
      width: isCollapsed ? 64 : 200,
      transition: 'width 0.2s ease',
      bgcolor: '#0E172A',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Collapse button inside sidebar */}
      <Box sx={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', px: isCollapsed ? 0 : 1.5, pt: 1.5 }}>
        <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} arrow>
          <IconButton
            size="small"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              color: 'rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#fff'
              }
            }}
          >
            {isCollapsed ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      {sections.map((sec) => (
        <Box key={sec.title} sx={{ mt: isCollapsed ? 1.5 : 2.5, mb: 1, width: '100%' }}>
          {!isCollapsed ? (
            <Typography sx={{
              px: 2,
              mb: 1,
              fontSize: '9px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              fontWeight: 700
            }}>
              {sec.title}
            </Typography>
          ) : (
            <Box sx={{ mx: 1.5, my: 1, borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          )}

          <List sx={{ p: 0, gap: 0.2, display: 'flex', flexDirection: 'column', width: '100%' }}>
            {sec.items.map((item) => {
              // Compute active highlighting based on active path, filters, and sub-selections
               const itemActive =
                (item.id === 'dashboard' && location.pathname.startsWith('/dashboard')) ||
                (item.id === 'seniors' && location.pathname.startsWith('/seniors')) ||
                (item.id === 'alerts' && location.pathname.startsWith('/alerts')) ||
                (item.id === 'guardians' && location.pathname.startsWith('/guardians')) ||
                (item.id === 'monitors' && location.pathname.startsWith('/monitors')) ||
                (item.id === 'users' && location.pathname.startsWith('/users')) ||
                (item.id === 'devices' && location.pathname.startsWith('/devices')) ||
                (item.id === 'locations' && location.pathname.startsWith('/locations')) ||
                (item.id === 'device-types' && location.pathname.startsWith('/device-types')) ||
                (item.id === 'system' && (location.pathname === '/system' || location.pathname === '/system/system')) ||
                (item.id === 'erp' && location.pathname === '/system/erp') ||
                (item.id === 'profile' && location.pathname.startsWith('/profile'));

              if (item.isGroup) {
                const handleGroupClick = () => {
                  if (isCollapsed) {
                    setSidebarOpen(true);
                    setDeviceMgmtOpen(true);
                  } else {
                    setDeviceMgmtOpen(!deviceMgmtOpen);
                  }
                };

                const groupButtonContent = (
                  <ListItemButton
                    onClick={handleGroupClick}
                    sx={{
                      py: 0.8,
                      px: isCollapsed ? 0 : 2,
                      width: '100%',
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      color: isDeviceMgmtActive ? '#fff' : 'rgba(255,255,255,0.55)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                        color: '#fff'
                      }
                    }}
                  >
                    <ListItemIcon sx={{
                      minWidth: isCollapsed ? 0 : 26,
                      color: 'inherit',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    )}
                    {!isCollapsed && (deviceMgmtOpen ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />)}
                  </ListItemButton>
                );

                return (
                  <Box key={item.text} sx={{ width: '100%' }}>
                    <ListItem disablePadding sx={{ width: '100%' }}>
                      {isCollapsed ? (
                        <Tooltip title={item.text} placement="right" arrow>
                          {groupButtonContent}
                        </Tooltip>
                      ) : (
                        groupButtonContent
                      )}
                    </ListItem>
                    <Collapse in={deviceMgmtOpen && !isCollapsed} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                      <List component="div" disablePadding sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                        {item.subItems.map((sub) => {
                          const subActive =
                            (sub.id === 'devices' && location.pathname.startsWith('/devices')) ||
                            (sub.id === 'pendants' && location.pathname === '/device-types/PENDANT') ||
                            (sub.id === 'wrist-bands' && location.pathname === '/device-types/WRIST_BAND') ||
                            (sub.id === 'watches' && location.pathname === '/device-types/WATCH') ||
                            (sub.id === 'dispensers' && location.pathname === '/device-types/PILL_DISPENSER') ||
                            (sub.id === 'unknown-devices' && location.pathname === '/device-types/UNKNOWN') ||
                            (sub.id === 'locations' && location.pathname.startsWith('/locations'));

                          return (
                            <ListItemButton
                              key={sub.text}
                              onClick={() => {
                                sub.action();
                                if (!isDesktop) {
                                  setSidebarOpen(false);
                                }
                              }}
                              sx={{
                                py: 0.6,
                                pl: 4,
                                pr: 2,
                                width: '100%',
                                bgcolor: subActive ? 'rgba(236,141,32,0.12)' : 'transparent',
                                color: subActive ? '#fff' : 'rgba(255,255,255,0.45)',
                                '&:hover': {
                                  bgcolor: subActive ? 'rgba(236,141,32,0.18)' : 'rgba(255,255,255,0.03)',
                                  color: '#fff'
                                }
                              }}
                            >
                              <ListItemText
                                primary={
                                  <Typography sx={{ fontSize: '11px', fontWeight: subActive ? 700 : 500, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                    {sub.text}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  </Box>
                );
              }

              return (
                <ListItem key={item.text} disablePadding sx={{ width: '100%' }}>
                  {(() => {
                    const buttonContent = (
                      <ListItemButton
                        onClick={() => {
                          item.action();
                          if (!isDesktop) {
                            setSidebarOpen(false);
                          }
                        }}
                        sx={{
                          py: 0.8,
                          px: isCollapsed ? 0 : 2,
                          width: '100%',
                          justifyContent: isCollapsed ? 'center' : 'initial',
                          bgcolor: itemActive ? 'rgba(236,141,32,0.12)' : 'transparent',
                          color: itemActive ? '#fff' : 'rgba(255,255,255,0.55)',
                          '&:hover': {
                            bgcolor: itemActive ? 'rgba(236,141,32,0.18)' : 'rgba(255,255,255,0.05)',
                            color: '#fff'
                          }
                        }}
                      >
                        <ListItemIcon sx={{
                          minWidth: isCollapsed ? 0 : 26,
                          color: 'inherit',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          {isCollapsed && item.badge !== undefined && item.badge > 0 ? (
                            <Badge
                              badgeContent={item.badge}
                              color={item.badgeType === 'error' ? 'error' : 'default'}
                              sx={{
                                '& .MuiBadge-badge': {
                                  fontSize: '8px',
                                  height: 12,
                                  minWidth: 12,
                                  padding: '0 2px',
                                  fontWeight: 700
                                }
                              }}
                            >
                              {item.icon}
                            </Badge>
                          ) : (
                            item.icon
                          )}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={
                              <Typography sx={{ fontSize: '12px', fontWeight: 500, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {item.text}
                              </Typography>
                            }
                          />
                        )}
                        {!isCollapsed && item.badge !== undefined && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 16,
                              minWidth: 20,
                              fontSize: '9px',
                              fontWeight: 700,
                              borderRadius: '6px',
                              color: '#fff',
                              bgcolor: item.badgeType === 'error' ? '#C0392B' : 'rgba(255,255,255,0.12)',
                              '& .MuiChip-label': { px: 0.6 }
                            }}
                          />
                        )}
                      </ListItemButton>
                    );

                    return isCollapsed ? (
                      <Tooltip title={item.text} placement="right" arrow>
                        {buttonContent}
                      </Tooltip>
                    ) : (
                      buttonContent
                    );
                  })()}
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};
