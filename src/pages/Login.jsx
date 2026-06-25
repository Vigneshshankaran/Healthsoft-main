import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CloseIcon from '@mui/icons-material/Close';
import { AuthService } from '../api';



export const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // Email form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mobile OTP states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password states
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Cooldown timer handler for sending OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Email Signin Handler
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AuthService.signin({
        email: email.trim(),
        password,
        platform: 'web',
      });

      // Backend may wrap the tokens in { data: ... }
      const tokens = res?.data ?? res;
      if (tokens && tokens.access_token) {
        localStorage.setItem('authToken', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refreshToken', tokens.refresh_token);
        }
        onLoginSuccess();
      } else {
        setErrorMsg('Authentication succeeded but no token was returned.');
      }
    } catch (err) {
      console.error('Email signin error:', err);
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP Handler
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthService.signinMobile({
        phoneNumber: phoneNumber.trim(),
        otp: '',
      });
      setOtpSent(true);
      setResendCooldown(60);
    } catch (err) {
      console.error('Send OTP error:', err);
      setErrorMsg(err.message || 'Failed to send OTP. Please verify your phone number.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Handler
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !otp) {
      setErrorMsg('Please enter both phone number and OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await AuthService.signinMobileVerify({
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
      }, 'web');

      // Backend may wrap the tokens in { data: ... }
      const tokens = res?.data ?? res;
      if (tokens && tokens.access_token) {
        localStorage.setItem('authToken', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('refreshToken', tokens.refresh_token);
        }
        onLoginSuccess();
      } else {
        setErrorMsg('Verification succeeded but no token was returned.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password request handler
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await AuthService.forgotPassword({
        email: forgotEmail.trim(),
        platform: 'web',
      });
      setSuccessMsg('Instructions to reset your password have been sent to your email.');
      setOpenForgotDialog(false);
      setForgotEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMsg(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Google Signin


  return (
    <Box
      id="login-page-root"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: '#FAF8F6', // Theme background color
      }}
    >
      {/* Visual Left Panel (Hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '1.2 1 0%',
          bgcolor: '#0F172A', // Slate-900 / Dark Navy matching sidebar
          color: '#FFFFFF',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Ambient Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,85,41,0.1) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 2 }}>
          <Box
            component="img"
            src="https://healthsoft.in/assets/healthsoft_logo_thick-DuCtC_SQ.png"
            alt="Healthsoft"
            sx={{
              width: 32,
              height: 32,
              objectFit: 'contain',
              borderRadius: '6px'
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            SeniorCare
          </Typography>
        </Box>

        {/* Dynamic Marketing Graphic */}
        <Box sx={{ my: 'auto', maxW: '520px', zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 3,
              letterSpacing: '-1.5px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Care, monitored with safety.
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4, lineHeight: 1.6 }}>
            Real-time fall detection, health vitals monitoring, and senior resident tracking. Empowering caregivers with immediate alert responses.
          </Typography>

          {/* Micro Card Dashboard Previews */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                p: 2.5,
                flex: '1 1 200px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#D45529', fontWeight: 700, letterSpacing: '0.5px' }}>
                FALL DETECTION
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                Real-time alerts
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                p: 2.5,
                flex: '1 1 200px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, letterSpacing: '0.5px' }}>
                HEALTH VITALS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                Device monitoring
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer info */}
        <Box sx={{ zIndex: 2 }}>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            &copy; {new Date().getFullYear()} SeniorCare. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Login Controller Form */}
      <Box
        sx={{
          flex: '1 1 0%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Fade in timeout={800}>
          <Box sx={{ width: '100%', maxWidth: '440px' }}>
            {/* Header on Mobile view */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box
                component="img"
                src="https://healthsoft.in/assets/healthsoft_logo_thick-DuCtC_SQ.png"
                alt="Healthsoft"
                sx={{
                  width: 32,
                  height: 32,
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1A0E07' }}>
                SeniorCare
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1A0E07',
                mb: 1.5,
                letterSpacing: '-0.5px',
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E625B', mb: 4 }}>
              Sign in to manage residents, monitors, and alerts.
            </Typography>

            {/* Premium Selector Tabs (Email, Mobile OTP) */}
            <Tabs
              value={activeTab}
              onChange={(_, val) => {
                setActiveTab(val);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              variant="fullWidth"
              sx={{
                mb: 4,
                borderBottom: '1px solid #EAE5E0',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#D45529',
                },
              }}
            >
              <Tab
                label="Sign In"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: activeTab === 0 ? '#D45529' : '#8C7E76',
                  '&.Mui-selected': { color: '#D45529' },
                }}
              />
              <Tab
                label="Mobile OTP"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: activeTab === 1 ? '#D45529' : '#8C7E76',
                  '&.Mui-selected': { color: '#D45529' },
                }}
              />
            </Tabs>

            {/* Notifications */}
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                {errorMsg}
              </Alert>
            )}
            {successMsg && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                {successMsg}
              </Alert>
            )}

            {/* Tab 0: Email/Password Login Form */}
            {activeTab === 0 && (
              <form onSubmit={handleEmailSubmit} id="email-login-form">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    id="email-input"
                    label="Email address"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <TextField
                    id="password-input"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              id="toggle-password-visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                  />

                  <Button
                    id="email-signin-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      bgcolor: '#D45529',
                      color: '#FFFFFF',
                      '&:hover': {
                        bgcolor: '#B23F1C',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </Box>
              </form>
            )}

            {/* Tab 1: Mobile OTP Login Form */}
            {activeTab === 1 && (
              <Box>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} id="send-otp-form">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <TextField
                        id="phone-input"
                        label="Phone Number"
                        type="tel"
                        variant="outlined"
                        fullWidth
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 1234567890"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />

                      <Button
                        id="send-otp-button"
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          bgcolor: '#D45529',
                          color: '#FFFFFF',
                          '&:hover': {
                            bgcolor: '#B23F1C',
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} id="verify-otp-form">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Typography variant="body2" sx={{ color: '#6E625B', mb: 1 }}>
                        We sent a verification code to <strong>{phoneNumber}</strong>.
                      </Typography>

                      <TextField
                        id="otp-input"
                        label="6-Digit OTP"
                        type="text"
                        variant="outlined"
                        fullWidth
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }
                        }}
                      />

                      <Button
                        id="verify-otp-button"
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          bgcolor: '#D45529',
                          color: '#FFFFFF',
                          '&:hover': {
                            bgcolor: '#B23F1C',
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Login'}
                      </Button>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Button
                          id="resend-otp-button"
                          variant="text"
                          disabled={resendCooldown > 0 || loading}
                          onClick={handleSendOtp}
                          sx={{
                            color: '#D45529',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            p: 0,
                            textTransform: 'none',
                            '&:hover': { background: 'none', textDecoration: 'underline' },
                          }}
                        >
                          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </Button>
                        <Button
                          id="change-phone-button"
                          variant="text"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp('');
                            setErrorMsg(null);
                          }}
                          sx={{
                            color: '#8C7E76',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            p: 0,
                            textTransform: 'none',
                            '&:hover': { background: 'none', textDecoration: 'underline' },
                          }}
                        >
                          Change Phone Number
                        </Button>
                      </Box>
                    </Box>
                  </form>
                )}
              </Box>
            )}



            {/* Bottom auxiliary options */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 4,
              }}
            >
              <Typography
                variant="body2"
                onClick={() => setOpenForgotDialog(true)}
                sx={{
                  color: '#D45529',
                  fontWeight: 700,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Forgot Password Modal Dialog */}
      <Dialog
        open={openForgotDialog}
        onClose={() => setOpenForgotDialog(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1A0E07', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Reset Password
          <IconButton onClick={() => setOpenForgotDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleForgotSubmit}>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#6E625B', mb: 3 }}>
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>
            <TextField
              label="Email address"
              type="email"
              variant="outlined"
              fullWidth
              required
              autoFocus
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#8C7E76', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenForgotDialog(false)} sx={{ color: '#8C7E76', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ fontWeight: 700, bgcolor: '#D45529', color: '#FFFFFF', '&:hover': { bgcolor: '#B23F1C' } }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Send Instructions'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Login;
