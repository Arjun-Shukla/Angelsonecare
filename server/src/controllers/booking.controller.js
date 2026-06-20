import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import * as bookingService from '../services/booking.service.js';
import {
  validateCreateBooking,
  validateRejectBooking,
  validateAssignLeader,
  validateVerifyOtp,
} from '../validators/booking.validator.js';

// POST /api/bookings
// Role: CLIENT — create a new booking request (status → PENDING)
export const createBooking = async (req, res) => {
  const errors = validateCreateBooking(req.body);
  if (errors) throw new ApiError(422, errors);

  const booking = await bookingService.createBooking(req.user._id, req.body);
  sendSuccess(res, { data: { booking }, message: 'Booking created successfully', status: 201 });
};

// GET /api/bookings
// Role: ALL — role-scoped list (client: own, leader: assigned, admin: all)
export const listBookings = async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await bookingService.listForRole(req.user, { status, page, limit });
  sendSuccess(res, {
    data: { bookings: result.bookings },
    meta: { total: result.total, page: result.page, limit: result.limit },
    message: 'Bookings fetched successfully',
  });
};

// GET /api/bookings/:id
// Role: ALL — returns booking if caller is the client, assigned leader, or admin
export const getBooking = async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id, req.user);
  sendSuccess(res, { data: { booking }, message: 'Booking fetched successfully' });
};

// PATCH /api/bookings/:id/accept
// Role: ADMIN — mark booking ACCEPTED, create ServiceSession, notify client
export const acceptBooking = async (req, res) => {
  const booking = await bookingService.acceptBooking(req.params.id, req.user);
  sendSuccess(res, { data: { booking }, message: 'Booking accepted successfully' });
};

// PATCH /api/bookings/:id/reject
// Role: ADMIN — mark booking REJECTED, store reason, notify client
export const rejectBooking = async (req, res) => {
  const errors = validateRejectBooking(req.body);
  if (errors) throw new ApiError(422, errors);

  const booking = await bookingService.rejectBooking(req.params.id, req.body.reason);
  sendSuccess(res, { data: { booking }, message: 'Booking rejected' });
};

// PATCH /api/bookings/:id/assign
// Role: ADMIN — assign a leader to the booking
export const assignLeader = async (req, res) => {
  const errors = validateAssignLeader(req.body);
  if (errors) throw new ApiError(422, errors);

  const booking = await bookingService.assignLeader(req.params.id, req.body.leaderId, req.user);
  sendSuccess(res, { data: { booking }, message: 'Leader assigned successfully' });
};

// PATCH /api/bookings/:id/progress
// Role: LEADER, ADMIN — move booking from ACCEPTED → IN_PROGRESS
export const updateProgress = async (req, res) => {
  const booking = await bookingService.updateProgress(req.params.id, req.user, req.body.note);
  sendSuccess(res, { data: { booking }, message: 'Booking marked as in progress' });
};

// POST /api/bookings/:id/otp/generate
// Role: LEADER, ADMIN — generate 6-digit OTP, email client, move to COMPLETION_REQUESTED
export const generateOtp = async (req, res) => {
  const booking = await bookingService.generateCompletionOtp(req.params.id, req.user);
  sendSuccess(res, {
    data: { booking },
    message: "OTP generated and sent to the client's email",
  });
};

// POST /api/bookings/:id/otp/verify
// Role: LEADER, ADMIN — leader enters client OTP to mark the booking COMPLETED
export const verifyOtp = async (req, res) => {
  const errors = validateVerifyOtp(req.body);
  if (errors) throw new ApiError(422, errors);

  const booking = await bookingService.verifyCompletionOtp(req.params.id, req.body.otp, req.user);
  sendSuccess(res, { data: { booking }, message: 'Service marked as completed' });
};
