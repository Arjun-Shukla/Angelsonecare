import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { listBookings } from '../../api/booking.api.js';
import { listTickets } from '../../api/ticket.api.js';
import {
  PhoneIcon,
  ArrowRightIcon,
  TagIcon,
  ClipboardListIcon,
  StarIcon,
} from '../../components/common/icons.jsx';

const ACTIVE_STATUSES = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'];

const STATUS_LABEL = {
  PENDING:              'Pending Assignment',
  ACCEPTED:             'Service Accepted',
  IN_PROGRESS:          'In Progress',
  COMPLETION_REQUESTED: 'Awaiting Completion',
  COMPLETED:            'Completed',
  REJECTED:             'Rejected',
  CANCELLED:            'Cancelled',
};

const STATUS_COLOR = {
  PENDING:              'bg-amber-100 text-amber-700',
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-indigo-100 text-indigo-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-emerald-100 text-emerald-700',
  REJECTED:             'bg-rose-100 text-rose-700',
};

function StatCard({ label, value, accent, description, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {loading
        ? <div className="h-9 w-10 bg-slate-100 animate-pulse rounded-lg mt-1" />
        : <p className={`text-3xl font-bold mt-1 ${accent}`}>{value}</p>
      }
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
  );
}

function ActiveBookingCard({ booking }) {
  const id = booking._id || booking.id;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">{booking.service}</h3>
            <span className="text-xs text-slate-500 font-mono">#{id.slice(-8).toUpperCase()}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[booking.status] || 'bg-slate-100 text-slate-600'}`}>
          <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></span>
          {STATUS_LABEL[booking.status] || booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {booking.leader && (
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Assigned Caregiver</p>
            <p className="font-semibold text-slate-800 text-sm">{booking.leader.name}</p>
            {booking.leader.phone && (
              <div className="flex items-center gap-1 mt-1">
                <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">{booking.leader.phone}</span>
              </div>
            )}
          </div>
        )}
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 mb-1">Service Period</p>
          <p className="font-semibold text-slate-800 text-sm">
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
            {booking.endDate ? ` → ${new Date(booking.endDate).toLocaleDateString('en-IN')}` : ''}
          </p>
          {(booking.shift || booking.shiftTime) && (
            <p className="text-xs text-slate-500 mt-1">{[booking.shift, booking.shiftTime].filter(Boolean).join(' · ')}</p>
          )}
        </div>
      </div>

      {booking.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-4">
          <p className="text-xs text-amber-800">{booking.notes}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Link
          to={`/app/bookings/${id}`}
          className="flex-1 text-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all"
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
      className="flex items-center gap-3 bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-sm rounded-2xl p-4 transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{label}</span>
      <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 ml-auto transition-colors" />
    </Link>
  );
}

function RecentActivity({ bookings }) {
  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) return null;

  const eventText = (b) => {
    if (b.status === 'PENDING')              return `${b.service} request submitted`;
    if (b.status === 'ACCEPTED')             return `${b.service} booking accepted`;
    if (b.status === 'IN_PROGRESS')          return `${b.service} service in progress`;
    if (b.status === 'COMPLETION_REQUESTED') return `${b.service} — awaiting OTP verification`;
    if (b.status === 'COMPLETED')            return `${b.service} service completed`;
    if (b.status === 'REJECTED')             return `${b.service} booking rejected`;
    return `${b.service} updated`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
      <div className="space-y-0">
        {recent.map((item, idx) => {
          const id = item._id || item.id;
          return (
            <div key={id} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />
                {idx < recent.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
              </div>
              <div className="pb-0 min-w-0">
                <p className="text-sm font-medium text-slate-700">{eventText(item)}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  #{id.slice(-8).toUpperCase()} · {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [openTickets, setOpenTickets] = useState(0);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.all([
      listBookings().catch(() => ({ data: { bookings: [] } })),
      listTickets().catch(() => ({ data: { tickets: [] } })),
    ]).then(([bookRes, tickRes]) => {
      setBookings(bookRes.data?.bookings ?? []);
      const tickets = tickRes.data?.tickets ?? [];
      setOpenTickets(tickets.filter(t => t.status === 'OPEN').length);
    }).finally(() => setLoading(false));
  }, []);

  const activeBookings    = bookings.filter(b => ACTIVE_STATUSES.includes(b.status));
  const pendingBookings   = bookings.filter(b => b.status === 'PENDING');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Welcome back, {firstName}!</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening today - {today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Services"  value={activeBookings.length}    accent="text-green-600"  description="Currently running"    loading={loading} />
        <StatCard label="Pending"          value={pendingBookings.length}    accent="text-amber-600"  description="Awaiting assignment"  loading={loading} />
        <StatCard label="Completed"        value={completedBookings.length}  accent="text-indigo-600"  description="Successfully done"    loading={loading} />
        <StatCard label="Tickets Open"     value={openTickets}               accent="text-rose-600"   description="Needs attention"      loading={loading} />
      </div>

      {!loading && activeBookings.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">
            Active Service{activeBookings.length > 1 ? 's' : ''}
            {activeBookings.length > 1 && (
              <span className="ml-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{activeBookings.length}</span>
            )}
          </h2>
          <div className="space-y-4">
            {activeBookings.map(b => <ActiveBookingCard key={b._id || b.id} booking={b} />)}
          </div>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardListIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="font-semibold text-slate-700">No services booked yet</p>
          <p className="text-slate-400 text-sm mt-1">Book your first healthcare service to get started.</p>
          <Link to="/book" className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold rounded-xl transition-all">
            Book a Service
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionButton label="Book New Service" to="/book" Icon={({ className }) => <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} color="bg-indigo-100 text-indigo-600" />
          <QuickActionButton label="My Bookings"      to="/app/bookings"  Icon={ClipboardListIcon}  color="bg-emerald-100 text-emerald-600" />
          <QuickActionButton label="Raise a Ticket"   to="/app/tickets"   Icon={TagIcon}            color="bg-amber-100 text-amber-600" />
          <QuickActionButton label="My Reviews"       to="/app/reviews"   Icon={StarIcon}           color="bg-purple-100 text-purple-600" />
        </div>
      </div>

      {!loading && <RecentActivity bookings={bookings} />}
    </div>
  );
}
