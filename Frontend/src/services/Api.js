const API_URL = 'http://localhost:8080/api';

export const apiRequest = async (
  endpoint,
  method = 'GET',
  data = null,
  token = null,
) => {
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
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const errJson = await response.json().catch(() => null);
        const msg =
          errJson?.error ||
          errJson?.message ||
          (errJson ? JSON.stringify(errJson) : '') ||
          `HTTP error! status: ${response.status}`;
        throw new Error(msg);
      }

      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API hiba:', error);
    throw error;
  }
};

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
  getFeatured: () => apiRequest('/assets/featured'),
};

export const authAPI = {
  login: (email, password) =>
    apiRequest('/auth/login', 'POST', { email, password }),
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  getCurrentUser: (token) => apiRequest('/auth/me', 'GET', null, token),
  refreshToken: (token) => apiRequest('/auth/refresh', 'POST', { token }),
  logout: (token) => apiRequest('/auth/logout', 'POST', null, token),
};


export const bookingAPI = {
  getAll: (token) => apiRequest('/bookings', 'GET', null, token),
  getUserBookings: (userId, token) =>
    apiRequest(`/bookings/user/${userId}`, 'GET', null, token),


getDeviceBookings: (deviceId, token) =>
  apiRequest(`/bookings/device/${deviceId}`, 'GET', null, token),

  create: (bookingData, token) =>
    apiRequest('/bookings', 'POST', bookingData, token),

  
  updateStatus: (id, status, token) =>
    apiRequest(`/bookings/${id}/status`, 'PUT', { status }, token),


  cancel: (id, token) => apiRequest(`/bookings/cancel/${id}`, 'PUT', null, token),

  
  checkAvailability: (deviceId, startDate, endDate, token) =>
    apiRequest(
      `/bookings/availability/${deviceId}?start=${startDate}&end=${endDate}`,
      'GET',
      null,
      token,
    ),
};

export const userAPI = {
  getAll: (token) => apiRequest('/users', 'GET', null, token),
  getById: (id, token) => apiRequest(`/users/${id}`, 'GET', null, token),

  updateProfile: (id, profileData, token) =>
    apiRequest(`/users/profile/${id}`, 'PUT', profileData, token),

  changePassword: (id, passwordData, token) =>
    apiRequest(`/users/password/${id}`, 'PUT', passwordData, token),

  delete: (id, token) => apiRequest(`/users/${id}`, 'DELETE', null, token),
};