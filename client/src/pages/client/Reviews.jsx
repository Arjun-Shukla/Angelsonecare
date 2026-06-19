import { useState } from 'react';
import { MOCK_BOOKINGS, MOCK_REVIEWS } from '../../data/mockClient.js';
import { StarIcon, CheckBadgeIcon, CheckCircleIcon } from '../../components/common/icons.jsx';

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <StarIcon
            className="w-8 h-8"
            filled={n <= display}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ booking, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (comment.trim().length < 10) { setError('Please write at least 10 characters.'); return; }
    onSubmit({ bookingId: booking.id, service: booking.service, leader: booking.leader?.name ?? 'Caregiver', rating, comment: comment.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <div>
        <p className="font-semibold text-slate-800">{booking.service}</p>
        <p className="text-xs text-slate-400 mt-0.5">Booking #{booking.id}</p>
      </div>
      <div>
        <label className="label-style">Your Rating</label>
        <StarRating rating={rating} onChange={setRating} />
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
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors">
        Submit Review
      </button>
    </form>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-slate-800">{review.service}</p>
          <p className="text-xs text-slate-500 mt-0.5">Caregiver: {review.leader}</p>
        </div>
        <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
          <CheckBadgeIcon className="w-3.5 h-3.5" />
          Verified Review
        </span>
      </div>
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map(n => (
          <StarIcon key={n} className="w-5 h-5 text-amber-400" filled={n <= review.rating} />
        ))}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{review.comment}</p>
      <p className="text-xs text-slate-400">{review.date}</p>
    </div>
  );
}

export default function Reviews() {
  const pendingReviews = MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED' && !b.review);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [successFor, setSuccessFor] = useState(null);

  const submittedIds = submittedReviews.map(r => r.bookingId);
  const remaining = pendingReviews.filter(b => !submittedIds.includes(b.id));
  const allReviews = [...MOCK_REVIEWS, ...submittedReviews];

  function handleSubmit(review) {
    const newReview = {
      id: `REV-${Date.now()}`,
      ...review,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setSubmittedReviews(prev => [...prev, newReview]);
    setSuccessFor(review.bookingId);
    setTimeout(() => setSuccessFor(null), 4000);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reviews</h1>
        <p className="text-slate-500 text-sm mt-1">Share your experience and help others choose the right care.</p>
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Pending Reviews</h2>
        {remaining.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-slate-700 font-medium">All caught up!</p>
            <p className="text-slate-400 text-sm mt-1">No pending reviews at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {remaining.map(booking => (
              <div key={booking.id}>
                {successFor === booking.id ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-green-800">Review submitted! Thank you.</p>
                  </div>
                ) : (
                  <ReviewForm booking={booking} onSubmit={handleSubmit} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">My Reviews</h2>
        {allReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <p className="text-slate-500 text-sm">You haven't submitted any reviews yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allReviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
