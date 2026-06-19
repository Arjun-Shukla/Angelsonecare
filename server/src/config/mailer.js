import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Titan Email SMTP — port 465 = SSL (secure:true), port 587 = STARTTLS (secure:false)
export const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

// Call once on startup — warns if credentials are missing, does not crash the server.
export const verifyMailer = async () => {
  if (!env.smtp.user || !env.smtp.pass) {
    logger.warn('[mailer] SMTP credentials not set — email sending is disabled');
    return false;
  }
  try {
    await transporter.verify();
    logger.info('[mailer] SMTP connection verified successfully');
    return true;
  } catch (err) {
    logger.warn(`[mailer] SMTP verification failed: ${err.message}`);
    return false;
  }
};
