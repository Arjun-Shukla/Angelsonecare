import { useState, useEffect, useContext } from 'react';
import { MagnifyingGlassIcon } from '../../components/common/icons.jsx';
import { listBookings, acceptBooking, rejectBooking, assignLeader } from '../../api/booking.api.js';
import { getLeaders } from '../../api/user.api.js';
import { SocketContext } from '../../context/SocketContext.jsx';

const STATUS_FILTERS = ['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETION_REQUESTED', 'COMPLETED', 'REJECTED', 'CANCELLED'];

const STATUS_BADGE = {
  PENDING:              'bg-amber-100 text-amber-700',
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-indigo-100 text-indigo-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-emerald-100 text-emerald-700',
  REJECTED:             'bg-red-100 text-red-700',
  CANCELLED:            'bg-slate-100 text-slate-500',
};

function StatusChip({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[status] || 'bg-slate-100 text-slate-500'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function InlineAction({ booking, leaders, onAction }) {
  const [mode,   setMode]   = useState(null); // null | 'assigning' | 'rejecting'
  const [leadId, setLeadId] = useState('');
  const [reason, setReason] = useState('');
  const [busy,   setBusy]   = useState(false);
  const [done,   setDone]   = useState('');

  const id = booking._id || booking.id;

  if (done) {
    return (
      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${done === 'accepted' ? 'text-green-700 bg-green-50' : 'text-slate-500 bg-slate-100'}`}>
        {done === 'accepted' ? '✓ Assigned & Accepted' : '✗ Rejected'}
      </span>
    );
  }

  // Only show action buttons for PENDING bookings
  if (booking.status !== 'PENDING') return null;

  const handleAccept = async () => {
    if (!leadId) return;
    setBusy(true);
    try {
      await assignLeader(id, leadId);
      await acceptBooking(id);
      setDone('accepted');
      onAction(id, 'accepted', leadId);
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
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
      onAction(id, 'rejected');
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'assigning') {
    return (
      <div className="flex flex-col gap-1.5">
        <select
          value={leadId}
          onChange={e => setLeadId(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 bg-white"
        >
          <option value="">Select Leader</option>
          {leaders.map(l => (
            <option key={l._id} value={l._id}>{l.name}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <button
            onClick={handleAccept}
            disabled={busy || !leadId}
            className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {busy ? '…' : 'Confirm'}
          </button>
          <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      </div>
    );
  }

  if (mode === 'rejecting') {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          rows={1}
          placeholder="Reason..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 resize-none w-36"
        />
        <div className="flex gap-1.5">
          <button
            onClick={handleReject}
            disabled={busy || !reason.trim()}
            className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {busy ? '…' : 'Confirm'}
          </button>
          <button onClick={() => setMode(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setMode('assigning')}
        className="px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
      >
        Assign & Accept
      </button>
      <button
        onClick={() => setMode('rejecting')}
        className="px-2.5 py-1 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
      >
        Reject
      </button>
    </div>
  );
}

export default function AdminBookings() {
  const [filter,   setFilter]   = useState('ALL');
  const [search,   setSearch]   = useState('');
  const [bookings, setBookings] = useState([]);
  const [leaders,  setLeaders]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const { socket } = useContext(SocketContext);

  const fetchData = async () => {
    try {
      const [bookRes, leadRes] = await Promise.all([listBookings(), getLeaders()]);
      setBookings(bookRes.data.bookings);
      setLeaders(leadRes.data.users);
    } catch {
      /* errors handled per-row */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Real-time: merge incoming booking updates
  useEffect(() => {
    if (!socket) return;
    const upsert = (updated) => {
      setBookings((prev) => {
        const idx = prev.findIndex(b => (b._id || b.id) === (updated._id || updated.id));
        if (idx === -1) return [updated, ...prev];
        const next = [...prev];
        next[idx] = updated;
        return next;
      });
    };
    socket.on('booking:created',        upsert);
    socket.on('booking:status_updated', upsert);
    return () => {
      socket.off('booking:created',        upsert);
      socket.off('booking:status_updated', upsert);
    };
  }, [socket]);

  const handleAction = (id, action) => {
    setBookings(prev => prev.map(b => {
      if ((b._id || b.id) !== id) return b;
      return { ...b, status: action === 'accepted' ? 'ACCEPTED' : 'REJECTED' };
    }));
  };

  const counts = STATUS_FILTERS.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? bookings.length : bookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  const filtered = bookings.filter(b => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (b._id || b.id || '').toLowerCase().includes(q)
      || (b.client?.name || '').toLowerCase().includes(q)
      || (b.patient || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {STATUS_FILTERS.slice(1).map(s => counts[s] > 0 && (
            <span key={s} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[s] || 'bg-slate-100 text-slate-500'}`}>
              {s.replace(/_/g, ' ')}: {counts[s]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, client, or patient..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'ALL' ? `All (${counts.ALL})` : s.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">ID</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Client</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Service</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Patient</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Start Date</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Amount</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Leader</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(b => {
              const id = b._id || b.id;
              return (
                <tr key={id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-lg font-mono">{id.slice(-8)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 text-xs">{b.client?.name || '—'}</p>
                    <p className="text-slate-400 text-xs">{b.client?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-xs">{b.service}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{b.patient}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                    {b.amount ? `₹${b.amount.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {b.leader
                      ? <span className="text-slate-700">{b.leader.name}</span>
                      : <span className="text-amber-600 font-semibold">Unassigned</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <InlineAction
                      booking={b}
                      leaders={leaders}
                      onAction={handleAction}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-sm">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(b => {
          const id = b._id || b.id;
          return (
            <div key={id} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-lg font-mono">{id.slice(-8)}</span>
                <StatusChip status={b.status} />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{b.service}</p>
              <p className="text-xs text-slate-500 mb-1">{b.client?.name} · {b.patient}</p>
              <p className="text-xs text-slate-400 mb-2">
                {b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN') : '—'}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800">
                  {b.amount ? `₹${b.amount.toLocaleString('en-IN')}` : '—'}
                </span>
                <span className="text-xs text-slate-500">
                  {b.leader ? b.leader.name : <span className="text-amber-600 font-semibold">Unassigned</span>}
                </span>
              </div>
              {b.status === 'PENDING' && (
                <div className="pt-3 border-t border-slate-100">
                  <InlineAction booking={b} leaders={leaders} onAction={handleAction} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
