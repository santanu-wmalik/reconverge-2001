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
  getByEmail: (email) => request(`/users?email=${encodeURIComponent(email)}`),
  create: (data) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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
