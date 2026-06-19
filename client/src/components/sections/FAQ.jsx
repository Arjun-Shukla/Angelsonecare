import { useState } from 'react';
import { ChevronDownIcon } from '../common/icons.jsx';

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

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-4 text-left px-6 py-5 transition-colors ${
          open ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
        }`}
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm sm:text-base ${open ? 'text-blue-700' : 'text-slate-800'}`}>
          {q}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-blue-600' : 'text-slate-400'
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section-padding bg-slate-50">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            Everything you need to know before booking your first service.
          </p>
        </div>

        {/* Two-column FAQ layout on large screens */}
        <div className="grid lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQS.slice(0, 4).map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
          {FAQS.slice(4).map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            Talk to Our Team
          </a>
        </div>
      </div>
    </section>
  );
}
