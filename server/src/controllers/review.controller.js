import Review  from '../models/Review.js';
import Booking from '../models/Booking.js';
import { sendSuccess, ApiError } from '../utils/apiResponse.js';
import { getIo } from '../sockets/index.js';
import { SOCKET_EVENTS, ROOMS } from '../constants/events.js';

const populateReview = (query) =>
  query
    .populate({ path: 'booking', select: 'service leader', populate: { path: 'leader', select: 'name' } })
    .populate({ path: 'client', select: 'name' });

// ── CREATE ─────────────────────────────────────────────────────────────────
export const createReview = async (req, res) => {
  const { bookingId, rating, title, comment } = req.body;
  if (!bookingId) throw new ApiError(400, 'bookingId is required');
  if (!rating || rating < 1 || rating > 5) throw new ApiError(400, 'Rating must be between 1 and 5');
  if (!title?.trim() || title.trim().length < 3) throw new ApiError(400, 'Title must be at least 3 characters');
  if (!comment?.trim() || comment.trim().length < 10) throw new ApiError(400, 'Comment must be at least 10 characters');

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only review your own bookings');
  }
  if (booking.status !== 'COMPLETED') {
    throw new ApiError(400, 'Reviews are only available after service is completed and OTP is verified');
  }

  const existing = await Review.findOne({ booking: bookingId });
  if (existing) throw new ApiError(409, 'You have already submitted a review for this booking');

  const review = await Review.create({
    client:  req.user._id,
    booking: bookingId,
    rating,
    title:   title.trim(),
    comment: comment.trim(),
  });

  const populated = await populateReview(Review.findById(review._id));

  // Real-time: push new review to admin dashboard immediately
  const io = getIo();
  if (io) {
    io.to(ROOMS.roleAdmin).emit(SOCKET_EVENTS.REVIEW_NEW, populated);
    // Also deliver to the client's own room so their review list updates
    io.to(ROOMS.user(req.user._id.toString())).emit(SOCKET_EVENTS.REVIEW_NEW, populated);
  }

  sendSuccess(res, { status: 201, data: { review: populated }, message: 'Review submitted successfully' });
};

// ── PUBLIC — approved reviews only (used by website testimonials) ──────────
export const listReviews = async (req, res) => {
  const reviews = await populateReview(
    Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(12)
  );
  sendSuccess(res, { data: { reviews } });
};

// ── CLIENT — own reviews ───────────────────────────────────────────────────
export const listMyReviews = async (req, res) => {
  const reviews = await populateReview(
    Review.find({ client: req.user._id }).sort({ createdAt: -1 })
  );
  sendSuccess(res, { data: { reviews } });
};

// ── ADMIN — all reviews regardless of approval ────────────────────────────
export const listAllReviews = async (req, res) => {
  const reviews = await populateReview(Review.find({}).sort({ createdAt: -1 }));
  sendSuccess(res, { data: { reviews } });
};

// ── ADMIN — approve ────────────────────────────────────────────────────────
export const approveReview = async (req, res) => {
  const review = await populateReview(
    Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true })
  );
  if (!review) throw new ApiError(404, 'Review not found');

  // Real-time: notify admin of the update
  const io = getIo();
  if (io) {
    io.to(ROOMS.roleAdmin).emit(SOCKET_EVENTS.REVIEW_UPDATED, review);
  }

  sendSuccess(res, { data: { review }, message: 'Review approved' });
};

// ── ADMIN — feature toggle ─────────────────────────────────────────────────
export const toggleFeatured = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  review.isFeatured = !review.isFeatured;
  await review.save();

  const populated = await populateReview(Review.findById(review._id));

  // Real-time: notify admin
  const io = getIo();
  if (io) {
    io.to(ROOMS.roleAdmin).emit(SOCKET_EVENTS.REVIEW_UPDATED, populated);
  }

  sendSuccess(res, { data: { review: populated }, message: review.isFeatured ? 'Review featured' : 'Review unfeatured' });
};

// ── ADMIN — delete ─────────────────────────────────────────────────────────
export const deleteReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  sendSuccess(res, { message: 'Review deleted' });
};
