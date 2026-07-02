import { useState } from 'react';
import { TESTIMONIALS } from '../../data/testimonials.js';

/* ─── Avatar colour palette (one per testimonial, cycles if more are added) ─── */
const AVATAR_GRADIENTS = [
  'from-indigo-400 to-indigo-600',
  'from-emerald-400 to-emerald-600',
  'from-violet-400 to-violet-600',
  'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-600',
  'from-fuchsia-400 to-purple-600',
];

/* ─── Service badge colour map ─────────────────────────────────────────────── */
const SERVICE_STYLES = {
  'Home Nursing':   'bg-indigo-50  text-indigo-700',
  'Elder Care':     'bg-emerald-50 text-emerald-700',
  'Attendant Care': 'bg-violet-50  text-violet-700',
  'Physiotherapy':  'bg-teal-50    text-teal-700',
  'Baby Care':      'bg-rose-50    text-rose-600',
};

/* ─── Star rating ──────────────────────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Single testimonial card ──────────────────────────────────────────────── */
function TestimonialCard({ name, location, service, rating, review, image, colorIndex }) {
  const initials  = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient  = AVATAR_GRADIENTS[colorIndex % AVATAR_GRADIENTS.length];
  const badgeStyle = SERVICE_STYLES[service] ?? 'bg-slate-50 text-slate-600';

  return (
    <article className="
      w-[300px] sm:w-[340px] lg:w-[360px]
      flex-shrink-0 flex flex-col gap-4
      bg-white rounded-2xl p-6
      border border-slate-100
      shadow-card
      transition-all duration-300 ease-out
      hover:-translate-y-2 hover:shadow-card-hover
    ">
      {/* Author row */}
      <div className="flex items-center gap-3">
        {/* Avatar: shows initials by default; photo overlays if it loads */}
        <div className="relative w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden">
          <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-bold text-sm select-none`}>
            {initials}
          </div>
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none'; }}
            loading="lazy"
          />
        </div>

        {/* Name + location */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-800 text-sm leading-snug truncate">{name}</p>
          <p className="text-xs text-slate-400 truncate">{location}</p>
        </div>

        {/* Service badge */}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${badgeStyle}`}>
          {service}
        </span>
      </div>

      {/* Stars */}
      <Stars count={rating} />

      {/* Review body */}
      <p className="text-sm text-slate-600 leading-relaxed flex-1">
        &ldquo;{review}&rdquo;
      </p>
    </article>
  );
}

/* ─── Duplicate items for seamless infinite loop ───────────────────────────── */
const TRACK_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

/* ─── Main slider section ──────────────────────────────────────────────────── */
export default function TestimonialSlider() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50/80 to-white overflow-hidden">

      {/* Section header */}
      <div className="section-container text-center mb-14">
        <span className="section-badge">❤️ Real Care Stories</span>
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
          Trusted by{' '}
          <span className="text-gradient">Thousands of Families</span>
          <br className="hidden sm:block" />
          {' '}across India.
        </h2>
        <p className="mt-4 text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          Real stories from families who chose Angels Onecare for their loved ones.
        </p>
      </div>

      {/* Slider track — mask creates the fade-out edges */}
      <div
        className="relative"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
        aria-label="Customer testimonials"
        role="region"
      >
        <div
          className="flex gap-5 w-max py-4 px-2"
          style={{
            animation: 'testimonial-marquee 55s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {TRACK_ITEMS.map((t, i) => (
            <TestimonialCard
              key={`${t.id}-${i}`}
              {...t}
              colorIndex={i % TESTIMONIALS.length}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
