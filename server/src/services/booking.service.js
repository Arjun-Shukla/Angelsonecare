import Booking from '../models/Booking.js';
import ServiceSession from '../models/ServiceSession.js';
import User from '../models/User.js';
import { BOOKING_STATUS } from '../constants/bookingStatus.js';
import { ROLES } from '../constants/roles.js';
import { ApiError } from '../utils/apiResponse.js';
import {
  sendBookingCreatedNotification,
  sendBookingAcceptedNotification,
  sendBookingRejectedNotification,
  sendOtpEmail,
  sendServiceCompletedNotification,
} from './email.service.js';
import {
  generateOtp,
  hashOtp,
  otpExpiresAt,
  isOtpExpired,
  verifyOtp,
  EXPIRY_MINUTES,
} from './otp.service.js';
import { emitBookingCreated, emitBookingStatusUpdated } from '../sockets/emitters.js';

// ─── Populate helper ──────────────────────────────────────────────────────────
// Reused across all queries: populate client and leader with display fields only.
const POPULATE_CLIENT = { path: 'client', select: 'name email phone profilePicture' };
const POPULATE_LEADER = { path: 'leader', select: 'name email phone profilePicture' };

const populateBooking = (query) =>
  query.populate(POPULATE_CLIENT).populate(POPULATE_LEADER);

// ─── 1. Create Booking ────────────────────────────────────────────────────────
export const createBooking = async (clientId, payload) => {
  const booking = await Booking.create({ client: clientId, ...payload });
  const populated = await populateBooking(Booking.findById(booking._id));

  // Fire-and-forget: email and socket should never block the HTTP response
  sendBookingCreatedNotification(populated);
  emitBookingCreated(populated);

  return populated;
};

// ─── 2. List bookings scoped by role ─────────────────────────────────────────
export const listForRole = async (user, { status, page = 1, limit = 20 } = {}) => {
  const filter = {};

  if (user.role === ROLES.CLIENT) filter.client = user._id;
  if (user.role === ROLES.LEADER) filter.leader = user._id;
  // ADMIN: no filter — sees all

  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [bookings, total] = await Promise.all([
    populateBooking(
      Booking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
    ),
    Booking.countDocuments(filter),
  ]);

  return { bookings, total, page: Number(page), limit: Number(limit) };
};

// ─── 3. Get single booking (access-controlled) ────────────────────────────────
export const getBookingById = async (bookingId, user) => {
  const booking = await populateBooking(Booking.findById(bookingId));
  if (!booking) throw new ApiError(404, 'Booking not found');

  const id = user._id.toString();
  const isClient = booking.client?._id?.toString() === id;
  const isLeader = booking.leader?._id?.toString() === id;
  const isAdmin  = user.role === ROLES.ADMIN;

  if (!isClient && !isLeader && !isAdmin) {
    throw new ApiError(403, 'You do not have access to this booking');
  }

  return booking;
};

// ─── 4. Accept booking ────────────────────────────────────────────────────────
export const acceptBooking = async (bookingId, adminUser) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.status !== BOOKING_STATUS.PENDING) {
    throw new ApiError(400, `Cannot accept a booking with status "${booking.status}"`);
  }

  booking.status = BOOKING_STATUS.ACCEPTED;
  await booking.save();

  const populated = await populateBooking(Booking.findById(bookingId));

  // Create (or update) the service session when a leader is already assigned
  if (booking.leader) {
    await _upsertSession(booking, adminUser._id);
  }

  sendBookingAcceptedNotification(populated);
  emitBookingStatusUpdated(populated);

  return populated;
};

// ─── 5. Reject booking ────────────────────────────────────────────────────────
export const rejectBooking = async (bookingId, reason) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (![BOOKING_STATUS.PENDING, BOOKING_STATUS.ACCEPTED].includes(booking.status)) {
    throw new ApiError(400, `Cannot reject a booking with status "${booking.status}"`);
  }

  booking.status = BOOKING_STATUS.REJECTED;
  booking.rejectionReason = reason || '';
  await booking.save();

  const populated = await populateBooking(Booking.findById(bookingId));

  sendBookingRejectedNotification(populated);
  emitBookingStatusUpdated(populated);

  return populated;
};

// ─── 6. Assign leader ─────────────────────────────────────────────────────────
export const assignLeader = async (bookingId, leaderId, adminUser) => {
  const [booking, leader] = await Promise.all([
    Booking.findById(bookingId),
    User.findById(leaderId).select('name email phone role'),
  ]);

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (!leader)  throw new ApiError(404, 'Leader not found');
  if (leader.role !== ROLES.LEADER) {
    throw new ApiError(400, 'The specified user is not a leader');
  }

  booking.leader = leaderId;
  await booking.save();

  const populated = await populateBooking(Booking.findById(bookingId));

  // If already accepted, ensure session exists with the new leader
  if (booking.status === BOOKING_STATUS.ACCEPTED) {
    await _upsertSession(booking, adminUser._id);
  }

  // Notify the newly assigned leader via booking-created email
  sendBookingCreatedNotification(populated);
  emitBookingStatusUpdated(populated);

  return populated;
};

// ─── 7. Update progress ───────────────────────────────────────────────────────
// Moves ACCEPTED → IN_PROGRESS on first call; subsequent calls just log the note.
export const updateProgress = async (bookingId, actorUser, note = '') => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const workingStatuses = [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS];
  if (!workingStatuses.includes(booking.status)) {
    throw new ApiError(400, `Cannot update progress for booking with status "${booking.status}"`);
  }

  const wasAccepted = booking.status === BOOKING_STATUS.ACCEPTED;
  if (wasAccepted) {
    booking.status = BOOKING_STATUS.IN_PROGRESS;
    await booking.save();
  }

  await ServiceSession.findOneAndUpdate(
    { booking: bookingId },
    {
      $push: {
        timeline: {
          status: BOOKING_STATUS.IN_PROGRESS,
          note: note || (wasAccepted ? 'Service started' : 'Progress updated'),
          updatedBy: actorUser._id,
        },
      },
    }
  );

  const populated = await populateBooking(Booking.findById(bookingId));
  if (wasAccepted) emitBookingStatusUpdated(populated);
  return populated;
};

// ─── 8. Generate OTP for completion ──────────────────────────────────────────
export const generateCompletionOtp = async (bookingId, actorUser) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const allowedStatuses = [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.COMPLETION_REQUESTED];
  if (!allowedStatuses.includes(booking.status)) {
    throw new ApiError(
      400,
      `OTP can only be generated when booking is IN_PROGRESS, ACCEPTED, or COMPLETION_REQUESTED. Current: "${booking.status}"`
    );
  }

  const plain = generateOtp();
  const hash  = await hashOtp(plain);
  const expiry = otpExpiresAt();

  // Store hashed OTP + plain code (shown in client dashboard)
  // Only advance status the first time; on resend it stays COMPLETION_REQUESTED
  booking.otp = { hash, code: plain, expiresAt: expiry };
  if (booking.status !== BOOKING_STATUS.COMPLETION_REQUESTED) {
    booking.status = BOOKING_STATUS.COMPLETION_REQUESTED;
  }
  await booking.save();

  // Log in session timeline
  await ServiceSession.findOneAndUpdate(
    { booking: bookingId },
    {
      $push: {
        timeline: {
          status: BOOKING_STATUS.COMPLETION_REQUESTED,
          note: 'Completion OTP generated',
          updatedBy: actorUser._id,
        },
      },
    }
  );

  // Fetch client details to send OTP email
  const populated = await populateBooking(Booking.findById(bookingId));
  const client = populated.client;

  sendOtpEmail({
    clientEmail: client?.email,
    clientName: client?.name,
    otp: plain,
    bookingId: booking.id,
    service: booking.service,
    expiryMinutes: EXPIRY_MINUTES,
  });

  emitBookingStatusUpdated(populated);

  // Return WITHOUT the plain OTP in the response — it only goes to the client's email
  return populated;
};

// ─── 9. Verify OTP and complete booking ──────────────────────────────────────
export const verifyCompletionOtp = async (bookingId, plainOtp, actorUser) => {
  // Explicitly select the hidden otp.hash field
  const booking = await Booking.findById(bookingId).select('+otp.hash');
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.status !== BOOKING_STATUS.COMPLETION_REQUESTED) {
    throw new ApiError(400, 'No completion OTP is pending for this booking');
  }

  if (isOtpExpired(booking.otp?.expiresAt)) {
    throw new ApiError(400, 'OTP has expired. Please generate a new one.');
  }

  const isValid = await verifyOtp(plainOtp, booking.otp?.hash);
  if (!isValid) throw new ApiError(400, 'Invalid OTP');

  // Mark booking complete and clear OTP atomically
  const now = new Date();
  await Booking.updateOne(
    { _id: bookingId },
    {
      $set: { status: BOOKING_STATUS.COMPLETED, completedAt: now },
      $unset: { otp: '' },
    }
  );

  // Close the session
  await ServiceSession.findOneAndUpdate(
    { booking: bookingId },
    {
      $set: { status: 'CLOSED', closedAt: new Date() },
      $push: {
        timeline: {
          status: BOOKING_STATUS.COMPLETED,
          note: 'OTP verified — service marked complete',
          updatedBy: actorUser._id,
        },
      },
    }
  );

  const populated = await populateBooking(Booking.findById(bookingId));

  sendServiceCompletedNotification(populated);
  emitBookingStatusUpdated(populated);

  return populated;
};

// ─── Internal: upsert ServiceSession ─────────────────────────────────────────
// $set is used for leader so reassignment updates the session's leader reference.
// $setOnInsert only runs on the initial create, not on subsequent updates.
const _upsertSession = async (booking, adminId) => {
  return ServiceSession.findOneAndUpdate(
    { booking: booking._id },
    {
      $set: { leader: booking.leader },
      $setOnInsert: {
        booking: booking._id,
        client: booking.client,
        admin: adminId,
        startedAt: new Date(),
      },
      $push: {
        timeline: {
          status: BOOKING_STATUS.ACCEPTED,
          note: 'Session opened / leader updated',
          updatedBy: adminId,
        },
      },
    },
    { upsert: true, new: true }
  );
};
