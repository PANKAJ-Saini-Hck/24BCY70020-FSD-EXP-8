import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  assignRole: (data) => api.post('/admin/assign-role', data),
  toggleUserStatus: (data) => api.post('/admin/toggle-status', data),
  getAuditLog: () => api.get('/admin/audit-log'),
};

export const dashboardAPI = {
  getUserDashboard: () => api.get('/dashboard/user'),
  getManagerDashboard: () => api.get('/dashboard/manager'),
  getAdminDashboard: () => api.get('/dashboard/admin'),
};

export default api;
