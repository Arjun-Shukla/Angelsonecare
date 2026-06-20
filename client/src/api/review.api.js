import api from './axios.js';

export const listReviews = async () => {
  const { data } = await api.get('/reviews');
  return data;
};

export const createReview = async (payload) => {
  const { data } = await api.post('/reviews', payload);
  return data;
};

export const listMyReviews = async () => {
  const { data } = await api.get('/reviews/me');
  return data;
};

// Admin: all reviews regardless of approval status
export const listAllReviews = async () => {
  const { data } = await api.get('/reviews/admin/all');
  return data;
};

export const approveReview = async (id) => {
  const { data } = await api.patch(`/reviews/${id}/approve`);
  return data;
};

export const toggleFeatured = async (id) => {
  const { data } = await api.patch(`/reviews/${id}/featured`);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};
