/**
 * Booking request validators.
 *
 * Each function returns a string error message if validation fails,
 * or null if the body is valid. No external libraries required.
 */

// POST /api/bookings
export const validateCreateBooking = (body) => {
  const { service, patient, startDate, address } = body ?? {};
  const missing = [];

  if (!service?.trim())    missing.push('service');
  if (!patient?.trim())    missing.push('patient');
  if (!startDate)          missing.push('startDate');
  if (!address?.trim())    missing.push('address');

  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;

  if (body.patientAge !== undefined) {
    const age = Number(body.patientAge);
    if (!Number.isInteger(age) || age < 0 || age > 150) {
      return 'patientAge must be an integer between 0 and 150';
    }
  }

  if (body.gender && !['MALE', 'FEMALE', 'OTHER'].includes(body.gender)) {
    return 'gender must be MALE, FEMALE, or OTHER';
  }

  if (isNaN(Date.parse(startDate))) return 'startDate must be a valid date';
  if (body.endDate && isNaN(Date.parse(body.endDate))) return 'endDate must be a valid date';

  if (body.amount !== undefined && (isNaN(Number(body.amount)) || Number(body.amount) < 0)) {
    return 'amount must be a non-negative number';
  }

  return null;
};

// PATCH /api/bookings/:id/reject
export const validateRejectBooking = (body) => {
  if (!body?.reason?.trim()) return 'A rejection reason is required';
  return null;
};

// PATCH /api/bookings/:id/assign
export const validateAssignLeader = (body) => {
  if (!body?.leaderId?.trim()) return 'leaderId is required';
  return null;
};

// POST /api/bookings/:id/otp/verify
export const validateVerifyOtp = (body) => {
  const otp = String(body?.otp ?? '').trim();
  if (!otp) return 'OTP is required';
  if (!/^\d{6}$/.test(otp)) return 'OTP must be a 6-digit number';
  return null;
};
