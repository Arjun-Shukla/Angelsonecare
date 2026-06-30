import { Link } from 'react-router-dom';
import { HeartIcon, ShieldCheckIcon, BoltIcon, ClockIcon, ArrowLeftIcon } from '../common/icons.jsx';

const TRUST_POINTS = [
  { icon: ShieldCheckIcon, text: 'Every caregiver is government-verified and background-checked' },
  { icon: BoltIcon,        text: 'OTP-secured service completion - fully fraud-proof' },
  { icon: ClockIcon,       text: '24/7 support and real-time booking status tracking' },
];

export default function AuthLayout({ children, heading, subheading }) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel (desktop only) ── */}
      <aside
        className="hidden lg:flex lg:w-[42%] xl:w-2/5 relative flex-col bg-gradient-to-br from-indigo-950 via-indigo-700 to-emerald-600 overflow-hidden"
        aria-hidden="true"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        {/* Blobs */}
        <div className="absolute -top-28 -left-28 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[28rem] h-[28rem] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">

          {/* Logo */}
          <Link to="/" tabIndex={-1} className="flex items-center gap-3 group w-fit">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-white leading-none">Angels One</p>
              <p className="text-[10px] text-indigo-200 tracking-widest uppercase">Healthcare Services</p>
            </div>
          </Link>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center mt-10 gap-8">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-200 bg-white/10 px-3 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Trusted by 2,000+ families across India
              </span>
              <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight">
                Professional Care,<br />
                <span className="text-emerald-300">Right at Home.</span>
              </h2>
              <p className="text-indigo-100 mt-4 text-sm xl:text-base leading-relaxed max-w-sm">
                Join thousands of families who rely on Angels One Health Care for verified, compassionate home healthcare.
              </p>
            </div>

            <ul className="space-y-3.5">
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-emerald-300" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-indigo-100 leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          {/* <div className="mt-auto pt-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mt-3.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">P</div>
                <div>
                  <p className="text-white text-xs font-semibold">Priya Sharma</p>
                  <p className="text-indigo-200 text-xs">Home Nursing Client, Lucknow</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </aside>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-slate-100 shrink-0">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 lg:hidden group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm text-indigo-700 leading-none">Angels One</p>
              <p className="text-[10px] text-emerald-600 tracking-widest uppercase">Healthcare</p>
            </div>
          </Link>

          {/* Back link (desktop) */}
          <Link
            to="/"
            className="hidden lg:inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to website
          </Link>

          {/* Back link (mobile) */}
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
        </header>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center overflow-y-auto px-6 sm:px-8 py-10">
          <div className="w-full max-w-md">
            {(heading || subheading) && (
              <div className="mb-8">
                {heading && (
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{heading}</h1>
                )}
                {subheading && (
                  <p className="mt-2 text-slate-500 text-sm sm:text-base">{subheading}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>

        <footer className="text-center text-xs text-slate-400 py-5 border-t border-slate-100 shrink-0">
          © {new Date().getFullYear()} Angels One Healthcare Services. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
