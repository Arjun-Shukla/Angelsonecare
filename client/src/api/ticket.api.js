import api from './axios.js';

export const createTicket = async (payload) => {
  const { data } = await api.post('/tickets', payload);
  return data;
};

export const listTickets = async () => {
  const { data } = await api.get('/tickets');
  return data;
};

export const getTicket = async (id) => {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
};

export const addMessage = async (id, text) => {
  const { data } = await api.post(`/tickets/${id}/messages`, { text });
  return data;
};

export const updateStatus = async (id, status) => {
  const { data } = await api.patch(`/tickets/${id}/status`, { status });
  return data;
};
