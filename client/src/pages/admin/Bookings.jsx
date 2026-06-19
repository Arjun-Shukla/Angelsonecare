import { useState } from 'react';
import { MOCK_ALL_BOOKINGS, MOCK_LEADERS } from '../../data/mockAdmin.js';
import { MagnifyingGlassIcon } from '../../components/common/icons.jsx';

const STATUS_FILTERS = ['ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

const statusBadge = {
  PENDING:   'bg-amber-100 text-amber-700',
  ACTIVE:    'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

function StatusChip({ status }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[status] || 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  );
}

function InlineAction({ booking, activeLeaders, actionState, setAction, selectedLeader, setSelectedLeader, rejectReason, setRejectReason }) {
  const state = actionState[booking.id] || null;
  if (booking.status !== 'PENDING') return null;

  if (state === null) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setAction(booking.id, 'assigning')}
          className="px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Assign
        </button>
        <button
          onClick={() => setAction(booking.id, 'rejecting')}
          className="px-2.5 py-1 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
      </div>
    );
  }
  if (state === 'assigning') {
    return (
      <div className="flex flex-col gap-1.5">
        <select
          value={selectedLeader[booking.id] || ''}
          onChange={e => setSelectedLeader(prev => ({ ...prev, [booking.id]: e.target.value }))}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 bg-white"
        >
          <option value="">Select Leader</option>
          {activeLeaders.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <button
            onClick={() => setAction(booking.id, 'done-accepted')}
            className="px-2.5 py-1 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            Confirm
          </button>
          <button onClick={() => setAction(booking.id, null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      </div>
    );
  }
  if (state === 'rejecting') {
    return (
      <div className="flex flex-col gap-1.5">
        <textarea
          rows={1}
          placeholder="Reason..."
          value={rejectReason[booking.id] || ''}
          onChange={e => setRejectReason(prev => ({ ...prev, [booking.id]: e.target.value }))}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-700 resize-none w-36"
        />
        <div className="flex gap-1.5">
          <button
            onClick={() => setAction(booking.id, 'done-rejected')}
            className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
          <button onClick={() => setAction(booking.id, null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      </div>
    );
  }
  if (state === 'done-accepted') {
    return <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-lg">✓ Assigned</span>;
  }
  if (state === 'done-rejected') {
    return <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">✗ Rejected</span>;
  }
  return null;
}

export default function AdminBookings() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionState, setActionState] = useState({});
  const [selectedLeader, setSelectedLeader] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [localBookings] = useState([...MOCK_ALL_BOOKINGS]);

  const activeLeaders = MOCK_LEADERS.filter(l => l.status === 'ACTIVE');

  function setAction(id, state) {
    setActionState(prev => ({ ...prev, [id]: state }));
  }

  const counts = STATUS_FILTERS.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? localBookings.length : localBookings.filter(b => b.status === s).length;
    return acc;
  }, {});

  const filtered = localBookings.filter(b => {
    const matchStatus = filter === 'ALL' || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.id.toLowerCase().includes(q) || b.client.name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const actionProps = { activeLeaders, actionState, setAction, selectedLeader, setSelectedLeader, rejectReason, setRejectReason };

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Management</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {STATUS_FILTERS.slice(1).map(s => (
            <span key={s} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[s]}`}>
              {s}: {counts[s]}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by booking ID or client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s} {s === 'ALL' ? `(${counts.ALL})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Booking</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Client</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Service</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Patient</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Dates</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Amount</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Leader</th>
              <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg">{b.id}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800 text-xs">{b.client.name}</p>
                  <p className="text-slate-400 text-xs">{b.client.phone}</p>
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs">{b.service}</td>
                <td className="px-4 py-3 text-slate-600 text-xs">{b.patient}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  <span>{b.startDate}</span>
                  <span className="block text-slate-400">→ {b.endDate}</span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-800">₹{b.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <StatusChip status={b.status} />
                </td>
                <td className="px-4 py-3 text-xs">
                  {b.leader
                    ? <span className="text-slate-700">{b.leader.name}</span>
                    : (b.status === 'PENDING' || b.status === 'ACTIVE')
                      ? <span className="text-amber-600 font-semibold">Unassigned</span>
                      : <span className="text-slate-400">—</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a href="#" className="text-xs text-blue-600 hover:underline font-medium">View</a>
                    <InlineAction booking={b} {...actionProps} />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400 text-sm">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg">{b.id}</span>
              <StatusChip status={b.status} />
            </div>
            <p className="font-semibold text-slate-800 text-sm">{b.service}</p>
            <p className="text-xs text-slate-500 mb-1">{b.client.name} · {b.patient}</p>
            <p className="text-xs text-slate-400 mb-2">{b.startDate} → {b.endDate}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">₹{b.amount.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500">
                {b.leader ? b.leader.name : <span className="text-amber-600 font-semibold">Unassigned</span>}
              </span>
            </div>
            {b.status === 'PENDING' && (
              <div className="mt-3 pt-3 border-t border-slate-50">
                <InlineAction booking={b} {...actionProps} />
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No bookings found.</p>
        )}
      </div>
    </div>
  );
}
