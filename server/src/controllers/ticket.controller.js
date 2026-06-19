/**
 * Ticket controller — support tickets.
 *
 * Endpoints:
 *   createTicket  -> user raises a ticket
 *   listTickets   -> role-scoped list (user: own, leader/admin: assigned/all)
 *   getTicket     -> single ticket with thread
 *   addMessage    -> append a reply (emits ticket:message)
 *   updateStatus  -> change ticket status
 *
 * Delegates to `ticket.service.js`; emits Socket.IO events.
 * TODO (implementation).
 */

export const createTicket = async (req, res) => {};
export const listTickets = async (req, res) => {};
export const getTicket = async (req, res) => {};
export const addMessage = async (req, res) => {};
export const updateStatus = async (req, res) => {};
