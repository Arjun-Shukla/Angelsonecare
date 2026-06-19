import { CheckCircleIcon, HeartIcon, ShieldCheckIcon, UserGroupIcon } from '../common/icons.jsx';
import Button from '../common/Button.jsx';

const VALUES = [
  { icon: HeartIcon,       label: 'Compassionate Care',  desc: 'We treat every client like family, with warmth and empathy.' },
  { icon: ShieldCheckIcon, label: 'Verified Caregivers', desc: 'Background-checked and credentialed healthcare professionals.' },
  { icon: UserGroupIcon,   label: 'Family-Centred',      desc: 'We keep families informed and involved every step of the way.' },
];

const ACHIEVEMENTS = [
  { value: '5+',    label: 'Years of Service' },
  { value: '2,000+', label: 'Satisfied Clients' },
  { value: '50+',   label: 'Expert Caregivers' },
  { value: '15+',   label: 'Cities Covered' },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-slate-50">
      <div className="section-container">

        {/* Section label */}
        <div className="flex justify-center mb-4">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            About Us
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – visual */}
          <div className="relative order-2 lg:order-1">

            {/* Main card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-teal-500 p-1 shadow-2xl">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-[calc(1.5rem-4px)] p-10 min-h-[420px] flex flex-col items-center justify-center gap-8">

                {/* Central icon */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-xl">
                  <HeartIcon className="w-14 h-14 text-white" />
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-800">Our Mission</p>
                  <p className="text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed text-sm">
                    To make quality healthcare accessible, affordable, and personal — wherever you are.
                  </p>
                </div>

                {/* Achievements grid */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  {ACHIEVEMENTS.map(({ value, label }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
                      <p className="text-2xl font-extrabold text-blue-700">{value}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">100% Verified</p>
                <p className="text-xs text-slate-500">All caregivers are certified</p>
              </div>
            </div>
          </div>

          {/* Right – content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              Healthcare You Can{' '}
              <span className="text-gradient">Trust & Count On</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Angels One Healthcare Services was founded with a simple belief: everyone deserves access to professional, compassionate healthcare — right in the comfort of their own home.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              Whether you need a nurse for post-surgery care, a physiotherapist for rehabilitation, or a caregiver for your elderly loved ones, we bring experienced professionals to your doorstep — vetted, trained, and ready to serve.
            </p>

            {/* Core values */}
            <div className="space-y-5 mb-10">
              {VALUES.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button href="#services" arrow>Explore Our Services</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
