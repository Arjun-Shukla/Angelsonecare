import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_LEADER_BOOKINGS } from '../../data/mockLeader.js';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
} from '../../components/common/icons.jsx';

const PALETTE = {
  blue:   { icon: 'bg-blue-100 text-blue-600',    sel: 'border-blue-500 bg-blue-50' },
  teal:   { icon: 'bg-teal-100 text-teal-600',    sel: 'border-teal-500 bg-teal-50' },
  orange: { icon: 'bg-orange-100 text-orange-600', sel: 'border-orange-500 bg-orange-50' },
  violet: { icon: 'bg-violet-100 text-violet-600', sel: 'border-violet-500 bg-violet-50' },
  rose:   { icon: 'bg-rose-100 text-rose-600',    sel: 'border-rose-500 bg-rose-50' },
  green:  { icon: 'bg-green-100 text-green-600',  sel: 'border-green-500 bg-green-50' },
};

const STATUS_OPTIONS = [
  { value: 'NOT_STARTED',     label: 'Not Started' },
  { value: 'STARTED',         label: 'Started' },
  { value: 'IN_PROGRESS',     label: 'In Progress' },
  { value: 'NEAR_COMPLETION', label: 'Near Completion' },
];

const BOOKING_STATUS_STYLES = {
  ACTIVE:    'bg-teal-100 text-teal-700',
  PENDING:   'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

function Toast({ message }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-teal-600 text-white px-5 py-3 rounded-2xl shadow-lg animate-fade-in">
      <CheckIcon className="w-4 h-4" strokeWidth={3} />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

function UpdateItem({ update }) {
  return (
    <li className="flex gap-4 pl-6 relative">
      <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-teal-500 bg-white flex-shrink-0" />
      <div className="min-w-0 pb-4">
        <p className="text-xs text-slate-400 font-medium">{update.date} · {update.time}</p>
        <p className="text-sm text-slate-700 mt-1">{update.note}</p>
      </div>
    </li>
  );
}

export default function UpdateProgress() {
  const { id } = useParams();
  const booking = MOCK_LEADER_BOOKINGS.find(b => b.id === id);

  const [selectedStatus, setSelectedStatus] = useState(booking?.progressStatus || 'NOT_STARTED');
  const [note, setNote] = useState('');
  const [updates, setUpdates] = useState(booking?.updates || []);
  const [toast, setToast] = useState(false);

  if (!booking) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto mt-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
          <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Booking Not Found</h2>
          <p className="text-slate-500 mb-6">No booking with ID "{id}" was found.</p>
          <Link
            to="/leader/bookings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const palette = PALETTE[booking.serviceColor] || PALETTE.teal;

  function handleSubmit(e) {
    e.preventDefault();
    if (!note.trim()) return;
    const now = new Date();
    const newUpdate = {
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      note: note.trim(),
    };
    setUpdates(prev => [newUpdate, ...prev]);
    setNote('');
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const canRequestOtp = booking.progressPercent >= 80 || selectedStatus === 'NEAR_COMPLETION';

  return (
    <div className="animate-fade-in space-y-6">
      {toast && <Toast message="Update logged!" />}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/leader/bookings" className="flex items-center gap-1 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Assigned Bookings
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">#{id}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${palette.icon}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={booking.svgPath} />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{booking.service}</h1>
              <p className="text-sm text-slate-500">#{booking.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${BOOKING_STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-600'}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Patient</p>
            <p className="text-sm font-semibold text-slate-800">{booking.patient}</p>
            <p className="text-xs text-slate-500">{booking.patientAge}y · {booking.gender}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Client</p>
            <p className="text-sm font-semibold text-slate-800">{booking.client.name}</p>
            <a href={`tel:${booking.client.phone}`} className="text-xs text-teal-600 hover:underline">{booking.client.phone}</a>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Duration</p>
            <p className="text-sm font-medium text-slate-700">{booking.startDate}</p>
            <p className="text-xs text-slate-500">→ {booking.endDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Shift</p>
            <p className="text-sm font-medium text-slate-700">{booking.shiftTime}</p>
          </div>
        </div>

        {booking.notes && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{booking.notes}</p>
          </div>
        )}

        {booking.extras && booking.extras.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {booking.extras.map(extra => (
              <span key={extra} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                {extra}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 mb-4">Progress</h2>

            <div className="mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Current progress</span>
                <span className="font-bold text-teal-700">{booking.progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all"
                  style={{ width: `${booking.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">Update Status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-colors ${
                      selectedStatus === opt.value
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label-style">Progress Update</label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Describe today's tasks, observations, patient condition..."
                  className="input-style resize-none"
                />
              </div>
              <div>
                <label className="label-style">Date & Time</label>
                <input
                  type="text"
                  readOnly
                  value={new Date().toLocaleString()}
                  className="input-style bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={!note.trim()}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
              >
                Log Update
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-800 mb-4">Service Updates</h2>
          {updates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">No updates yet. Log your first update above.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-100" />
              <ul className="space-y-0">
                {updates.map((u, i) => (
                  <UpdateItem key={i} update={u} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <Link
          to="/leader/bookings"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Bookings
        </Link>
        {canRequestOtp ? (
          <Link
            to={`/leader/verify/${id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Request OTP & Complete Service
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 text-slate-400 font-semibold text-sm rounded-xl cursor-not-allowed"
          >
            Log more progress before requesting OTP
          </button>
        )}
      </div>
    </div>
  );
}
