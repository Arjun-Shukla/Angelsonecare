import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../../components/common/icons.jsx';
import { listBookings } from '../../api/booking.api.js';
import { SocketContext } from '../../context/SocketContext.jsx';

const FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED', 'COMPLETED', 'CANCELLED'];

const STATUS_STYLES = {
  PENDING:              'bg-amber-100 text-amber-700',
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-blue-100 text-blue-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-teal-100 text-teal-700',
  CANCELLED:            'bg-slate-100 text-slate-600',
  REJECTED:             'bg-red-100 text-red-700',
};

const STATUS_LABEL = {
  PENDING:              'Pending',
  ACCEPTED:             'Accepted',
  IN_PROGRESS:          'In Progress',
  COMPLETION_REQUESTED: 'OTP Verification',
  COMPLETED:            'Completed',
  CANCELLED:            'Cancelled',
  REJECTED:             'Rejected',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function OtpPanel({ code, expiresAt }) {
  const [expired, setExpired] = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const check = () => setExpired(new Date() > new Date(expiresAt));
    check();
    const t = setInterval(check, 10_000);
    return () => clearInterval(t);
  }, [expiresAt]);

  function handleCopy() {
    if (!code) return;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fmtExpiry = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`rounded-xl border px-4 py-3 mt-3 ${expired ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-200'}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`text-xs font-semibold ${expired ? 'text-red-700' : 'text-purple-700'}`}>
          {expired ? 'OTP Expired — Ask caregiver to generate a new one' : 'Your Completion OTP'}
        </p>
        {!expired && expiresAt && (
          <span className="text-xs text-purple-500">Expires {fmtExpiry(expiresAt)}</span>
        )}
      </div>

      {!expired && code && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {(visible ? code : '●●●●●●').split('').map((ch, i) => (
              <span
                key={i}
                className="w-9 h-10 flex items-center justify-center bg-white border-2 border-purple-300 rounded-lg text-lg font-bold text-purple-800 tracking-widest select-none"
              >
                {ch}
              </span>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setVisible(v => !v)}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline"
            >
              {visible ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <p className={`text-xs mt-2 ${expired ? 'text-red-600' : 'text-purple-600'}`}>
        {expired
          ? 'Please ask your caregiver to generate a new OTP.'
          : 'Share this code with your caregiver to confirm service completion.'}
      </p>
    </div>
  );
}

function BookingCard({ booking }) {
  const id    = booking._id || booking.id;
  const notes = booking.notes || '';
  const extras = notes.startsWith('Add-ons:')
    ? notes.split('\n')[0].replace('Add-ons: ', '').split(', ')
    : [];

  const showOtp = booking.status === 'COMPLETION_REQUESTED';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${
      showOtp ? 'border-purple-200' : 'border-slate-100'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          showOtp ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          {showOtp ? (
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-base leading-tight">{booking.service}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">#{id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 block">Patient</span>
          <span className="font-medium">{booking.patient}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Shift</span>
          <span className="font-medium">{booking.shift || '—'}</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 block">Start Date</span>
          <span className="font-medium">{booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}</span>
        </div>
      </div>

      {extras.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {extras.map(e => (
            <span key={e} className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{e}</span>
          ))}
        </div>
      )}

      {booking.leader && (
        <p className="text-xs text-slate-500 mb-2">
          Caregiver: <span className="font-medium text-slate-700">{booking.leader.name}</span>
        </p>
      )}

      {booking.status === 'REJECTED' && booking.rejectionReason && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          Reason: {booking.rejectionReason}
        </p>
      )}

      {/* OTP panel — shown only when status is COMPLETION_REQUESTED */}
      {showOtp && (
        <OtpPanel code={booking.otp?.code} expiresAt={booking.otp?.expiresAt} />
      )}

      <div className="flex gap-2 pt-3 mt-1">
        <Link
          to={`/app/bookings/${id}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Details
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
        {booking.status === 'COMPLETED' && (
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
      <p className="text-slate-600 font-medium">No {filter !== 'ALL' ? STATUS_LABEL[filter]?.toLowerCase() ?? filter.toLowerCase() : ''} bookings found</p>
      <p className="text-slate-400 text-sm mt-1">
        {filter === 'ALL' ? 'Book your first service to get started.' : `You have no ${filter.toLowerCase()} bookings.`}
      </p>
    </div>
  );
}

export default function MyBookings() {
  const [filter,   setFilter]   = useState('ALL');
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    listBookings()
      .then(res => setBookings(res.data?.bookings ?? []))
      .catch(() => setError('Failed to load bookings. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  // Real-time: update booking in list when status changes
  // When status changes to COMPLETION_REQUESTED the updated booking now contains otp.code
  useEffect(() => {
    if (!socket) return;
    const handler = (updated) => {
      setBookings(prev => {
        const idx = prev.findIndex(b => (b._id || b.id) === (updated._id || updated.id));
        if (idx === -1) return [updated, ...prev];
        const next = [...prev];
        next[idx] = updated;
        return next;
      });
    };
    socket.on('booking:status_updated', handler);
    socket.on('booking:created',        handler);
    return () => {
      socket.off('booking:status_updated', handler);
      socket.off('booking:created',        handler);
    };
  }, [socket]);

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
        <p className="text-slate-500 text-sm mt-1">Track all your service bookings in one place.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => {
          const count = f === 'ALL' ? bookings.length : bookings.filter(b => b.status === f).length;
          if (count === 0 && f !== 'ALL') return null;
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
              {STATUS_LABEL[f] ?? f}
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
          : filtered.map(b => <BookingCard key={b._id || b.id} booking={b} />)
        }
      </div>
    </div>
  );
}
