import { useContext } from 'react';
import { HealthsoftProvider, HealthsoftContext } from './context/HealthsoftContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { RightPanel } from './components/layout/RightPanel';
import { LiveDashboard } from './pages/LiveDashboard';
import { Devices } from './pages/Devices';
import { SystemERP } from './pages/SystemERP';
import { Seniors } from './pages/Seniors';
import { Guardians } from './pages/Guardians';
import { Monitors } from './pages/Monitors';
import { Alerts } from './pages/Alerts';
import { Users } from './pages/Users';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { ConfirmModal } from './components/ui/ConfirmModal';
import { LockoutOverlay } from './components/ui/LockoutOverlay';

import {
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

function AppContent() {
  const {
    isAuthenticated,
    profile,
    setIsAuthenticated,
    toasts,
    sidebarOpen,
    setSidebarOpen,
    rightPanelOpen,
    setRightPanelOpen
  } = useContext(HealthsoftContext);

  const location = useLocation();
  const navigate = useNavigate();

  let activeTab = '';
  let tabList = [];

  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/devices') || location.pathname.startsWith('/system')) {
    activeTab = location.pathname.startsWith('/devices')
      ? 'devices'
      : (location.pathname.startsWith('/system') ? 'system' : 'dashboard');
    tabList = [
      { id: 'dashboard', label: 'Live Dashboard', path: '/dashboard' },
      { id: 'devices', label: 'Devices', path: '/devices' },
      { id: 'system', label: 'System & ERP', path: '/system' }
    ];
  } else if (location.pathname.startsWith('/seniors')) {
    activeTab = 'seniors';
    tabList = [{ id: 'seniors', label: 'Senior Residents', path: '/seniors' }];
  } else if (location.pathname.startsWith('/alerts')) {
    activeTab = 'alerts';
    tabList = [{ id: 'alerts', label: 'Alert History Log', path: '/alerts' }];
  } else if (location.pathname.startsWith('/guardians')) {
    activeTab = 'guardians';
    tabList = [{ id: 'guardians', label: 'Caregivers & Guardians', path: '/guardians' }];
  } else if (location.pathname.startsWith('/monitors')) {
    activeTab = 'monitors';
    tabList = [{ id: 'monitors', label: 'Shift Support Staff', path: '/monitors' }];
  } else if (location.pathname.startsWith('/users')) {
    activeTab = 'users';
    tabList = [{ id: 'users', label: 'Staff User Registry', path: '/users' }];
  } else if (location.pathname.startsWith('/profile')) {
    activeTab = 'profile';
    tabList = [{ id: 'profile', label: 'Operator Profile', path: '/profile' }];
  }

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#EC8D20',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#0E172A',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#F7F0E6', // Warm Cream
        paper: '#FFFFFF',
      },
      text: {
        primary: '#202B41',  // Deep Slate
        secondary: '#64748B', // Muted Gray
      },
      error:   { main: '#E8654A' },
      success: { main: '#4A8C6F' },
      info:    { main: '#3A7CB8' },
      divider: '#D9D9D9',
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 13,
      h1: { fontFamily: '"Sora", sans-serif', fontWeight: 800 },
      h2: { fontFamily: '"Sora", sans-serif', fontWeight: 800 },
      h3: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Sora", sans-serif', fontWeight: 700 },
      h5: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Sora", sans-serif', fontWeight: 600 },
      subtitle1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
      subtitle2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 500 },
      body1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 400 },
      body2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 400 },
      button: {
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        textTransform: 'none',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, padding: '6px 14px' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #D9D9D9',
          },
        },
      },
    },
  });

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Full screen shell container */}
      <Box sx={{
        display: 'grid',
        gridTemplateRows: '48px 1fr',
        height: '100vh',
        overflow: 'hidden'
      }}>
        
        {/* Top Header Bar */}
        <Topbar />

        {/* Main Panel Frame (Sidebar + Centre + RightPanel) */}
        <Box sx={{
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
          position: 'relative',
          height: '100%'
        }}>

          {/* Navigation Sidebar */}
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            flexShrink: 0,
            height: '100%',
            overflow: 'hidden'
          }}>
            <Sidebar />
          </Box>

          {/* Centre tab-views container */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
            minHeight: 0,
            transition: 'padding-right 0.18s ease',
            pr: { lg: rightPanelOpen ? '280px' : 0 }
          }}>
            
            {/* Tab selection bar */}
            <Box sx={{
              bgcolor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              gap: 0.2,
              height: 38,
              flexShrink: 0
            }}>
              {tabList.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <Box
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    sx={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: active ? 'text.primary' : 'text.secondary',
                      px: 1.5,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      borderBottom: '2px solid transparent',
                      borderBottomColor: active ? '#EC8D20' : 'transparent',
                      transition: 'color 0.15s, border-color 0.15s',
                      userSelect: 'none',
                      '&:hover': { color: 'text.primary' }
                    }}
                  >
                    {tab.label}
                  </Box>
                );
              })}
            </Box>

            {/* Render selected centre tab view */}
            <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<LiveDashboard />} />
                <Route path="/devices/:deviceType?" element={<Devices />} />
                <Route path="/system/:systemView?" element={<SystemERP />} />
                <Route path="/seniors" element={<Seniors currentUserName={profile?.name} currentUserRole={profile?.role} />} />
                <Route path="/alerts" element={<Alerts role={profile?.role} />} />
                <Route path="/guardians" element={<Guardians />} />
                <Route path="/monitors" element={<Monitors />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Box>

          </Box>

          {/* Right Information Panel — absolute positioned, slides in/out with GPU translateX */}
          <Box sx={{
            display: { xs: 'none', lg: 'flex' },
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '280px',
            zIndex: 10,
            flexDirection: 'column',
            borderLeft: '1px solid #D9D9D9',
            bgcolor: 'background.paper',
            transform: rightPanelOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            overflow: 'hidden'
          }}>
            <RightPanel />
          </Box>

          {/* Right edge floating tab to re-open the panel */}
          {!rightPanelOpen && (
            <Tooltip title="Open Panel" placement="left" arrow>
              <Box
                onClick={() => setRightPanelOpen(true)}
                sx={{
                  display: { xs: 'none', lg: 'flex' },
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 11,
                  width: 16,
                  height: 64,
                  bgcolor: '#FFFFFF',
                  color: '#EC8D20',
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  border: '1px solid #D9D9D9',
                  borderRight: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
                  transition: 'width 0.15s ease',
                  '&:hover': { width: 22, bgcolor: '#FAF8F6' }
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 14 }} />
              </Box>
            </Tooltip>
          )}

        </Box>

        {/* Mobile Navigation Sidebar Drawer */}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 200, 
              bgcolor: '#0E172A',
              border: 'none',
              height: '100%'
            }
          }}
        >
          <Sidebar />
        </Drawer>

        {/* Mobile/Tablet Right Information Panel Drawer */}
        <Drawer
          anchor="right"
          open={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280, 
              bgcolor: 'background.paper',
              border: 'none',
              height: '100%'
            }
          }}
        >
          <RightPanel />
        </Drawer>

      </Box>

      {/* Fullscreen Locking Overlay — disabled, re-add <LockoutOverlay /> to restore */}

      {/* Confirmation prompts */}
      <ConfirmModal />

      {/* Custom Toast notifications list */}
      <Box id="toasts" sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 0.8,
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => {
          let leftBorderColor = '#64748B'; // info default
          if (toast.type === 'success') leftBorderColor = '#1A7A4A';
          if (toast.type === 'warning') leftBorderColor = '#D68910';
          if (toast.type === 'error') leftBorderColor = '#C0392B';

          return (
            <Box
              key={toast.id}
              sx={{
                bgcolor: 'secondary.main',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                py: 1.2,
                px: 1.8,
                borderRadius: '9px',
                maxWidth: 300,
                border: '1px solid',
                borderColor: leftBorderColor,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                transition: 'opacity 0.25s, transform 0.25s',
                pointerEvents: 'auto'
              }}
            >
              {toast.message}
            </Box>
          );
        })}
      </Box>

    </ThemeProvider>
  );
}

function App() {
  return (
    <HealthsoftProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </HealthsoftProvider>
  );
}

export default App;
