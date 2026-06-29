import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { listBookings } from '../../api/booking.api.js';
import { listTickets } from '../../api/ticket.api.js';
import { SocketContext } from '../../context/SocketContext.jsx';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  BellIcon,
  ArrowRightIcon,
  KeyIcon,
  WrenchScrewdriverIcon,
} from '../../components/common/icons.jsx';

const ACTIVE_STATUSES  = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'];
const WORKING_STATUSES = ['ACCEPTED', 'IN_PROGRESS'];

const STATUS_LABEL = {
  PENDING:              'Pending',
  ACCEPTED:             'Accepted',
  IN_PROGRESS:          'In Progress',
  COMPLETION_REQUESTED: 'Awaiting OTP',
  COMPLETED:            'Completed',
};

const STATUS_COLOR = {
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-indigo-100 text-indigo-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-emerald-100 text-emerald-700',
  PENDING:              'bg-amber-100 text-amber-700',
};

function StatCard({ label, value, colorClass, Icon, loading }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading
        ? <div className="h-9 w-10 bg-slate-100 animate-pulse rounded-lg" />
        : <p className="text-3xl font-bold text-slate-800">{value}</p>
      }
    </div>
  );
}

function ActiveBookingCard({ booking }) {
  const id = booking._id || booking.id;
  const canOtp = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'].includes(booking.status);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-semibold text-slate-800">{booking.service}</p>
          <p className="text-xs font-mono text-slate-500 mt-0.5">#{id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLOR[booking.status] || 'bg-slate-100 text-slate-600'}`}>
          {STATUS_LABEL[booking.status] || booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-xs text-slate-400 font-medium">Client</p>
          <p className="font-semibold text-slate-700">{booking.client?.name || '—'}</p>
          {booking.client?.phone && (
            <a href={`tel:${booking.client.phone}`} className="text-xs text-emerald-600 hover:underline">
              {booking.client.phone}
            </a>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Patient</p>
          <p className="font-semibold text-slate-700">{booking.patient || '—'}</p>
          <p className="text-xs text-slate-500">
            {booking.patientAge ? `${booking.patientAge}y` : ''}
            {booking.gender ? ` · ${booking.gender}` : ''}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Start Date</p>
          <p className="text-sm font-medium text-slate-700">
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Shift</p>
          <p className="text-sm font-medium text-slate-700">
            {[booking.shift, booking.shiftTime].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
      </div>

      {booking.notes && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
          <p className="text-xs text-amber-800">{booking.notes}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Link
          to={`/leader/progress/${id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <WrenchScrewdriverIcon className="w-4 h-4" />
          Update Progress
        </Link>
        {canOtp && (
          <Link
            to={`/leader/verify/${id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <KeyIcon className="w-4 h-4" />
            Verify OTP
          </Link>
        )}
      </div>
    </div>
  );
}

function RecentActivity({ bookings }) {
  const recent = [...bookings]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="font-bold text-slate-800 text-sm mb-3">Recent Activity</h2>
        <p className="text-sm text-slate-400">No recent activity.</p>
      </div>
    );
  }

  const activityText = (b) => {
    if (b.status === 'ACCEPTED')             return `${b.service} — accepted & assigned`;
    if (b.status === 'IN_PROGRESS')          return `${b.service} — service in progress`;
    if (b.status === 'COMPLETION_REQUESTED') return `${b.service} — OTP verification pending`;
    if (b.status === 'COMPLETED')            return `${b.service} — service completed`;
    return `${b.service} updated`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h2 className="font-bold text-slate-800 text-sm mb-4">Recent Activity</h2>
      <div className="relative">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-100" />
        <ul className="space-y-4">
          {recent.map(b => {
            const id = b._id || b.id;
            return (
              <li key={id} className="flex gap-4 pl-6 relative">
                <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">
                    {new Date(b.updatedAt || b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(b.updatedAt || b.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-slate-700 mt-0.5">{activityText(b)}</p>
                  <p className="text-xs text-slate-400 font-mono">#{id.slice(-8).toUpperCase()} · {b.client?.name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <Link to="/leader/bookings" className="block text-center text-xs text-emerald-600 hover:underline mt-4 font-medium">
        View all bookings →
      </Link>
    </div>
  );
}

export default function LeaderDashboard() {
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);
  const [bookings,    setBookings]    = useState([]);
  const [openTickets, setOpenTickets] = useState(0);
  const [loading,     setLoading]     = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    Promise.all([
      listBookings().catch(() => ({ data: { bookings: [] } })),
      listTickets().catch(() => ({ data: { tickets: [] } })),
    ]).then(([bookRes, tickRes]) => {
      setBookings(bookRes.data?.bookings ?? []);
      setOpenTickets((tickRes.data?.tickets ?? []).filter(t => t.status === 'OPEN').length);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const upsert = (updated) => {
      setBookings(prev => {
        const idx = prev.findIndex(b => (b._id || b.id) === (updated._id || updated.id));
        if (idx === -1) return [updated, ...prev];
        const next = [...prev]; next[idx] = updated; return next;
      });
    };
    socket.on('booking:created',        upsert);
    socket.on('booking:status_updated', upsert);
    return () => {
      socket.off('booking:created',        upsert);
      socket.off('booking:status_updated', upsert);
    };
  }, [socket]);

  const activeBookings    = bookings.filter(b => ACTIVE_STATUSES.includes(b.status));
  const workingBookings   = bookings.filter(b => WORKING_STATUSES.includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Good morning, {firstName}!</h1>
        <p className="text-sm text-slate-500 mt-1">{today}{user?.location ? ` · ${user.location}` : ''}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assigned"  value={bookings.length}           colorClass="bg-emerald-100 text-emerald-600" Icon={ClipboardListIcon} loading={loading} />
        <StatCard label="Active"          value={activeBookings.length}     colorClass="bg-indigo-100 text-indigo-600"   Icon={ArrowRightIcon}    loading={loading} />
        <StatCard label="Completed Total" value={completedBookings.length}  colorClass="bg-green-100 text-green-600" Icon={CheckCircleIcon}   loading={loading} />
        <StatCard label="Open Tickets"    value={openTickets}               colorClass="bg-amber-100 text-amber-600" Icon={BellIcon}          loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">
              Active Assignments
              {!loading && activeBookings.length > 0 && (
                <span className="ml-2 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {activeBookings.length}
                </span>
              )}
            </h2>
            <Link to="/leader/bookings" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
              <CheckCircleIcon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="font-semibold text-slate-500">No active assignments</p>
              <p className="text-xs text-slate-400 mt-1">New assignments will appear here when the admin assigns them to you.</p>
            </div>
          ) : (
            activeBookings.map(b => <ActiveBookingCard key={b._id || b.id} booking={b} />)
          )}
        </div>

        <div className="space-y-4">
          {!loading && workingBookings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-bold text-slate-800 text-sm mb-3">Needs Your Action</h2>
              <div className="space-y-2">
                {workingBookings.slice(0, 3).map(b => {
                  const id = b._id || b.id;
                  return (
                    <div key={id} className="flex items-center justify-between gap-2 py-2 border-b border-slate-50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{b.service}</p>
                        <p className="text-xs text-slate-500 font-mono">#{id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-slate-400">{b.client?.name}</p>
                      </div>
                      <Link
                        to={`/leader/progress/${id}`}
                        className="flex-shrink-0 p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
                        title="Update Progress"
                      >
                        <WrenchScrewdriverIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!loading && <RecentActivity bookings={bookings} />}
        </div>
      </div>
    </div>
  );
}
