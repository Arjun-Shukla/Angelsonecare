import { Link } from 'react-router-dom';
import { HeartIcon, UserGroupIcon, ScissorsIcon, BoltIcon, SparklesIcon, CpuChipIcon, ArrowRightIcon } from '../common/icons.jsx';
import { useInView } from '../../hooks/useInView.js';

const SERVICES = [
  {
    icon:  HeartIcon,
    color: 'indigo',
    title: 'Home Nursing Care',
    desc:  'Qualified nurses visit your home to administer medications, monitor vitals, dress wounds, and provide post-hospitalisation support.',
    tags:  ['Wound Care', 'IV Therapy', 'Vital Monitoring'],
  },
  {
    icon:  UserGroupIcon,
    color: 'emerald',
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
    color: 'amber',
    title: 'Physiotherapy',
    desc:  'Certified physiotherapists provide targeted rehabilitation at home — joint pain, paralysis recovery, sports injuries, and more.',
    tags:  ['Joint Rehab', 'Stroke Care', 'Sports Injury'],
  },
  {
    icon:  SparklesIcon,
    color: 'rose',
    title: 'Baby & Mother Care',
    desc:  'Specialised care for newborns and new mothers — bathing, feeding support, postnatal recovery, and neonatal monitoring.',
    tags:  ['Neonatal Care', 'Postnatal', 'Feeding Support'],
  },
  {
    icon:  CpuChipIcon,
    color: 'teal',
    title: 'Medical Equipment',
    desc:  'Supply and setup of home medical equipment — oxygen concentrators, hospital beds, CPAP machines, wheelchairs, and more.',
    tags:  ['Oxygen Supply', 'Hospital Beds', 'Wheelchairs'],
  },
];

const colorMap = {
  indigo: {
    iconBg: 'bg-indigo-100 group-hover:bg-indigo-600',
    icon:   'text-indigo-600 group-hover:text-white',
    tag:    'bg-indigo-50 text-indigo-700 border border-indigo-100',
    border: 'hover:border-indigo-200',
    link:   'text-indigo-600 hover:text-indigo-800',
    bar:    'bg-indigo-600',
  },
  emerald: {
    iconBg: 'bg-emerald-100 group-hover:bg-emerald-600',
    icon:   'text-emerald-600 group-hover:text-white',
    tag:    'bg-emerald-50 text-emerald-700 border border-emerald-100',
    border: 'hover:border-emerald-200',
    link:   'text-emerald-600 hover:text-emerald-800',
    bar:    'bg-emerald-500',
  },
  violet: {
    iconBg: 'bg-violet-100 group-hover:bg-violet-600',
    icon:   'text-violet-600 group-hover:text-white',
    tag:    'bg-violet-50 text-violet-700 border border-violet-100',
    border: 'hover:border-violet-200',
    link:   'text-violet-600 hover:text-violet-800',
    bar:    'bg-violet-500',
  },
  amber: {
    iconBg: 'bg-amber-100 group-hover:bg-amber-500',
    icon:   'text-amber-600 group-hover:text-white',
    tag:    'bg-amber-50 text-amber-700 border border-amber-100',
    border: 'hover:border-amber-200',
    link:   'text-amber-600 hover:text-amber-800',
    bar:    'bg-amber-500',
  },
  rose: {
    iconBg: 'bg-rose-100 group-hover:bg-rose-500',
    icon:   'text-rose-500 group-hover:text-white',
    tag:    'bg-rose-50 text-rose-700 border border-rose-100',
    border: 'hover:border-rose-200',
    link:   'text-rose-500 hover:text-rose-700',
    bar:    'bg-rose-500',
  },
  teal: {
    iconBg: 'bg-teal-100 group-hover:bg-teal-600',
    icon:   'text-teal-600 group-hover:text-white',
    tag:    'bg-teal-50 text-teal-700 border border-teal-100',
    border: 'hover:border-teal-200',
    link:   'text-teal-600 hover:text-teal-800',
    bar:    'bg-teal-500',
  },
};

export default function Services() {
  const [headerRef, headerInView] = useInView({ threshold: 0.5 });
  const [gridRef,   gridInView]   = useInView({ threshold: 0.05 });
  const [ctaRef,    ctaInView]    = useInView({ threshold: 0.5 });

  return (
    <section id="services" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="section-badge">Our Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-4">
            Comprehensive Care for{' '}
            <span className="text-gradient">Every Need</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg leading-relaxed">
            From nursing to physiotherapy, our trained professionals are just a booking away.
          </p>
        </div>

        {/* Grid — staggered card reveal */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, color, title, desc, tags }, i) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 ${c.border} flex flex-col`}
                style={{
                  opacity:          gridInView ? 1 : 0,
                  transform:        gridInView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
                  transitionProperty: 'opacity, transform, box-shadow, border-color',
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay:  gridInView ? `${i * 80}ms` : '0ms',
                }}
              >
                {/* Top accent bar */}
                <div className={`h-1 w-full ${c.bar}`} />

                <div className="p-7 flex flex-col flex-1">
                  <div className={`w-14 h-14 rounded-2xl ${c.iconBg} flex items-center justify-center mb-5 transition-all duration-300 flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${c.icon} transition-colors duration-300`} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tags.map((t) => (
                      <span key={t} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.tag}`}>{t}</span>
                    ))}
                  </div>

                  <Link
                    to="/book"
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${c.link} group-hover:gap-3 transition-all duration-200`}
                  >
                    Book This Service
                    <ArrowRightIcon className="w-4 h-4 flex-shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef}
          className={`text-center mt-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-slate-500 text-sm mb-4 font-medium">Don't see what you need?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-indigo-600 text-indigo-600 font-bold px-8 py-3.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:shadow-md"
          >
            Contact Us for Custom Care
          </a>
        </div>
      </div>
    </section>
  );
}
