import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const patientApi = {
  getAll: async () => {
    const response = await api.get('/patients');
    return response.data;
  },
  search: async (query) => {
    const response = await api.get('/patients/search', {
      params: { q: query },
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post('/patients', payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await api.put(`/patients/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export default api;
