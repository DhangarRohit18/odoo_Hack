import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const expenseService = {
  submitExpense: async (formData: FormData) => {
    const response = await api.post('/expenses/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getExpenses: async () => {
    const response = await api.get('/expenses/history');
    return response.data;
  },
  getExpenseDetails: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  getCountries: async () => {
    const response = await api.get('/countries');
    return response.data;
  },
};

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getRules: async () => {
    const response = await api.get('/admin/rules');
    return response.data;
  },
  updateRule: async (id: string, data: any) => {
    const response = await api.put(`/admin/rules/${id}`, data);
    return response.data;
  },
};

export default api;
