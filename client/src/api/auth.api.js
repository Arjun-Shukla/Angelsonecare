import api from './axios.js';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { success, message, data: { accessToken, user } }
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data; // { success, data: { user } }
};

export const refresh = async () => {
  const { data } = await api.post('/auth/refresh');
  return data; // { success, data: { accessToken } }
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const updateMe = async (payload) => {
  const { data } = await api.patch('/auth/me', payload);
  return data; // { success, data: { user } }
};

export const googleLoginUrl = () =>
  `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
