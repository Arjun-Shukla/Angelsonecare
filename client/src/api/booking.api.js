import api from './axios.js';

export const createBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload);
  return data; // { success, data: { booking } }
};

export const listBookings = async (params = {}) => {
  const { data } = await api.get('/bookings', { params });
  return data; // { success, data: { bookings }, meta: { total, page, limit } }
};

export const getBooking = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data; // { success, data: { booking } }
};

export const acceptBooking = async (id) => {
  const { data } = await api.patch(`/bookings/${id}/accept`);
  return data;
};

export const rejectBooking = async (id, reason) => {
  const { data } = await api.patch(`/bookings/${id}/reject`, { reason });
  return data;
};

export const assignLeader = async (id, leaderId) => {
  const { data } = await api.patch(`/bookings/${id}/assign`, { leaderId });
  return data;
};

export const updateProgress = async (id, note = '') => {
  const { data } = await api.patch(`/bookings/${id}/progress`, { note });
  return data;
};

export const generateOtp = async (id) => {
  const { data } = await api.post(`/bookings/${id}/otp/generate`);
  return data;
};

export const verifyOtp = async (id, otp) => {
  const { data } = await api.post(`/bookings/${id}/otp/verify`, { otp });
  return data;
};
