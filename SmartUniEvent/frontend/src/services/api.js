import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for JWT
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  validateAcademicEmail: (email) => api.post('/auth/validate-email', { email }),
};

// Events API
export const eventsAPI = {
  getAll: (filters) => api.get('/events', { params: filters }),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
};

// Queue API
export const queueAPI = {
  join: (eventId) => api.post(`/queue/join/${eventId}`),
  getStatus: (eventId) => api.get(`/queue/status/${eventId}`),
  leave: (eventId) => api.post(`/queue/leave/${eventId}`),
};

// Tickets API
export const ticketsAPI = {
  purchase: (eventId, paymentData) => api.post(`/tickets/purchase/${eventId}`, paymentData),
  getById: (ticketId) => api.get(`/tickets/${ticketId}`),
  getTicket: (ticketId) => api.get(`/tickets/${ticketId}`),
  getMyTickets: () => api.get('/tickets/my-tickets'),
  getUserTickets: () => api.get('/tickets/my-tickets'),
  validate: (ticketId, qrData) => api.post(`/tickets/validate/${ticketId}`, { qrData }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (filters) => api.get('/admin/users', { params: filters }),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  scanTicket: (qrData) => api.post('/admin/scan-ticket', { qrData }),
};

export default api;
