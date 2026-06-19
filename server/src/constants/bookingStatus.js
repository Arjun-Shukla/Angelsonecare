/**
 * Booking lifecycle status constants.
 *
 * Flow: PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED
 * Terminal alternatives: REJECTED (by admin), CANCELLED (by client).
 */

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const BOOKING_STATUS_VALUES = Object.values(BOOKING_STATUS);

/**
 * Payment status for a booking.
 */
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);
