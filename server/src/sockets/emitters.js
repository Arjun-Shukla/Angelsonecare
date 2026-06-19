/**
 * Server-side socket emit helpers.
 *
 * Purpose: Decouple business logic (services) from the socket layer. Services
 * call these helpers; they look up `io` via getIo() and emit to the right rooms
 * using SOCKET_EVENTS / ROOMS constants.
 *
 * TODO (implementation): fill bodies using getIo().to(room).emit(event, payload).
 */

// import { getIo } from './index.js';
// import { SOCKET_EVENTS, ROOMS } from '../constants/events.js';

export const emitBookingCreated = (booking) => {};
export const emitBookingStatusUpdated = (booking) => {};
export const emitTicketCreated = (ticket) => {};
export const emitTicketMessage = (ticket, message) => {};
export const emitReviewNew = (review) => {};
export const emitDashboardUpdate = (payload) => {};
export const emitNotification = (userId, notification) => {};
