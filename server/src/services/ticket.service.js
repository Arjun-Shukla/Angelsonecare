/**
 * Ticket service — support ticket business logic.
 *
 * Responsibilities:
 *   - createTicket(userId, payload)
 *   - listForRole(user, filters)
 *   - addMessage(ticketId, senderId, text)
 *   - setStatus(ticketId, status)
 *
 * Collaborators: models/Ticket, email.service, sockets/emitters.
 * TODO (implementation).
 */

export const createTicket = async (userId, payload) => {};
export const listForRole = async (user, filters) => {};
export const addMessage = async (ticketId, senderId, text) => {};
export const setStatus = async (ticketId, status) => {};
