import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MOCK_LEADER,
  MOCK_LEADER_BOOKINGS,
  MOCK_LEADER_TICKETS,
  MOCK_TODAY_TASKS,
} from '../../data/mockLeader.js';
import {
  ClipboardListIcon,
  CheckCircleIcon,
  BellIcon,
  ArrowRightIcon,
  CheckIcon,
  CalendarIcon,
} from '../../components/common/icons.jsx';

const PALETTE = {
  blue:   { icon: 'bg-blue-100 text-blue-600',    sel: 'border-blue-500 bg-blue-50' },
  teal:   { icon: 'bg-teal-100 text-teal-600',    sel: 'border-teal-500 bg-teal-50' },
  orange: { icon: 'bg-orange-100 text-orange-600', sel: 'border-orange-500 bg-orange-50' },
  violet: { icon: 'bg-violet-100 text-violet-600', sel: 'border-violet-500 bg-violet-50' },
  rose:   { icon: 'bg-rose-100 text-rose-600',    sel: 'border-rose-500 bg-rose-50' },
  green:  { icon: 'bg-green-100 text-green-600',  sel: 'border-green-500 bg-green-50' },
};

function StatCard({ label, value, colorClass, Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default function LeaderDashboard() {
  const [tasks, setTasks] = useState(MOCK_TODAY_TASKS);

  const firstName = MOCK_LEADER.name.split(' ')[0];
  const assigned = MOCK_LEADER_BOOKINGS.filter(b => b.status === 'ACTIVE' || b.status === 'PENDING').length;
  const inProgress = MOCK_LEADER_BOOKINGS.filter(b => b.status === 'ACTIVE').length;
  const openTickets = MOCK_LEADER_TICKETS.filter(t => t.status === 'OPEN').length;

  const activeBooking = MOCK_LEADER_BOOKINGS.find(b => b.status === 'ACTIVE');
  const pendingBooking = MOCK_LEADER_BOOKINGS.find(b => b.status === 'PENDING');
  const recentUpdates = activeBooking ? activeBooking.updates.slice(0, 3) : [];

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const allDone = tasks.every(t => t.done);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Good morning, {firstName}!</h1>
        <p className="text-sm text-slate-500 mt-1">Jun 20, 2026 · {MOCK_LEADER.location}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Assigned"
          value={assigned}
          colorClass="bg-teal-100 text-teal-600"
          Icon={ClipboardListIcon}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          colorClass="bg-blue-100 text-blue-600"
          Icon={ArrowRightIcon}
        />
        <StatCard
          label="Completed Total"
          value={MOCK_LEADER.totalCompleted}
          colorClass="bg-green-100 text-green-600"
          Icon={CheckCircleIcon}
        />
        <StatCard
          label="Open Tickets"
          value={openTickets}
          colorClass="bg-amber-100 text-amber-600"
          Icon={BellIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Today's Tasks</h2>
              <span className="text-xs text-slate-400 font-medium">Jun 20, 2026</span>
            </div>
            {allDone ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                  <CheckCircleIcon className="w-7 h-7 text-teal-600" />
                </div>
                <p className="font-semibold text-slate-700">All done!</p>
                <p className="text-sm text-slate-400 mt-1">Great work today, {firstName}.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        task.done
                          ? 'bg-teal-600 border-teal-600'
                          : 'border-slate-300 hover:border-teal-400'
                      }`}
                    >
                      {task.done && <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{task.time}</span>
                        <span className={`text-sm ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {task.task}
                        </span>
                      </div>
                      <Link
                        to={`/leader/progress/${task.bookingId}`}
                        className="text-xs text-teal-600 hover:underline mt-0.5 inline-block"
                      >
                        #{task.bookingId}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {activeBooking && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Active Booking</h2>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${PALETTE[activeBooking.serviceColor]?.icon || 'bg-slate-100 text-slate-600'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={activeBooking.svgPath} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{activeBooking.service}</p>
                  <p className="text-xs text-slate-500">#{activeBooking.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Client</p>
                  <p className="font-semibold text-slate-700">{activeBooking.client.name}</p>
                  <a href={`tel:${activeBooking.client.phone}`} className="text-xs text-teal-600 hover:underline">{activeBooking.client.phone}</a>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Patient</p>
                  <p className="font-semibold text-slate-700">{activeBooking.patient}</p>
                  <p className="text-xs text-slate-500">{activeBooking.patientAge}y · {activeBooking.gender}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold text-teal-700">{activeBooking.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${activeBooking.progressPercent}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 italic mb-4">{activeBooking.currentTask}</p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to={`/leader/progress/${activeBooking.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Update Progress
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  to={`/leader/verify/${activeBooking.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-500 text-sm font-semibold rounded-xl cursor-not-allowed"
                >
                  Verify OTP
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {pendingBooking && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-800 text-sm">Upcoming Assignment</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">PENDING</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${PALETTE[pendingBooking.serviceColor]?.icon || 'bg-slate-100 text-slate-600'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={pendingBooking.svgPath} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{pendingBooking.service}</p>
                  <p className="text-xs text-slate-500">#{pendingBooking.id}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pendingBooking.startDate} → {pendingBooking.endDate}</span>
                </div>
                <p className="text-slate-500">Client: <span className="font-medium text-slate-700">{pendingBooking.client.name}</span></p>
              </div>
              <p className="text-xs text-amber-700 font-medium bg-amber-50 rounded-lg px-3 py-2 mb-3">
                Starts Jun 25 — 5 days from now
              </p>
              <Link
                to="/leader/bookings"
                className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-semibold"
              >
                View Details
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-4">Recent Updates</h2>
            {recentUpdates.length === 0 ? (
              <p className="text-sm text-slate-400">No updates yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-100" />
                <ul className="space-y-4">
                  {recentUpdates.map((u, i) => (
                    <li key={i} className="flex gap-4 pl-6 relative">
                      <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-teal-500 bg-white flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-medium">{u.date} · {u.time}</p>
                        <p className="text-sm text-slate-700 mt-0.5 line-clamp-2">{u.note}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeBooking && (
              <Link
                to={`/leader/progress/${activeBooking.id}`}
                className="block text-center text-xs text-teal-600 hover:underline mt-4 font-medium"
              >
                View all updates →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
