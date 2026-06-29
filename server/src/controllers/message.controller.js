import ContactMessage from '../models/ContactMessage.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { getIo } from '../sockets/index.js';
import { SOCKET_EVENTS, ROOMS } from '../constants/events.js';

export const createMessage = async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name?.trim())    throw new ApiError(400, 'Name is required');
  if (!phone?.trim())   throw new ApiError(400, 'Phone number is required');
  if (!message?.trim()) throw new ApiError(400, 'Message is required');

  const doc = await ContactMessage.create({
    name:    name.trim(),
    email:   email?.trim() || '',
    phone:   phone.trim(),
    service: service?.trim() || '',
    message: message.trim(),
  });

  const io = getIo();
  if (io) {
    io.to(ROOMS.roleAdmin).to(ROOMS.roleLeader).emit(SOCKET_EVENTS.MESSAGE_NEW, doc);
  }

  sendSuccess(res, { status: 201, data: { message: doc }, message: 'Message sent successfully' });
};

export const listMessages = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  sendSuccess(res, { data: { messages } });
};

export const markRead = async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!msg) throw new ApiError(404, 'Message not found');
  sendSuccess(res, { data: { message: msg } });
};
