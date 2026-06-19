/**
 * Booking service — core workflow business logic.
 *
 * Responsibilities:
 *   - createBooking(clientId, payload)        // -> PENDING, trigger notifications
 *   - listForRole(user, filters)              // role-scoped query
 *   - setStatus(bookingId, status, actor)     // accept/reject/progress transitions
 *   - assignLeader(bookingId, leaderId)
 *   - guards: enforce valid status transitions
 *
 * Collaborators: models/Booking, otp.service, email.service, sockets/emitters.
 * TODO (implementation).
 */

export const createBooking = async (clientId, payload) => {};
export const listForRole = async (user, filters) => {};
export const setStatus = async (bookingId, status, actor) => {};
export const assignLeader = async (bookingId, leaderId) => {};
