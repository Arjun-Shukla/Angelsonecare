/**
 * Client-side shared constants — roles, statuses, route paths, socket events.
 * Keep enums in sync with the server constants.
 */

export const ROLES = {
  CLIENT: 'CLIENT',
  LEADER: 'LEADER',
  ADMIN: 'ADMIN',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  OAUTH_CALLBACK: '/oauth/callback',
  CLIENT: '/app',
  LEADER: '/leader',
  ADMIN: '/admin',
};

export const SOCKET_EVENTS = {
  BOOKING_CREATED: 'booking:created',
  BOOKING_STATUS_UPDATED: 'booking:status_updated',
  TICKET_CREATED: 'ticket:created',
  TICKET_MESSAGE: 'ticket:message',
  REVIEW_NEW: 'review:new',
  DASHBOARD_UPDATE: 'dashboard:update',
  NOTIFICATION_NEW: 'notification:new',
};
