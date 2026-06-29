import { Link } from 'react-router-dom';
import { HeartIcon, PhoneIcon, MailIcon, MapPinIcon } from '../common/icons.jsx';

const QUICK_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'About Us',     href: '#about' },
  { label: 'Services',     href: '#services' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Contact',      href: '#contact' },
];

const SERVICES = [
  'Home Nursing Care',
  'Elder Care',
  'Post-Surgery Care',
  'Physiotherapy',
  'Baby & Mother Care',
  'Medical Equipment',
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top band */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-600 py-12">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ready to book a healthcare service?
            </h2>
            <p className="text-blue-100 mt-1">Get professional care delivered right to your doorstep.</p>
          </div>
          <Link
            to="/book"
            className="shrink-0 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            Book a Service
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-[17px] leading-none">Angels One</p>
                <p className="text-[10px] font-medium tracking-widest uppercase text-teal-400">
                  Healthcare Services
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bringing compassionate, professional healthcare to your home. Trusted by thousands of families across India.
            </p>
            <div className="flex gap-3 mt-5">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-bold text-slate-300 capitalize">{s[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide uppercase">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">+91 98765 43210</p>
                  <p className="text-xs text-slate-500">Mon – Sat, 8 AM – 9 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MailIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-medium">care@angelsone.in</p>
                  <p className="text-xs text-slate-500">We reply within 24 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-400">Lucknow, Uttar Pradesh, India</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Angels One Healthcare Services. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <a key={t} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
