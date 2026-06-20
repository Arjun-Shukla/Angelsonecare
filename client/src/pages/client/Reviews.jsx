import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { listMyReviews, createReview as apiCreateReview } from '../../api/review.api.js';
import { listBookings } from '../../api/booking.api.js';
import { StarIcon, CheckBadgeIcon, CheckCircleIcon } from '../../components/common/icons.jsx';

// Statuses that are NOT yet eligible for a review
const LOCKED_STATUSES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'];

const STATUS_LABELS = {
  PENDING:              'Awaiting Acceptance',
  ACCEPTED:             'Accepted',
  IN_PROGRESS:          'In Progress',
  COMPLETION_REQUESTED: 'Completion Requested',
};

function StarRating({ rating, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => !disabled && setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className={`transition-transform ${!disabled ? 'hover:scale-110' : 'cursor-default'}`}
        >
          <StarIcon className="w-8 h-8" filled={n <= display} />
        </button>
      ))}
    </div>
  );
}

function LockedBookingCard({ booking }) {
  const label = STATUS_LABELS[booking.status] || booking.status;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 opacity-75">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-700">{booking.service}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Booking #{(booking._id).slice(-8).toUpperCase()}
          </p>
        </div>
        <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full flex-shrink-0">
          {label}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs text-slate-500">
          Review will be unlocked once service is completed and OTP is verified.
        </p>
      </div>
      <div className="flex gap-1 mt-3">
        {[1, 2, 3, 4, 5].map(n => (
          <StarIcon key={n} className="w-7 h-7 text-slate-200" filled={false} />
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ booking, onSubmit }) {
  const [rating,  setRating]  = useState(0);
  const [title,   setTitle]   = useState('');
  const [comment, setComment] = useState('');
  const [error,   setError]   = useState('');
  const [busy,    setBusy]    = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0)              { setError('Please select a star rating.'); return; }
    if (title.trim().length < 3)   { setError('Please enter a title (at least 3 characters).'); return; }
    if (comment.trim().length < 10){ setError('Please write at least 10 characters in your review.'); return; }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ bookingId: booking._id, rating, title: title.trim(), comment: comment.trim() });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-teal-100 shadow-sm p-5 space-y-4">
      <div>
        <p className="font-semibold text-slate-800">{booking.service}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Booking #{(booking._id).slice(-8).toUpperCase()}
          {booking.leader?.name ? ` · Caregiver: ${booking.leader.name}` : ''}
        </p>
        <span className="inline-block mt-1.5 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">
          Service Completed
        </span>
      </div>

      <div>
        <label className="label-style">Your Rating</label>
        <StarRating rating={rating} onChange={setRating} />
      </div>

      <div>
        <label className="label-style">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); setError(''); }}
          placeholder="Summarise your experience in a few words"
          className="input-style"
          maxLength={120}
        />
      </div>

      <div>
        <label className="label-style">Your Review</label>
        <textarea
          value={comment}
          onChange={e => { setComment(e.target.value); setError(''); }}
          placeholder="Share your experience with the caregiver and service..."
          rows={4}
          className="input-style resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{comment.length} / 10 minimum</p>
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {busy ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}

function ReviewCard({ review }) {
  const service   = review.booking?.service ?? '—';
  const caregiver = review.booking?.leader?.name ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-slate-800">{service}</p>
          {caregiver && <p className="text-xs text-slate-500 mt-0.5">Caregiver: {caregiver}</p>}
        </div>
        <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
          <CheckBadgeIcon className="w-3.5 h-3.5" />
          Verified Review
        </span>
      </div>
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map(n => (
          <StarIcon key={n} className="w-5 h-5 text-amber-400" filled={n <= review.rating} />
        ))}
      </div>
      {review.title && (
        <p className="font-semibold text-slate-700 text-sm mb-1">{review.title}</p>
      )}
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.comment}</p>
      <p className="text-xs text-slate-400">
        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        {review.isApproved
          ? <span className="ml-2 text-green-600 font-medium">· Published</span>
          : <span className="ml-2 text-amber-600 font-medium">· Pending Approval</span>
        }
      </p>
    </div>
  );
}

export default function Reviews() {
  const { socket }              = useSocket();
  const [myReviews,   setMyReviews]   = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [successFor,  setSuccessFor]  = useState(null);

  useEffect(() => {
    Promise.all([
      listMyReviews().catch(() => ({ data: { reviews: [] } })),
      listBookings().catch(() => ({ data: { bookings: [] } })),
    ]).then(([revRes, bookRes]) => {
      setMyReviews(revRes.data?.reviews ?? []);
      setAllBookings(bookRes.data?.bookings ?? []);
    }).finally(() => setLoading(false));
  }, []);

  // Real-time: when own review is confirmed via socket, add it to myReviews
  useEffect(() => {
    if (!socket) return;
    const handleNew = (review) => {
      setMyReviews(prev => {
        if (prev.some(r => r._id === review._id)) return prev;
        return [review, ...prev];
      });
    };
    socket.on('review:new', handleNew);
    return () => socket.off('review:new', handleNew);
  }, [socket]);

  const reviewedBookingIds = new Set(
    myReviews.map(r => r.booking?._id?.toString() || r.booking?.toString())
  );

  // Bookings eligible to review (completed, not yet reviewed)
  const pendingReviews = allBookings.filter(
    b => b.status === 'COMPLETED' && !reviewedBookingIds.has(b._id?.toString())
  );

  // Active (non-terminal) bookings that aren't complete yet — show locked state
  const lockedBookings = allBookings.filter(
    b => LOCKED_STATUSES.includes(b.status)
  );

  async function handleSubmit(payload) {
    const res = await apiCreateReview(payload);
    const newReview = res.data?.review;
    if (newReview) {
      setMyReviews(prev => [newReview, ...prev]);
    }
    setSuccessFor(payload.bookingId);
    setTimeout(() => setSuccessFor(null), 5000);
  }

  if (loading) {
    return (
      <div className="animate-fade-in flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasPendingOrLocked = pendingReviews.length > 0 || lockedBookings.length > 0;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Share your experience and help others choose the right care.</p>
      </div>

      {/* Pending + Locked Reviews Section */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Your Services</h2>

        {!hasPendingOrLocked ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-slate-700 font-medium">All caught up!</p>
            <p className="text-slate-400 text-sm mt-1">
              {allBookings.length === 0
                ? 'No bookings found. Book a service to get started.'
                : 'All completed services have been reviewed.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Completed bookings awaiting review */}
            {pendingReviews.map(booking => {
              const id = booking._id?.toString();
              return (
                <div key={id}>
                  {successFor === id ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-semibold text-green-800">Review submitted! Thank you.</p>
                      <p className="text-sm text-green-700 mt-1">Your review is pending approval and will appear publicly shortly.</p>
                    </div>
                  ) : (
                    <ReviewForm booking={booking} onSubmit={handleSubmit} />
                  )}
                </div>
              );
            })}

            {/* Locked bookings (not yet completed) */}
            {lockedBookings.map(booking => (
              <LockedBookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>

      {/* My Submitted Reviews */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">My Reviews</h2>
        {myReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <p className="text-slate-500 text-sm">You haven't submitted any reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myReviews.map(r => <ReviewCard key={r._id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
