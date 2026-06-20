import { useState, useEffect, useRef } from 'react';
import { StarIcon } from '../common/icons.jsx';
import { listReviews } from '../../api/review.api.js';

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200'}`} filled={i < count} />
      ))}
    </div>
  );
}

function initials(name = '') {
  return name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '?';
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-teal-500', 'bg-violet-500',
  'bg-orange-500', 'bg-pink-500', 'bg-green-500',
  'bg-rose-500', 'bg-indigo-500',
];

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  function fetchReviews() {
    listReviews()
      .then(res => setReviews(res.data?.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchReviews();
    // Refresh every 60 seconds so newly approved reviews appear without a page reload
    timerRef.current = setInterval(fetchReviews, 60_000);
    return () => clearInterval(timerRef.current);
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const displayReviews = reviews.slice(0, 6);

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Stories from Our{' '}
            <span className="text-gradient">Happy Families</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            Real reviews from real clients who trusted Angels One with their loved ones' care.
          </p>
        </div>

        {/* Review grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-4/5 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-3/5" />
                <div className="flex items-center gap-3 mt-8 pt-5 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="h-3 bg-slate-100 rounded w-24" />
                    <div className="h-2.5 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <StarIcon className="w-8 h-8 text-slate-300" filled={false} />
            </div>
            <p className="text-slate-500 font-medium">No reviews yet</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to share your experience.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review, idx) => {
              const name    = review.client?.name || 'Client';
              const service = review.booking?.service || 'Healthcare Service';
              const color   = AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <div
                  key={review._id}
                  className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <Stars count={review.rating} />

                  {review.title && (
                    <p className="text-slate-800 font-semibold text-sm mt-3">{review.title}</p>
                  )}

                  <p className="text-slate-600 text-sm leading-relaxed mt-3 flex-1">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                    <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-base">{initials(name)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{name}</p>
                      <p className="text-xs text-slate-500">{service}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rating summary — only shown when real data is available */}
        {!loading && reviews.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
            <div>
              <p className="text-6xl font-extrabold text-blue-700">{avgRating}</p>
              <Stars count={Math.round(parseFloat(avgRating))} />
              <p className="text-sm text-slate-500 mt-1">Average rating</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-blue-200" />
            <div>
              <p className="text-4xl font-extrabold text-slate-800">{reviews.length}+</p>
              <p className="text-slate-500 mt-1">Verified reviews</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-blue-200" />
            <div>
              <p className="text-4xl font-extrabold text-slate-800">
                {reviews.length > 0
                  ? `${Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%`
                  : '—'}
              </p>
              <p className="text-slate-500 mt-1">Would recommend us</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
