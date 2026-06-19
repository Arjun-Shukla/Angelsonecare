/**
 * OTP service — completion verification.
 *
 * Responsibilities:
 *   - generateForBooking(bookingId)  // create + hash + store + send OTP
 *   - verifyForBooking(bookingId, otp) // compare, check expiry, mark COMPLETED
 *
 * Collaborators: utils/otp, email.service, models/Booking.
 * TODO (implementation).
 */

export const generateForBooking = async (bookingId) => {};
export const verifyForBooking = async (bookingId, otp) => {};
