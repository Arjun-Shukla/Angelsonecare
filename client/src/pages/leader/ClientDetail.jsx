import { useParams, Link } from 'react-router-dom';
import { MOCK_LEADER_BOOKINGS } from '../../data/mockLeader.js';
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
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

export default function ClientDetail() {
  const { id } = useParams();
  const booking = MOCK_LEADER_BOOKINGS.find(b => b.client.id === id);
  const client = booking?.client;

  if (!client) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto mt-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
          <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Client Not Found</h2>
          <p className="text-slate-500 mb-6">No client with ID "{id}" was found in your bookings.</p>
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

  const allBookingsForClient = MOCK_LEADER_BOOKINGS.filter(b => b.client.id === id);
  const currentBooking = allBookingsForClient.find(b => b.status === 'ACTIVE' || b.status === 'PENDING');
  const hasHistory = allBookingsForClient.length > 1;

  const initials = client.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/leader/bookings" className="flex items-center gap-1 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Assigned Bookings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{client.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MailIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Email</p>
                  <a href={`mailto:${client.email}`} className="text-sm text-slate-700 hover:text-teal-600 break-all">
                    {client.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Phone</p>
                  <a href={`tel:${client.phone}`} className="text-sm text-slate-700 hover:text-teal-600">
                    {client.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-0.5">Address</p>
                  <p className="text-sm text-slate-700">{client.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <a
                href={`tel:${client.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                <PhoneIcon className="w-4 h-4" />
                Call Client
              </a>
              <a
                href={`mailto:${client.email}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-slate-200 hover:border-teal-400 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                <MailIcon className="w-4 h-4" />
                Send Email
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {currentBooking && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Current Booking</h3>
                <StatusBadge status={currentBooking.status} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${(PALETTE[currentBooking.serviceColor] || PALETTE.teal).icon}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={currentBooking.svgPath} />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{currentBooking.service}</p>
                  <p className="text-xs text-slate-500">#{currentBooking.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Patient</p>
                  <p className="font-semibold text-slate-700">{currentBooking.patient}</p>
                  <p className="text-xs text-slate-500">{currentBooking.patientAge}y · {currentBooking.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Duration</p>
                  <p className="font-medium text-slate-700 text-xs">{currentBooking.startDate}</p>
                  <p className="text-xs text-slate-500">→ {currentBooking.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Shift</p>
                  <p className="font-medium text-slate-700 text-xs">{currentBooking.shiftTime}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold text-teal-700">{currentBooking.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${currentBooking.progressPercent}%` }}
                  />
                </div>
              </div>
              <Link
                to={`/leader/progress/${currentBooking.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                Update Progress
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Service History</h3>
            {!hasHistory ? (
              <p className="text-sm text-slate-400 py-4 text-center">No previous service history.</p>
            ) : (
              <div className="space-y-3">
                {allBookingsForClient.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${(PALETTE[b.serviceColor] || PALETTE.teal).icon}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d={b.svgPath} />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{b.service}</p>
                        <p className="text-xs text-slate-500">{b.startDate} → {b.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={b.status} />
                      {b.status === 'COMPLETED' && (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentBooking && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-4">Patient Care Notes</h3>
              {currentBooking.extras && currentBooking.extras.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentBooking.extras.map(extra => (
                    <span key={extra} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-200">
                      {extra}
                    </span>
                  ))}
                </div>
              )}
              {currentBooking.notes && (
                <p className="text-sm text-slate-700 mb-4 leading-relaxed">{currentBooking.notes}</p>
              )}
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  Always verify medication schedule with the client or supervisor before each administration.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
