import { useState } from 'react';
import {
  MOCK_ALL_BOOKINGS,
  MOCK_RECENT_ACTIVITY,
  MOCK_LEADERS,
} from '../../data/mockAdmin.js';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  TagIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from '../../components/common/icons.jsx';

const STAT_CARDS = [
  {
    label: 'Total Bookings',
    value: '1,247',
    accent: 'blue',
    Icon: ClipboardListIcon,
    trend: '+12% vs last month',
    trendColor: 'green',
  },
  {
    label: 'Active Services',
    value: '43',
    accent: 'green',
    Icon: CheckCircleIcon,
    trend: '+5% vs last month',
    trendColor: 'green',
  },
  {
    label: 'Monthly Revenue',
    value: '₹8,42,500',
    accent: 'teal',
    Icon: CurrencyRupeeIcon,
    trend: '+18% vs last month',
    trendColor: 'green',
  },
  {
    label: 'Total Leaders',
    value: '18',
    accent: 'violet',
    Icon: UserGroupIcon,
    trend: '+2 this month',
    trendColor: 'green',
  },
  {
    label: 'Open Tickets',
    value: '7',
    accent: 'amber',
    Icon: TagIcon,
    trend: '3 urgent',
    trendColor: 'amber',
  },
  {
    label: 'Avg Rating',
    value: '4.7★',
    accent: 'rose',
    Icon: StarIcon,
    trend: '+0.1 vs last month',
    trendColor: 'green',
  },
];

const accentMap = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-600',   num: 'text-blue-700' },
  green:  { bg: 'bg-green-100',  text: 'text-green-600',  num: 'text-green-700' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-600',   num: 'text-teal-700' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', num: 'text-violet-700' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-600',  num: 'text-amber-700' },
  rose:   { bg: 'bg-rose-100',   text: 'text-rose-600',   num: 'text-rose-700' },
};

const trendColorMap = {
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  red:   'bg-red-50 text-red-700',
};

function StatCard({ label, value, accent, Icon, trend, trendColor }) {
  const a = accentMap[accent];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${a.text}`} />
      </div>
      <p className={`text-3xl font-black ${a.num} leading-none mb-1`}>{value}</p>
      <p className="text-xs text-slate-500 mb-2">{label}</p>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${trendColorMap[trendColor]}`}>
        {trend}
      </span>
    </div>
  );
}

const dotColors = {
  blue:  'bg-blue-500',
  teal:  'bg-teal-500',
  amber: 'bg-amber-500',
  rose:  'bg-rose-500',
  green: 'bg-green-500',
};

const METRICS = [
  { label: 'Bookings', value: '89 / 100', pct: 89, color: 'bg-blue-500' },
  { label: 'Revenue',  value: '₹8,42,500 / ₹10L', pct: 84, color: 'bg-teal-500' },
  { label: 'Completion Rate', value: '94%', pct: 94, color: 'bg-blue-500' },
  { label: 'New Clients', value: '34', pct: 68, color: 'bg-teal-500' },
];

export default function AdminDashboard() {
  const pendingBookings = MOCK_ALL_BOOKINGS.filter(b => b.status === 'PENDING');
  const activeLeaders = MOCK_LEADERS.filter(l => l.status === 'ACTIVE');

  const [actionState, setActionState] = useState({});
  const [selectedLeader, setSelectedLeader] = useState({});
  const [rejectReason, setRejectReason] = useState({});

  function setAction(id, state) {
    setActionState(prev => ({ ...prev, [id]: state }));
  }

  function handleConfirmAssign(id) {
    setAction(id, 'done-accepted');
  }

  function handleConfirmReject(id) {
    setAction(id, 'done-rejected');
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Jun 20, 2026 · Angels One Healthcare Services</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto">
          <ArrowTrendingUpIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-slate-900">Pending Bookings · Requires Action</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {pendingBookings.length}
          </span>
        </div>
        <div className="space-y-3">
          {pendingBookings.map(booking => {
            const state = actionState[booking.id] || null;
            return (
              <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
                    {booking.id}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{booking.service}</p>
                    <p className="text-xs text-slate-500">{booking.client.name} · Requested {booking.createdAt}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {state === null && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAction(booking.id, 'assigning')}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept →
                      </button>
                      <button
                        onClick={() => setAction(booking.id, 'rejecting')}
                        className="px-3 py-1.5 border border-red-300 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {state === 'assigning' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={selectedLeader[booking.id] || ''}
                        onChange={e => setSelectedLeader(prev => ({ ...prev, [booking.id]: e.target.value }))}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white"
                      >
                        <option value="">Select Leader</option>
                        {activeLeaders.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleConfirmAssign(booking.id)}
                        className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Confirm Assignment
                      </button>
                      <button
                        onClick={() => setAction(booking.id, null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {state === 'rejecting' && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <textarea
                        rows={1}
                        placeholder="Reason for rejection..."
                        value={rejectReason[booking.id] || ''}
                        onChange={e => setRejectReason(prev => ({ ...prev, [booking.id]: e.target.value }))}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 w-48 resize-none"
                      />
                      <button
                        onClick={() => handleConfirmReject(booking.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setAction(booking.id, null)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {state === 'done-accepted' && (
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      ✓ Accepted &amp; Assigned
                    </span>
                  )}
                  {state === 'done-rejected' && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      ✗ Rejected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-0">
            {MOCK_RECENT_ACTIVITY.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${dotColors[item.color] || 'bg-slate-400'}`} />
                  {idx < MOCK_RECENT_ACTIVITY.length - 1 && (
                    <div className="w-px flex-1 bg-slate-100 my-1" style={{ minHeight: '16px' }} />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">This Month's Performance</h2>
          <div className="space-y-4">
            {METRICS.map(m => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{m.label}</span>
                  <span className="text-sm font-bold text-slate-900">{m.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.color} transition-all`}
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
