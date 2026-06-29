import { ShieldCheckIcon, ClockIcon, BoltIcon, UserGroupIcon, CurrencyRupeeIcon, SparklesIcon, ArrowRightIcon } from '../common/icons.jsx';
import { useInView } from '../../hooks/useInView.js';

const FEATURES = [
  {
    icon:  ShieldCheckIcon,
    color: 'indigo',
    title: 'Government-Verified Caregivers',
    desc:  'Every professional on our platform is background-checked, credential-verified, and trained to healthcare standards before joining.',
  },
  {
    icon:  BoltIcon,
    color: 'emerald',
    title: 'OTP-Secured Completion',
    desc:  'Services are only marked complete after the client verifies a one-time PIN, ensuring accountability and preventing fraud.',
  },
  {
    icon:  ClockIcon,
    color: 'violet',
    title: 'Real-Time Progress Tracking',
    desc:  'Follow your service live — from acceptance and assignment to each progress update — right from your dashboard.',
  },
  {
    icon:  ClockIcon,
    color: 'amber',
    title: '24/7 Customer Support',
    desc:  'Our support team is available round the clock to resolve queries, escalate issues, and ensure a smooth experience.',
  },
  {
    icon:  CurrencyRupeeIcon,
    color: 'rose',
    title: 'Transparent, Affordable Pricing',
    desc:  'No hidden charges. See the full service cost before booking, with flexible payment options including Razorpay.',
  },
  {
    icon:  SparklesIcon,
    color: 'teal',
    title: 'Effortless Online Booking',
    desc:  'Book any service in under two minutes — select, schedule, pay, and relax while we handle the rest.',
  },
];

const colorMap = {
  indigo:  { bg: 'bg-indigo-100',  icon: 'text-indigo-600',  glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]',   accent: 'group-hover:bg-indigo-600  group-hover:text-white' },
  emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]',   accent: 'group-hover:bg-emerald-600 group-hover:text-white' },
  violet:  { bg: 'bg-violet-100',  icon: 'text-violet-600',  glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',   accent: 'group-hover:bg-violet-600  group-hover:text-white' },
  amber:   { bg: 'bg-amber-100',   icon: 'text-amber-600',   glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',   accent: 'group-hover:bg-amber-500   group-hover:text-white' },
  rose:    { bg: 'bg-rose-100',    icon: 'text-rose-500',    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',   accent: 'group-hover:bg-rose-500    group-hover:text-white' },
  teal:    { bg: 'bg-teal-100',    icon: 'text-teal-600',    glow: 'group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]',   accent: 'group-hover:bg-teal-600    group-hover:text-white' },
};

export default function WhyChooseUs() {
  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [gridRef,   gridInView]   = useInView({ threshold: 0.05 });
  const [ctaRef,    ctaInView]    = useInView({ threshold: 0.2 });

  return (
    <section id="why-us" className="section-padding bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
      <div className="section-container">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="section-badge">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-4">
            Built for Your{' '}
            <span className="text-gradient">Peace of Mind</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            We combine technology with compassion to deliver a healthcare experience you can truly rely on.
          </p>
        </div>

        {/* Feature grid — staggered reveal */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc }, i) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group bg-white rounded-3xl p-7 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 ${c.glow} cursor-default`}
                style={{
                  opacity:          gridInView ? 1 : 0,
                  transform:        gridInView ? 'translateY(0)' : 'translateY(28px)',
                  transitionProperty: 'opacity, transform, box-shadow',
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay:  gridInView ? `${i * 80}ms` : '0ms',
                }}
              >
                <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.accent} flex items-center justify-center mb-5 transition-all duration-300`}>
                  <Icon className={`w-6 h-6 ${c.icon} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2.5 leading-snug">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div
          ref={ctaRef}
          className={`mt-16 relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 rounded-3xl p-8 lg:p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 left-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Join 2,000+ families who trust Angels One
              </p>
              <p className="text-indigo-200 mt-2">Start with a free consultation — no commitment required.</p>
            </div>
            <a
              href="#contact"
              className="shrink-0 inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Get a Free Consultation
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
