import api from './axios.js';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

export const saveSettings = async (payload) => {
  const { data } = await api.patch('/settings', payload);
  return data;
};
