import { useState } from 'react';
import { MOCK_ALL_REVIEWS } from '../../data/mockAdmin.js';
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
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AdminReviews() {
  const [localReviews, setLocalReviews] = useState([...MOCK_ALL_REVIEWS]);
  const [filter, setFilter] = useState('ALL');

  const totalCount = localReviews.length;
  const approvedCount = localReviews.filter(r => r.status === 'APPROVED').length;
  const pendingCount = localReviews.filter(r => r.status === 'PENDING').length;
  const featuredCount = localReviews.filter(r => r.featured).length;
  const avgRating = totalCount
    ? (localReviews.reduce((s, r) => s + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  const filtered = localReviews.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'FEATURED') return r.featured;
    return r.status === filter;
  });

  function approve(id) {
    setLocalReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  }

  function deleteReview(id) {
    setLocalReviews(prev => prev.filter(r => r.id !== id));
  }

  function toggleFeatured(id) {
    setLocalReviews(prev => prev.map(r => r.id === id ? { ...r, featured: !r.featured } : r));
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews Management</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Total: {totalCount}</span>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Approved: {approvedCount}</span>
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Pending: {pendingCount}</span>
          <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Featured: {featuredCount}</span>
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Avg: {avgRating}★</span>
        </div>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials(review.clientName)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{review.clientName}</p>
                  <p className="text-xs text-slate-500">{review.service}{review.leader ? ` · ${review.leader}` : ''}</p>
                  <p className="text-xs text-slate-400">{review.date}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  review.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {review.status}
                </span>
                {review.featured && (
                  <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐ Featured</span>
                )}
              </div>
            </div>

            <div className="mb-2">
              <ReviewStars rating={review.rating} />
            </div>

            <p className="text-sm italic text-slate-600 mb-4 leading-relaxed">"{review.comment}"</p>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-50 flex-wrap">
              {review.status === 'PENDING' && (
                <button
                  onClick={() => approve(review.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve ✓
                </button>
              )}
              {review.status === 'APPROVED' && (
                <button
                  onClick={() => toggleFeatured(review.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    review.featured
                      ? 'border border-amber-300 text-amber-700 hover:bg-amber-50'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {review.featured ? 'Unfeature' : 'Feature ★'}
                </button>
              )}
              <button
                onClick={() => deleteReview(review.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-slate-400 text-sm py-8">No reviews found.</p>
        )}
      </div>
    </div>
  );
}
