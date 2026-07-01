// mockData.js — In-memory mock database for offline mock mode.

let currentMockState = false;

export function isMockActive() {
  return currentMockState;
}

export function setMockActive(active) {
  if (currentMockState !== active) {
    currentMockState = active;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mock:status', { detail: active }));
    }
  }
}

// --- Mock State Database ---
let mockUsers = [
  { id: "1", role: "ADMIN", firstName: "Priya", lastName: "Krishnamurthy", username: "priya.k", userName: "priya.k", primaryEmail: "priya.k@healthsoft.in", email: "priya.k@healthsoft.in", phoneNumber: "9840012345", status: "ACTIVE", active: true },
  { id: "2", role: "ADMIN", firstName: "Ranjini", lastName: "S.", username: "ranjini.s", userName: "ranjini.s", primaryEmail: "ranjini.s@healthsoft.in", email: "ranjini.s@healthsoft.in", phoneNumber: "9840012346", status: "ACTIVE", active: true },
  { id: "3", role: "MONITOR", firstName: "Karthik", lastName: "M.", username: "karthik.m", userName: "karthik.m", primaryEmail: "karthik.m@healthsoft.in", email: "karthik.m@healthsoft.in", phoneNumber: "9840012347", status: "ACTIVE", active: true },
  { id: "4", role: "SENIOR", firstName: "Meenakshi", lastName: "Rajan", username: "meenakshi.r", userName: "meenakshi.r", primaryEmail: "meenakshi.r@healthsoft.in", email: "meenakshi.r@healthsoft.in", phoneNumber: "9840012342", status: "ACTIVE", active: true },
  { id: "5", role: "GUARDIAN", firstName: "Suresh", lastName: "Rajan", username: "suresh.r", userName: "suresh.r", primaryEmail: "suresh.rajan@gmail.com", email: "suresh.rajan@gmail.com", phoneNumber: "9840067890", status: "ACTIVE", active: true }
];


let mockSeniors = [
  {
    id: "MR",
    name: "Meenakshi Rajan",
    firstName: "Meenakshi",
    lastName: "Rajan",
    gender: "Female",
    age: 74,
    dateOfBirth: "1951-10-12",
    dob: "October 12, 1951",
    bloodGroup: "O+",
    room: "302-A",
    hsId: "HS-CN-0142",
    admissionDate: "01 Mar 2026",
    mobilityAid: "Cane",
    fallsCount: 1,
    medCompliance: 92,
    devicesCount: 3,
    latestSpo2: 97,
    latestBp: "135/85",
    latestHeartRate: 88,
    latestTemperature: 36.8,
    latestBloodGlucose: 140,
    latestRespRate: 18,
    nationality: "Indian",
    language: "Tamil",
    religion: "Hinduism",
    primaryPhysician: "Dr. R. K. Swamy",
    physicianPhone: "+91 98400 99999",
    caregiver: { name: "Suresh Rajan", relation: "Son", location: "Fremont, CA, USA", phone: "+1 (510) 555-0142" },
    floorAttendant: "Karthik M.",
    dietitian: "Ranjini S.",
    physiotherapist: "Suresh N.",
    fallRisk: "Medium",
    wanderRisk: "Low",
    cardiacRisk: "High",
    activeConditions: ["Hypertension", "Type 2 DM"],
    medicalConditions: "Hypertension, Type 2 DM",
    allergies: "Sulfonamides",
    devices: {
      pendant: { online: true, battery: 78, imei: "352625333142", sn: "EV07-0142" },
      dispenser: { online: true, model: "KP-20", sn: "KP20-0142" },
      band: { online: true, battery: 22, hr: 88, spo2: 97, sn: "HG-0142" }
    },
    erp: { plan: "Complete Care", billing: "Annual", nextBilling: "01 Mar 2027", amount: "₹29,999/yr", status: "Active", invoices: 1 },
    gps: { lat: "13.0342°N", lng: "80.2685°E", place: "Luz Church Rd, Mylapore", cx: 140, cy: 53 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, hr: true, spo2: true },
    log: [
      { time: "09:44", text: "App push → <strong>Suresh Rajan</strong>'s iPhone" },
      { time: "09:44", text: "WhatsApp sent to <strong>Suresh Rajan</strong> (Fremont)" },
      { time: "09:43", text: "Outbound call to <strong>Meenakshi Rajan</strong> — Priya K." },
      { time: "09:43", text: "<strong>Priya K.</strong> acknowledged · response 58s" },
      { time: "09:42", text: "Ticket <strong>TKT-2026-00847</strong> created · P1 SOS" },
      { time: "09:42", text: "GPS from <strong>Flespi</strong> — 13.0342°N, 80.2685°E · 8m acc" },
      { time: "09:42", text: "<strong>fall.alarm.start</strong> · pendant IMEI 352625333142" }
    ]
  },
  {
    id: "RS",
    name: "Rajagopalan Subramaniam",
    firstName: "Rajagopalan",
    lastName: "Subramaniam",
    gender: "Male",
    age: 81,
    dateOfBirth: "1945-01-04",
    dob: "January 04, 1945",
    bloodGroup: "A+",
    room: "104-B",
    hsId: "HS-CN-0089",
    admissionDate: "01 Jan 2026",
    mobilityAid: "Walker",
    fallsCount: 0,
    medCompliance: 85,
    devicesCount: 3,
    latestSpo2: 98,
    latestBp: "128/80",
    latestHeartRate: 74,
    latestTemperature: 36.6,
    latestBloodGlucose: 110,
    latestRespRate: 16,
    nationality: "Indian",
    language: "Tamil",
    religion: "Hinduism",
    primaryPhysician: "Dr. A. R. Babu",
    physicianPhone: "+91 98400 88888",
    caregiver: { name: "Ananya Subramaniam", relation: "Daughter", location: "Bangalore, KA", phone: "+91 98400 12345" },
    floorAttendant: "Karthik M.",
    dietitian: "Ranjini S.",
    physiotherapist: "Suresh N.",
    fallRisk: "Low",
    wanderRisk: "Medium",
    cardiacRisk: "Medium",
    activeConditions: ["Parkinson's (Stage 2)", "Arthritis"],
    medicalConditions: "Parkinson's (Stage 2), Arthritis",
    allergies: "Penicillin",
    devices: {
      pendant: { online: true, battery: 55, imei: "352625330089", sn: "EV07-0089" },
      dispenser: { online: true, model: "KP-20", sn: "KP20-0089" },
      band: { online: true, battery: 71, hr: 74, spo2: 98, sn: "HG-0089" }
    },
    erp: { plan: "Essential", billing: "Monthly", nextBilling: "01 Jul 2026", amount: "₹2,499/mo", status: "Active", invoices: 6 },
    gps: { lat: "13.0418°N", lng: "80.2338°E", place: "Anna Salai, T. Nagar", cx: 90, cy: 65 },
    toggles: { fall: true, sos: true, geo: true, missedDose: true, hr: true, spo2: true },
    log: [
      { time: "09:36", text: "<strong>Karthik M.</strong> acknowledged · 2m 10s response" },
      { time: "09:35", text: "Geo-fence breach · <strong>Flespi</strong> — 400m outside zone" },
      { time: "09:35", text: "<strong>geo.exit</strong> event · IMEI 352625330089" },
      { time: "09:00", text: "Morning check-in · all devices nominal" }
    ]
  }
];

let mockMappings = [
  {
    id: "1",
    status: "APPROVED",
    createdAt: "2026-03-01T00:00:00.000Z",
    senior: { id: "MR", firstName: "Meenakshi", lastName: "Rajan", primaryEmail: "meenakshi.r@healthsoft.in", phoneNumber: "9840012342" },
    guardian: { id: "5", firstName: "Suresh", lastName: "Rajan", primaryEmail: "suresh.rajan@gmail.com" }
  },
  {
    id: "2",
    status: "APPROVED",
    createdAt: "2026-01-01T00:00:00.000Z",
    senior: { id: "RS", firstName: "Rajagopalan", lastName: "Subramaniam", primaryEmail: "rajagopalan.s@healthsoft.in", phoneNumber: "9840012345" },
    guardian: { id: "6", firstName: "Ananya", lastName: "Subramaniam", primaryEmail: "ananya.s@gmail.com" }
  }
];

let mockMonitorMappings = [
  {
    id: "1",
    createdAt: "2026-03-01T00:00:00.000Z",
    seniorId: "MR",
    senior: { firstName: "Meenakshi", lastName: "Rajan", primaryEmail: "meenakshi.r@healthsoft.in", phoneNumber: "9840012342" },
    monitorId: "3",
    monitor: { firstName: "Karthik", lastName: "M.", primaryEmail: "karthik.m@healthsoft.in" }
  }
];

let mockAlarms = [
  { id: "TKT-2026-00847", sid: "MR", pri: "p1", type: "SOS — Fall detected", badge: "b-sos", loc: "Luz Church Road, Mylapore · 600004", time: "2 mins ago", agent: "Priya K.", extra: "Pendant 78% · Flespi GPS" },
  { id: "TKT-2026-00846", sid: "RS", pri: "p1", type: "Geo-fence breach", badge: "b-geo", loc: "T. Nagar · 600017 · 400m outside", time: "8 mins ago", agent: "Karthik M.", extra: "Flespi GPS · Anna Salai" }
];

// --- Request Router Interceptor ---
// Active devices + their last known GPS location (mirrors GET /v1/admin/eligible-seniors/device-locations)
let mockDeviceLocations = [
  {
    device: { id: "mock-dev-1", deviceIdentifier: "7510160", imei: "861045085125576", deviceName: "Meenakshi's Pendant", status: "ACTIVE", deviceType: "PENDANT", deviceTypeId: "782", model: "EV07BA", batteryLevel: 78, networkType: "4G", lastSeen: 1781774785000 },
    deviceLocation: { id: 1, ident: "861045085125576", "device.name": "Meenakshi's Pendant", "position.latitude": 13.0827, "position.longitude": 80.2707, "position.satellites": 9, "position.speed": 0, timestamp: 1781774785, "server.timestamp": 1781774811.5 },
  },
  {
    device: { id: "mock-dev-2", deviceIdentifier: "7958461", imei: "861045082850739", deviceName: "Suresh Wrist Band", status: "ACTIVE", deviceType: "WRIST_BAND", deviceTypeId: "782", model: "HG-200", batteryLevel: 100, networkType: "4G", lastSeen: 1780306036000 },
    deviceLocation: { id: 2, ident: "861045082850739", "device.name": "Suresh Wrist Band", "position.latitude": 12.997235, "position.longitude": 80.260174, "position.satellites": 10, "position.speed": 1, timestamp: 1780306036, "server.timestamp": 1780306039.2 },
  },
  {
    device: { id: "mock-dev-3", deviceIdentifier: "8378454", imei: "862596080697380", deviceName: "Ward-A Watch", status: "ACTIVE", deviceType: "WATCH", deviceTypeId: "782", model: "SW-10", batteryLevel: 42, networkType: "4G", lastSeen: 1782388254000 },
    deviceLocation: { id: 3, ident: "862596080697380", "device.name": "Ward-A Watch", "position.latitude": 13.0674, "position.longitude": 80.2376, "position.satellites": 9, "position.speed": 0, timestamp: 1781594896, "server.timestamp": 1781607995.3 },
  },
  {
    device: { id: "mock-dev-4", deviceIdentifier: "8378565", imei: "862596085917791", deviceName: "Clinic Pill Dispenser", status: "ACTIVE", deviceType: "PILL_DISPENSER", deviceTypeId: "782", model: "KP-20", batteryLevel: 12, networkType: "4G", lastSeen: 1782372555000 },
    deviceLocation: { id: 4, ident: "862596085917791", "device.name": "Clinic Pill Dispenser", "position.latitude": 12.9915, "position.longitude": 80.2337, "position.satellites": 8, "position.speed": 0, timestamp: 1781863809, "server.timestamp": 1781863811.3 },
  },
];

export function handleMockRequest(path, options) {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : null;

  console.log(`[Mock API Intercept] ${method} ${path}`, body);

  return new Promise((resolve, reject) => {
    // Artificial latency for visual validation
    setTimeout(() => {
      try {
        // --- AUTH ROUTES ---
        if (path.startsWith("/v1/auth/signin")) {
          resolve({
            access_token: "mock-access-token",
            refresh_token: "mock-refresh-token"
          });
          return;
        }
        if (path.startsWith("/v1/auth/logout")) {
          resolve({ success: true });
          return;
        }
        if (path.startsWith("/v1/auth/me")) {
          resolve({
            id: "1",
            role: "ADMIN",
            firstName: "Priya",
            lastName: "Krishnamurthy",
            username: "priya.k",
            primaryEmail: "priya.k@healthsoft.in",
            phoneNumber: "9840012345"
          });
          return;
        }

        // --- PROFILE ROUTES ---
        if (path.startsWith("/v1/profile")) {
          if (method === "PUT") {
            resolve({ success: true, data: body });
          } else {
            resolve({
              id: "1",
              role: "ADMIN",
              firstName: "Priya",
              lastName: "Krishnamurthy",
              username: "priya.k",
              primaryEmail: "priya.k@healthsoft.in",
              phoneNumber: "9840012345"
            });
          }
          return;
        }

        // --- ADMIN USERS ROUTES ---
        if (path === "/v1/admin/users") {
          if (method === "GET") {
            resolve(mockUsers);
          } else if (method === "POST") {
            const newUser = {
              id: `user-${Date.now()}`,
              role: body.role,
              firstName: body.firstName,
              lastName: body.lastName,
              username: `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}`,
              userName: `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}`,
              primaryEmail: body.email || `${body.firstName.toLowerCase()}@healthsoft.in`,
              email: body.email || `${body.firstName.toLowerCase()}@healthsoft.in`,
              phoneNumber: body.phoneNumber || "9840000000",
              status: "ACTIVE",
              active: true
            };
            mockUsers.push(newUser);
            resolve(newUser);
          }
          return;
        }

        // Admin User Actions (Update, Delete, Deactivate, Reactivate)
        if (path.startsWith("/v1/admin/users/")) {
          const userId = path.split("/").pop();
          if (method === "DELETE") {
            mockUsers = mockUsers.filter(u => u.id !== userId);
            resolve({ success: true });
          } else if (method === "PUT") {
            const index = mockUsers.findIndex(u => u.id === userId);
            if (index !== -1) {
              mockUsers[index] = { ...mockUsers[index], ...body };
              resolve(mockUsers[index]);
            } else {
              reject(new Error("User not found"));
            }
          } else if (path.endsWith("/deactivate")) {
            const realId = path.split("/")[4];
            const index = mockUsers.findIndex(u => u.id === realId);
            if (index !== -1) {
              mockUsers[index].status = "DEACTIVATED";
              mockUsers[index].active = false;
              resolve({ success: true });
            } else {
              reject(new Error("User not found"));
            }
          } else if (path.endsWith("/reactivate")) {
            const realId = path.split("/")[4];
            const index = mockUsers.findIndex(u => u.id === realId);
            if (index !== -1) {
              mockUsers[index].status = "ACTIVE";
              mockUsers[index].active = true;
              resolve({ success: true });
            } else {
              reject(new Error("User not found"));
            }
          }
          return;
        }

        // --- SENIOR RESIDENTS ROUTES ---
        if (path === "/v1/seniors/my-seniors" || path === "/v1/admin/seniors" || path === "/v1/monitors/my-seniors") {
          resolve(mockSeniors);
          return;
        }

        if (path === "/v1/seniors/create") {
          const newSenior = {
            id: `sn-${Date.now()}`,
            name: `${body.firstName} ${body.lastName}`,
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender || "Male",
            age: 70,
            dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth).toISOString().split("T")[0] : "1956-01-01",
            dob: body.dateOfBirth ? new Date(body.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "January 01, 1956",
            bloodGroup: "O+",
            room: "101-A",
            hsId: `HS-CN-${Math.floor(1000 + Math.random() * 9000)}`,
            admissionDate: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
            mobilityAid: "None",
            fallsCount: 0,
            medCompliance: 100,
            devicesCount: 3,
            latestSpo2: 98,
            latestBp: "120/80",
            latestHeartRate: 72,
            latestTemperature: 36.6,
            latestBloodGlucose: 100,
            latestRespRate: 16,
            nationality: "Indian",
            language: "Tamil",
            religion: "Hinduism",
            primaryPhysician: "Dr. A. Kumar",
            physicianPhone: "+91 98400 11111",
            caregiver: "Caregiver",
            floorAttendant: "Karthik M.",
            dietitian: "Ranjini S.",
            physiotherapist: "Suresh N.",
            fallRisk: "Low",
            wanderRisk: "Low",
            cardiacRisk: "Low",
            activeConditions: [],
            medicalConditions: "",
            allergies: "",
            devices: {
              pendant: { online: true, battery: 95, imei: "352625330000", sn: "EV07-0000" },
              dispenser: { online: true, model: "KP-20", sn: "KP20-0000" },
              band: { online: true, battery: 90, hr: 72, spo2: 98, sn: "HG-0000" }
            },
            erp: { plan: "Essential", billing: "Monthly", nextBilling: "01 Jul 2026", amount: "₹2,499/mo", status: "Active", invoices: 1 },
            gps: { lat: "13.0827°N", lng: "80.2707°E", place: "Chennai", cx: 120, cy: 60 },
            toggles: { fall: true, sos: true, geo: true, missedDose: true, hr: true, spo2: true },
            log: []
          };
          mockSeniors.push(newSenior);
          resolve(newSenior);
          return;
        }

        if (path.startsWith("/v1/admin/guardians/available-for-senior/")) {
          const guardiansList = mockUsers.filter(u => u.role === "GUARDIAN");
          resolve(guardiansList);
          return;
        }

        // --- GUARDIAN MAPPINGS ROUTES ---
        if (path === "/v1/admin/mappings") {
          resolve(mockMappings);
          return;
        }

        if (path === "/v1/seniors/map") {
          const seniorObj = mockSeniors.find(s => s.id === body.seniorId) || { id: body.seniorId, firstName: "Senior", lastName: "Resident" };
          const guardianObj = mockUsers.find(u => u.id === body.guardianId) || { id: body.guardianId, firstName: "Guardian", lastName: "User" };
          const newMap = {
            id: `map-${Date.now()}`,
            status: "APPROVED",
            createdAt: new Date().toISOString(),
            senior: { id: seniorObj.id, firstName: seniorObj.firstName, lastName: seniorObj.lastName, primaryEmail: seniorObj.email || "senior@healthsoft.in", phoneNumber: seniorObj.phone || "" },
            guardian: { id: guardianObj.id, firstName: guardianObj.firstName, lastName: guardianObj.lastName, primaryEmail: guardianObj.primaryEmail }
          };
          mockMappings.push(newMap);
          resolve(newMap);
          return;
        }

        if (path.startsWith("/v1/seniors/map/")) {
          const mappingId = path.split("/").pop();
          if (method === "DELETE") {
            mockMappings = mockMappings.filter(m => m.id !== mappingId);
            resolve({ success: true });
          }
          return;
        }

        // --- SHIFT STAFF / MONITOR MAPPINGS ---
        if (path === "/v1/admin/monitor-mappings") {
          resolve(mockMonitorMappings);
          return;
        }

        if (path === "/v1/monitors/assign") {
          const seniorObj = mockSeniors.find(s => s.id === body.seniorId) || { firstName: "Senior", lastName: "Resident" };
          const monitorObj = mockUsers.find(u => u.id === body.monitorId) || { firstName: "Monitor", lastName: "User" };
          const newMap = {
            id: `monmap-${Date.now()}`,
            createdAt: new Date().toISOString(),
            seniorId: body.seniorId,
            monitorId: body.monitorId,
            senior: { firstName: seniorObj.firstName, lastName: seniorObj.lastName, primaryEmail: seniorObj.email || "senior@healthsoft.in", phoneNumber: seniorObj.phone || "" },
            monitor: { firstName: monitorObj.firstName, lastName: monitorObj.lastName, primaryEmail: monitorObj.primaryEmail }
          };
          mockMonitorMappings.push(newMap);
          resolve(newMap);
          return;
        }

        if (path.startsWith("/v1/monitors/mappings/")) {
          const mappingId = path.split("/").pop();
          if (method === "DELETE") {
            mockMonitorMappings = mockMonitorMappings.filter(m => m.id !== mappingId);
            resolve({ success: true });
          }
          return;
        }

        // --- ALARMS & ALERTS ---
        if (path === "/v1/alarm/all" || path === "/v1/admin/alarm-events") {
          resolve(mockAlarms);
          return;
        }

        // --- COUNTS FOR SYSTEM STATUS ---
        if (path === "/v1/admin/counts") {
          resolve({
            totalSeniors: mockSeniors.length,
            totalGuardians: mockUsers.filter(u => u.role === "GUARDIAN").length,
            totalMonitors: mockUsers.filter(u => u.role === "MONITOR").length,
            totalAdmins: mockUsers.filter(u => u.role === "ADMIN").length,
            totalDevices: mockSeniors.reduce((acc, s) => acc + (s.devicesCount || 0), 0),
            pendingMappings: mockMappings.filter(m => m.status === "PENDING").length,
            totalAlerts: mockAlarms.length
          });
          return;
        }

        // --- ACTUATOR HEALTH ---
        if (path.startsWith("/v1/actuator/health")) {
          resolve({ status: "UP" });
          return;
        }

        // --- DEVICE REGISTRATION LOOKUPS ---
        if (path === "/v1/devices/types") {
          resolve(["PENDANT", "WRIST_BAND", "WATCH", "PILL_DISPENSER", "UNKNOWN"]);
          return;
        }
        if (path === "/v1/devices/network-types") {
          resolve(["4G"]);
          return;
        }

        // --- DEVICE LOCATIONS (eligible seniors) ---
        if (path === "/v1/admin/eligible-seniors/device-locations") {
          resolve(mockDeviceLocations);
          return;
        }

        // --- ALL DEVICES ---
        if (path === "/v1/admin/devices") {
          resolve(mockDeviceLocations.map(r => r.device));
          return;
        }

        // --- DEVICES BY TYPE ---
        if (path.startsWith("/v1/admin/devices/")) {
          const type = decodeURIComponent(path.split("/").pop());
          resolve(mockDeviceLocations
            .map(r => r.device)
            .filter(d => type ? d.deviceType === type : true));
          return;
        }


        // Default fallback response
        resolve({ success: true });
      } catch (err) {
        reject(err);
      }
    }, 150); // slight simulated delay
  });
}
