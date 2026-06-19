import { ShieldCheckIcon, ClockIcon, BoltIcon, UserGroupIcon, CurrencyRupeeIcon, SparklesIcon } from '../common/icons.jsx';

const FEATURES = [
  {
    icon:  ShieldCheckIcon,
    color: 'blue',
    title: 'Government-Verified Caregivers',
    desc:  'Every professional on our platform is background-checked, credential-verified, and trained to healthcare standards before joining.',
  },
  {
    icon:  BoltIcon,
    color: 'teal',
    title: 'OTP-Secured Completion',
    desc:  'Services are only marked complete after the client verifies a one-time PIN, ensuring accountability and preventing fraud.',
  },
  {
    icon:  ClockIcon,
    color: 'violet',
    title: 'Real-Time Progress Tracking',
    desc:  'Follow your service live — from acceptance and assignment to each progress update — right from your dashboard.',
  },
  {
    icon:  ClockIcon,
    color: 'orange',
    title: '24/7 Customer Support',
    desc:  'Our support team is available round the clock to resolve queries, escalate issues, and ensure a smooth experience.',
  },
  {
    icon:  CurrencyRupeeIcon,
    color: 'pink',
    title: 'Transparent, Affordable Pricing',
    desc:  'No hidden charges. See the full service cost before booking, with flexible payment options including Razorpay.',
  },
  {
    icon:  SparklesIcon,
    color: 'green',
    title: 'Effortless Online Booking',
    desc:  'Book any service in under two minutes — select, schedule, pay, and relax while we handle the rest.',
  },
];

const colorMap = {
  blue:   'bg-blue-100 text-blue-600',
  teal:   'bg-teal-100 text-teal-600',
  violet: 'bg-violet-100 text-violet-600',
  orange: 'bg-orange-100 text-orange-600',
  pink:   'bg-pink-100 text-pink-600',
  green:  'bg-green-100 text-green-600',
};

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="section-padding bg-gradient-to-br from-slate-50 to-blue-50/40">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Built for Your{' '}
            <span className="text-gradient">Peace of Mind</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            We combine technology with compassion to deliver a healthcare experience you can truly rely on.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-5`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-14 bg-gradient-to-r from-blue-700 to-teal-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-white">Join 2,000+ families who trust Angels One</p>
            <p className="text-blue-100 mt-1">Start with a free consultation — no commitment required.</p>
          </div>
          <a
            href="#contact"
            className="shrink-0 bg-white text-blue-700 font-bold px-7 py-3.5 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
          >
            Get a Free Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
