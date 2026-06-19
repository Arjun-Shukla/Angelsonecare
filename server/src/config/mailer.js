/**
 * Nodemailer transporter (Titan Email SMTP).
 *
 * Purpose: Configure a reusable SMTP transporter for sending transactional
 * emails (booking notifications, OTP, ticket updates). Consumed by
 * `email.service.js`.
 *
 * TODO (implementation):
 *  - export const transporter = nodemailer.createTransport({ host, port, auth })
 *  - Optionally verify() the connection on startup
 */

export const transporter = null;
