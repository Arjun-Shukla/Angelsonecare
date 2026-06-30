import { useState, useEffect, useRef } from 'react';
import { StarIcon } from '../common/icons.jsx';
import { listReviews } from '../../api/review.api.js';
import { useInView } from '../../hooks/useInView.js';

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
  'from-indigo-500 to-indigo-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-rose-700',
  'from-teal-500 to-teal-700',
  'from-blue-500 to-blue-700',
  'from-indigo-400 to-emerald-500',
];

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [gridRef,   gridInView]   = useInView({ threshold: 0.05 });
  const [summaryRef, summaryInView] = useInView({ threshold: 0.2 });

  function fetchReviews() {
    listReviews()
      .then(res => setReviews(res.data?.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchReviews();
    timerRef.current = setInterval(fetchReviews, 60_000);
    return () => clearInterval(timerRef.current);
  }, []);

  const avgRating    = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;
  const displayReviews = reviews.slice(0, 6);

  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="section-badge">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-4">
            Stories from Our{' '}
            <span className="text-gradient">Happy Families</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            Real reviews from real clients who trusted Angels One Health Care with their loved ones' care.
          </p>
        </div>

        {/* Skeleton */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-3xl p-7 shadow-card animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-slate-100 rounded" />
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-slate-100 rounded-full w-full" />
                  <div className="h-3 bg-slate-100 rounded-full w-5/6" />
                  <div className="h-3 bg-slate-100 rounded-full w-4/6" />
                </div>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded-full w-24" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-indigo-100">
              <StarIcon className="w-9 h-9 text-indigo-300" filled={false} />
            </div>
            <p className="text-slate-700 font-semibold text-lg">No reviews yet</p>
            <p className="text-slate-400 text-sm mt-1">Be the first to share your experience.</p>
          </div>
        ) : (
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review, idx) => {
              const name     = review.client?.name || 'Client';
              const service  = review.booking?.service || 'Healthcare Service';
              const gradient = AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <div
                  key={review._id}
                  className="group bg-white border border-slate-100 rounded-3xl p-7 shadow-card hover:shadow-card-hover hover:border-indigo-100 hover:-translate-y-1 flex flex-col"
                  style={{
                    opacity:          gridInView ? 1 : 0,
                    transform:        gridInView ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
                    transitionProperty: 'opacity, transform, box-shadow, border-color',
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay:  gridInView ? `${idx * 80}ms` : '0ms',
                  }}
                >
                  <div className="text-5xl font-black text-indigo-100 leading-none mb-3 select-none group-hover:text-indigo-200 transition-colors">"</div>

                  <Stars count={review.rating} />

                  {review.title && (
                    <p className="text-slate-800 font-bold text-sm mt-3 leading-snug">{review.title}</p>
                  )}

                  <p className="text-slate-600 text-sm leading-relaxed mt-3 flex-1">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-white font-bold text-base">{initials(name)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{name}</p>
                      <p className="text-xs text-indigo-500 font-medium mt-0.5">{service}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rating summary */}
        {!loading && reviews.length > 0 && (
          <div
            ref={summaryRef}
            className={`mt-14 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-indigo-100 rounded-3xl p-8 lg:p-10 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              summaryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-16 text-center">
              <div>
                <p className="text-6xl font-black text-indigo-700 leading-none">{avgRating}</p>
                <div className="mt-2 flex justify-center"><Stars count={Math.round(parseFloat(avgRating))} /></div>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">Average rating</p>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
              <div>
                <p className="text-5xl font-black text-slate-900 leading-none">{reviews.length}+</p>
                <p className="text-slate-500 mt-2 font-medium">Verified reviews</p>
              </div>
              <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />
              <div>
                <p className="text-5xl font-black text-emerald-600 leading-none">
                  {reviews.length > 0
                    ? `${Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%`
                    : '—'}
                </p>
                <p className="text-slate-500 mt-2 font-medium">Would recommend us</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
