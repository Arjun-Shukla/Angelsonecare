import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MenuIcon, XMarkIcon } from '../common/icons.jsx';

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Services',     href: '#services' },
  { label: 'Why Us',       href: '#why-us' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = scrolled
    ? 'text-slate-700 hover:text-blue-600'
    : 'text-white/90 hover:text-white';

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
      aria-label="Main navigation"
    >
      <div className="section-container flex items-center justify-between">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group" aria-label="Angels One Home">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors">
            <HeartIcon className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className={`font-bold text-[17px] leading-none ${scrolled ? 'text-blue-700' : 'text-white'}`}>
              Angels One
            </p>
            <p className={`text-[10px] font-medium tracking-widest uppercase ${scrolled ? 'text-teal-600' : 'text-blue-200'}`}>
              Healthcare Services
            </p>
          </div>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${linkClass}`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className={`text-sm font-semibold transition-colors ${linkClass}`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`text-sm font-semibold px-5 py-2.5 rounded-full border-2 transition-all ${
              scrolled
                ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-blue-700'
            }`}
          >
            Sign Up
          </Link>
          <Link
            to="/book"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden p-2 rounded-lg"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen
            ? <XMarkIcon className={`w-6 h-6 ${scrolled ? 'text-slate-800' : 'text-white'}`} />
            : <MenuIcon  className={`w-6 h-6 ${scrolled ? 'text-slate-800' : 'text-white'}`} />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 mt-2 mb-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-2">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium text-sm transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 p-4 border-t border-slate-100">
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
              className="border-2 border-blue-600 text-blue-600 font-semibold py-2.5 rounded-full text-center text-sm hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/book"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-600 text-white font-semibold py-2.5 rounded-full text-center text-sm hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
