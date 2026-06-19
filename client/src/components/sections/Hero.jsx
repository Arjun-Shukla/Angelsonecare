import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { ShieldCheckIcon, UserGroupIcon, SparklesIcon, HeartIcon } from '../common/icons.jsx';

const STATS = [
  { value: '2,000+', label: 'Happy Clients',       icon: UserGroupIcon },
  { value: '50+',    label: 'Expert Caregivers',   icon: SparklesIcon },
  { value: '20+',    label: 'Healthcare Services', icon: HeartIcon },
  { value: '99%',    label: 'Satisfaction Rate',   icon: ShieldCheckIcon },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600" />

      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative section-container pt-32 pb-16">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Trusted Healthcare at Your Doorstep
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Professional Care,{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-200">
              Right at Home
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-10 max-w-2xl">
            Angels One connects you with verified, compassionate caregivers for home nursing, elder care, post-surgery recovery, and more — all with real-time tracking and OTP-secured service completion.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:shadow-2xl hover:-translate-y-0.5 text-base"
            >
              Book a Service Now
            </Link>
            <Button variant="white-outline" size="lg" href="#about">
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-10">
            {[
              '✓ Verified Professionals',
              '✓ OTP-Secured Completion',
              '✓ 24/7 Support',
            ].map((t) => (
              <span key={t} className="text-sm text-blue-200 font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative">
        <div className="section-container pb-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-teal-300" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white leading-none">{value}</p>
                    <p className="text-xs text-blue-200 font-medium mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/50">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
