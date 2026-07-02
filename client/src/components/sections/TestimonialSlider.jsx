import { useState } from 'react';
import { TESTIMONIALS } from '../../data/testimonials.js';

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-indigo-700',
  'from-emerald-400 to-emerald-700',
  'from-violet-400 to-violet-700',
  'from-teal-400 to-teal-700',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-sky-400 to-blue-700',
  'from-fuchsia-400 to-purple-700',
];

const SERVICE_STYLES = {
  'Home Nursing':   'bg-indigo-500/30  text-indigo-200  border-indigo-400/30',
  'Elder Care':     'bg-emerald-500/30 text-emerald-200 border-emerald-400/30',
  'Attendant Care': 'bg-violet-500/30  text-violet-200  border-violet-400/30',
  'Physiotherapy':  'bg-teal-500/30    text-teal-200    border-teal-400/30',
  'Baby Care':      'bg-rose-500/30    text-rose-200    border-rose-400/30',
};

function Stars({ count }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-white/20'}`}
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

function TestimonialCard({ name, location, service, rating, review, image, imagePosition, imageStyle, colorIndex }) {
  const initials   = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient   = AVATAR_GRADIENTS[colorIndex % AVATAR_GRADIENTS.length];
  const badgeStyle = SERVICE_STYLES[service] ?? 'bg-white/20 text-white/80 border-white/20';

  return (
    <article className="
      w-[300px] sm:w-[340px]
      flex-shrink-0 flex flex-col
      rounded-2xl overflow-hidden
      border border-white/10
      bg-white/8 backdrop-blur-xl
      shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]
      transition-all duration-500 ease-out
      hover:-translate-y-2
      hover:bg-white/14
      hover:border-white/20
      hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
    ">

      {/* ── Large photo area ── */}
      <div className="relative h-96 w-full flex-shrink-0 overflow-hidden">
        {/* Gradient fallback / background always visible */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-white/30 font-black text-7xl select-none">{initials}</span>
        </div>

        {/* Actual photo */}
        {image && (
          <img
            src={image}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover ${imagePosition ?? 'object-center'}`}
            style={imageStyle}
            onError={e => { e.currentTarget.style.display = 'none'; }}
            loading="lazy"
          />
        )}

        {/* Bottom gradient scrim so text below blends */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Service badge pinned to bottom-left */}
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full border backdrop-blur-sm ${badgeStyle}`}>
          {service}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-3 p-5 flex-1">

        {/* Stars */}
        <Stars count={rating} />

        {/* Quote */}
        <p className="text-sm text-white/75 leading-relaxed flex-1">
          &ldquo;{review}&rdquo;
        </p>

        {/* Divider */}
        <div className="h-px bg-white/10" />

        {/* Name + location */}
        <div>
          <p className="font-bold text-white text-sm">{name}</p>
          <p className="text-xs text-white/45 mt-0.5">{location}</p>
        </div>
      </div>
    </article>
  );
}

const TRACK_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialSlider() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #1a1040 70%, #0d1b2a 100%)' }}
    >
      {/* ── Decorative background blobs ── */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/25 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

      {/* ── Section header ── */}
      <div className="section-container text-center mb-14 relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/15">
          ❤️ Real Care Stories
        </span>
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
          Trusted by{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
            Thousands of Families
          </span>
          <br className="hidden sm:block" />
          {' '}across India.
        </h2>
        <p className="mt-4 text-white/50 text-base sm:text-lg max-w-xl mx-auto">
          Real stories from families who chose Angels One Health care for their loved ones.
        </p>
      </div>

      {/* ── Slider ── */}
      <div
        className="relative z-10"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onTouchCancel={() => setPaused(false)}
        role="region"
        aria-label="Customer testimonials"
      >
        <div
          className="flex gap-5 w-max py-6 px-2"
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
