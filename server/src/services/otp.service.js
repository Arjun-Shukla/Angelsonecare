import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

const EXPIRY_MINUTES = Number(env.otpExpiryMinutes) || 10;

/**
 * Generate a cryptographically sufficient random 6-digit OTP.
 */
export const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

/**
 * Hash an OTP using bcrypt.
 * Salt rounds = 10 — lower than passwords because OTPs are short-lived.
 */
export const hashOtp = async (plainOtp) => {
  return bcrypt.hash(plainOtp, 10);
};

/**
 * Compare a plain OTP against a stored bcrypt hash.
 */
export const verifyOtp = async (plainOtp, hash) => {
  if (!plainOtp || !hash) return false;
  return bcrypt.compare(String(plainOtp), hash);
};

/**
 * Return a Date representing when an OTP expires.
 */
export const otpExpiresAt = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + EXPIRY_MINUTES);
  return d;
};

/**
 * Return true if the OTP expiry Date has passed.
 */
export const isOtpExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
};

export { EXPIRY_MINUTES };
