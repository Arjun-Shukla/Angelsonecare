/**
 * Payment controller — Razorpay integration.
 *
 * Endpoints:
 *   createOrder   -> create a Razorpay order for a booking
 *   verifyPayment -> verify signature server-side, mark booking PAID
 *   getPayment    -> fetch payment record by bookingId
 *
 * Delegates to `payment.service.js`.
 * TODO (implementation).
 */

export const createOrder = async (req, res) => {};
export const verifyPayment = async (req, res) => {};
export const getPayment = async (req, res) => {};
