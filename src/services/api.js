const BASE_URL = '/api';

// Auth token plumbing. AuthContext owns the lifecycle (login sets it, logout
// clears it). Every request below pulls the current token from localStorage
// so a refresh in another tab still picks it up. Kept as a separate getter
// (instead of a closure) so tests / scripts can override it without
// reimporting the module.
const TOKEN_STORAGE_KEY = 'alumni-token';
export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}
export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore — Safari private mode etc.
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getAuthToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    // Surface 401/403 distinctly so the UI can prompt re-login vs deny.
    const err = new Error(`API Error: ${response.status} ${response.statusText}`);
    err.status = response.status;
    throw err;
  }
  return response.json();
}

// --- Auth ---
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  // `data` is the full registration payload (alumni profile fields + password).
  // The server creates both rows atomically and returns { user, token }.
  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// --- Alumni ---
export const alumniApi = {
  getAll: () => request('/alumni'),
  getById: (id) => request(`/alumni/${id}`),
  getByEmail: (email) => request(`/alumni?email=${encodeURIComponent(email)}`),
  create: (data) =>
    request('/alumni', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/alumni/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// --- RSVPs ---
export const rsvpApi = {
  getAll: () => request('/rsvps'),
  create: (data) =>
    request('/rsvps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- Orders ---
export const orderApi = {
  getAll: () => request('/orders'),
  getByUserId: (userId) => request(`/orders?userId=${encodeURIComponent(userId)}`),
  create: (data) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// --- Users (auth) ---
export const userApi = {
  getAll: () => request('/users'),
  getByEmail: (email) => request(`/users?email=${encodeURIComponent(email)}`),
  create: (data) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// --- Rooming (hotel room allotment) ---
export const roomingApi = {
  getAll: () => request('/rooming'),
  getByAlumniId: (alumniId) => request(`/rooming?alumniId=${encodeURIComponent(alumniId)}`),
  create: (data) =>
    request('/rooming', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/rooming/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// --- Announcements ---
export const announcementApi = {
  getAll: () => request('/announcements'),
};

// --- Custom Groups (user-created) ---
export const customGroupApi = {
  getAll: () => request('/customGroups'),
  getByCreator: (creatorId) => request(`/customGroups?creatorId=${encodeURIComponent(creatorId)}`),
  create: (data) =>
    request('/customGroups', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/customGroups/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/customGroups/${id}`, { method: 'DELETE' }),
};

// --- Group Memberships (who has joined which group) ---
export const groupMembershipApi = {
  getAll: () => request('/groupMemberships'),
  getByGroup: (groupId) => request(`/groupMemberships?groupId=${encodeURIComponent(groupId)}`),
  getByAlumni: (alumniId) => request(`/groupMemberships?alumniId=${encodeURIComponent(alumniId)}`),
  create: (data) =>
    request('/groupMemberships', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/groupMemberships/${id}`, { method: 'DELETE' }),
};

// --- Group Announcements ---
export const groupAnnouncementApi = {
  getByGroup: (groupId) => request(`/groupAnnouncements?groupId=${encodeURIComponent(groupId)}&_sort=createdAt&_order=desc`),
  create: (data) =>
    request('/groupAnnouncements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/groupAnnouncements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/groupAnnouncements/${id}`, { method: 'DELETE' }),
};

// --- Group Polls ---
export const groupPollApi = {
  getByGroup: (groupId) => request(`/groupPolls?groupId=${encodeURIComponent(groupId)}&_sort=createdAt&_order=desc`),
  create: (data) =>
    request('/groupPolls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/groupPolls/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/groupPolls/${id}`, { method: 'DELETE' }),
};

// --- Travel Items (free-form per-user plan) ---
export const travelItemApi = {
  getAll: () => request('/travelItems'),
  getByAlumniId: (alumniId) => request(`/travelItems?alumniId=${encodeURIComponent(alumniId)}`),
  create: (data) =>
    request('/travelItems', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/travelItems/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  remove: (id) =>
    request(`/travelItems/${id}`, { method: 'DELETE' }),
};

// --- Photos (alumni-uploaded gallery) ---
export const photoApi = {
  getAll: () => request('/photos?_sort=createdAt&_order=desc'),
  create: (data) =>
    request('/photos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  remove: (id) => request(`/photos/${id}`, { method: 'DELETE' }),
};

// --- Itineraries ---
export const itineraryApi = {
  getAll: () => request('/itineraries'),
  getByUserId: (userId) => request(`/itineraries?userId=${encodeURIComponent(userId)}`),
  create: (data) =>
    request('/itineraries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/itineraries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
