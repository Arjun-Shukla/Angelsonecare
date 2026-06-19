/**
 * OTP generation and hashing helpers.
 *
 * Purpose: Generate numeric OTPs for service completion and hash them before
 * storage (the raw OTP is only ever sent to the client/leader, never stored).
 * Used by `otp.service.js`.
 *
 * TODO (implementation):
 *  - generateOtp(length = 6) -> random numeric string
 *  - hashOtp(otp)            -> bcrypt/sha256 hash
 *  - compareOtp(otp, hash)   -> boolean
 *  - getExpiry()             -> Date (now + env.otpExpiryMinutes)
 */

export const generateOtp = (length = 6) => {};
export const hashOtp = (otp) => {};
export const compareOtp = (otp, hash) => {};
export const getExpiry = () => {};
