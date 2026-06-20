import { useState, useEffect } from 'react';
import { getDashboard, getBookingTrends, getRevenue } from '../../api/analytics.api.js';
import { getAllLeaders } from '../../api/user.api.js';
import {
  ArrowTrendingUpIcon,
  ClipboardListIcon,
  CurrencyRupeeIcon,
} from '../../components/common/icons.jsx';

function LineChart({ data, height = 180 }) {
  if (!data || data.length < 2) return <p className="text-xs text-slate-400 text-center py-8">No data yet.</p>;
  const values = data.map(d => d.revenue);
  const max = Math.max(...values) || 1;
  const min = Math.min(...values) * 0.85;
  const W = 560, H = height;
  const padL = 10, padR = 10, padT = 12, padB = 28;
  const cW = W - padL - padR, cH = H - padT - padB;
  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * cW,
    y: padT + cH - ((d.revenue - min) / ((max - min) || 1)) * cH,
  }));
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = [`${pts[0].x},${padT + cH}`, ...pts.map(p => `${p.x},${p.y}`), `${pts[pts.length - 1].x},${padT + cH}`].join(' ');
  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#revGrad)" />
      <polyline points={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{data[i].month}</text>
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="600">{fmt(data[i].revenue)}</text>
        </g>
      ))}
    </svg>
  );
}

function BarChart({ data, height = 160 }) {
  if (!data || data.length === 0) return <p className="text-xs text-slate-400 text-center py-8">No data yet.</p>;
  const max = Math.max(...data.map(d => d.count)) || 1;
  const W = 520, H = height;
  const padL = 10, padB = 28, padT = 20;
  const barW = 44, gap = data.length > 1 ? (W - padL - data.length * barW) / (data.length - 1) : 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const bH = ((d.count / max) * (H - padB - padT)) || 2;
        const x = padL + i * (barW + gap);
        const y = H - padB - bH;
        return (
          <g key={d.month}>
            <rect x={x} y={y} width={barW} height={bH} rx="6" fill="#3b82f6" opacity="0.8" />
            <text x={x + barW / 2} y={H - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.month}</text>
            <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="700">{d.count}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((s, d) => s + d.count, 0);
  if (total === 0) return <p className="text-xs text-slate-400 text-center py-8">No completed services yet.</p>;
  const cx = 90, cy = 90, r = 65, strokeW = 22;
  let cumAngle = -Math.PI / 2;
  const arcs = segments.map((seg) => {
    const angle = (seg.count / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return {
      d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      color: seg.color,
      name:  seg.name,
      count: seg.count,
    };
  });
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-44 h-44 shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
        {arcs.map((arc, i) => (
          <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={strokeW} strokeLinecap="butt" />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#0f172a">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#94a3b8">Total</text>
      </svg>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-slate-600">{seg.name}</span>
            <span className="text-xs font-bold text-slate-800 ml-auto">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const accentMap = {
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-600',   num: 'text-teal-700' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-600',   num: 'text-blue-700' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', num: 'text-violet-700' },
  green:  { bg: 'bg-green-100',  text: 'text-green-600',  num: 'text-green-700' },
};

function fmtRevenue(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function Analytics() {
  const [dash,         setDash]         = useState(null);
  const [bookingData,  setBookingData]  = useState([]);
  const [revenueData,  setRevenueData]  = useState([]);
  const [serviceDist,  setServiceDist]  = useState([]);
  const [leaders,      setLeaders]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboard().catch(() => null),
      getBookingTrends(6).catch(() => null),
      getRevenue(6).catch(() => null),
      getAllLeaders().catch(() => null),
    ]).then(([dashRes, bookRes, revRes, ldrsRes]) => {
      if (dashRes?.data)   setDash(dashRes.data);
      if (bookRes?.data)   setBookingData(bookRes.data.bookings  || []);
      if (revRes?.data) {
        setRevenueData(revRes.data.revenue             || []);
        setServiceDist(revRes.data.serviceDistribution || []);
      }
      if (ldrsRes?.data)   setLeaders(ldrsRes.data.users || []);
    }).finally(() => setLoading(false));
  }, []);

  const topStats = dash
    ? [
        { label: 'Total Revenue',    value: fmtRevenue(dash.totalRevenue),    Icon: CurrencyRupeeIcon,  accent: 'teal'   },
        { label: 'Total Bookings',   value: dash.totalBookings,               Icon: ClipboardListIcon,  accent: 'blue'   },
        { label: 'Active Services',  value: dash.activeServices,              Icon: ArrowTrendingUpIcon, accent: 'violet' },
        { label: 'Completed',        value: dash.completedServices,           Icon: ArrowTrendingUpIcon, accent: 'green'  },
      ]
    : [];

  const totalServiceCount = serviceDist.reduce((s, d) => s + d.count, 0);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-0.5">Platform performance overview</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {dash && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topStats.map(stat => {
                  const a = accentMap[stat.accent];
                  return (
                    <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                      <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center mb-3`}>
                        <stat.Icon className={`w-5 h-5 ${a.text}`} />
                      </div>
                      <p className={`text-2xl font-black ${a.num} leading-none mb-1`}>{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Clients',  value: dash.totalClients,  color: 'text-blue-700' },
                  { label: 'Total Leaders',  value: dash.totalLeaders,  color: 'text-teal-700' },
                  { label: 'Pending',        value: dash.pendingBookings, color: 'text-amber-700' },
                  { label: 'Open Tickets',   value: dash.openTickets,   color: 'text-rose-700' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Revenue Trend</h2>
              <LineChart data={revenueData} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Bookings by Month</h2>
              <BarChart data={bookingData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Service Distribution</h2>
              <DonutChart segments={serviceDist} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Leader Performance</h2>
              {leaders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No leaders registered yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-2">Name</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-2">Location</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {leaders.map(l => (
                      <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5">
                          <p className="text-xs font-semibold text-slate-800">{l.name}</p>
                          <p className="text-[10px] text-slate-400">{l.email}</p>
                        </td>
                        <td className="py-2.5 text-xs text-slate-500">{l.location || '—'}</td>
                        <td className="py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            l.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {l.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {serviceDist.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-4">Service Revenue Breakdown</h2>
              <div className="space-y-3">
                {serviceDist.map(seg => {
                  const pct = totalServiceCount ? Math.round((seg.count / totalServiceCount) * 100) : 0;
                  return (
                    <div key={seg.name} className="flex items-center gap-4">
                      <div className="w-32 flex-shrink-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{seg.name}</p>
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: seg.color }} />
                      </div>
                      <div className="w-12 text-right flex-shrink-0">
                        <span className="text-xs font-bold text-slate-700">{pct}%</span>
                      </div>
                      <div className="w-12 text-right flex-shrink-0">
                        <span className="text-xs text-slate-500">{seg.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
