import api from './axios.js';

// Active leaders only (for assignment dropdowns)
export const getLeaders = async () => {
  const { data } = await api.get('/users', { params: { role: 'LEADER', isActive: true } });
  return data;
};

// All leaders including inactive (for admin management)
export const getAllLeaders = async () => {
  const { data } = await api.get('/users', { params: { role: 'LEADER' } });
  return data;
};

export const getUser = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createLeader = async (payload) => {
  const { data } = await api.post('/users/leaders', payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
};

export const deactivateUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
