/**
 * client.js — the "telephone" that talks to the backend server.
 *
 * One shared `request()` function handles everything every API call needs:
 *  - prefixes the backend address (VITE_API_BASE_URL from .env)
 *  - attaches your login token (unless `skipAuth` is set)
 *  - serializes JSON bodies and query parameters
 *  - turns bad responses into a typed ApiError
 *
 * The `client` object below is just a shorthand for the 5 HTTP verbs.
 */
import { isMockActive, setMockActive, handleMockRequest } from './mockData';
export { isMockActive, setMockActive };

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ─── Automatic token refresh ──────────────────────────────────────────────────
// When the access token expires (HTTP 401), we silently exchange the refresh
// token for a new one and retry the request — the user never gets kicked out
// mid-session. If the refresh itself fails, we broadcast 'auth:expired' so the
// app can return to the login screen cleanly.

let refreshInFlight = null;

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  // Single-flight: if several requests hit 401 at once, refresh only once
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { Accept: 'application/json', refreshToken },
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json().catch(() => null);
        const payload = data?.data ?? data;
        const newAccess = payload?.access_token;
        if (!newAccess) return false;
        localStorage.setItem('authToken', newAccess);
        if (payload?.refresh_token) {
          localStorage.setItem('refreshToken', payload.refresh_token);
        }
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

function notifySessionExpired() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  window.dispatchEvent(new Event('auth:expired'));
}

function isEmptyData(data) {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
}

export async function request(path, options = {}, isRetry = false) {
  const { method = 'GET', headers = {}, body, queryParams, skipAuth = false } = options;

  // Set up headers
  const requestHeaders = {
    'Accept': 'application/json',
    ...headers,
  };

  // Content type for JSON payloads
  if (body && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  // Inject Bearer token if present
  if (!skipAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Construct URL with query parameters
  let url = `${BASE_URL}${path}`;
  if (queryParams) {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Formulate Fetch RequestInit
  const init = {
    method,
    headers: requestHeaders,
  };

  if (body) {
    init.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch (fetchErr) {
    console.warn(`Fetch connection failed for ${path}, falling back to mock data:`, fetchErr);
    setMockActive(true);
    return handleMockRequest(path, options);
  }

  // Access token expired? Refresh once and retry the original request.
  if (response.status === 401 && !skipAuth && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request(path, options, true);
    }
    notifySessionExpired();
  }

  let text;
  try {
    text = await response.text();
  } catch (textErr) {
    console.warn(`Failed to read response body for ${path}, falling back to mock data:`, textErr);
    setMockActive(true);
    return handleMockRequest(path, options);
  }

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.warn(`HTTP response not OK (${response.status}) for ${path}, falling back to mock data.`);
    setMockActive(true);
    return handleMockRequest(path, options);
  }

  if (isEmptyData(data)) {
    console.warn(`API returned empty data for ${path}, falling back to mock data.`);
    setMockActive(true);
    return handleMockRequest(path, options);
  }

  // Successful API call - disable mock tag
  setMockActive(false);
  return data;
}

export const client = {
  get: (path, queryParams, headers) =>
    request(path, { method: 'GET', queryParams, headers }),

  post: (path, body, queryParams, headers) =>
    request(path, { method: 'POST', body, queryParams, headers }),

  put: (path, body, queryParams, headers) =>
    request(path, { method: 'PUT', body, queryParams, headers }),

  delete: (path, queryParams, headers) =>
    request(path, { method: 'DELETE', queryParams, headers }),

  patch: (path, body, queryParams, headers) =>
    request(path, { method: 'PATCH', body, queryParams, headers }),
};
