import api from './axios';

export const authApi = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  verifyOtp: async (payload) => {
    const response = await api.post('/auth/verify-otp', payload);
    return response.data;
  },

  resendOtp: async (payload) => {
    const response = await api.post('/auth/resend-otp', payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (payload) => {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  },

  resetPassword: async (payload) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
};

