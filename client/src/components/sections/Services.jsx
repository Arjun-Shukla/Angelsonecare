import { Link } from 'react-router-dom';
import { HeartIcon, UserGroupIcon, ScissorsIcon, BoltIcon, SparklesIcon, CpuChipIcon, ArrowRightIcon } from '../common/icons.jsx';

const SERVICES = [
  {
    icon:  HeartIcon,
    color: 'blue',
    title: 'Home Nursing Care',
    desc:  'Qualified nurses visit your home to administer medications, monitor vitals, dress wounds, and provide post-hospitalisation support.',
    tags:  ['Wound Care', 'IV Therapy', 'Vital Monitoring'],
  },
  {
    icon:  UserGroupIcon,
    color: 'teal',
    title: 'Elder Care',
    desc:  'Dedicated companions and caregivers for senior family members — personal hygiene, mobility assistance, and daily routine management.',
    tags:  ['24/7 Companionship', 'Mobility Aid', 'Medication'],
  },
  {
    icon:  ScissorsIcon,
    color: 'violet',
    title: 'Post-Surgery Care',
    desc:  'Expert recovery support after procedures — physiotherapy, wound management, nutrition guidance, and health monitoring.',
    tags:  ['Recovery Plans', 'Wound Dressing', 'Monitoring'],
  },
  {
    icon:  BoltIcon,
    color: 'orange',
    title: 'Physiotherapy',
    desc:  'Certified physiotherapists provide targeted rehabilitation at home — joint pain, paralysis recovery, sports injuries, and more.',
    tags:  ['Joint Rehab', 'Stroke Care', 'Sports Injury'],
  },
  {
    icon:  SparklesIcon,
    color: 'pink',
    title: 'Baby & Mother Care',
    desc:  'Specialised care for newborns and new mothers — bathing, feeding support, postnatal recovery, and neonatal monitoring.',
    tags:  ['Neonatal Care', 'Postnatal', 'Feeding Support'],
  },
  {
    icon:  CpuChipIcon,
    color: 'green',
    title: 'Medical Equipment',
    desc:  'Supply and setup of home medical equipment — oxygen concentrators, hospital beds, CPAP machines, wheelchairs, and more.',
    tags:  ['Oxygen Supply', 'Hospital Beds', 'Wheelchairs'],
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600',   tag: 'bg-blue-50 text-blue-700',   border: 'group-hover:border-blue-200' },
  teal:   { bg: 'bg-teal-100',   icon: 'text-teal-600',   tag: 'bg-teal-50 text-teal-700',   border: 'group-hover:border-teal-200' },
  violet: { bg: 'bg-violet-100', icon: 'text-violet-600', tag: 'bg-violet-50 text-violet-700', border: 'group-hover:border-violet-200' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600', tag: 'bg-orange-50 text-orange-700', border: 'group-hover:border-orange-200' },
  pink:   { bg: 'bg-pink-100',   icon: 'text-pink-600',   tag: 'bg-pink-50 text-pink-700',   border: 'group-hover:border-pink-200' },
  green:  { bg: 'bg-green-100',  icon: 'text-green-600',  tag: 'bg-green-50 text-green-700',  border: 'group-hover:border-green-200' },
};

export default function Services() {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Comprehensive Care for{' '}
            <span className="text-gradient">Every Need</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            From nursing to physiotherapy, our trained professionals are just a booking away.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map(({ icon: Icon, color, title, desc, tags }) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group relative bg-white rounded-2xl border border-slate-100 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.border}`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${c.icon}`} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">{desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((t) => (
                    <span key={t} className={`text-xs font-medium px-3 py-1 rounded-full ${c.tag}`}>{t}</span>
                  ))}
                </div>

                <Link
                  to="/book"
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.icon} group-hover:gap-2.5 transition-all`}
                >
                  Book This Service
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm mb-4">Don't see what you need?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold px-7 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all"
          >
            Contact Us for Custom Care
          </a>
        </div>
      </div>
    </section>
  );
}
