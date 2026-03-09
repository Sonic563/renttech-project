const API_URL = 'http://localhost:8080/api';
// Általános fetch függvény
export const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API hiba:', error);
    throw error;
  }
};

// Eszközök API
export const assetAPI = {
  getAll: (category = null, search = null) => {
    let url = '/assets';
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest(url);
  },
  getById: (id) => apiRequest(`/assets/${id}`),
  create: (asset, token) => apiRequest('/assets', 'POST', asset, token),
  update: (id, asset, token) => apiRequest(`/assets/${id}`, 'PUT', asset, token),
  delete: (id, token) => apiRequest(`/assets/${id}`, 'DELETE', null, token),
  getFeatured: () => apiRequest('/assets/featured')
};

// Auth API
export const authAPI = {
   login: (email, password) => apiRequest('/auth/login', 'POST', { email, password }),
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  getCurrentUser: (token) => apiRequest('/auth/me', 'GET', null, token),
  refreshToken: (token) => apiRequest('/auth/refresh', 'POST', { token }),
  logout: (token) => apiRequest('/auth/logout', 'POST', null, token)
};

// Booking API
export const bookingAPI = {
  getAll: (token) => apiRequest('/bookings', 'GET', null, token),
  getUserBookings: (userId, token) => apiRequest(`/bookings/user/${userId}`, 'GET', null, token),
  getById: (id, token) => apiRequest(`/bookings/${id}`, 'GET', null, token),
  create: (bookingData, token) => apiRequest('/bookings', 'POST', bookingData, token),
  update: (id, bookingData, token) => apiRequest(`/bookings/${id}`, 'PUT', bookingData, token),
  updateStatus: (id, status, token) => apiRequest(`/bookings/${id}/status`, 'PATCH', { status }, token),
  delete: (id, token) => apiRequest(`/bookings/${id}`, 'DELETE', null, token),
  checkAvailability: (deviceId, startDate, endDate, token) => 
    apiRequest(`/bookings/check-availability/${deviceId}`, 'POST', { startDate, endDate }, token)
};

// User API
export const userAPI = {
  getAll: (token) => apiRequest('/users', 'GET', null, token),
  getById: (id, token) => apiRequest(`/users/${id}`, 'GET', null, token),
  update: (id, userData, token) => apiRequest(`/users/${id}`, 'PUT', userData, token),
  updateRole: (id, roleData, token) => apiRequest(`/users/${id}/role`, 'PATCH', roleData, token),
  delete: (id, token) => apiRequest(`/users/${id}`, 'DELETE', null, token),
  getProfile: (token) => apiRequest('/users/profile', 'GET', null, token),
  updateProfile: (profileData, token) => apiRequest('/users/profile', 'PUT', profileData, token)
};