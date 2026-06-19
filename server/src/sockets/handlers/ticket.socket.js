/**
 * Ticket socket handlers.
 *
 * Purpose: Register per-socket listeners for tickets, e.g. joining a
 * `ticket:{id}` room for live message updates.
 *
 * TODO (implementation):
 *  - socket.on('ticket:subscribe', ({ ticketId }) => socket.join(ROOMS.ticket(ticketId)))
 */

export const registerTicketHandlers = (io, socket) => {};
