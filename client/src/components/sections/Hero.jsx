import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, UserGroupIcon, SparklesIcon, HeartIcon, CheckCircleIcon, ArrowRightIcon } from '../common/icons.jsx';
import CountUp from '../common/CountUp.jsx';

const STATS = [
  { target: 2000, suffix: '+', label: 'Happy Clients',       icon: UserGroupIcon,   color: 'from-indigo-400 to-indigo-600' },
  { target: 50,   suffix: '+', label: 'Expert Caregivers',   icon: SparklesIcon,    color: 'from-emerald-400 to-emerald-600' },
  { target: 15,   suffix: '+', label: 'Healthcare Services', icon: HeartIcon,       color: 'from-violet-400 to-violet-600' },
  { target: 99,   suffix: '%', label: 'Satisfaction Rate',   icon: ShieldCheckIcon, color: 'from-amber-400 to-orange-500' },
];

const TRUST = [
  'Verified Professionals',
  'OTP-Secured Completion',
  '24/7 Support',
];

export default function Hero() {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);

  // Parallax on background blobs — direct DOM write, zero React re-renders
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (blob1Ref.current) blob1Ref.current.style.transform = `translateY(${y * 0.12}px)`;
      if (blob2Ref.current) blob2Ref.current.style.transform = `translateY(${-y * 0.08}px)`;
      if (blob3Ref.current) blob3Ref.current.style.transform = `translateY(${y * 0.05}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-hero" />

      {/* Decorative blobs — parallax via ref, float via CSS child */}
      <div ref={blob1Ref} className="absolute -top-32 -right-32 w-[500px] h-[500px] pointer-events-none">
        <div className="w-full h-full bg-indigo-500/20 rounded-full blur-3xl animate-float-slow" />
      </div>
      <div ref={blob2Ref} className="absolute -bottom-20 -left-20 w-[400px] h-[400px] pointer-events-none">
        <div className="w-full h-full bg-emerald-500/15 rounded-full blur-3xl animate-float" />
      </div>
      <div ref={blob3Ref} className="absolute top-1/3 right-1/4 w-72 h-72 pointer-events-none">
        <div className="w-full h-full bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"
        style={{ right: '25%' }}
      />

      {/* Content — staggered entry animations on page load */}
      <div className="relative section-container pt-36 pb-10">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="animate-slide-up mb-8" style={{ animationDelay: '0ms' }}>
            <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">
                Trusted Healthcare at Your Doorstep
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-7 animate-slide-up"
            style={{ animationDelay: '120ms' }}
          >
            Professional Care,{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-indigo-200">
              Right at Home
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl font-light animate-slide-up"
            style={{ animationDelay: '220ms' }}
          >
            Angels One Health connects you with verified, compassionate caregivers for home nursing, elder care,
            physiotherapy care, baby care and more with real-time tracking and OTP-secured completion.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up"
            style={{ animationDelay: '320ms' }}
          >
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2.5 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-base group"
            >
              Book a Service Now
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/20 hover:border-white/50 transition-all duration-300 text-base"
            >
              Learn More
            </a>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 animate-slide-up"
            style={{ animationDelay: '420ms' }}
          >
            {TRUST.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-white/70 font-medium">
                <CheckCircleIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip — enters last, numbers count up via CountUp */}
      <div
        className="relative section-container pb-12 animate-slide-up"
        style={{ animationDelay: '540ms' }}
      >
        <div className="glass rounded-3xl p-1">
          <div className="bg-white/5 rounded-[calc(1.5rem-4px)] px-6 py-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-white/10">
              {STATS.map(({ target, suffix, label, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-4 lg:px-8 first:lg:pl-0 last:lg:pr-0">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white leading-none tracking-tight">
                      <CountUp target={target} suffix={suffix} duration={1600} />
                    </p>
                    <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/40 animate-fade-in"
        style={{ animationDelay: '1000ms' }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
