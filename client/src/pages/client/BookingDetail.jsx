import { Link, useParams } from 'react-router-dom';
import { MOCK_BOOKINGS } from '../../data/mockClient.js';
import {
  ArrowLeftIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
} from '../../components/common/icons.jsx';

const STATUS_STYLES = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
};

const COLOR_MAP = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', avatar: 'bg-blue-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', avatar: 'bg-orange-500' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', avatar: 'bg-teal-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', avatar: 'bg-rose-500' },
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

function ServiceIcon({ svgPath, color, size = 'md' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  const dim = size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const iconDim = size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <div className={`${dim} rounded-2xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
      <svg className={`${iconDim} ${c.text}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
      </svg>
    </div>
  );
}

function TimelineCard({ booking }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Booking Timeline</h3>
      <div className="space-y-0">
        {booking.timeline.map((item, idx) => (
          <div key={idx} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 border-2 ${
                item.done
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-slate-300'
              }`} />
              {idx < booking.timeline.length - 1 && (
                <div className={`w-px flex-1 mt-1 ${item.done ? 'bg-blue-200' : 'bg-slate-100'}`} />
              )}
            </div>
            <div className="min-w-0 pb-0">
              <p className={`text-sm font-medium ${item.done ? 'text-slate-800' : 'text-slate-400'}`}>
                {item.event}
              </p>
              <p className={`text-xs mt-0.5 ${item.done ? 'text-slate-500' : 'text-slate-300'}`}>{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaregiverCard({ booking }) {
  const c = COLOR_MAP[booking.serviceColor] || COLOR_MAP.blue;

  if (!booking.leader) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Assigned Caregiver</h3>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="w-6 h-6 text-amber-600" />
          </div>
          <p className="font-medium text-slate-700">Caregiver Assignment Pending</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">We will assign a verified caregiver within 24 hours of confirmation.</p>
        </div>
      </div>
    );
  }

  const initial = booking.leader.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Assigned Caregiver</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full ${c.avatar} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
          {initial}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{booking.leader.name}</p>
          <p className="text-xs text-slate-500">{booking.leader.experience} experience</p>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
          <StarIcon className="w-4 h-4" />
          {booking.leader.rating} Rating
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <PhoneIcon className="w-4 h-4 text-slate-400" />
          {booking.leader.phone}
        </div>
      </div>
      <div className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl">
        <ShieldCheckIcon className="w-4 h-4" />
        Verified Professional
      </div>
    </div>
  );
}

function CostSummaryCard({ booking }) {
  const subtotal = booking.basePrice * booking.days;
  const hasDiscount = booking.days >= 30;
  const discountAmount = hasDiscount ? Math.round(subtotal * 0.1) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Cost Summary</h3>
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Base rate</span>
          <span className="text-slate-700 font-medium">₹{booking.basePrice.toLocaleString('en-IN')}/day</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Duration</span>
          <span className="text-slate-700 font-medium">{booking.days} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Subtotal</span>
          <span className="text-slate-700 font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        {hasDiscount && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Monthly discount (10%)</span>
            <span className="font-medium">−₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className="border-t border-slate-100 pt-2.5 flex justify-between">
          <span className="font-semibold text-slate-800">Total</span>
          <span className="font-bold text-slate-900 text-lg">₹{booking.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3 text-center">Payment collected at service completion</p>
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams();
  const booking = MOCK_BOOKINGS.find(b => b.id === id);

  if (!booking) {
    return (
      <div className="animate-fade-in text-center py-24">
        <p className="text-slate-500 text-lg font-medium mb-4">Booking not found</p>
        <Link to="/app/bookings" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 justify-center">
          <ArrowLeftIcon className="w-4 h-4" />
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const hasReview = !!booking.review;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/app/bookings" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          My Bookings
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{booking.id}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap items-start gap-4">
          <ServiceIcon svgPath={booking.svgPath} color={booking.serviceColor} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-800">{booking.service}</h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-sm text-slate-500">Booking ID: <span className="font-semibold text-slate-700">#{booking.id}</span></p>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
              <span>
                <span className="text-slate-400">Patient: </span>
                <span className="font-medium">{booking.patient} ({booking.relationship})</span>
              </span>
              <span>
                <span className="text-slate-400">Period: </span>
                <span className="font-medium">{booking.startDate} → {booking.endDate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Service Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Service</p>
                <p className="font-medium text-slate-700">{booking.service}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Shift</p>
                <p className="font-medium text-slate-700">{booking.shift} · {booking.shiftTime}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Duration</p>
                <p className="font-medium text-slate-700">{booking.duration}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Patient Age</p>
                <p className="font-medium text-slate-700">—</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-0.5">Address</p>
              <p className="font-medium text-slate-700 text-sm">{booking.address}</p>
            </div>
            {booking.extras.length > 0 && (
              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-1.5">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {booking.extras.map(e => (
                    <span key={e} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{e}</span>
                  ))}
                </div>
              </div>
            )}
            {booking.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-semibold mb-0.5">Notes</p>
                <p className="text-sm text-amber-800">{booking.notes}</p>
              </div>
            )}
          </div>

          <TimelineCard booking={booking} />
        </div>

        <div className="lg:col-span-2 space-y-5">
          <CaregiverCard booking={booking} />
          <CostSummaryCard booking={booking} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          to="/app/bookings"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to My Bookings
        </Link>
        <Link
          to="/app/tickets"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Raise Ticket for this Booking
        </Link>
        {booking.status === 'COMPLETED' && !hasReview && (
          <Link
            to="/app/reviews"
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Write a Review
          </Link>
        )}
      </div>
    </div>
  );
}
