import api from './axios.js';

export const getDashboard = async () => {
  const { data } = await api.get('/analytics/dashboard');
  return data;
};

export const getBookingTrends = async (months = 6) => {
  const { data } = await api.get('/analytics/bookings', { params: { months } });
  return data;
};

export const getRevenue = async (months = 6) => {
  const { data } = await api.get('/analytics/revenue', { params: { months } });
  return data;
};
