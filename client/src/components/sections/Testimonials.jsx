import { StarIcon } from '../common/icons.jsx';

const TESTIMONIALS = [
  {
    name:    'Priya Sharma',
    role:    'Home Nursing Client',
    city:    'Lucknow',
    rating:  5,
    text:    "After my mother's hip replacement surgery, Angels One arranged a home nurse within hours. The caregiver was incredibly professional and patient. My mother recovered faster than the doctors expected!",
    initial: 'P',
    color:   'bg-blue-500',
  },
  {
    name:    'Rajesh Verma',
    role:    'Elder Care Client',
    city:    'Kanpur',
    rating:  5,
    text:    'Finding reliable elder care for my 78-year-old father felt impossible until I found Angels One. The assigned caregiver is like family now — punctual, caring, and highly skilled.',
    initial: 'R',
    color:   'bg-teal-500',
  },
  {
    name:    'Anita Gupta',
    role:    'Physiotherapy Client',
    city:    'Lucknow',
    rating:  5,
    text:    'The physiotherapist came every morning for 3 weeks after my knee surgery. The OTP verification gave me confidence that service was properly logged. Highly recommended!',
    initial: 'A',
    color:   'bg-violet-500',
  },
  {
    name:    'Suresh Patel',
    role:    'Post-Surgery Client',
    city:    'Varanasi',
    rating:  5,
    text:    'The real-time tracking feature is brilliant. I could see exactly when the nurse left, was en route, and arrived. Completely transparent and trustworthy service.',
    initial: 'S',
    color:   'bg-orange-500',
  },
  {
    name:    'Meera Joshi',
    role:    'Baby Care Client',
    city:    'Lucknow',
    rating:  5,
    text:    'As a first-time mother, I was anxious. The baby care specialist from Angels One was a blessing — she guided me through everything and helped my baby settle into a healthy routine.',
    initial: 'M',
    color:   'bg-pink-500',
  },
  {
    name:    'Deepak Mishra',
    role:    'Elder Care Client',
    city:    'Allahabad',
    rating:  5,
    text:    'Booking was effortless and the support team responded within minutes. The caregiver they sent for my parents is wonderful. The price is fair and there are no hidden charges at all.',
    initial: 'D',
    color:   'bg-green-500',
  },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200'}`} filled={i < count} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-white">
      <div className="section-container">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Stories from Our{' '}
            <span className="text-gradient">Happy Families</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            Real reviews from real clients who trusted Angels One with their loved ones' care.
          </p>
        </div>

        {/* Review grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, city, rating, text, initial, color }) => (
            <div
              key={name}
              className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Stars */}
              <Stars count={rating} />

              {/* Review text */}
              <p className="text-slate-600 text-sm leading-relaxed mt-4 flex-1">
                "{text}"
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-base">{initial}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{name}</p>
                  <p className="text-xs text-slate-500">{role} · {city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div>
            <p className="text-6xl font-extrabold text-blue-700">4.9</p>
            <Stars count={5} />
            <p className="text-sm text-slate-500 mt-1">Average rating</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-blue-200" />
          <div>
            <p className="text-4xl font-extrabold text-slate-800">2,000+</p>
            <p className="text-slate-500 mt-1">Verified reviews</p>
          </div>
          <div className="hidden sm:block w-px h-16 bg-blue-200" />
          <div>
            <p className="text-4xl font-extrabold text-slate-800">99%</p>
            <p className="text-slate-500 mt-1">Would recommend us</p>
          </div>
        </div>
      </div>
    </section>
  );
}
