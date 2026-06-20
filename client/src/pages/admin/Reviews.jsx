import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { listAllReviews, approveReview, toggleFeatured, deleteReview } from '../../api/review.api.js';
import { StarIcon, TrashIcon } from '../../components/common/icons.jsx';

const STATUS_FILTERS = ['ALL', 'APPROVED', 'PENDING', 'FEATURED'];

function ReviewStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <StarIcon key={n} className="w-4 h-4 text-amber-400" filled={n <= rating} />
      ))}
    </div>
  );
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminReviews() {
  const { socket } = useSocket();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');

  useEffect(() => {
    listAllReviews()
      .then(res => setReviews(res.data?.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Real-time: new review submitted by a client
  useEffect(() => {
    if (!socket) return;

    const handleNew = (review) => {
      setReviews(prev => {
        if (prev.some(r => r._id === review._id)) return prev;
        return [review, ...prev];
      });
    };

    const handleUpdated = (review) => {
      setReviews(prev => prev.map(r => r._id === review._id ? { ...r, ...review } : r));
    };

    socket.on('review:new',     handleNew);
    socket.on('review:updated', handleUpdated);

    return () => {
      socket.off('review:new',     handleNew);
      socket.off('review:updated', handleUpdated);
    };
  }, [socket]);

  const totalCount    = reviews.length;
  const approvedCount = reviews.filter(r => r.isApproved).length;
  const pendingCount  = reviews.filter(r => !r.isApproved).length;
  const featuredCount = reviews.filter(r => r.isFeatured).length;
  const avgRating     = totalCount
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  const filtered = reviews.filter(r => {
    if (filter === 'ALL')      return true;
    if (filter === 'FEATURED') return r.isFeatured;
    if (filter === 'APPROVED') return r.isApproved;
    if (filter === 'PENDING')  return !r.isApproved;
    return true;
  });

  async function handleApprove(id) {
    try {
      await approveReview(id);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: true } : r));
    } catch { /* silent */ }
  }

  async function handleToggleFeatured(id) {
    try {
      const res = await toggleFeatured(id);
      const updated = res.data?.review;
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isFeatured: updated?.isFeatured ?? !r.isFeatured } : r));
    } catch { /* silent */ }
  }

  async function handleDelete(id) {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch { /* silent */ }
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>
        {!loading && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Total: {totalCount}</span>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Approved: {approvedCount}</span>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Pending: {pendingCount}</span>
            <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Featured: {featuredCount}</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Avg: {avgRating}★</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(review => {
            const clientName = review.client?.name || 'Unknown';
            const service    = review.booking?.service || '—';
            const bookingRef = review.booking?._id?.slice(-8).toUpperCase() || '—';
            const leaderName = review.booking?.leader?.name;

            return (
              <div key={review._id} className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {initials(clientName)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{clientName}</p>
                      <p className="text-xs text-slate-500">
                        {service}{leaderName ? ` · ${leaderName}` : ''}
                      </p>
                      <p className="text-xs text-slate-400">
                        Booking #{bookingRef} ·{' '}
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      review.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {review.isApproved ? 'APPROVED' : 'PENDING'}
                    </span>
                    {review.isFeatured && (
                      <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐ Featured</span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <ReviewStars rating={review.rating} />
                </div>

                {review.title && (
                  <p className="font-semibold text-slate-700 text-sm mb-1">{review.title}</p>
                )}
                <p className="text-sm italic text-slate-600 mb-4 leading-relaxed">"{review.comment}"</p>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-50 flex-wrap">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve ✓
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleToggleFeatured(review._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        review.isFeatured
                          ? 'border border-amber-300 text-amber-700 hover:bg-amber-50'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      {review.isFeatured ? 'Unfeature' : 'Feature ★'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <StarIcon className="w-6 h-6 text-slate-300" filled={false} />
              </div>
              <p className="text-slate-500 font-medium">No reviews found</p>
              <p className="text-slate-400 text-sm mt-1">
                {filter === 'ALL'
                  ? 'Reviews will appear here after clients complete their services.'
                  : `No ${filter.toLowerCase()} reviews yet.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
