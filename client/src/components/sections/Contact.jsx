import { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '../common/icons.jsx';
import { sendContactMessage } from '../../api/message.api.js';
import { useInView } from '../../hooks/useInView.js';

const CONTACT_INFO = [
  {
    icon:  PhoneIcon,
    label: 'Phone',
    value: '+91 98765 43210',
    sub:   'Mon – Sat, 8 AM – 9 PM',
    href:  'tel:+919876543210',
    color: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
  },
  {
    icon:  MailIcon,
    label: 'Email',
    value: 'care@angelsone.in',
    sub:   'We reply within 24 hours',
    href:  'mailto:care@angelsone.in',
    color: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    icon:  MapPinIcon,
    label: 'Address',
    value: 'Lucknow, Uttar Pradesh',
    sub:   'India – 226001',
    href:  '#',
    color: 'bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
  },
  {
    icon:  ClockIcon,
    label: 'Working Hours',
    value: 'Mon – Sat: 8 AM – 9 PM',
    sub:   'Emergency support: 24/7',
    href:  '#',
    color: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
  },
];

const SERVICES_LIST = [
  'Home Nursing Care', 'Elder Care', 'Post-Surgery Care',
  'Physiotherapy', 'Baby & Mother Care', 'Medical Equipment', 'Other',
];

export default function Contact() {
  const [form, setForm]           = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [sideRef,   sideInView]   = useInView({ threshold: 0.1 });
  const [formRef,   formInView]   = useInView({ threshold: 0.1 });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendContactMessage(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="section-container">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="section-badge">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-4">
            Get in Touch with{' '}
            <span className="text-gradient">Our Team</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            Book a service, ask a question, or request a free consultation — we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* Contact info sidebar — slides from left */}
          <div
            ref={sideRef}
            className={`lg:col-span-2 space-y-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              sideInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href, color }, i) => (
              <a
                key={label}
                href={href}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group"
                style={{
                  opacity:            sideInView ? 1 : 0,
                  transitionDelay:    sideInView ? `${i * 80}ms` : '0ms',
                  transitionProperty: 'opacity, border-color, box-shadow, transform',
                  transitionDuration: '400ms',
                }}
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0 transition-all duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="font-bold text-slate-900 mt-0.5">{value}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{sub}</p>
                </div>
              </a>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-emerald-100 border border-indigo-100 h-44 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <MapPinIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm text-slate-700 font-semibold">Lucknow, Uttar Pradesh</p>
                <p className="text-xs text-slate-500 mt-0.5">India – 226001</p>
              </div>
            </div>
          </div>

          {/* Form — slides from right */}
          <div
            ref={formRef}
            className={`lg:col-span-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              formInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: formInView ? '150ms' : '0ms' }}
          >
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-card">

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-6 shadow-glow-emerald">
                    <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 max-w-xs leading-relaxed">
                    Thank you for reaching out. Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                    className="mt-7 inline-flex items-center gap-2 text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h3 className="text-xl font-black text-slate-900 mb-7 tracking-tight">Send Us a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="label-style" htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" required value={form.name} onChange={onChange} placeholder="Your full name" className="input-style" />
                    </div>
                    <div>
                      <label className="label-style" htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" required value={form.phone} onChange={onChange} placeholder="+91 XXXXX XXXXX" className="input-style" />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="label-style" htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" className="input-style" />
                  </div>

                  <div className="mb-5">
                    <label className="label-style" htmlFor="service">Service Required</label>
                    <select id="service" name="service" value={form.service} onChange={onChange} className="input-style bg-white">
                      <option value="">Select a service…</option>
                      {SERVICES_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="mb-7">
                    <label className="label-style" htmlFor="message">Message *</label>
                    <textarea
                      id="message" name="message" rows={4} required
                      value={form.message} onChange={onChange}
                      placeholder="Tell us about your requirements — patient condition, preferred schedule, location, etc."
                      className="input-style resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2.5 hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-indigo-500 hover:text-indigo-700 hover:underline transition-colors">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
