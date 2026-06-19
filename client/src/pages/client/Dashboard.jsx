import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { MOCK_BOOKINGS, MOCK_TICKETS } from '../../data/mockClient.js';
import {
  PhoneIcon,
  StarIcon,
  ArrowRightIcon,
  TagIcon,
  ClipboardListIcon,
} from '../../components/common/icons.jsx';

const STATUS_COUNTS = {
  ACTIVE: MOCK_BOOKINGS.filter(b => b.status === 'ACTIVE').length,
  PENDING: MOCK_BOOKINGS.filter(b => b.status === 'PENDING').length,
  COMPLETED: MOCK_BOOKINGS.filter(b => b.status === 'COMPLETED').length,
  OPEN_TICKETS: MOCK_TICKETS.filter(t => t.status === 'OPEN').length,
};

const COLOR_MAP = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-500' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', icon: 'text-teal-500' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', icon: 'text-rose-500' },
};

function StatCard({ label, value, accent, description }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  );
}

function ServiceIcon({ svgPath, color }) {
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  return (
    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
      <svg className={`w-6 h-6 ${c.text}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={svgPath} />
      </svg>
    </div>
  );
}

function ActiveBookingCard({ booking }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <ServiceIcon svgPath={booking.svgPath} color={booking.serviceColor} />
          <div>
            <h3 className="font-semibold text-slate-800 text-base">{booking.service}</h3>
            <span className="text-xs text-slate-500">#{booking.id}</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          IN PROGRESS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {booking.leader && (
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Assigned Caregiver</p>
            <p className="font-semibold text-slate-800 text-sm">{booking.leader.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <PhoneIcon className="w-3.5 h-3.5" />
                {booking.leader.phone}
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <StarIcon className="w-3.5 h-3.5" />
                {booking.leader.rating}
              </span>
            </div>
          </div>
        )}
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Service Period</p>
          <p className="font-semibold text-slate-800 text-sm">{booking.startDate} → {booking.endDate}</p>
          <p className="text-xs text-slate-500 mt-1">{booking.shift} · {booking.shiftTime}</p>
        </div>
      </div>

      {booking.extras.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {booking.extras.map(e => (
            <span key={e} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{e}</span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to={`/app/bookings/${booking.id}`}
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          View Details
        </Link>
        <Link
          to="/app/tickets"
          className="flex-1 text-center border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
        >
          Raise Ticket
        </Link>
      </div>
    </div>
  );
}

function QuickActionButton({ label, to, Icon, color }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm rounded-2xl p-4 transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{label}</span>
      <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-400 ml-auto transition-colors" />
    </Link>
  );
}

function RecentActivity() {
  const events = [];
  MOCK_BOOKINGS.forEach(b => {
    b.timeline.forEach(t => {
      events.push({ ...t, bookingId: b.id, service: b.service });
    });
  });
  const sorted = events.filter(e => e.done).slice(-4).reverse();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
      <div className="space-y-0">
        {sorted.map((item, idx) => (
          <div key={idx} className="flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
              {idx < sorted.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1"></div>}
            </div>
            <div className="pb-0 min-w-0">
              <p className="text-sm font-medium text-slate-700">{item.event}</p>
              <p className="text-xs text-slate-400 mt-0.5">#{item.bookingId} · {item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const activeBooking = MOCK_BOOKINGS.find(b => b.status === 'ACTIVE');

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {firstName}!</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening today — {today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Services" value={STATUS_COUNTS.ACTIVE} accent="text-green-600" description="Currently running" />
        <StatCard label="Pending" value={STATUS_COUNTS.PENDING} accent="text-amber-600" description="Awaiting assignment" />
        <StatCard label="Completed" value={STATUS_COUNTS.COMPLETED} accent="text-blue-600" description="Successfully done" />
        <StatCard label="Tickets Open" value={STATUS_COUNTS.OPEN_TICKETS} accent="text-rose-600" description="Needs attention" />
      </div>

      {activeBooking && (
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">Active Service</h2>
          <ActiveBookingCard booking={activeBooking} />
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionButton label="Book New Service" to="/book" Icon={({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} color="bg-blue-100 text-blue-600" />
          <QuickActionButton label="My Bookings" to="/app/bookings" Icon={ClipboardListIcon} color="bg-teal-100 text-teal-600" />
          <QuickActionButton label="Raise a Ticket" to="/app/tickets" Icon={TagIcon} color="bg-amber-100 text-amber-600" />
          <QuickActionButton label="My Reviews" to="/app/reviews" Icon={StarIcon} color="bg-purple-100 text-purple-600" />
        </div>
      </div>

      <RecentActivity />
    </div>
  );
}
