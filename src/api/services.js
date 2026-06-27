/**
 * services.js — the "phone book" of the backend.
 *
 * Every action the app can ask the backend to do lives here, grouped by
 * feature (Auth, Profile, Seniors, Monitors, Devices, Alarms, Admin, ...).
 * Pages never call fetch() directly — they import a service from this file.
 */
import { client, request } from './client';

// 1. Authentication Services
export const AuthService = {
  signin: (body) =>
    request('/v1/auth/signin', { method: 'POST', body, skipAuth: true }),

  signinMobile: (body) =>
    request('/v1/auth/signin/mobile', { method: 'POST', body, skipAuth: true }),

  signinMobileVerify: (body, platform) =>
    request('/v1/auth/signin/mobile/verify', {
      method: 'POST',
      body,
      headers: platform ? { 'X-Platform': platform } : undefined,
      skipAuth: true,
    }),

  signupEmail: (body) =>
    request('/v1/auth/signup/email', { method: 'POST', body, skipAuth: true }),

  refresh: (refreshToken) =>
    request('/v1/auth/refresh', {
      method: 'POST',
      headers: { refreshToken },
      skipAuth: true,
    }),

  logout: (refreshToken) =>
    request('/v1/auth/logout', {
      method: 'POST',
      headers: { refreshToken },
      skipAuth: true,
    }),

  updateMe: (body) =>
    client.put('/v1/auth/me', body),

  verifyEmail: (userId) =>
    client.post(`/v1/auth/verify-email/${userId}`),

  changePassword: (body) =>
    request('/v1/auth/change-password', { method: 'POST', body, skipAuth: true }),

  googleAuth: (body) =>
    request('/v1/auth/google', { method: 'POST', body, skipAuth: true }),

  loginGoogle: () =>
    request('/v1/auth/login/google', { method: 'GET', skipAuth: true }),

  forgotPassword: (body) =>
    request('/v1/auth/forgot-password', { method: 'POST', body, skipAuth: true }),

  resetPassword: (body, token) =>
    request('/v1/auth/reset-password', {
      method: 'POST',
      body,
      headers: { Authorization: `Bearer ${token}` },
      skipAuth: true,
    }),

  validateResetToken: (token) =>
    request(`/v1/auth/validate-reset-token/${token}`, { method: 'GET', skipAuth: true }),

  getResetPasswordPage: (queryParams) =>
    request('/v1/auth/reset-password-page', { method: 'GET', queryParams, skipAuth: true }),
};

// 2. User Profile Services
export const ProfileService = {
  getProfile: () =>
    client.get('/v1/profile'),

  updateProfile: (body) =>
    client.put('/v1/profile', body),

  updatePersonalInfo: (body) =>
    client.put('/v1/profile/personal-info', body),

  verifyPhone: () =>
    client.post('/v1/profile/verify-phone'),
};

// 3. Senior Services
export const SeniorService = {
  createSenior: (body) =>
    client.post('/v1/seniors/create', body),

  mapSenior: (body) =>
    client.post('/v1/seniors/map', body),

  approveMapping: (mappingId) =>
    client.post(`/v1/seniors/map/${mappingId}/approve`),

  rejectMapping: (mappingId) =>
    client.post(`/v1/seniors/map/${mappingId}/reject`),

  deleteMapping: (mappingId) =>
    client.delete(`/v1/seniors/map/${mappingId}`),

  getMySeniors: () =>
    client.get('/v1/seniors/my-seniors'),

  getMyGuardians: () =>
    client.get('/v1/seniors/my-guardians'),

  getMyMonitors: () =>
    client.get('/v1/seniors/my-monitors'),
};

// 4. Monitor Services
export const MonitorService = {
  assignMonitor: (body) =>
    client.post('/v1/monitors/assign', body),

  deleteMonitorMapping: (mappingId) =>
    client.delete(`/v1/monitors/mappings/${mappingId}`),

  getMonitorsOfSenior: (seniorId) =>
    client.get(`/v1/monitors/of-senior/${seniorId}`),

  getMonitorsMySeniors: () =>
    client.get('/v1/monitors/my-seniors'),
};

// 5. Compliance Services
export const ComplianceService = {
  uploadReport: (body) =>
    client.post('/v1/compliance/reports', body),

  getReportsOfSenior: (seniorId) =>
    client.get(`/v1/compliance/reports/senior/${seniorId}`),

  completeSubscription: (seniorId) =>
    client.post('/v1/compliance/subscription/complete', undefined, { seniorId }),
};

// 6. Dashboard Services
export const DashboardService = {
  getGuardianDashboard: (guardianUUID) =>
    request(`/v1/guardian-dashboard/${guardianUUID}`, { method: 'GET', skipAuth: true }),

  getSeniorDashboard: (seniorUUID) =>
    request(`/v1/senior-dashboard/${seniorUUID}`, { method: 'GET', skipAuth: true }),

  getMonitorDashboard: (seniorUUID) =>
    request(`/v1/monitor-dashboard/${seniorUUID}`, { method: 'GET', skipAuth: true }),

  getMonitorDashboardMappedSeniors: () =>
    client.get('/v1/monitor-dashboard/mapped-seniors'),
};

// Device type enum — values returned by GET /v1/devices/types and accepted by
// GET /v1/admin/devices/{deviceType}.
export const DeviceType = {
  PENDANT: 'PENDANT',
  WRIST_BAND: 'WRIST_BAND',
  WATCH: 'WATCH',
  PILL_DISPENSER: 'PILL_DISPENSER',
  UNKNOWN: 'UNKNOWN',
};

// 7. Device Registration Services
export const DeviceService = {
  getDeviceNetworkTypes: () =>
    client.get('/v1/devices/network-types'),

  // Valid device types for registration → e.g. ["PENDANT","WATCH",...]
  getDeviceTypes: () =>
    client.get('/v1/devices/types'),

  registerDevice: (body) =>
    request('/v1/devices/register', { method: 'POST', body, skipAuth: true }),

  rotateDeviceCredentials: (deviceUUID) =>
    client.post(`/v1/devices/${deviceUUID}/credentials/rotate`),

  revokeDevice: (deviceUUID) =>
    client.post(`/v1/devices/${deviceUUID}/revoke`),

  getDeviceDetailsByImei: (imei) =>
    request(`/v1/devices/details/by-imei/${imei}`, { method: 'GET', skipAuth: true }),

  getDeviceDetailsByImeiList: (imeiList) =>
    request('/v1/devices/details/by-imei-list', { method: 'POST', body: imeiList, skipAuth: true }),
};

// 8. Device Assignment Services
export const DeviceAssignmentService = {
  assignDevice: (body, xForwardedFor) =>
    request('/v1/devices/assignments/assign', {
      method: 'POST',
      body,
      headers: xForwardedFor ? { 'X-Forwarded-For': xForwardedFor } : undefined,
    }),

  unassignDevice: (assignmentId, body, xForwardedFor) =>
    request(`/v1/devices/assignments/unassign/${assignmentId}`, {
      method: 'POST',
      body,
      headers: xForwardedFor ? { 'X-Forwarded-For': xForwardedFor } : undefined,
    }),

  getDeviceAssignment: (deviceId) =>
    client.get(`/v1/devices/assignments/get/${deviceId}`),

  getDeviceAssignmentAuditLogs: (assignmentId) =>
    client.get(`/v1/devices/assignments/audit-logs/${assignmentId}`), // ADMIN ONLY

  getSeniorDevices: (seniorUUID) =>
    client.get(`/v1/devices/assignments/seniors/${seniorUUID}/devices`),
};

// 9. Vitals Services
export const VitalService = {
  syncVitals: (body) =>
    request('/v1/vitals/sync', { method: 'POST', body, skipAuth: true }),

  getVitalsSummary: (queryParams) =>
    client.get('/v1/vitals/summary', queryParams),
};

// 10. Alarm Events Services
export const AlarmService = {
  saveAlarmEvents: (body) =>
    request('/v1/alarm/save', { method: 'POST', body, skipAuth: true }),

  getAlarmsByDevice: (deviceUUID) =>
    client.get(`/v1/alarm/by-device/${deviceUUID}`),

  getAllAlarms: () =>
    client.get('/v1/alarm/all'),

  getAlarm: (id) =>
    client.get(`/v1/alarm/${id}`),

  deleteAlarm: (id) =>
    client.delete(`/v1/alarm/${id}`),
};

// 11. Device Events Services
export const DeviceEventService = {
  saveDeviceEvents: (body) =>
    request('/v1/device-events/save-all', { method: 'POST', body, skipAuth: true }),
};

// 12. Device Status Services
export const DeviceStatusService = {
  saveDeviceStatusEvents: (body) =>
    request('/v1/device-status/save', { method: 'POST', body, skipAuth: true }),

  getDeviceStatusByDevice: (deviceUUID) =>
    client.get(`/v1/device-status/by-device/${deviceUUID}`),

  getAllDeviceStatuses: () =>
    client.get('/v1/device-status/all'),

  getDeviceStatus: (id) =>
    client.get(`/v1/device-status/${id}`),

  deleteDeviceStatus: (id) =>
    client.delete(`/v1/device-status/${id}`),
};

// 13. Position Events Services
export const PositionService = {
  savePositionEvents: (body) =>
    request('/v1/position/save', { method: 'POST', body, skipAuth: true }),

  getPositionByDevice: (deviceUUID) =>
    client.get(`/v1/position/by-device/${deviceUUID}`),

  getAllPositions: () =>
    client.get('/v1/position/all'),

  getPosition: (id) =>
    client.get(`/v1/position/${id}`),

  deletePosition: (id) =>
    client.delete(`/v1/position/${id}`),
};

// 14. CRM Services
export const CrmService = {
  getCrmLead: (leadName) =>
    client.get(`/v1/api/crm/leads/${leadName}`), // ADMIN ONLY

  saveCrmLead: (body) =>
    client.post('/v1/api/crm/leads', body), // ADMIN ONLY
};

// 15. Admin Services
export const AdminService = {
  backfillUsernames: () =>
    client.post('/v1/admin/backfill-usernames'),

  adminCreateUser: (body) =>
    client.post('/v1/admin/users', body),

  adminUpdateUser: (userId, body) =>
    client.put(`/v1/admin/users/${userId}`, body),

  adminDeactivateUser: (userId) =>
    client.patch(`/v1/admin/users/${userId}/deactivate`),

  adminReactivateUser: (userId) =>
    client.patch(`/v1/admin/users/${userId}/reactivate`),

  adminDeleteUser: (userId) =>
    client.delete(`/v1/admin/users/${userId}`),

  adminGetUsers: (queryParams) =>
    client.get('/v1/admin/users', queryParams),

  adminGetUsersAvailableForSenior: (seniorId, queryParams) =>
    client.get(`/v1/admin/users/available-for-senior/${seniorId}`, queryParams),

  adminGetGuardiansAvailableForSenior: (seniorId) =>
    client.get(`/v1/admin/guardians/available-for-senior/${seniorId}`),

  adminGetSeniors: () =>
    client.get('/v1/admin/seniors'),

  adminGetSeniorByMobile: (mobile) =>
    client.get(`/v1/admin/seniors/${mobile}`),

  adminGetDevices: () =>
    client.get('/v1/admin/devices'),

  // Devices filtered by type (deviceType ∈ DeviceType) → array of device objects
  adminGetDevicesByType: (deviceType) =>
    client.get(`/v1/admin/devices/${deviceType}`),

  // Active devices + their last known GPS location → array of { device, deviceLocation }
  adminGetEligibleSeniorDeviceLocations: () =>
    client.get('/v1/admin/eligible-seniors/device-locations'),

  adminGetAssignments: () =>
    client.get('/v1/admin/assignments'),

  adminGetMappings: () =>
    client.get('/v1/admin/mappings'),

  adminMapGuardianSenior: (body) =>
    client.post('/v1/admin/mappings/admin-map', body),

  adminGetCounts: () =>
    client.get('/v1/admin/counts'),

  adminGetAlarmEvents: () =>
    client.get('/v1/admin/alarm-events'),

  adminGetMonitorMappings: () =>
    client.get('/v1/admin/monitor-mappings'),
};

// 16. Actuator Services
export const ActuatorService = {
  getHealth: () =>
    request('/v1/actuator/health', { method: 'GET', skipAuth: true }),

  getHealthPing: () =>
    request('/v1/actuator/health/ping', { method: 'GET', skipAuth: true }),

  getHealthUptime: () =>
    request('/v1/actuator/health/uptime', { method: 'GET', skipAuth: true }),

  getHealthSystem: () =>
    request('/v1/actuator/health/system', { method: 'GET', skipAuth: true }),

  getHealthDb: () =>
    request('/v1/actuator/health/db', { method: 'GET', skipAuth: true }),

  getHealthReady: () =>
    request('/v1/actuator/health/ready', { method: 'GET', skipAuth: true }),

  getHealthInternalDetails: () =>
    client.get('/v1/actuator/health/internal/details'),
};
