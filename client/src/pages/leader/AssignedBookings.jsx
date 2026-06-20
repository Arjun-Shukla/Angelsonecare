import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  WrenchScrewdriverIcon,
  KeyIcon,
  UserIcon,
  ClipboardListIcon,
} from '../../components/common/icons.jsx';
import { listBookings } from '../../api/booking.api.js';
import { SocketContext } from '../../context/SocketContext.jsx';

const STATUS_STYLES = {
  PENDING:              'bg-amber-100 text-amber-700',
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-blue-100 text-blue-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-teal-100 text-teal-700',
};

const STATUS_LABEL = {
  PENDING:              'Pending',
  ACCEPTED:             'Accepted',
  IN_PROGRESS:          'In Progress',
  COMPLETION_REQUESTED: 'Pending OTP',
  COMPLETED:            'Completed',
};

const FILTER_GROUPS = {
  ALL:        null,
  ACTIVE:     ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'],
  COMPLETED:  ['COMPLETED'],
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function FilterTab({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
        active
          ? 'bg-teal-600 text-white shadow-sm'
          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
      }`}
    >
      {label}
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {count}
      </span>
    </button>
  );
}

function BookingCard({ booking }) {
  const id = booking._id || booking.id;
  const canOtp = ['IN_PROGRESS', 'ACCEPTED', 'COMPLETION_REQUESTED'].includes(booking.status);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{booking.service}</p>
          <p className="text-xs text-slate-500 font-mono">#{id.slice(-8)}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 font-medium">Client</span>
          <p className="font-semibold text-slate-700 mt-0.5">{booking.client?.name || '—'}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Patient</span>
          <p className="font-semibold text-slate-700 mt-0.5">{booking.patient}{booking.patientAge ? `, ${booking.patientAge}y` : ''}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Shift</span>
          <p className="font-medium text-slate-700 mt-0.5">{booking.shiftTime || booking.shift || '—'}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Start Date</span>
          <p className="font-medium text-slate-700 mt-0.5">
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-1 flex-wrap">
        <Link
          to={`/leader/progress/${id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <WrenchScrewdriverIcon className="w-3.5 h-3.5" />
          Update Progress
        </Link>
        {canOtp && (
          <Link
            to={`/leader/verify/${id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors"
          >
            <KeyIcon className="w-3.5 h-3.5" />
            OTP Verify
          </Link>
        )}
        <Link
          to={`/leader/clients/${booking.client?._id || booking.client?.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <UserIcon className="w-3.5 h-3.5" />
          Client
        </Link>
      </div>
    </div>
  );
}

export default function AssignedBookings() {
  const [filter,   setFilter]   = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    listBookings()
      .then(res => setBookings(res.data.bookings))
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const activeStatuses = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'];
  const counts = {
    ALL:       bookings.length,
    ACTIVE:    bookings.filter(b => activeStatuses.includes(b.status)).length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
  };

  const filtered = filter === 'ALL'
    ? bookings
    : filter === 'ACTIVE'
      ? bookings.filter(b => activeStatuses.includes(b.status))
      : bookings.filter(b => b.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Assigned Bookings</h1>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assigned Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">All bookings assigned to you</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.keys(counts).map(f => (
          <FilterTab
            key={f}
            label={f.charAt(0) + f.slice(1).toLowerCase()}
            count={counts[f]}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Start Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <ClipboardListIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  <p className="font-medium">No bookings found</p>
                  <p className="text-xs mt-1">Try a different filter</p>
                </td>
              </tr>
            ) : filtered.map(b => {
              const id = b._id || b.id;
              const canOtp = ['IN_PROGRESS', 'ACCEPTED', 'COMPLETION_REQUESTED'].includes(b.status);
              return (
                <tr key={id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                      #{id.slice(-8)}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">{b.service}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{b.client?.name || '—'}</p>
                    <p className="text-xs text-slate-400">{b.client?.phone || ''}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">{b.patient}</p>
                    <p className="text-xs text-slate-400">{b.patientAge ? `${b.patientAge}y` : ''}{b.gender ? ` · ${b.gender}` : ''}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs">
                    {b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/leader/progress/${id}`}
                        title="Update Progress"
                        className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                      >
                        <WrenchScrewdriverIcon className="w-4 h-4" />
                      </Link>
                      {canOtp && (
                        <Link
                          to={`/leader/verify/${id}`}
                          title="OTP Verify"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <KeyIcon className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        to={`/leader/clients/${b.client?._id}`}
                        title="Client Details"
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
            <ClipboardListIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No bookings found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different filter</p>
          </div>
        ) : filtered.map(b => (
          <BookingCard key={b._id || b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}
