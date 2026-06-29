import api from './axios.js';

export const sendContactMessage = async (data)  => { const { data: r } = await api.post('/messages', data); return r; };
export const getMessages        = async ()       => { const { data } = await api.get('/messages'); return data; };
export const markMessageRead    = async (id)     => { const { data } = await api.patch(`/messages/${id}/read`); return data; };
