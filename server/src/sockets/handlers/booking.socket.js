/**
 * Booking socket handlers.
 *
 * Purpose: Register per-socket listeners related to bookings, e.g. clients
 * joining a `booking:{id}` room to receive live status updates.
 *
 * TODO (implementation):
 *  - socket.on('booking:subscribe', ({ bookingId }) => socket.join(ROOMS.booking(bookingId)))
 */

export const registerBookingHandlers = (io, socket) => {};
