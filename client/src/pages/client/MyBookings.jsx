import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BOOKINGS } from '../../data/mockClient.js';
import { ArrowRightIcon } from '../../components/common/icons.jsx';

const FILTERS = ['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];

const STATUS_STYLES = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
};

const COLOR_MAP = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

function ServiceIcon({ svgPath, color }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
      <svg className={`w-5 h-5 ${c.text}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
      </svg>
    </div>
  );
}

function BookingCard({ booking }) {
  const hasReview = !!booking.review;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <ServiceIcon svgPath={booking.svgPath} color={booking.serviceColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-base leading-tight">{booking.service}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">#{booking.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 block">Patient</span>
          <span className="font-medium">{booking.patient}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Shift</span>
          <span className="font-medium">{booking.shift}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 block">Period</span>
          <span className="font-medium">{booking.startDate} → {booking.endDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 text-xs text-slate-600">
        <span className="bg-slate-50 px-2.5 py-1 rounded-lg">
          <span className="text-slate-400">Duration: </span>
          <span className="font-medium">{booking.duration}</span>
        </span>
        <span className="bg-slate-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
          <span className="text-slate-400">Total: </span>
          <span className="font-semibold text-slate-700">₹{booking.total.toLocaleString('en-IN')}</span>
        </span>
      </div>

      {booking.extras.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {booking.extras.map(e => (
            <span key={e} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{e}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Link
          to={`/app/bookings/${booking.id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Details
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
        {booking.status === 'COMPLETED' && !hasReview && (
          <Link
            to="/app/reviews"
            className="ml-auto text-sm font-semibold text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-3 py-1 rounded-lg transition-colors"
          >
            Write Review
          </Link>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filter }) {
  return (
    <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        </svg>
      </div>
      <p className="text-slate-600 font-medium">No {filter !== 'ALL' ? filter.toLowerCase() : ''} bookings found</p>
      <p className="text-slate-400 text-sm mt-1">
        {filter === 'ALL' ? 'Book your first service to get started.' : `You have no ${filter.toLowerCase()} bookings.`}
      </p>
    </div>
  );
}

export default function MyBookings() {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === filter);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">Track all your service bookings in one place.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => {
          const count = f === 'ALL' ? MOCK_BOOKINGS.length : MOCK_BOOKINGS.filter(b => b.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length === 0
          ? <EmptyState filter={filter} />
          : filtered.map(b => <BookingCard key={b.id} booking={b} />)
        }
      </div>
    </div>
  );
}
