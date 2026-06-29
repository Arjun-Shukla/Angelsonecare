import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MenuIcon, XMarkIcon } from '../common/icons.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Services',     href: '#services' },
  { label: 'Why Us',       href: '#why-us' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
];

const DASHBOARD_PATH = {
  CLIENT: '/app',
  LEADER: '/leader',
  ADMIN:  '/admin',
};

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [progress,  setProgress]  = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight > clientHeight) {
        setProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboardPath = user ? (DASHBOARD_PATH[user.role] ?? '/app') : '/login';
  const firstName     = user?.name?.split(' ')[0] ?? '';
  const initial       = user?.name?.charAt(0).toUpperCase() ?? '';

  const linkClass = scrolled
    ? 'text-slate-600 hover:text-indigo-600'
    : 'text-white/85 hover:text-white';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100 py-3'
          : 'bg-transparent py-5'
      }`}
      aria-label="Main navigation"
    >
      {/* Scroll progress indicator */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 pointer-events-none transition-opacity duration-300"
        style={{ width: `${progress}%`, opacity: scrolled ? 1 : 0 }}
      />

      <div className="section-container flex items-center justify-between">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group" aria-label="Angels One Home">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${
            scrolled ? 'bg-indigo-600 group-hover:bg-indigo-700' : 'bg-white/15 backdrop-blur-sm border border-white/30 group-hover:bg-white/25'
          }`}>
            <HeartIcon className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="leading-tight">
            <p className={`font-bold text-[17px] leading-none tracking-tight transition-colors ${scrolled ? 'text-indigo-700' : 'text-white'}`}>
              Angels One
            </p>
            <p className={`text-[10px] font-semibold tracking-widest uppercase transition-colors ${scrolled ? 'text-emerald-600' : 'text-emerald-300'}`}>
              Healthcare Services
            </p>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`relative text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 group ${linkClass}`}
            >
              {label}
              <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ${
                scrolled ? 'bg-indigo-500' : 'bg-white/60'
              }`} />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className={`flex items-center gap-2.5 text-sm font-semibold transition-colors px-2 py-1.5 rounded-lg ${
                  scrolled ? 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {initial}
                </span>
                {firstName}
              </Link>
              <Link
                to={dashboardPath}
                className={`text-sm font-semibold px-5 py-2.5 rounded-full border-2 transition-all duration-200 ${
                  scrolled
                    ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    : 'border-white/60 text-white hover:border-white hover:bg-white hover:text-indigo-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Book Now
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                  scrolled ? 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50' : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`text-sm font-semibold px-5 py-2.5 rounded-full border-2 transition-all duration-200 ${
                  scrolled
                    ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    : 'border-white/60 text-white hover:border-white hover:bg-white hover:text-indigo-700'
                }`}
              >
                Sign Up
              </Link>
              <Link
                to="/book"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${
            scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
          }`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen
            ? <XMarkIcon className="w-6 h-6" />
            : <MenuIcon  className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 mt-2 mb-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-2">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium text-sm transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2 bg-white rounded-xl border border-slate-100">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-indigo-500 font-medium">{user.role}</p>
                  </div>
                </div>
                <Link
                  to={dashboardPath}
                  onClick={() => setMenuOpen(false)}
                  className="border-2 border-indigo-600 text-indigo-600 font-semibold py-2.5 rounded-full text-center text-sm hover:bg-indigo-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/book"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-2.5 rounded-full text-center text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all"
                >
                  Book Now
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-700 font-semibold py-2.5 text-center text-sm rounded-full hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="border-2 border-indigo-600 text-indigo-600 font-semibold py-2.5 rounded-full text-center text-sm hover:bg-indigo-50 transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  to="/book"
                  onClick={() => setMenuOpen(false)}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-2.5 rounded-full text-center text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
