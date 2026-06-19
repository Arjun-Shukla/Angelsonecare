/**
 * Email service — transactional email orchestration.
 *
 * Responsibilities (templated emails via config/mailer transporter):
 *   - sendBookingCreated(booking)   // -> admin, leader, client
 *   - sendBookingStatus(booking)    // status change notification
 *   - sendOtp(booking, otp)         // completion OTP
 *   - sendTicketUpdate(ticket)
 *
 * Collaborators: config/mailer.
 * TODO (implementation): build templates + send via transporter.
 */

export const sendBookingCreated = async (booking) => {};
export const sendBookingStatus = async (booking) => {};
export const sendOtp = async (booking, otp) => {};
export const sendTicketUpdate = async (ticket) => {};
