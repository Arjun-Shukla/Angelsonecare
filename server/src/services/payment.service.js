/**
 * Payment service — Razorpay logic.
 *
 * Responsibilities:
 *   - createOrder(bookingId)               // razorpay.orders.create + persist
 *   - verifySignature({ orderId, paymentId, signature }) // HMAC verify
 *   - markPaid(bookingId, payment)         // update Booking.paymentStatus
 *
 * Collaborators: config/razorpay, models/Payment, models/Booking.
 * TODO (implementation).
 */

export const createOrder = async (bookingId) => {};
export const verifySignature = (params) => {};
export const markPaid = async (bookingId, payment) => {};
