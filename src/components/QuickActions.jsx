import React from 'react';
import { Card, Typography, List, ListItem, ListItemButton, Box, Divider } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ElderlyIcon from '@mui/icons-material/Elderly';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WarningIcon from '@mui/icons-material/Warning';

export const QuickActions = ({ role, onNavigate }) => {
  const actions = [
    {
      id: 'users',
      tab: 'users',
      adminOnly: true,
      title: 'Manage Users',
      description: 'Create, edit or deactivate user accounts',
      icon: <ManageAccountsIcon />,
    },
    {
      id: 'seniors',
      tab: 'seniors',
      adminOnly: false,
      title: 'Senior Profiles',
      description: 'View and manage senior registrations',
      icon: <ElderlyIcon />,
    },
    {
      id: 'mappings',
      tab: 'guardians',
      adminOnly: true,
      title: 'Guardian Mappings',
      description: 'Approve or manage guardian-senior links',
      icon: <SupervisorAccountIcon />,
    },
    {
      id: 'registry',
      tab: 'devices',
      adminOnly: true,
      title: 'Device Registry',
      description: 'Register, monitor and assign wearables',
      icon: <AppRegistrationIcon />,
    },
    {
      id: 'assignments',
      tab: 'devices',
      adminOnly: true,
      title: 'Device Assignments',
      description: 'Assign or unassign devices to seniors',
      icon: <AssignmentIndIcon />,
    },
    {
      id: 'alarms',
      tab: 'alerts',
      adminOnly: false,
      title: 'Alarm Events',
      description: 'Review panic, fall and geofence alerts',
      icon: <WarningIcon />,
    },
  ].filter((action) => !action.adminOnly || role === 'ADMIN');

  return (
    <Card sx={{ height: '100%', p: 2.25 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontFamily: '"Sora", sans-serif',
          mb: 1.5,
        }}
      >
        Quick Actions
      </Typography>

      <List disablePadding>
        {actions.map((action, idx) => (
          <React.Fragment key={action.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => onNavigate(action.tab)}
                sx={{
                  px: 0.5,
                  py: 1.5,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    '& .chevron-icon': {
                      color: 'primary.main',
                      transform: 'translateX(2px)',
                    },
                    '& .action-icon': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                {/* Left Icon and Text Group */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.25 }}>
                  {/* Proper Icon */}
                  <Box
                    className="action-icon"
                    sx={{
                      color: 'text.primary',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {action.icon}
                  </Box>

                  {/* Title & Description */}
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        lineHeight: 1.25,
                        mb: 0.25,
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                      }}
                    >
                      {action.description}
                    </Typography>
                  </Box>
                </Box>

                {/* Right Arrow Chevron */}
                <ChevronRightIcon
                  className="chevron-icon"
                  sx={{
                    color: 'divider',
                    fontSize: 20,
                    transition: 'all 0.2s ease',
                  }}
                />
              </ListItemButton>
            </ListItem>
            {idx < actions.length - 1 && (
              <Divider sx={{ borderColor: 'action.hover' }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default QuickActions;
