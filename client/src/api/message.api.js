import api from './axios.js';

export const sendContactMessage = (data) => api.post('/messages', data);
export const getMessages        = ()     => api.get('/messages');
export const markMessageRead    = (id)   => api.patch(`/messages/${id}/read`);
