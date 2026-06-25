APIs
Legend:
 Path Vars → {name}: type
 Query Params → name: type [required/optional]
 Body → ClassName &gt; field: type
 Headers → Header-Name: value
 Auth → roles allowed (all secured endpoints require Authorization: Bearer
&lt;token&gt;)

Authentication (/v1/auth)
POST /v1/auth/signin
 Body: UserSignInRequest &gt; email: String, password: String, platform: String
 Auth: Public
POST /v1/auth/signin/mobile
 Body: MobileSignInRequest &gt; phoneNumber: String, otp: String
 Auth: Public
POST /v1/auth/signin/mobile/verify
 Body: MobileSignInRequest &gt; phoneNumber: String, otp: String
 Headers: X-Platform: String [optional]
 Auth: Public
POST /v1/auth/signup/email
 Body: EmailSignUpRequest &gt; firstName: String, lastName: String, email:
String, password: String, phoneNumber: Long
 Auth: Public
POST /v1/auth/refresh
 Headers: refreshToken: &lt;token&gt; [required]
 Auth: Public
POST /v1/auth/logout
 Headers: refreshToken: &lt;token&gt; [required]
 Auth: Public

PUT /v1/auth/me
 Body: UpdateProfileRequest &gt; firstName: String, lastName: String, userName:
String, phoneNumber: Long, secondaryEmail: String, profileImageUrl: String,
dob: Long
 Auth: Any authenticated user
POST /v1/auth/verify-email/{userId}
 Path Vars: userId: UUID
 Auth: Any authenticated user
POST /v1/auth/change-password
 Body: UserLoginDTO  userId: UUID, oldPassword: String, newPassword:
String, phoneNumber: Long, email: String
 Auth: Public
POST /v1/auth/google
 Body: GoogleAuthRequest &gt; idToken: String, platform: String
 Auth: Public
GET /v1/auth/login/google
 Auth: Public
POST /v1/auth/forgot-password
 Body: ForgotPasswordRequest &gt; email: String, platform: String
 Auth: Public
POST /v1/auth/reset-password
 Body: ResetPasswordRequest &gt; otp: String, newPassword: String,
confirmPassword: String
 Headers: Authorization: Bearer &lt;token&gt; [required]
 Auth: Bearer token
GET /v1/auth/validate-reset-token/{token}
 Path Vars: token: String
 Auth: Public
GET /v1/auth/reset-password-page
 Query Params: token: String [required], platform: String [optional]

 Auth: Public

User Profile (/v1/profile)
GET /v1/profile
 Auth: Any authenticated user
PUT /v1/profile
 Body: UpdateProfileRequest &gt; firstName: String, lastName: String, userName:
String, phoneNumber: Long, secondaryEmail: String, profileImageUrl: String,
dob: Long
 Auth: Any authenticated user
PUT /v1/profile/personal-info
 Body: PersonalInfoRequest &gt; dateOfBirth: Long, gender: String,
maritalStatus: String, nationality: String, occupation: String, height: Double,
weight: Double, bloodGroup: String, allergies: String, medicalConditions:
String, addressLine1: String, addressLine2: String, city: String, state: String,
country: String, postalCode: String
 Auth: Any authenticated user
POST /v1/profile/verify-phone
 Auth: Any authenticated user

Senior (/v1/seniors)
POST /v1/seniors/create
 Body: SeniorRequestDTO &gt; firstName: String, lastName: String,
phoneNumber: Long, height: Double, weight: Double, gender: String,
dateOfBirth: Long
 Auth: GUARDIAN, ADMIN
POST /v1/seniors/map
 Body: SMRequest &gt; phoneNumber: Long, countryCode: String
 Auth: GUARDIAN, ADMIN
POST /v1/seniors/map/{mappingId}/approve
 Path Vars: mappingId: UUID
 Auth: Any authenticated user

POST /v1/seniors/map/{mappingId}/reject
 Path Vars: mappingId: UUID
 Auth: Any authenticated user
DELETE /v1/seniors/map/{mappingId}
 Path Vars: mappingId: UUID
 Auth: GUARDIAN, SENIOR, ADMIN
GET /v1/seniors/my-seniors
 Auth: GUARDIAN, ADMIN
GET /v1/seniors/my-guardians
 Auth: SENIOR, ADMIN
GET /v1/seniors/my-monitors
 Auth: SENIOR, ADMIN

Monitor (/v1/monitors)
POST /v1/monitors/assign
 Body: MonitorMappingRequest &gt; seniorId: UUID, monitorId: UUID
 Auth: ADMIN, GUARDIAN, SENIOR
DELETE /v1/monitors/mappings/{mappingId}
 Path Vars: mappingId: UUID
 Auth: ADMIN, GUARDIAN, SENIOR, MONITOR
GET /v1/monitors/of-senior/{seniorId}
 Path Vars: seniorId: UUID
 Auth: ADMIN, GUARDIAN, SENIOR, MONITOR
GET /v1/monitors/my-seniors
 Auth: MONITOR, ADMIN

Compliance (/v1/compliance)
POST /v1/compliance/reports

 Body: UploadReportsRequest &gt; reportName: String, reportUrl: String,
reportType: String, seniorId: UUID
 Auth: GUARDIAN, ADMIN
GET /v1/compliance/reports/senior/{seniorId}
 Path Vars: seniorId: UUID
 Auth: GUARDIAN, ADMIN
POST /v1/compliance/subscription/complete
 Query Params: seniorId: UUID [required]
 Auth: GUARDIAN, ADMIN

Dashboards
GET /v1/guardian-dashboard/{guardianUUID}
 Path Vars: guardianUUID: UUID
 Auth: Public
GET /v1/senior-dashboard/{seniorUUID}
 Path Vars: seniorUUID: UUID
 Auth: Public
GET /v1/monitor-dashboard/{seniorUUID}
 Path Vars: seniorUUID: UUID
 Auth: Public
GET /v1/monitor-dashboard/mapped-seniors
 Auth: Public

Device Registration (/v1/devices)
GET /v1/devices/network-types
 Auth: Bearer token
POST /v1/devices/register
 Body: DeviceRegistrationRequest &gt; deviceIdentifier: String, deviceName:
String, module: String, iccid: String, mac: String, model: String, deviceTypeId:

String, deviceType: String, firmwareVersion: String, networkType: String,
serverTimestamp: Double, imei: String
 Auth: Public
POST /v1/devices/{deviceUUID}/credentials/rotate
 Path Vars: deviceUUID: UUID
 Auth: Bearer token
POST /v1/devices/{deviceUUID}/revoke
 Path Vars: deviceUUID: UUID
 Auth: Bearer token
GET /v1/devices/details/by-imei/{imei}
 Path Vars: imei: String
 Auth: Public
POST /v1/devices/details/by-imei-list
 Body: List&lt;String&gt; (IMEI list)
 Auth: Public

Device Assignment (/v1/devices/assignments)
POST /v1/devices/assignments/assign
 Body: AssignDeviceRequest &gt; deviceUUID: UUID, seniorUUID: UUID
 Headers: X-Forwarded-For: IP [optional]
 Auth: Bearer token
POST /v1/devices/assignments/unassign/{assignmentId}
 Path Vars: assignmentId: UUID
 Body: UnassignDeviceRequest &gt; assignmentId: UUID, reason: String
 Headers: X-Forwarded-For: IP [optional]
 Auth: Bearer token
GET /v1/devices/assignments/get/{deviceId}
 Path Vars: deviceId: UUID
 Auth: Bearer token

GET /v1/devices/assignments/audit-logs/{assignmentId}
 Path Vars: assignmentId: UUID
 Auth: Bearer token (ADMIN)
GET /v1/devices/assignments/seniors/{seniorUUID}/devices
 Path Vars: seniorUUID: UUID
 Auth: Bearer token

Vitals (/v1/vitals)
POST /v1/vitals/sync
 Body: VitalSyncRequest &gt; deviceUUID: UUID, syncDays: Integer, syncFrom:
LocalDate, syncTo: LocalDate, vitalSummaries: List&lt;DailyVitalSummary&gt;
 Auth: Public
GET /v1/vitals/summary
 Query Params: deviceUUID: UUID [required], days: Integer [required]
 Auth: Public

Alarm Events (/v1/alarm)
POST /v1/alarm/save
 Body: List&lt;AlarmEvent&gt;
 Auth: Public
GET /v1/alarm/by-device/{deviceUUID}
 Path Vars: deviceUUID: UUID
 Auth: ADMIN, MONITOR, GUARDIAN
GET /v1/alarm/all
 Auth: Public
GET /v1/alarm/{id}
 Path Vars: id: Long
 Auth: Public
DELETE /v1/alarm/{id}

 Path Vars: id: Long
 Auth: Public

Device Events (/v1/device-events)
POST /v1/device-events/save-all
 Body: List&lt;SCUnifiedEventDTO&gt; &gt; deviceId: Integer, deviceName: String,
deviceSerialNumber: String, deviceTypeId: Integer, ident: String, peer: String,
channelId: Integer, protocolId: Integer, eventEnum: Integer, eventSeqnum:
Integer, timestamp: Long, serverTimestamp: BigDecimal, timestampKey:
BigDecimal, positionLatitude: BigDecimal, positionLongitude: BigDecimal,
positionAltitude: Integer, positionDirection: Integer, positionHdop: Double,
positionSatellites: Integer, positionSpeed: Integer, positionValid: Boolean,
gnssVehicleMileage: Integer, alarmPanicStart: Boolean, alarmPanicStop:
Boolean, fallAlarmStart: Boolean, fallAlarmStop: Boolean, startupAlarm:
Boolean, batteryLowAlarm: Boolean, noMotionAlarm: Boolean,
geofenceAlarm1: Boolean, geofenceAlarm2: Boolean, geofenceStatus1..4:
Boolean, tiltStatus: Boolean, vehicleState: String, vehicleStateBitmask:
Integer, bluetoothMacAddress: String, agpsPositionValid: Boolean,
batteryChargingStatus: Boolean, batteryFull: Boolean, batteryLevel: Integer,
bluetoothConnectedStatus: Boolean, deviceReboot: Boolean, fallAlarmStatus:
Boolean, gsmNetworkType: String, gsmSignalDbm: Integer, indoorStatus:
Boolean, locationSource(Beacon/Bluetooth/Gps/Gsm/Smart/Wifi): Boolean,
messageBufferedStatus: Boolean, movementStatus: Boolean,
operatingModeEnum: Integer, wifiHomeStatus: Boolean, wifiStatus: Boolean,
metadata: Map&lt;String, Object&gt;
 Auth: Public

Device Status (/v1/device-status)
POST /v1/device-status/save
 Body: List&lt;DeviceStatusEvent&gt;
 Auth: Public
GET /v1/device-status/by-device/{deviceUUID}
 Path Vars: deviceUUID: UUID
 Auth: ADMIN, MONITOR, GUARDIAN
GET /v1/device-status/all

 Auth: Public
GET /v1/device-status/{id}
 Path Vars: id: Long
 Auth: Public
DELETE /v1/device-status/{id}
 Path Vars: id: Long
 Auth: Public

Position Events (/v1/position)
POST /v1/position/save
 Body: List&lt;PositionEvent&gt;
 Auth: Public
GET /v1/position/by-device/{deviceUUID}
 Path Vars: deviceUUID: UUID
 Auth: ADMIN, MONITOR, GUARDIAN
GET /v1/position/all
 Auth: Public
GET /v1/position/{id}
 Path Vars: id: Long
 Auth: Public
DELETE /v1/position/{id}
 Path Vars: id: Long
 Auth: Public

CRM (/v1/api/crm)
GET /v1/api/crm/leads/{leadName}
 Path Vars: leadName: String
 Auth: ADMIN
POST /v1/api/crm/leads

 Body: FrappeLeadDTO &gt; name: String, owner: String, creation:
LocalDateTime, modified: LocalDateTime, modifiedBy: String, docstatus:
Integer, idx: Integer, customIsCaregiver: Integer, customIsSenior: Integer,
namingSeries: String, salutation: String, firstName: String, middleName:
String, lastName: String, leadName: String, jobTitle: String, gender: String,
customDateOfBirth: LocalDate, customConversationLanguage: String,
customLinkedLead: String, leadOwner: String, status: String, customer:
String, type: String, requestType: String, customPairedCustomer: String,
emailId: String, website: String, mobileNo: String, whatsappNo: String, phone:
String, phoneExt: String, companyName: String, noOfEmployees: String,
annualRevenue: BigDecimal, industry: String, marketSegment: String,
territory: String, fax: String, city: String, state: String, country: String,
customRelationshipToSenior: String, utmSource: String, utmMedium: String,
utmCampaign: String, utmContent: String, qualificationStatus: String,
qualifiedBy: String, qualifiedOn: LocalDateTime, company: String, language:
String, image: String, title: String, disabled: Integer, unsubscribed: Integer,
blogSubscriber: Integer, customMedicalConditions: String,
customLivingSituation: String, customMobilityLevel: String,
customContact1Name: String, customContact2NameOptional: String,
customContact1Phone: String, customContact2PhoneOptional: String,
customDoctorsName: String, customDoctorsPhone: String, doctype: String,
notes: List&lt;Object&gt;, errorMessage: String
 Auth: ADMIN

Admin (/v1/admin)
POST /v1/admin/backfill-usernames
 Auth: ADMIN
POST /v1/admin/users
 Body: AdminCreateUserRequest &gt; role: UserRole, firstName: String,
lastName: String, phoneNumber: Long, email: String, password: String,
guardianId: UUID, height: Double, weight: Double, gender: String,
dateOfBirth: Long
 Auth: ADMIN
PUT /v1/admin/users/{userId}
 Path Vars: userId: UUID
 Body: AdminUpdateUserRequest &gt; firstName: String, lastName: String,
userName: String, phoneNumber: Long, primaryEmail: String,

secondaryEmail: String, profileImageUrl: String, role: UserRole, status:
UserStatus, active: Boolean
 Auth: ADMIN
PATCH /v1/admin/users/{userId}/deactivate
 Path Vars: userId: UUID
 Auth: ADMIN
PATCH /v1/admin/users/{userId}/reactivate
 Path Vars: userId: UUID
 Auth: ADMIN
DELETE /v1/admin/users/{userId}
 Path Vars: userId: UUID
 Auth: ADMIN
GET /v1/admin/users
 Query Params: active: Boolean [optional]
 Auth: ADMIN
GET /v1/admin/users/available-for-senior/{seniorId}
 Path Vars: seniorId: UUID
 Query Params: role: UserRole [optional]
 Auth: ADMIN
GET /v1/admin/seniors
 Auth: ADMIN
GET /v1/admin/seniors/{mobile}
 Path Vars: mobile: Long
 Auth: ADMIN
GET /v1/admin/devices
 Auth: ADMIN
GET /v1/admin/assignments
 Auth: ADMIN
GET /v1/admin/mappings

 Auth: ADMIN
POST /v1/admin/mappings/admin-map
 Body: AdminMapRequest &gt; guardianId: UUID, seniorId: UUID
 Auth: ADMIN
GET /v1/admin/counts
 Auth: ADMIN
GET /v1/admin/alarm-events
 Auth: ADMIN
GET /v1/admin/monitor-mappings
 Auth: ADMIN

Health (/v1/actuator/health)
GET /v1/actuator/health
 Auth: Public
GET /v1/actuator/health/ping
 Auth: Public
GET /v1/actuator/health/uptime
 Auth: Public
GET /v1/actuator/health/system
 Auth: Public
GET /v1/actuator/health/db
 Auth: Public
GET /v1/actuator/health/ready
 Auth: Public
GET /v1/actuator/health/internal/details
 Auth: localhost only
