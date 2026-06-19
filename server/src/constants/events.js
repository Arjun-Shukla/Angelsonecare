/**
 * Socket.IO event name constants (shared contract between server emitters and
 * client listeners). Keep these in sync with the client `constants` definitions.
 */

export const SOCKET_EVENTS = {
  // Booking
  BOOKING_CREATED: 'booking:created',
  BOOKING_STATUS_UPDATED: 'booking:status_updated',

  // Tickets
  TICKET_CREATED: 'ticket:created',
  TICKET_MESSAGE: 'ticket:message',
  TICKET_STATUS_UPDATED: 'ticket:status_updated',

  // Reviews
  REVIEW_NEW: 'review:new',

  // Admin dashboard
  DASHBOARD_UPDATE: 'dashboard:update',

  // Notifications
  NOTIFICATION_NEW: 'notification:new',
};

/**
 * Room name builders — centralized so server and emitters agree on naming.
 */
export const ROOMS = {
  user: (userId) => `user:${userId}`,
  roleAdmin: 'role:admin',
  roleLeader: 'role:leader',
  booking: (bookingId) => `booking:${bookingId}`,
  ticket: (ticketId) => `ticket:${ticketId}`,
};
