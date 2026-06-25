import { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { ProfileService, AuthService } from '../api';
import { HealthsoftContext } from '../context/HealthsoftContext';
import { DataState } from '../components/DataState';

export const Profile = () => {
  const { profile, setProfile: onUpdateProfile, toast: notify } = useContext(HealthsoftContext);

  // Toggle editing state
  const [isEditing, setIsEditing] = useState(false);

  // Form input states (matched with mockup screenshots)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [nationality, setNationality] = useState('');
  const [occupation, setOccupation] = useState('');

  // Health Information states
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  // Address states
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Toast / Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Local account details states from API
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [authProvider, setAuthProvider] = useState('EMAIL');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [lastLogin, setLastLogin] = useState('—');
  const [memberSince, setMemberSince] = useState('—');
  const [lastUpdated, setLastUpdated] = useState('—');
  const [isMock, setIsMock] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const loadProfile = () => {
    setPageError(null);
    ProfileService.getProfile()
      .then((response) => {
        setPageLoading(false);
        // Backend may wrap the payload in { data: ... }
        const res = response?.data ?? response;
        if (res) {
          setIsMock(false);
          const fName = res.first_name || res.firstName || '';
          const lName = res.last_name || res.lastName || '';
          const name = res.name || `${fName} ${lName}`.trim() || profile.name;
          const phoneNum = res.phone_number || res.phoneNumber || '';
          const uName = res.username || res.userName || '';

          onUpdateProfile({
            name,
            email: res.email || res.primaryEmail || profile.email,
            phone: phoneNum ? String(phoneNum) : profile.phone,
            role: res.role || profile.role,
            avatarBg: profile.avatarBg || '#EC8D20',
          });
          if (fName) setFirstName(fName);
          if (lName) setLastName(lName);
          if (uName) setUsername(uName);
          if (phoneNum) setPhone(String(phoneNum));
          if (res.secondaryEmail) setSecondaryEmail(res.secondaryEmail);

          // Set Account Details from API response
          setUserId(res.user_id || res.id || res.userId || '');
          if (res.status) setStatus(res.status);

          const authProv = res.authProvider || res.auth_provider;
          if (authProv) setAuthProvider(authProv);

          const emailVer = res.emailVerified !== undefined ? res.emailVerified : res.email_verified;
          if (emailVer !== undefined) setEmailVerified(!!emailVer);

          const phoneVer = res.phoneVerified !== undefined ? res.phoneVerified : res.phone_verified;
          if (phoneVer !== undefined) setPhoneVerified(!!phoneVer);

          const formatDate = (ts) => {
            if (!ts) return '—';
            const d = new Date(ts);
            return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          };

          if (res.lastLoginAt) setLastLogin(formatDate(res.lastLoginAt));
          else if (res.last_login_at) setLastLogin(formatDate(res.last_login_at));

          if (res.createdAt) setMemberSince(formatDate(res.createdAt));
          else if (res.created_at) setMemberSince(formatDate(res.created_at));

          if (res.updatedAt) setLastUpdated(formatDate(res.updatedAt));
          else if (res.updated_at) setLastUpdated(formatDate(res.updated_at));

          const pInfo = res.personalInfo || res.personal_info || res || {};
          const heightVal = pInfo.height ?? res.height ?? '';
          const weightVal = pInfo.weight ?? res.weight ?? '';
          const bg = pInfo.bloodGroup || pInfo.blood_group || res.bloodGroup || res.blood_group || '';
          const alg = pInfo.allergies || res.allergies || '';
          const cond = pInfo.medicalConditions || pInfo.medical_conditions || res.medicalConditions || res.medical_conditions || '';
          const dobVal = res.dob || res.dateOfBirth || res.date_of_birth || pInfo.dob || pInfo.dateOfBirth || pInfo.date_of_birth;

          if (dobVal) {
            try {
              setDob(new Date(dobVal).toISOString().split('T')[0]);
            } catch {
              setDob('');
            }
          }
          setGender(pInfo.gender || res.gender || '');
          setMaritalStatus(pInfo.maritalStatus || pInfo.marital_status || res.maritalStatus || res.marital_status || '');
          setNationality(pInfo.nationality || res.nationality || '');
          setOccupation(pInfo.occupation || res.occupation || '');
          setHeight(heightVal ? String(heightVal) : '');
          setWeight(weightVal ? String(weightVal) : '');
          setBloodGroup(bg);
          setAllergies(alg);
          setMedicalConditions(cond);

          setAddressLine1(pInfo.addressLine1 || pInfo.address_line1 || res.addressLine1 || res.address_line1 || '');
          setAddressLine2(pInfo.addressLine2 || pInfo.address_line2 || res.addressLine2 || res.address_line2 || '');
          setCity(pInfo.city || res.city || '');
          setState(pInfo.state || res.state || '');
          setCountry(pInfo.country || res.country || '');
          setPostalCode(pInfo.postalCode || pInfo.postal_code || res.postalCode || res.postal_code || '');
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch profile from API, using default/mock:', err);
        setPageLoading(false);
        setIsMock(true);
        // Load default mock values if API is unavailable
        setFirstName(profile.name.split(' ')[0] || 'Priya');
        setLastName(profile.name.split(' ').slice(1).join(' ') || 'Krishnamurthy');
        setPhone(profile.phone || '+91 98400 12345');
        setUserId('usr_92c30b20a1bc');
      });
  };

  useEffect(() => {
    loadProfile();
  }, [profile.name, profile.email, profile.phone, profile.role]);

  // Save changes handler
  const handleSave = () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || profile.name;
    const dobMs = dob ? new Date(dob).getTime() : null;
    const updatePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: username.trim(),
      phoneNumber: phone.trim().replace(/\D/g, ''),
      secondaryEmail: secondaryEmail.trim(),
      profileImageUrl: '',
      dob: dobMs,
    };

    const personalInfoPayload = {
      dateOfBirth: dobMs,
      gender: gender,
      maritalStatus: maritalStatus,
      nationality: nationality,
      occupation: occupation,
      height: Number(height) || 0.0,
      weight: Number(weight) || 0.0,
      bloodGroup: bloodGroup,
      allergies: allergies,
      medicalConditions: medicalConditions,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
    };

    Promise.all([
      ProfileService.updateProfile(updatePayload),
      ProfileService.updatePersonalInfo(personalInfoPayload),
    ])
      .then(() => {
        onUpdateProfile({
          name: fullName,
          email: profile.email,
          phone: phone.trim() || profile.phone,
          role: profile.role,
          avatarBg: profile.avatarBg || '#EC8D20',
        });
        setIsEditing(false);
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error('Failed to update profile or personal info on API:', err);
        notify(`Failed to update profile: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  const handleCancel = () => {
    // Revert to current profile details
    setFirstName(profile.name.split(' ')[0] || '');
    setLastName(profile.name.split(' ').slice(1).join(' ') || '');
    setPhone(profile.phone);
    setIsEditing(false);
  };

  const handleVerifyEmail = () => {
    if (!userId) return;
    AuthService.verifyEmail(userId)
      .then(() => {
        setEmailVerified(true);
        notify('Email verified successfully!', 'success');
      })
      .catch((err) => {
        console.error('Failed to verify email:', err);
        notify(`Failed to verify email: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  const handleVerifyPhone = () => {
    ProfileService.verifyPhone()
      .then(() => {
        setPhoneVerified(true);
        notify('Phone verified successfully!', 'success');
      })
      .catch((err) => {
        console.error('Failed to verify phone:', err);
        notify(`Failed to verify phone: ${err?.message || 'Unknown error from server'}`, 'error');
      });
  };

  const initials = (() => {
    const f = (firstName || '').trim();
    const l = (lastName || '').trim();
    if (f && l) return (f[0] + l[0]).toUpperCase();
    return (f || profile.name || 'PK').trim().slice(0, 2).toUpperCase();
  })();

  // ── Small presentational helpers ─────────────────────────────────────────
  const SectionLabel = ({ children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ width: 3, height: 14, borderRadius: 2, bgcolor: 'primary.main' }} />
      <Typography sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: '0.6px', fontSize: '11px' }}>
        {children}
      </Typography>
    </Box>
  );

  const fieldSx = {
    '& .MuiInputBase-input': { fontSize: '13px' },
    '& .MuiInputLabel-root': { fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px' },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: isEditing ? 'background.paper' : 'rgba(0,0,0,0.015)',
    },
  };

  const DetailRow = ({ label, children }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, minHeight: 24 }}>
      <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
      {children}
    </Box>
  );

  const VerifiedChip = (
    <Chip
      icon={<CheckCircleIcon sx={{ fontSize: '13px !important', color: '#059669 !important' }} />}
      label="VERIFIED"
      size="small"
      sx={{ bgcolor: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '10px', height: 22, borderRadius: '6px', '& .MuiChip-label': { px: 0.75 } }}
    />
  );

  const verifyBtnSx = {
    borderColor: 'primary.main',
    color: 'primary.main',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '6px',
    py: 0.25,
    px: 1,
    minHeight: 24,
    textTransform: 'none',
    '&:hover': { bgcolor: 'rgba(236,141,32,0.08)', borderColor: '#C77518' },
  };

  return (
    <DataState loading={pageLoading} error={pageError} onRetry={loadProfile}>
    <Box sx={{ p: 1.8, display: 'flex', flexDirection: 'column', gap: 1.8, bgcolor: 'background.default' }}>
      {/* ── Banner Header ───────────────────────────────────────────────── */}
      <Card
        sx={{
          border: 'none',
          borderRadius: '14px',
          flexShrink: 0,
          color: '#FFFFFF',
          p: { xs: 2.5, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2.5,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #EC8D20 0%, #DE7E14 55%, #C77518 100%)',
          boxShadow: '0 8px 24px rgba(236,141,32,0.28)',
        }}
      >
        {/* decorative circles */}
        <Box sx={{ position: 'absolute', right: -40, top: -50, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.10)' }} />
        <Box sx={{ position: 'absolute', right: 70, bottom: -70, width: 130, height: 130, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255,255,255,0.18)',
              width: 72,
              height: 72,
              border: '3px solid rgba(255,255,255,0.45)',
              fontWeight: 800,
              fontSize: '24px',
              color: '#FFFFFF',
              fontFamily: '"Sora", sans-serif',
            }}
          >
            {initials}
          </Avatar>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', fontFamily: '"Sora", sans-serif', lineHeight: 1.1 }}>
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : profile.name}
              </Typography>
              {isMock && (
                <Chip
                  label="MOCK"
                  size="small"
                  sx={{ bgcolor: 'rgba(0,0,0,0.35)', color: '#fff', fontWeight: 700, fontSize: '8px', height: 16, borderRadius: '3px', px: 0.5, border: '1px solid rgba(255,255,255,0.25)', '& .MuiChip-label': { px: 0.5 } }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
              <Chip
                label={profile.role || 'OPERATOR'}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#FFFFFF', fontWeight: 800, fontSize: '10px', height: 20, borderRadius: '6px', letterSpacing: '0.5px', '& .MuiChip-label': { px: 1 } }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.18)', borderRadius: '6px', px: 0.9, height: 20 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ADE80' }} />
                <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>{status}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 1.25, opacity: 0.95 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <MailIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
                <Typography sx={{ fontSize: '13px', color: '#FFFFFF' }}>{profile.email || '—'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <PhoneIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
                <Typography sx={{ fontSize: '13px', color: '#FFFFFF' }}>{phone || profile.phone || '—'}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => notify('Password change link sent to email', 'info')}
          startIcon={<LockIcon sx={{ fontSize: 16, color: '#EC8D20' }} />}
          sx={{
            position: 'relative',
            zIndex: 1,
            bgcolor: '#FFFFFF',
            color: '#C77518',
            fontWeight: 700,
            fontSize: '13px',
            px: 2,
            py: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            '&:hover': { bgcolor: '#FFF7EC' },
          }}
        >
          Change Password
        </Button>
      </Card>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <Grid container spacing={1.8} sx={{ flexShrink: 0 }}>
        {/* Left Column: Profile Forms */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, bgcolor: 'background.paper', borderRadius: '12px' }}>
            {/* Header: Title + Updated + Edit button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Sora", sans-serif', fontSize: '16px' }}>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '11px' }}>
                  {lastUpdated && lastUpdated !== '—' ? `Updated ${lastUpdated}` : 'Updated recently'}
                </Typography>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                    onClick={() => setIsEditing(true)}
                    size="small"
                    sx={{ borderRadius: '8px', py: 0.5, px: 1.75, fontSize: '12px', borderColor: 'primary.main', color: 'primary.main', '&:hover': { borderColor: '#C77518', bgcolor: 'rgba(236,141,32,0.06)' } }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                    onClick={handleCancel}
                    size="small"
                    color="inherit"
                    sx={{ borderRadius: '8px', py: 0.5, px: 1.75, fontSize: '12px', color: 'text.secondary', borderColor: 'divider' }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>

            <Divider />

            {/* SECTION 1: BASIC DETAILS */}
            <Box>
              <SectionLabel>BASIC DETAILS</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="FIRST NAME" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="LAST NAME" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="USERNAME" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="PHONE NUMBER" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="SECONDARY EMAIL" value={secondaryEmail} onChange={(e) => setSecondaryEmail(e.target.value)} placeholder="Secondary email" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="DATE OF BIRTH" type="date" value={dob} onChange={(e) => setDob(e.target.value)} fullWidth size="small" disabled={!isEditing} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing} sx={fieldSx}>
                    <InputLabel id="gender-select-label">GENDER</InputLabel>
                    <Select labelId="gender-select-label" label="GENDER" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing} sx={fieldSx}>
                    <InputLabel id="marital-select-label">MARITAL STATUS</InputLabel>
                    <Select labelId="marital-select-label" label="MARITAL STATUS" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Married">Married</MenuItem>
                      <MenuItem value="Divorced">Divorced</MenuItem>
                      <MenuItem value="Widowed">Widowed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="NATIONALITY" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Indian" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="OCCUPATION" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Retired Teacher" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* SECTION 2: HEALTH INFORMATION */}
            <Box>
              <SectionLabel>HEALTH INFORMATION</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="HEIGHT (CM)" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 165" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="WEIGHT (KG)" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={!isEditing} sx={fieldSx}>
                    <InputLabel id="blood-select-label">BLOOD GROUP</InputLabel>
                    <Select labelId="blood-select-label" label="BLOOD GROUP" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                      <MenuItem value="">— Select —</MenuItem>
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="ALLERGIES" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Pollen" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="MEDICAL CONDITIONS" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} placeholder="e.g. Hypertension, Diabetes" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* SECTION 3: ADDRESS */}
            <Box>
              <SectionLabel>ADDRESS</SectionLabel>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField label="ADDRESS LINE 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="ADDRESS LINE 2" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Apt, suite, etc." fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="CITY" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="STATE" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="COUNTRY" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField label="POSTAL CODE" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" fullWidth size="small" disabled={!isEditing} sx={fieldSx} />
                </Grid>
              </Grid>
            </Box>

            {/* Bottom Form Actions Bar when editing is active */}
            {isEditing && (
              <>
                <Divider />
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={handleCancel} sx={{ borderRadius: '8px', color: 'text.secondary', borderColor: 'divider', fontSize: '13px' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon sx={{ color: '#FFFFFF', fontSize: 16 }} />}
                    onClick={handleSave}
                    sx={{ borderRadius: '8px', bgcolor: 'primary.main', color: '#FFFFFF', fontSize: '13px', px: 2.5, '&:hover': { bgcolor: '#C77518' } }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Grid>

        {/* Right Column: Account Details Side Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'background.paper', borderRadius: '12px', position: { md: 'sticky' }, top: { md: 8 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: '"Sora", sans-serif', fontSize: '16px' }}>
              Account Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {/* User ID */}
              <Box>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '11px', letterSpacing: '0.3px', display: 'block', mb: 0.5 }}>
                  USER ID
                </Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all', lineHeight: 1.4, bgcolor: 'rgba(0,0,0,0.025)', px: 1, py: 0.6, borderRadius: '6px' }}>
                  {userId || '—'}
                </Typography>
              </Box>
              <Divider />

              <DetailRow label="ROLE">
                <Chip label={profile.role || '—'} size="small" sx={{ bgcolor: 'rgba(236,141,32,0.14)', color: '#C77518', fontWeight: 700, fontSize: '10px', height: 22, borderRadius: '6px', '& .MuiChip-label': { px: 0.9 } }} />
              </DetailRow>
              <Divider />

              <DetailRow label="STATUS">
                <Chip
                  label={status}
                  size="small"
                  sx={{ bgcolor: status === 'ACTIVE' ? '#D1FAE5' : '#FEF2F2', color: status === 'ACTIVE' ? '#065F46' : '#B91C1C', fontWeight: 700, fontSize: '10px', height: 22, borderRadius: '6px', '& .MuiChip-label': { px: 0.9 } }}
                />
              </DetailRow>
              <Divider />

              <DetailRow label="AUTH PROVIDER">
                <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '12px' }}>{authProvider}</Typography>
              </DetailRow>
              <Divider />

              <DetailRow label="EMAIL VERIFIED">
                {emailVerified ? VerifiedChip : (
                  <Button variant="outlined" size="small" onClick={handleVerifyEmail} startIcon={<CheckCircleIcon sx={{ fontSize: 13 }} />} sx={verifyBtnSx}>
                    Verify
                  </Button>
                )}
              </DetailRow>
              <Divider />

              <DetailRow label="PHONE VERIFIED">
                {phoneVerified ? VerifiedChip : (
                  <Button variant="outlined" size="small" onClick={handleVerifyPhone} startIcon={<CheckCircleIcon sx={{ fontSize: 13 }} />} sx={verifyBtnSx}>
                    Verify
                  </Button>
                )}
              </DetailRow>
              <Divider />

              <DetailRow label="LAST LOGIN">
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>{lastLogin}</Typography>
              </DetailRow>
              <Divider />

              <DetailRow label="MEMBER SINCE">
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>{memberSince}</Typography>
              </DetailRow>
              <Divider />

              <DetailRow label="LAST UPDATED">
                <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '12px', textAlign: 'right' }}>{lastUpdated}</Typography>
              </DetailRow>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Saved Success Toast */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%', fontWeight: 700 }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
    </DataState>
  );
};

export default Profile;
