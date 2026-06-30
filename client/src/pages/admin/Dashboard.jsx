import { useState, useEffect, useContext } from 'react';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
} from '../../components/common/icons.jsx';
import { listBookings, acceptBooking, rejectBooking, assignLeader } from '../../api/booking.api.js';
import { getLeaders } from '../../api/user.api.js';
import { SocketContext } from '../../context/SocketContext.jsx';

const accentMap = {
  blue:   { bg: 'bg-indigo-100',  text: 'text-indigo-600',  num: 'text-indigo-700' },
  green:  { bg: 'bg-green-100',  text: 'text-green-600',  num: 'text-green-700' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-600',   num: 'text-teal-700' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', num: 'text-violet-700' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-600',  num: 'text-amber-700' },
};

function StatCard({ label, value, accent, Icon }) {
  const a = accentMap[accent] || accentMap.blue;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${a.text}`} />
      </div>
      <p className={`text-3xl font-black ${a.num} leading-none mb-1`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function PendingBookingRow({ booking, leaders, onResolved }) {
  const [mode,   setMode]   = useState(null);
  const [leadId, setLeadId] = useState('');
  const [reason, setReason] = useState('');
  const [busy,   setBusy]   = useState(false);
  const [done,   setDone]   = useState('');

  const id = booking._id || booking.id;

  const handleAccept = async () => {
    if (!leadId) return;
    setBusy(true);
    try {
      await assignLeader(id, leadId);
      await acceptBooking(id);
      setDone('accepted');
      onResolved(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setBusy(true);
    try {
      await rejectBooking(id, reason);
      setDone('rejected');
      onResolved(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-start gap-3">
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 font-mono">
          {id.slice(-8)}
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">{booking.service}</p>
          <p className="text-xs text-slate-500">
            {booking.client?.name} · {new Date(booking.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {done === 'accepted' && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
            ✓ Accepted &amp; Assigned
          </span>
        )}
        {done === 'rejected' && (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
            ✗ Rejected
          </span>
        )}
        {!done && mode === null && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('assigning')}
              className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept →
            </button>
            <button
              onClick={() => setMode('rejecting')}
              className="px-3 py-1.5 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          </div>
        )}
        {!done && mode === 'assigning' && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={leadId}
              onChange={e => setLeadId(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white"
            >
              <option value="">Select Leader</option>
              {leaders.map(l => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
            <button
              onClick={handleAccept}
              disabled={busy || !leadId}
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {busy ? '…' : 'Confirm'}
            </button>
            <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
        )}
        {!done && mode === 'rejecting' && (
          <div className="flex items-center gap-2 flex-wrap">
            <textarea
              rows={1}
              placeholder="Reason for rejection..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 w-48 resize-none"
            />
            <button
              onClick={handleReject}
              disabled={busy || !reason.trim()}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {busy ? '…' : 'Confirm'}
            </button>
            <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [leaders,  setLeaders]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { socket } = useContext(SocketContext);

  const fetchData = async () => {
    try {
      const [bookRes, leadRes] = await Promise.all([listBookings(), getLeaders()]);
      setBookings(bookRes.data.bookings);
      setLeaders(leadRes.data.users);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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

  const handleResolved = (id) => {
    // The socket event will update the booking status; we don't need to remove it manually
    // because the pending filter will exclude it after the socket update
  };

  const pendingBookings   = bookings.filter(b => b.status === 'PENDING');
  const activeBookings    = bookings.filter(b => ['ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue      = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  const stats = [
    { label: 'Total Bookings',   value: bookings.length,   accent: 'blue',   Icon: ClipboardListIcon },
    { label: 'Pending Review',   value: pendingBookings.length, accent: 'amber',  Icon: ClipboardListIcon },
    { label: 'Active Services',  value: activeBookings.length,  accent: 'green',  Icon: CheckCircleIcon },
    { label: 'Completed',        value: completedBookings.length, accent: 'teal', Icon: CheckCircleIcon },
    { label: 'Total Revenue',    value: totalRevenue ? `₹${(totalRevenue/1000).toFixed(0)}K` : '₹0', accent: 'violet', Icon: CurrencyRupeeIcon },
    { label: 'Leaders',          value: leaders.length,    accent: 'blue',   Icon: UserGroupIcon },
  ];

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })} · Angels One Healthcare Services</p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <ArrowTrendingUpIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-slate-900">Pending Bookings · Requires Action</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingBookings.length}
          </span>
        </div>
        {pendingBookings.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No pending bookings - you're all caught up!</p>
        ) : (
          <div className="space-y-0">
            {pendingBookings.map(booking => (
              <PendingBookingRow
                key={booking._id || booking.id}
                booking={booking}
                leaders={leaders}
                onResolved={handleResolved}
              />
            ))}
          </div>
        )}
      </div>

      {activeBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Active Services ({activeBookings.length})</h2>
          <div className="space-y-2">
            {activeBookings.map(b => {
              const id = b._id || b.id;
              return (
                <div key={id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{b.service}</p>
                    <p className="text-xs text-slate-500">{b.client?.name} · Leader: {b.leader?.name || 'Unassigned'}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    b.status === 'COMPLETION_REQUESTED' ? 'bg-purple-100 text-purple-700' :
                    b.status === 'IN_PROGRESS'          ? 'bg-indigo-100 text-indigo-700' :
                                                         'bg-green-100 text-green-700'
                  }`}>
                    {b.status.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
