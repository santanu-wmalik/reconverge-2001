const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

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
