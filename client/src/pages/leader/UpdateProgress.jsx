import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
} from '../../components/common/icons.jsx';
import { getBooking, updateProgress as apiUpdateProgress } from '../../api/booking.api.js';

const ACTIVE_STATUSES = ['ACCEPTED', 'IN_PROGRESS'];

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

const STATUS_BADGE = {
  PENDING:              'bg-amber-100 text-amber-700',
  ACCEPTED:             'bg-green-100 text-green-700',
  IN_PROGRESS:          'bg-blue-100 text-blue-700',
  COMPLETION_REQUESTED: 'bg-purple-100 text-purple-700',
  COMPLETED:            'bg-teal-100 text-teal-700',
};

export default function UpdateProgress() {
  const { id } = useParams();
  const [booking,  setBooking]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [note,     setNote]     = useState('');
  const [updates,  setUpdates]  = useState([]);
  const [toast,    setToast]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    getBooking(id)
      .then(res => setBooking(res.data.booking))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="animate-fade-in flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await apiUpdateProgress(id, note.trim());
      const now = new Date();
      setUpdates(prev => [{
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        note: note.trim(),
      }, ...prev]);
      setNote('');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
      // Refresh booking to get latest status
      const res = await getBooking(id);
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log update.');
    } finally {
      setSubmitting(false);
    }
  };

  const canOtp = ACTIVE_STATUSES.includes(booking.status) && updates.length > 0;

  return (
    <div className="animate-fade-in space-y-6">
      {toast && <Toast message="Progress update logged!" />}

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/leader/bookings" className="flex items-center gap-1 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Assigned Bookings
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">#{(booking._id || id).slice(-8)}</span>
      </div>

      {/* Booking summary card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{booking.service}</h1>
            <p className="text-sm text-slate-500 font-mono">#{(booking._id || id).slice(-8)}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${STATUS_BADGE[booking.status] || 'bg-slate-100 text-slate-600'}`}>
            {booking.status?.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Patient</p>
            <p className="text-sm font-semibold text-slate-800">{booking.patient}</p>
            <p className="text-xs text-slate-500">{booking.patientAge ? `${booking.patientAge}y` : ''}{booking.gender ? ` · ${booking.gender}` : ''}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Client</p>
            <p className="text-sm font-semibold text-slate-800">{booking.client?.name}</p>
            <a href={`tel:${booking.client?.phone}`} className="text-xs text-teal-600 hover:underline">
              {booking.client?.phone || ''}
            </a>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Start Date</p>
            <p className="text-sm font-medium text-slate-700">
              {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Shift</p>
            <p className="text-sm font-medium text-slate-700">{booking.shiftTime || booking.shift || '—'}</p>
          </div>
        </div>

        {booking.notes && (
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mt-4">
            <p className="text-sm text-amber-800">{booking.notes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress update form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h2 className="font-bold text-slate-800 mb-4">Log Progress Update</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label-style">Progress Note</label>
              <textarea
                rows={4}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Describe today's tasks, observations, patient condition..."
                className="input-style resize-none"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!note.trim() || submitting}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {submitting ? 'Saving…' : 'Log Update'}
            </button>
          </form>
        </div>

        {/* Update timeline */}
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

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <Link
          to="/leader/bookings"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Bookings
        </Link>
        {canOtp ? (
          <Link
            to={`/leader/verify/${booking._id || id}`}
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
            {updates.length === 0 ? 'Log a progress update first' : 'Service already completed or pending OTP'}
          </button>
        )}
      </div>
    </div>
  );
}
