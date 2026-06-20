import { getIo } from './index.js';
import { SOCKET_EVENTS, ROOMS } from '../constants/events.js';

// Emit to all participants of a booking: admin room + assigned leader + client
const emitToBookingParties = (event, booking) => {
  const io = getIo();
  if (!io) return;
  io.to(ROOMS.roleAdmin).emit(event, booking);
  if (booking.leader?._id) io.to(ROOMS.user(booking.leader._id.toString())).emit(event, booking);
  if (booking.client?._id) io.to(ROOMS.user(booking.client._id.toString())).emit(event, booking);
};

// New booking submitted by a client → admin and leader (if assigned) see it instantly
export const emitBookingCreated = (booking) => {
  const io = getIo();
  if (!io) return;
  io.to(ROOMS.roleAdmin).emit(SOCKET_EVENTS.BOOKING_CREATED, booking);
  if (booking.leader?._id) {
    io.to(ROOMS.user(booking.leader._id.toString())).emit(SOCKET_EVENTS.BOOKING_CREATED, booking);
  }
};

// Any status change (accept, reject, assign, progress, OTP, complete)
export const emitBookingStatusUpdated = (booking) => {
  emitToBookingParties(SOCKET_EVENTS.BOOKING_STATUS_UPDATED, booking);
};

export const emitTicketCreated    = (ticket)          => {};
export const emitTicketMessage    = (ticket, message) => {};
export const emitReviewNew        = (review)          => {};
export const emitDashboardUpdate  = (payload)         => {};
export const emitNotification     = (userId, notif)   => {
  const io = getIo();
  if (!io) return;
  io.to(ROOMS.user(userId)).emit(SOCKET_EVENTS.NOTIFICATION_NEW, notif);
};
