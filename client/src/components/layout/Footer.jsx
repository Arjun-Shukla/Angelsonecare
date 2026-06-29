import { Link } from 'react-router-dom';
import { HeartIcon, PhoneIcon, MailIcon, MapPinIcon, ArrowRightIcon } from '../common/icons.jsx';

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

const SOCIALS = [
  { key: 'F', label: 'facebook' },
  { key: 'T', label: 'twitter' },
  { key: 'I', label: 'instagram' },
  { key: 'L', label: 'linkedin' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">

      {/* CTA Band */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 py-14">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 left-12 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative section-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Ready to book a healthcare service?
            </h2>
            <p className="text-indigo-200 mt-1.5 text-lg">Get professional care delivered right to your doorstep.</p>
          </div>
          <Link
            to="/book"
            className="shrink-0 inline-flex items-center gap-2.5 bg-white text-indigo-700 font-bold px-8 py-4 rounded-full hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group"
          >
            Book a Service
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-[17px] leading-none tracking-tight">Angels One</p>
                <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-500 mt-0.5">
                  Healthcare Services
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Bringing compassionate, professional healthcare to your home. Trusted by thousands of families across India.
            </p>
            <div className="flex gap-2.5">
              {SOCIALS.map(({ key, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-xs font-bold text-slate-400 hover:text-white">{key}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-slate-500 hover:text-white transition-colors duration-200 hover:pl-1 inline-block">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="text-sm text-slate-500 hover:text-white transition-colors duration-200 hover:pl-1 inline-block">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-slate-500 hover:text-white transition-colors duration-200 hover:pl-1 inline-block">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm tracking-widest uppercase">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <PhoneIcon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">+91 98765 43210</p>
                  <p className="text-xs text-slate-600 mt-0.5">Mon – Sat, 8 AM – 9 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MailIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white font-semibold">care@angelsone.in</p>
                  <p className="text-xs text-slate-600 mt-0.5">We reply within 24 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPinIcon className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Lucknow, Uttar Pradesh, India</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/70">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Angels One Healthcare Services. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((t) => (
              <a key={t} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
