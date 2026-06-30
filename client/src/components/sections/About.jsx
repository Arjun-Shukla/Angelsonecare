import { CheckCircleIcon, HeartIcon, ShieldCheckIcon, UserGroupIcon } from '../common/icons.jsx';
import { useInView } from '../../hooks/useInView.js';
import CountUp from '../common/CountUp.jsx';

const VALUES = [
  { icon: HeartIcon,       label: 'Compassionate Care',  desc: 'We treat every client like family, with warmth and empathy.' },
  { icon: ShieldCheckIcon, label: 'Verified Caregivers', desc: 'Background-checked and credentialed healthcare professionals.' },
  { icon: UserGroupIcon,   label: 'Family-Centred',      desc: 'We keep families informed and involved every step of the way.' },
];

const ACHIEVEMENTS = [
  { target: 5,    suffix: '+', label: 'Years of Service',  color: 'text-indigo-700' },
  { target: 2000, suffix: '+', label: 'Satisfied Clients', color: 'text-emerald-600' },
  { target: 50,   suffix: '+', label: 'Expert Caregivers', color: 'text-indigo-700' },
  { target: 5,   suffix: '+', label: 'Cities Covered',    color: 'text-emerald-600' },
];

// Returns className + style for a reveal transition
function slideIn(inView, delay = 0, direction = 'up') {
  const base   = 'transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const hidden = direction === 'left'
    ? 'opacity-0 -translate-x-12'
    : direction === 'right'
      ? 'opacity-0 translate-x-12'
      : 'opacity-0 translate-y-8';
  return {
    className: `${base} ${inView ? 'opacity-100 translate-x-0 translate-y-0' : hidden}`,
    style:     { transitionDelay: inView ? `${delay}ms` : '0ms' },
  };
}

export default function About() {
  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [gridRef,   gridInView]   = useInView({ threshold: 0.08 });

  const leftAnim   = slideIn(gridInView, 0,   'left');
  const rightAnim  = slideIn(gridInView, 150, 'right');
  const headerAnim = slideIn(headerInView, 0, 'up');

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="section-container">

        {/* Section label */}
        <div
          ref={headerRef}
          className={`flex justify-center mb-16 ${headerAnim.className}`}
          style={headerAnim.style}
        >
          <span className="section-badge">About Us</span>
        </div>

        <div ref={gridRef} className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – visual card */}
          <div className={`relative order-2 lg:order-1 ${leftAnim.className}`} style={leftAnim.style}>

            {/* Decorative ring */}
            <div className="absolute -inset-4 bg-gradient-to-br from-indigo-100 to-emerald-50 rounded-[2.5rem] opacity-50 pointer-events-none" />

            {/* Main card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-600 p-0.5 rounded-3xl">
                <div className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 rounded-[calc(1.5rem-2px)] p-10 min-h-[440px] flex flex-col items-center justify-center gap-8">

                  {/* Central icon */}
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center shadow-glow-indigo">
                      <HeartIcon className="w-14 h-14 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-400 border-4 border-white shadow-sm animate-pulse-soft" />
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-slate-900">Our Mission</p>
                    <p className="text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed text-sm">
                      To make quality healthcare accessible, affordable, and personal - wherever you are.
                    </p>
                  </div>

                  {/* Achievements grid with animated counters */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                    {ACHIEVEMENTS.map(({ target, suffix, label, color }) => (
                      <div
                        key={label}
                        className="bg-white rounded-2xl p-4 text-center shadow-card border border-slate-100/80 hover:border-indigo-100 transition-colors"
                      >
                        <p className={`text-2xl font-black ${color}`}>
                          <CountUp target={target} suffix={suffix} />
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 animate-float">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">100% Verified</p>
                <p className="text-xs text-slate-500">All caregivers are certified</p>
              </div>
            </div>
          </div>

          {/* Right – content */}
          <div className={`order-1 lg:order-2 ${rightAnim.className}`} style={rightAnim.style}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Healthcare You Can{' '}
              <span className="text-gradient">Trust & Count On</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-5">
              Angels One Healthcare Services was founded with a simple belief: everyone deserves access
              to professional, compassionate healthcare - right in the comfort of their own home.
            </p>

            <p className="text-slate-500 leading-relaxed mb-10">
              Whether you need a nurse for post-surgery care, a physiotherapist for rehabilitation, or a
              caregiver for your elderly loved ones, we bring experienced professionals to your doorstep -
              vetted, trained, and ready to serve.
            </p>

            {/* Core values — stagger each row after the column slides in */}
            <div className="space-y-4 mb-10">
              {VALUES.map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={label}
                  className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-indigo-50/50 group cursor-default transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    gridInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                  }`}
                  style={{ transitionDelay: gridInView ? `${300 + i * 100}ms` : '0ms' }}
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 group-hover:bg-indigo-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Explore Our Services
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
