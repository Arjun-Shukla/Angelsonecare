import { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from '../common/icons.jsx';

const CONTACT_INFO = [
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '+91 98765 43210',
    sub: 'Mon – Sat, 8 AM – 9 PM',
    href: 'tel:+919876543210',
  },
  {
    icon: MailIcon,
    label: 'Email',
    value: 'care@angelsone.in',
    sub: 'We reply within 24 hours',
    href: 'mailto:care@angelsone.in',
  },
  {
    icon: MapPinIcon,
    label: 'Address',
    value: 'Lucknow, Uttar Pradesh',
    sub: 'India – 226001',
    href: '#',
  },
  {
    icon: ClockIcon,
    label: 'Working Hours',
    value: 'Mon – Sat: 8 AM – 9 PM',
    sub: 'Emergency support: 24/7',
    href: '#',
  },
];

const SERVICES_LIST = [
  'Home Nursing Care',
  'Elder Care',
  'Post-Surgery Care',
  'Physiotherapy',
  'Baby & Mother Care',
  'Medical Equipment',
  'Other',
];

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]  = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulated submit delay — backend integration comes later
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Get in Touch with{' '}
            <span className="text-gradient">Our Team</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            Book a service, ask a question, or request a free consultation — we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact info sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{value}</p>
                  <p className="text-sm text-slate-500">{sub}</p>
                </div>
              </a>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100 border border-blue-100 h-40 flex items-center justify-center">
              <div className="text-center">
                <MapPinIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">Lucknow, Uttar Pradesh</p>
                <p className="text-xs text-slate-400">Map will appear here</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                    <CheckCircleIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 max-w-xs">
                    Thank you for reaching out. Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                    className="mt-6 text-sm text-blue-600 font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h3>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="label-style" htmlFor="name">Full Name *</label>
                      <input
                        id="name" name="name" type="text" required
                        value={form.name} onChange={onChange}
                        placeholder="Your full name"
                        className="input-style"
                      />
                    </div>
                    <div>
                      <label className="label-style" htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone" name="phone" type="tel" required
                        value={form.phone} onChange={onChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="input-style"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="label-style" htmlFor="email">Email Address</label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={onChange}
                      placeholder="you@example.com"
                      className="input-style"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="label-style" htmlFor="service">Service Required</label>
                    <select
                      id="service" name="service"
                      value={form.service} onChange={onChange}
                      className="input-style bg-white"
                    >
                      <option value="">Select a service…</option>
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : 'Send Message'}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-4">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
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
