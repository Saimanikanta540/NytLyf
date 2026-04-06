import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (email, password) => client.post('/auth/login', { email, password });

// Admin Stats
export const getAdminStats = () => client.get('/users/admin/stats');

// Users Management
export const getAllUsers = () => client.get('/users/admin/all');

// Events Management
export const getAllEvents = () => client.get('/events');

// Categories
export const getCategories = () => client.get('/categories');

export default client;
