import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_LEADER_BOOKINGS } from '../../data/mockLeader.js';
import {
  WrenchScrewdriverIcon,
  KeyIcon,
  UserIcon,
  ClipboardListIcon,
} from '../../components/common/icons.jsx';

const PALETTE = {
  blue:   { icon: 'bg-blue-100 text-blue-600',    sel: 'border-blue-500 bg-blue-50' },
  teal:   { icon: 'bg-teal-100 text-teal-600',    sel: 'border-teal-500 bg-teal-50' },
  orange: { icon: 'bg-orange-100 text-orange-600', sel: 'border-orange-500 bg-orange-50' },
  violet: { icon: 'bg-violet-100 text-violet-600', sel: 'border-violet-500 bg-violet-50' },
  rose:   { icon: 'bg-rose-100 text-rose-600',    sel: 'border-rose-500 bg-rose-50' },
  green:  { icon: 'bg-green-100 text-green-600',  sel: 'border-green-500 bg-green-50' },
};

const STATUS_STYLES = {
  ACTIVE:    'bg-teal-100 text-teal-700',
  PENDING:   'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
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
  const palette = PALETTE[booking.serviceColor] || PALETTE.teal;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${palette.icon}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={booking.svgPath} />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{booking.service}</p>
            <p className="text-xs text-slate-500">#{booking.id}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div>
          <span className="text-slate-400 font-medium">Client</span>
          <p className="font-semibold text-slate-700 mt-0.5">{booking.client.name}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Patient</span>
          <p className="font-semibold text-slate-700 mt-0.5">{booking.patient}, {booking.patientAge}y</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Shift</span>
          <p className="font-medium text-slate-700 mt-0.5">{booking.shiftTime}</p>
        </div>
        <div>
          <span className="text-slate-400 font-medium">Dates</span>
          <p className="font-medium text-slate-700 mt-0.5">{booking.startDate}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-1 flex-wrap">
        <Link
          to={`/leader/progress/${booking.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <WrenchScrewdriverIcon className="w-3.5 h-3.5" />
          Update Progress
        </Link>
        {booking.status === 'ACTIVE' && (
          <Link
            to={`/leader/verify/${booking.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors"
          >
            <KeyIcon className="w-3.5 h-3.5" />
            OTP Verify
          </Link>
        )}
        <Link
          to={`/leader/clients/${booking.client.id}`}
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
  const [filter, setFilter] = useState('ALL');

  const counts = {
    ALL: MOCK_LEADER_BOOKINGS.length,
    ACTIVE: MOCK_LEADER_BOOKINGS.filter(b => b.status === 'ACTIVE').length,
    PENDING: MOCK_LEADER_BOOKINGS.filter(b => b.status === 'PENDING').length,
    COMPLETED: MOCK_LEADER_BOOKINGS.filter(b => b.status === 'COMPLETED').length,
  };

  const filtered = filter === 'ALL'
    ? MOCK_LEADER_BOOKINGS
    : MOCK_LEADER_BOOKINGS.filter(b => b.status === filter);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Assigned Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">All bookings assigned to you</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED'].map(status => (
          <FilterTab
            key={status}
            label={status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            count={counts[status]}
            active={filter === status}
            onClick={() => setFilter(status)}
          />
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Shift</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Dates</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                  <ClipboardListIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                  <p className="font-medium">No bookings found</p>
                  <p className="text-xs mt-1">Try a different filter</p>
                </td>
              </tr>
            ) : (
              filtered.map(booking => {
                const palette = PALETTE[booking.serviceColor] || PALETTE.teal;
                return (
                  <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                        #{booking.id}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${palette.icon}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={booking.svgPath} />
                          </svg>
                        </div>
                        <span className="font-medium text-slate-800">{booking.service}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{booking.client.name}</p>
                      <p className="text-xs text-slate-400">{booking.client.phone}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{booking.patient}</p>
                      <p className="text-xs text-slate-400">{booking.patientAge}y · {booking.gender}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{booking.shiftTime}</td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700 text-xs">{booking.startDate}</p>
                      <p className="text-slate-400 text-xs">→ {booking.endDate}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/leader/progress/${booking.id}`}
                          title="Update Progress"
                          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                        >
                          <WrenchScrewdriverIcon className="w-4 h-4" />
                        </Link>
                        {booking.status === 'ACTIVE' && (
                          <Link
                            to={`/leader/verify/${booking.id}`}
                            title="OTP Verify"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <KeyIcon className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/leader/clients/${booking.client.id}`}
                          title="Client Details"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                        >
                          <UserIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
            <ClipboardListIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No bookings found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different filter</p>
          </div>
        ) : (
          filtered.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}
