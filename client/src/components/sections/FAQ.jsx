import { useState } from 'react';
import { ChevronDownIcon } from '../common/icons.jsx';
import { useInView } from '../../hooks/useInView.js';

const FAQS = [
  {
    q: 'How do I book a service?',
    a: "Simply create an account, browse our services, select the one you need, choose a date and time, complete payment via Razorpay, and we'll confirm your booking instantly. You'll receive a confirmation email with all the details.",
  },
  {
    q: 'How are caregivers verified?',
    a: 'Every caregiver on Angels One undergoes a thorough background check, credential verification, and identity validation before being onboarded. We also conduct regular performance reviews and client feedback assessments.',
  },
  {
    q: 'What is OTP verification for service completion?',
    a: 'When a service is completed, the caregiver enters a one-time PIN that you receive on your registered mobile number. This ensures the service was actually delivered and prevents unauthorised closure of bookings.',
  },
  {
    q: 'Can I track my service in real time?',
    a: 'Yes! Your dashboard shows live booking status updates — from Pending to Accepted, In Progress, and Completed. You also receive real-time notifications at each stage of the service.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We support all major payment methods through our Razorpay integration — UPI, credit/debit cards, net banking, wallets, and EMI options are all available. All transactions are encrypted and secure.',
  },
  {
    q: 'Can I cancel or reschedule a booking?',
    a: 'Yes. You can cancel or reschedule from your dashboard before the service begins. Cancellation policies vary by service type — full details are shown at the time of booking.',
  },
  {
    q: 'Are services available on weekends and holidays?',
    a: 'Our customer support is available 24/7, and most of our services operate 7 days a week including public holidays. Service availability may vary by location — contact us for specific schedules.',
  },
  {
    q: 'Which areas do you currently serve?',
    a: 'We currently serve Lucknow, Kanpur, Varanasi, Allahabad, and surrounding areas in Uttar Pradesh. We are rapidly expanding — check our website or contact us to see if we serve your location.',
  },
];

function FAQItem({ q, a, visible, delay }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-200 ${open ? 'border-indigo-200 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
      style={{
        opacity:          visible ? 1 : 0,
        transform:        visible ? 'translateY(0)' : 'translateY(20px)',
        transitionProperty: 'opacity, transform, border-color, box-shadow',
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay:  visible ? `${delay}ms` : '0ms',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-4 text-left px-6 py-5 transition-colors duration-200 ${
          open ? 'bg-indigo-50' : 'bg-white hover:bg-slate-50'
        }`}
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug ${open ? 'text-indigo-700' : 'text-slate-800'}`}>
          {q}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          open ? 'bg-indigo-600 rotate-180' : 'bg-slate-100'
        }`}>
          <ChevronDownIcon className={`w-4 h-4 transition-colors ${open ? 'text-white' : 'text-slate-500'}`} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-6 pt-4 text-slate-600 text-sm leading-relaxed border-t border-indigo-100 bg-white">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [listRef,   listInView]   = useInView({ threshold: 0.05 });
  const [ctaRef,    ctaInView]    = useInView({ threshold: 0.5 });

  return (
    <section id="faq" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="section-container">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="section-badge">FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-4">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            Everything you need to know before booking your first service.
          </p>
        </div>

        {/* Two-column FAQ grid — staggered */}
        <div ref={listRef} className="grid lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.q}
              {...faq}
              visible={listInView}
              delay={i * 60}
            />
          ))}
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`text-center mt-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-slate-500 mb-5 font-medium">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold px-8 py-4 rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
