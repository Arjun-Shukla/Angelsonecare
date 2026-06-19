import { transporter } from '../config/mailer.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { welcomeTemplate } from '../emails/templates/welcome.js';
import { bookingCreatedTemplate } from '../emails/templates/bookingCreated.js';
import { ticketRaisedTemplate } from '../emails/templates/ticketRaised.js';
import { serviceCompletedTemplate } from '../emails/templates/serviceCompleted.js';

const CLIENT_URL = env.clientUrl;

// ─── Core send helper ─────────────────────────────────────────────────────────
// Fire-and-forget: logs success/failure but never throws.
// Callers must not await this if they don't want to delay the HTTP response.

const sendEmail = async ({ to, subject, html, text }) => {
  if (!env.smtp.user || !env.smtp.pass) {
    logger.warn(`[email] SMTP not configured — skipping: "${subject}" → ${to}`);
    return;
  }
  if (!to) {
    logger.warn(`[email] No recipient address — skipping: "${subject}"`);
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      html,
      text,
    });
    logger.info(`[email] Sent "${subject}" → ${to} (${info.messageId})`);
  } catch (err) {
    logger.error(`[email] Failed "${subject}" → ${to}: ${err.message}`);
  }
};

// ─── 1. Welcome Email ─────────────────────────────────────────────────────────
// Trigger: after successful Google OAuth signup (call from auth.service.findOrCreateGoogleUser
//          when a NEW user is created, or from the registration controller).
//
// Usage:
//   import { sendWelcomeEmail } from '../services/email.service.js';
//   await sendWelcomeEmail(user);

export const sendWelcomeEmail = async (user) => {
  const { subject, html, text } = welcomeTemplate({
    name: user.name,
    clientUrl: CLIENT_URL,
  });
  await sendEmail({ to: user.email, subject, html, text });
};

// ─── 2. New Booking Notification ─────────────────────────────────────────────
// Trigger: after a client successfully creates a booking (booking.controller).
//
// Usage:
//   import { sendBookingCreatedNotification } from '../services/email.service.js';
//   await sendBookingCreatedNotification(booking);
//
// `booking` must include:
//   { id, service, status, startDate, endDate, shift, shiftTime, amount,
//     client: { name, email, phone },
//     leader: { name, email } | null,
//     patient, patientAge, gender, relationship, address, notes }

export const sendBookingCreatedNotification = async (booking) => {
  // Notify admin
  if (env.adminEmail) {
    const { subject, html, text } = bookingCreatedTemplate({
      booking,
      recipientType: 'admin',
      dashboardUrl: `${CLIENT_URL}/admin/bookings`,
    });
    await sendEmail({ to: env.adminEmail, subject, html, text });
  }

  // Notify assigned leader (if any)
  if (booking.leader?.email) {
    const { subject, html, text } = bookingCreatedTemplate({
      booking,
      recipientType: 'leader',
      dashboardUrl: `${CLIENT_URL}/leader/bookings`,
    });
    await sendEmail({ to: booking.leader.email, subject, html, text });
  }
};

// ─── 3. Ticket Raised Notification ───────────────────────────────────────────
// Trigger: after a client creates a support ticket (ticket.controller).
//
// Usage:
//   import { sendTicketRaisedNotification } from '../services/email.service.js';
//   await sendTicketRaisedNotification(ticket);
//
// `ticket` must include:
//   { id, bookingId, clientName, clientEmail, clientPhone, service,
//     subject, category, description, priority, status, createdAt }
//   And optionally: { leaderEmail }

export const sendTicketRaisedNotification = async (ticket) => {
  // Notify admin
  if (env.adminEmail) {
    const { subject, html, text } = ticketRaisedTemplate({
      ticket,
      dashboardUrl: `${CLIENT_URL}/admin/tickets`,
    });
    await sendEmail({ to: env.adminEmail, subject, html, text });
  }

  // Notify the assigned leader if ticket is linked to a booking with a leader
  if (ticket.leaderEmail) {
    const { subject, html, text } = ticketRaisedTemplate({
      ticket,
      dashboardUrl: `${CLIENT_URL}/leader/tickets`,
    });
    await sendEmail({ to: ticket.leaderEmail, subject, html, text });
  }
};

// ─── 4. Service Completion Notification ──────────────────────────────────────
// Trigger: after OTP verification succeeds and booking is marked COMPLETED
//          (booking.controller, OTP verify route).
//
// Usage:
//   import { sendServiceCompletedNotification } from '../services/email.service.js';
//   await sendServiceCompletedNotification(booking);
//
// `booking` must include:
//   { id, service, completionDate, startDate, endDate, amount,
//     client: { name, email },
//     leader: { name, email },
//     patient }

export const sendServiceCompletedNotification = async (booking) => {
  const base = { booking, clientUrl: CLIENT_URL };

  // Email to client
  if (booking.client?.email) {
    const { subject, html, text } = serviceCompletedTemplate({ ...base, recipientType: 'client' });
    await sendEmail({ to: booking.client.email, subject, html, text });
  }

  // Email to leader
  if (booking.leader?.email) {
    const { subject, html, text } = serviceCompletedTemplate({ ...base, recipientType: 'leader' });
    await sendEmail({ to: booking.leader.email, subject, html, text });
  }

  // Email to admin
  if (env.adminEmail) {
    const { subject, html, text } = serviceCompletedTemplate({ ...base, recipientType: 'admin' });
    await sendEmail({ to: env.adminEmail, subject, html, text });
  }
};

// ─── Legacy stub aliases (keep existing callers from breaking) ────────────────
export const sendBookingCreated = sendBookingCreatedNotification;
export const sendTicketUpdate   = sendTicketRaisedNotification;
export const sendBookingStatus  = sendServiceCompletedNotification;
export const sendOtp            = async () => {};
