import { createContext, useState, useEffect, useRef } from 'react';
import { ProfileService, AuthService, SeniorService, AlarmService, AdminService, isMockActive } from '../api';

export const HealthsoftContext = createContext();

const INITIAL_SENIORS = {
  MR: {
    initials: 'MR',
    name: 'Meenakshi Rajan',
    age: 74,
    gender: 'Female',
    hsId: 'HS-CN-0142',
    address: '12, Luz Church Rd, Mylapore, Chennai 600004',
    medical: 'Hypertension, Type 2 DM',
    subscribed: 'March 2026',
    caregiver: { name: 'Suresh Rajan', relation: 'Son', location: 'Fremont, CA, USA', phone: '+1 (510) 555-0142' },
    devices: {
      pendant: { online: true, battery: 78, imei: '352625333142', sn: 'EV07-0142' },
      dispenser: { online: true, model: 'KP-20', sn: 'KP20-0142' },
      band: { online: true, battery: 22, hr: 88, spo2: 97, sn: 'HG-0142' }
    },
    erp: { plan: 'Complete Care', billing: 'Annual', nextBilling: '01 Mar 2027', amount: '₹29,999/yr', status: 'Active', invoices: 1 },
    gps: { lat: '13.0342°N', lng: '80.2685°E', place: 'Luz Church Rd, Mylapore', cx: 140, cy: 53 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, doseConfirm: true, hr: true, spo2: true, inactivity: true },
    log: [
      { time: '09:44', text: 'App push → <strong>Suresh Rajan</strong>\'s iPhone' },
      { time: '09:44', text: 'WhatsApp sent to <strong>Suresh Rajan</strong> (Fremont)' },
      { time: '09:43', text: 'Outbound call to <strong>Meenakshi Rajan</strong> — Priya K.' },
      { time: '09:43', text: '<strong>Priya K.</strong> acknowledged · response 58s' },
      { time: '09:42', text: 'Ticket <strong>TKT-2026-00847</strong> created · P1 SOS' },
      { time: '09:42', text: 'GPS from <strong>Flespi</strong> — 13.0342°N, 80.2685°E · 8m acc' },
      { time: '09:42', text: '<strong>fall.alarm.start</strong> · pendant IMEI 352625333142' }
    ]
  },
  RS: {
    initials: 'RS',
    name: 'Rajagopalan Subramaniam',
    age: 81,
    gender: 'Male',
    hsId: 'HS-CN-0089',
    address: '4B, Venkataraman St, T. Nagar, Chennai 600017',
    medical: 'Parkinson\'s (Stage 2), Arthritis',
    subscribed: 'January 2026',
    caregiver: { name: 'Ananya Subramaniam', relation: 'Daughter', location: 'Bangalore, KA', phone: '+91 98400 12345' },
    devices: {
      pendant: { online: true, battery: 55, imei: '352625330089', sn: 'EV07-0089' },
      dispenser: { online: true, model: 'KP-20', sn: 'KP20-0089' },
      band: { online: true, battery: 71, hr: 74, spo2: 98, sn: 'HG-0089' }
    },
    erp: { plan: 'Essential', billing: 'Monthly', nextBilling: '01 Jul 2026', amount: '₹2,499/mo', status: 'Active', invoices: 6 },
    gps: { lat: '13.0418°N', lng: '80.2338°E', place: 'Anna Salai, T. Nagar', cx: 90, cy: 65 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, doseConfirm: true, hr: true, spo2: true, inactivity: true },
    log: [
      { time: '09:36', text: '<strong>Karthik M.</strong> acknowledged · 2m 10s response' },
      { time: '09:35', text: 'Geo-fence breach · <strong>Flespi</strong> — 400m outside zone' },
      { time: '09:35', text: '<strong>geo.exit</strong> event · IMEI 352625330089' },
      { time: '09:00', text: 'Morning check-in · all devices nominal' }
    ]
  },
  KV: {
    initials: 'KV',
    name: 'Kamakshi Venkataraman',
    age: 69,
    gender: 'Female',
    hsId: 'HS-CN-0211',
    address: '7, 3rd Avenue, Adyar, Chennai 600020',
    medical: 'Atrial Fibrillation, Hypothyroidism',
    subscribed: 'April 2026',
    caregiver: { name: 'Ravi Venkataraman', relation: 'Husband', location: 'Adyar, Chennai', phone: '+91 98765 43210' },
    devices: {
      pendant: { online: true, battery: 91, imei: '352625330211', sn: 'EV07-0211' },
      dispenser: { online: false, model: 'KP-20', sn: 'KP20-0211' },
      band: { online: true, battery: 64, hr: 142, spo2: 95, sn: 'HG-0211' }
    },
    erp: { plan: 'Complete Care', billing: 'Annual', nextBilling: '01 Apr 2027', amount: '₹29,999/yr', status: 'Active', invoices: 2 },
    gps: { lat: '12.9975°N', lng: '80.2565°E', place: '3rd Avenue, Adyar', cx: 160, cy: 75 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, doseConfirm: false, hr: true, spo2: true, inactivity: false },
    log: [
      { time: '09:30', text: 'Band: <strong>142 bpm</strong> — threshold exceeded (130)' },
      { time: '09:30', text: 'Ticket <strong>TKT-2026-00848</strong> created · P2' },
      { time: '09:00', text: 'Morning check-in · pendant & band online · dispenser offline' }
    ]
  },
  DP: {
    initials: 'DP',
    name: 'Doraiswamy Pillai',
    age: 77,
    gender: 'Male',
    hsId: 'HS-CN-0067',
    address: '23, Lake View Road, Velachery, Chennai 600042',
    medical: 'Type 2 DM, Hypertension, CKD Stage 2',
    subscribed: 'December 2025',
    caregiver: { name: 'Malathi Pillai', relation: 'Wife', location: 'Velachery, Chennai', phone: '+91 98400 67890' },
    devices: {
      pendant: { online: true, battery: 43, imei: '352625330067', sn: 'EV07-0067' },
      dispenser: { online: true, model: 'KP-20', sn: 'KP20-0067' },
      band: { online: true, battery: 88, hr: 79, spo2: 96, sn: 'HG-0067' }
    },
    erp: { plan: 'Complete Care', billing: 'Annual', nextBilling: '01 Dec 2026', amount: '₹29,999/yr', status: 'Active', invoices: 7 },
    gps: { lat: '12.9788°N', lng: '80.2209°E', place: 'Velachery Main Rd', cx: 120, cy: 80 },
    toggles: { fall: true, sos: true, geo: false, missedDose: true, doseConfirm: true, hr: true, spo2: true, inactivity: true },
    log: [
      { time: '09:02', text: 'Missed dose: <strong>Metformin 500mg</strong> — 08:00 AM' },
      { time: '09:02', text: 'Ticket <strong>TKT-2026-00849</strong> created · P2' },
      { time: '08:00', text: 'Scheduled dispense: Metformin 500mg · Lisinopril 10mg' }
    ]
  },
  SK: {
    initials: 'SK',
    name: 'Savithri Krishnamurthy',
    age: 72,
    gender: 'Female',
    hsId: 'HS-CN-0155',
    address: '18, 4th Main Rd, Besant Nagar, Chennai 600090',
    medical: 'Osteoporosis, Mild cognitive impairment',
    subscribed: 'February 2026',
    caregiver: { name: 'Pradeep Krishnamurthy', relation: 'Son', location: 'Dubai, UAE', phone: '+971 50 123 4567' },
    devices: {
      pendant: { online: true, battery: 62, imei: '352625330155', sn: 'EV07-0155' },
      dispenser: { online: true, model: 'KP-20', sn: 'KP20-0155' },
      band: { online: true, battery: 77, hr: 71, spo2: 98, sn: 'HG-0155' }
    },
    erp: { plan: 'Complete Care', billing: 'Annual', nextBilling: '01 Feb 2027', amount: '₹29,999/yr', status: 'Active', invoices: 4 },
    gps: { lat: '13.0002°N', lng: '80.2707°E', place: '4th Main Rd, Besant Nagar', cx: 155, cy: 60 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, doseConfirm: true, hr: true, spo2: true, inactivity: true },
    log: [
      { time: '08:15', text: 'Ticket <strong>TKT-2026-00840</strong> resolved · Ranjini S.' },
      { time: '08:12', text: 'Confirmed false alarm — senior safe via phone' },
      { time: '08:11', text: 'SOS press detected · ticket created' }
    ]
  },
  AG: {
    initials: 'AG',
    name: 'Annamalai Govindarajan',
    age: 83,
    gender: 'Male',
    hsId: 'HS-CN-0034',
    address: '5, Karpagam Garden, Kodambakkam, Chennai 600024',
    medical: 'COPD, Type 2 DM, Age-related macular degeneration',
    subscribed: 'October 2025',
    caregiver: { name: 'Vijayalakshmi G.', relation: 'Daughter', location: 'Coimbatore, TN', phone: '+91 98400 34567' },
    devices: {
      pendant: { online: true, battery: 85, imei: '352625330034', sn: 'EV07-0034' },
      dispenser: { online: true, model: 'KP-20', sn: 'KP20-0034' },
      band: { online: true, battery: 55, hr: 68, spo2: 94, sn: 'HG-0034' }
    },
    erp: { plan: 'Essential', billing: 'Annual', nextBilling: '01 Oct 2026', amount: '₹19,999/yr', status: 'Active', invoices: 9 },
    gps: { lat: '13.0512°N', lng: '80.2175°E', place: 'Karpagam Garden, Kodambakkam', cx: 75, cy: 45 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, doseConfirm: true, hr: true, spo2: true, inactivity: true },
    log: [
      { time: '07:05', text: 'Ticket <strong>TKT-2026-00835</strong> resolved · returned home' },
      { time: '07:00', text: 'Geo-fence re-entry confirmed' },
      { time: '06:52', text: 'Geo-fence breach · Kodambakkam market area' }
    ]
  }
};

const INITIAL_TICKETS = [
  { id: 'TKT-2026-00847', sid: 'MR', pri: 'p1', type: 'SOS — Fall detected', badge: 'b-sos', loc: 'Luz Church Road, Mylapore · 600004', time: '2 mins ago', agent: 'Priya K.', extra: 'Pendant 78% · Flespi GPS' },
  { id: 'TKT-2026-00846', sid: 'RS', pri: 'p1', type: 'Geo-fence breach', badge: 'b-geo', loc: 'T. Nagar · 600017 · 400m outside', time: '8 mins ago', agent: 'Karthik M.', extra: 'Flespi GPS · Anna Salai' },
  { id: 'TKT-2026-00848', sid: 'KV', pri: 'p2', type: 'Abnormal heart rate', badge: 'b-hr', loc: 'Adyar · 600020 · 142 bpm', time: '14 mins ago', agent: 'Priya K.', extra: 'Health Band alert' },
  { id: 'TKT-2026-00849', sid: 'DP', pri: 'p2', type: 'Missed dose', badge: 'b-dose', loc: 'Velachery · 600042 · Metformin 500mg — 8:00 AM', time: '28 mins ago', agent: 'Karthik M.', extra: 'Pill Dispenser (P20)' },
  { id: 'TKT-2026-00840', sid: 'SK', pri: 'rv', type: 'Resolved — SOS false alarm', badge: 'b-ok', loc: 'Besant Nagar · 600090', time: '1h 12m ago', agent: 'Ranjini S.', extra: 'Resolved in 3m 40s' },
  { id: 'TKT-2026-00835', sid: 'AG', pri: 'rv', type: 'Resolved — Geo-fence', badge: 'b-ok', loc: 'Kodambakkam · 600024', time: '2h 05m ago', agent: 'Priya K.', extra: 'Resolved in 6m 10s' }
];

export const HealthsoftProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [profile, setProfile] = useState({
    name: 'Priya Krishnamurthy',
    email: 'priya.k@healthsoft.in',
    phone: '+91 98400 12345',
    role: 'ADMIN',
    avatarBg: '#EC8D20'
  });

  const [seniors, setSeniors] = useState(INITIAL_SENIORS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [isMockData, setIsMockData] = useState(isMockActive());
  const [alarms, setAlarms] = useState([
    { id: "1", type: "Fall", device: "Pendant (EV07-0142)", identifier: "35262533", serial: "EV07-0142", timestamp: "Jun 24, 2026, 09:42 AM", severity: "HIGH", resolved: false },
    { id: "2", type: "Geofence", device: "Pendant (EV07-0089)", identifier: "35262533", serial: "EV07-0089", timestamp: "Jun 24, 2026, 09:35 AM", severity: "HIGH", resolved: false },
    { id: "3", type: "Alarm", device: "Health Band (HG-0211)", identifier: "HG-0211", serial: "HG-0211", timestamp: "Jun 24, 2026, 09:30 AM", severity: "MEDIUM", resolved: false },
    { id: "4", type: "Alarm", device: "Pill Dispenser (KP-20)", identifier: "KP20-0067", serial: "KP20-0067", timestamp: "Jun 24, 2026, 08:00 AM", severity: "LOW", resolved: true }
  ]);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      AuthService.logout(refreshToken).catch((err) => {
        console.warn('Logout API failed:', err);
      });
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setProfile({ name: 'Priya Krishnamurthy', email: 'priya.k@healthsoft.in', phone: '+91 98400 12345', role: 'ADMIN', avatarBg: '#EC8D20' });
  };

  const fetchProfile = () => {
    ProfileService.getProfile()
      .then((res) => {
        const data = res?.data ?? res;
        if (data) {
          const firstName = data.first_name || data.firstName || '';
          const lastName = data.last_name || data.lastName || '';
          const phoneNumber = data.phone_number || data.phoneNumber || '';
          setProfile({
            name: data.name || `${firstName} ${lastName}`.trim() || data.username || data.userName || (data.email ? String(data.email).split('@')[0] : '') || 'Operator',
            email: data.email || data.primaryEmail || '',
            phone: phoneNumber ? String(phoneNumber) : '',
            role: data.role || 'ADMIN',
            avatarBg: '#EC8D20'
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load profile, keeping mock default:', err);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchRealData = (userRole) => {
    const isClientAdmin = userRole === 'ADMIN';
    const seniorCall = isClientAdmin ? AdminService.adminGetSeniors() : SeniorService.getMySeniors();
    const alarmCall = isClientAdmin ? AdminService.adminGetAlarmEvents() : AlarmService.getAllAlarms();

    Promise.all([
      seniorCall,
      alarmCall
    ]).then(([realSeniors, realAlarms]) => {
      let seniorsLoaded = false;
      let alarmsLoaded = false;

      if (realSeniors && realSeniors.length > 0) {
        const mappedSeniors = {};
        realSeniors.forEach((s, idx) => {
          const sid = s.id || s.hsId || `senior-${idx}`;
          const name = s.name || `${s.firstName || s.first_name || ''} ${s.lastName || s.last_name || ''}`.trim() || 'Unnamed';
          const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '👤';
          
          const rawDob = s.dateOfBirth || s.dob || s.date_of_birth;
          let age = 70;
          if (rawDob) {
            const today = new Date();
            const birthDate = new Date(rawDob);
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
          }

          const mockFallback = INITIAL_SENIORS[initials] || {};

          const cg = s.caregiver || {};
          const fbCg = mockFallback.caregiver || {};
          const mappedCaregiver = {
            name: cg.name || fbCg.name || 'Caregiver',
            relation: cg.relation || fbCg.relation || 'Contact',
            location: cg.location || fbCg.location || 'Chennai, India',
            phone: cg.phone || cg.phoneNumber || fbCg.phone || s.phone || '+91 98400 12345'
          };

          const dev = s.devices || {};
          const fbDev = mockFallback.devices || {};
          const mappedDevices = {
            pendant: {
              online: dev.pendant?.online ?? fbDev.pendant?.online ?? true,
              battery: dev.pendant?.battery ?? s.latestPendantBattery ?? fbDev.pendant?.battery ?? 80,
              imei: dev.pendant?.imei || s.pendantImei || fbDev.pendant?.imei || '352625330000',
              sn: dev.pendant?.sn || s.pendantSn || fbDev.pendant?.sn || 'EV07-0000'
            },
            dispenser: {
              online: dev.dispenser?.online ?? fbDev.dispenser?.online ?? true,
              model: dev.dispenser?.model || fbDev.dispenser?.model || 'KP-20',
              sn: dev.dispenser?.sn || s.dispenserSn || fbDev.dispenser?.sn || 'KP20-0000'
            },
            band: {
              online: dev.band?.online ?? fbDev.band?.online ?? true,
              battery: dev.band?.battery ?? fbDev.band?.battery ?? 75,
              hr: dev.band?.hr ?? s.latestHeartRate ?? fbDev.band?.hr ?? 75,
              spo2: dev.band?.spo2 ?? s.latestSpo2 ?? fbDev.band?.spo2 ?? 98,
              sn: dev.band?.sn || s.bandSn || fbDev.band?.sn || 'HG-0000'
            }
          };

          mappedSeniors[sid] = {
            id: sid,
            initials,
            name,
            age: age || mockFallback.age || 70,
            gender: s.gender || mockFallback.gender || 'Male',
            hsId: s.hsId || mockFallback.hsId || `HS-CN-${String(sid).slice(0, 4)}`,
            address: s.address || mockFallback.address || 'Chennai, Tamil Nadu',
            medical: s.medicalCondition || s.medical || mockFallback.medical || 'None',
            subscribed: s.subscribed || mockFallback.subscribed || 'January 2026',
            caregiver: mappedCaregiver,
            devices: mappedDevices,
            erp: s.erp || mockFallback.erp || { plan: 'Complete Care', billing: 'Annual', nextBilling: '01 Jan 2027', amount: '₹29,999/yr', status: 'Active', invoices: 1 },
            gps: s.gps || mockFallback.gps || { lat: '13.0827°N', lng: '80.2707°E', place: 'Chennai', cx: 120, cy: 60 },
            toggles: s.toggles || mockFallback.toggles || { fall: true, sos: true, geo: true, missedDose: true, hr: true, spo2: true },
            log: s.log || mockFallback.log || []
          };
        });
        setSeniors(mappedSeniors);
        seniorsLoaded = true;

        // Auto-select first senior if current selection is invalid
        setSelectedSeniorId(currentId => {
          if (!mappedSeniors[currentId]) {
            const keys = Object.keys(mappedSeniors);
            return keys[0] || '';
          }
          return currentId;
        });
      }

      if (realAlarms && realAlarms.length > 0) {
        const mappedAlarms = realAlarms.map((a, index) => {
          let type = "Alarm";
          if (a["fall.alarm.start"] || a["fall.alarm.stop"]) type = "Fall";
          else if (a["alarm.panic.start"] || a["alarm.panic.stop"]) type = "Panic";
          else if (a["startup.alarm"]) type = "Startup";
          else if (a["geofence.alarm.1"] || a["geofence.alarm.2"]) type = "Geofence";
          else if (a.alarmType) {
            const at = String(a.alarmType).toLowerCase();
            if (at.includes("startup")) type = "Startup";
            else if (at.includes("fall")) type = "Fall";
            else if (at.includes("panic") || at.includes("sos")) type = "Panic";
            else if (at.includes("geofence")) type = "Geofence";
          }
          let dateStr = "—";
          if (a.timestamp) {
            const ts = String(a.timestamp).length === 10 ? a.timestamp * 1000 : a.timestamp;
            const d = new Date(ts);
            dateStr = d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) + ", " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
          }
          return {
            id: a.id != null ? String(a.id) : `alarm-${index}`,
            type,
            device: a["device.name"] || a.deviceUUID || "Device",
            identifier: a.ident || (a.deviceUUID ? String(a.deviceUUID).slice(0, 8) : "—"),
            serial: a["device.serial.number"] || "—",
            timestamp: dateStr,
            severity: a.severity || "MEDIUM",
            resolved: a.isResolved !== undefined ? a.isResolved : a.resolved || false
          };
        });
        setAlarms(mappedAlarms);
        alarmsLoaded = true;
      } else {
        setAlarms([
          { id: "1", type: "Fall", device: "Pendant (EV07-0142)", identifier: "35262533", serial: "EV07-0142", timestamp: "Jun 24, 2026, 09:42 AM", severity: "HIGH", resolved: false },
          { id: "2", type: "Geofence", device: "Pendant (EV07-0089)", identifier: "35262533", serial: "EV07-0089", timestamp: "Jun 24, 2026, 09:35 AM", severity: "HIGH", resolved: false },
          { id: "3", type: "Alarm", device: "Health Band (HG-0211)", identifier: "HG-0211", serial: "HG-0211", timestamp: "Jun 24, 2026, 09:30 AM", severity: "MEDIUM", resolved: false },
          { id: "4", type: "Alarm", device: "Pill Dispenser (KP-20)", identifier: "KP20-0067", serial: "KP20-0067", timestamp: "Jun 24, 2026, 08:00 AM", severity: "LOW", resolved: true }
        ]);
        alarmsLoaded = true;
      }

      setTickets(INITIAL_TICKETS);
      setSelectedTicketId(currentId => {
        if (!INITIAL_TICKETS.some(t => t.id === currentId)) {
          return INITIAL_TICKETS[0]?.id || '';
        }
        return currentId;
      });

      if (isMockActive()) {
        setIsMockData(true);
      } else if (seniorsLoaded && alarmsLoaded) {
        setIsMockData(false);
      } else {
        setIsMockData(true);
        if (!seniorsLoaded) setSeniors(INITIAL_SENIORS);
        if (!alarmsLoaded) setTickets(INITIAL_TICKETS);
      }
    }).catch(err => {
      console.warn('Failed to load real data, falling back to mock data:', err);
      setIsMockData(true);
      setSeniors(INITIAL_SENIORS);
      setTickets(INITIAL_TICKETS);
      setAlarms([
        { id: "1", type: "Fall", device: "Pendant (EV07-0142)", identifier: "35262533", serial: "EV07-0142", timestamp: "Jun 24, 2026, 09:42 AM", severity: "HIGH", resolved: false },
        { id: "2", type: "Geofence", device: "Pendant (EV07-0089)", identifier: "35262533", serial: "EV07-0089", timestamp: "Jun 24, 2026, 09:35 AM", severity: "HIGH", resolved: false },
        { id: "3", type: "Alarm", device: "Health Band (HG-0211)", identifier: "HG-0211", serial: "HG-0211", timestamp: "Jun 24, 2026, 09:30 AM", severity: "MEDIUM", resolved: false },
        { id: "4", type: "Alarm", device: "Pill Dispenser (KP-20)", identifier: "KP20-0067", serial: "KP20-0067", timestamp: "Jun 24, 2026, 08:00 AM", severity: "LOW", resolved: true }
      ]);
    });
  };

  useEffect(() => {
    if (isAuthenticated && profile && profile.role) {
      fetchRealData(profile.role);
      const interval = setInterval(() => {
        fetchRealData(profile.role);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, profile.role]);

  useEffect(() => {
    const handleMockStatus = (e) => {
      setIsMockData(e.detail);
    };
    window.addEventListener('mock:status', handleMockStatus);
    return () => window.removeEventListener('mock:status', handleMockStatus);
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setIsAuthenticated(false);
      setProfile({ name: 'Priya Krishnamurthy', email: 'priya.k@healthsoft.in', phone: '+91 98400 12345', role: 'ADMIN', avatarBg: '#EC8D20' });
    };
    window.addEventListener('auth:expired', onSessionExpired);
    return () => window.removeEventListener('auth:expired', onSessionExpired);
  }, []);

  // Layout Tab states
  const [activeRpTab, setActiveRpTab] = useState('profile'); // 'profile', 'controls', 'erp', 'log'
  
  // Selected Senior / Ticket Context
  const [selectedTicketId, setSelectedTicketId] = useState('TKT-2026-00847');
  const [selectedSeniorId, setSelectedSeniorId] = useState('MR');

  // Filter & Alert Ribbon states
  const [ribbonAck, setRibbonAck] = useState(false);

  // Tracking states
  const [closedTickets, setClosedTickets] = useState(new Set());
  const [resolvedTickets, setResolvedTickets] = useState(new Set(['TKT-2026-00840', 'TKT-2026-00835']));

  // Outbound Call states
  const [calling, setCalling] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const callIntervalRef = useRef(null);

  // Action tracker
  const [dispatchedSeniors, setDispatchedSeniors] = useState(new Set());

  // Confirm Modal state
  const [modalConfig, setModalConfig] = useState(null);

  // Custom Toast state
  const [toasts, setToasts] = useState([]);

  // Critical lockout overlay trigger
  const [lockoutTicket, setLockoutTicket] = useState(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(60);
  const lockoutIntervalRef = useRef(null);

  // Global Infrastructure toggles
  const [infraToggles, setInfraToggles] = useState({
    awsIot: true,
    awsSns: true,
    awsLambda: true,
    awsErp: true,
    flespiGps: true,
    flespiGeo: true,
    flespiHist: false,
    mobileSos: true,
    mobileMissed: false,
    mobileHealth: false,
    mobileWeekly: false,
  });

  // Global threshold defaults
  const [thresholds, setThresholds] = useState({
    hr: 130,
    spo2: 90,
    battery: 20,
    geofence: 200,
    inactivity: 4,
    doseWindow: 30
  });

  // Audio context for lockout siren alarm
  const alarmCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  // Clock state
  const [timeStr, setTimeStr] = useState('--:--:--');

  // Responsive drawer states
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 900 : true);
  const [rightPanelOpen, setRightPanelOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1200 : true);

  // Stop any alarm audio that survived an HMR reload
  useEffect(() => {
    stopAlarmAudio();
  }, []);
  // Live clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const n = new Date();
      setTimeStr([n.getHours(), n.getMinutes(), n.getSeconds()].map(v => String(v).padStart(2, '0')).join(':'));
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Alarm popup disabled — re-enable block below to restore
  // useEffect(() => {
  //   const activeP1 = tickets.find(t => t.pri === 'p1' && !resolvedTickets.has(t.id) && !closedTickets.has(t.id));
  //   if (activeP1 && !lockoutTicket) { triggerLockout(activeP1); }
  // }, [tickets, resolvedTickets, closedTickets]);

  const toast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const showConfirm = (title, body, confirmLabel, confirmClass, extraType = '') => {
    return new Promise((resolve) => {
      setModalConfig({
        title,
        body,
        confirmLabel,
        confirmClass,
        extraType,
        onConfirm: (note) => {
          setModalConfig(null);
          resolve({ ok: true, note });
        },
        onCancel: () => {
          setModalConfig(null);
          resolve({ ok: false });
        }
      });
    });
  };

  const addLog = (sid, text) => {
    const n = new Date();
    const t = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
    setSeniors(prev => {
      const copy = { ...prev };
      copy[sid] = {
        ...copy[sid],
        log: [{ time: t, text }, ...copy[sid].log]
      };
      return copy;
    });
  };

  // Alarm audio — disabled
  const startAlarmAudio = () => { /* no-op — alarm audio disabled */ };

  const stopAlarmAudio = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (alarmCtxRef.current) {
      try {
        alarmCtxRef.current.close();
      } catch {}
      alarmCtxRef.current = null;
    }
  };

  const triggerLockout = (ticket) => {
    setLockoutTicket(ticket);
    setLockoutSeconds(60);
    startAlarmAudio();

    if (lockoutIntervalRef.current) clearInterval(lockoutIntervalRef.current);
    lockoutIntervalRef.current = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          clearInterval(lockoutIntervalRef.current);
          addLog(ticket.sid, '⚠️ Alert <strong>auto-escalated</strong> to supervisor — no response in 60s');
          toast('⚠️ No response for 60s — auto-escalated to supervisor', 'error');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const ackCritical = () => {
    if (lockoutIntervalRef.current) {
      clearInterval(lockoutIntervalRef.current);
      lockoutIntervalRef.current = null;
    }
    stopAlarmAudio();
    if (lockoutTicket) {
      setSelectedTicketId(lockoutTicket.id);
      setSelectedSeniorId(lockoutTicket.sid);
      if (!ribbonAck) {
        setRibbonAck(true);
        addLog(lockoutTicket.sid, 'Ribbon acknowledged by <strong>Priya K.</strong>');
      }
      setLockoutTicket(null);
      toast('Critical alert acknowledged — take immediate action now', 'error');
    }
  };

  // Call senior timers
  useEffect(() => {
    if (calling) {
      callIntervalRef.current = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [calling]);

  const selectTicket = (tid, sid) => {
    setSelectedTicketId(tid);
    setSelectedSeniorId(sid);
    setCalling(false);
    setCallSeconds(0);
    setRightPanelOpen(true); // Auto-open profile drawer on mobile/tablet
  };



  return (
    <HealthsoftContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        handleLogout,
        seniors,
        setSeniors,
        tickets,
        setTickets,
        selectedTicketId,
        setSelectedTicketId,
        selectedSeniorId,
        setSelectedSeniorId,
        activeRpTab,
        setActiveRpTab,
        ribbonAck,
        setRibbonAck,
        closedTickets,
        setClosedTickets,
        resolvedTickets,
        setResolvedTickets,
        calling,
        setCalling,
        callSeconds,
        setCallSeconds,
        dispatchedSeniors,
        setDispatchedSeniors,
        modalConfig,
        setModalConfig,
        toasts,
        setToasts,
        lockoutTicket,
        lockoutSeconds,
        ackCritical,
        infraToggles,
        setInfraToggles,
        thresholds,
        setThresholds,
        timeStr,
        toast,
        showConfirm,
        addLog,
        selectTicket,
        sidebarOpen,
        setSidebarOpen,
        rightPanelOpen,
        setRightPanelOpen,
        isMockData,
        setIsMockData,
        alarms,
        setAlarms,
      }}
    >
      {children}
    </HealthsoftContext.Provider>
  );
};
