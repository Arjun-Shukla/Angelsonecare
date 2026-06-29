import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartIcon, CheckCircleIcon, ArrowLeftIcon, ArrowRightIcon,
  MapPinIcon, CurrencyRupeeIcon, ExclamationCircleIcon,
} from '../../components/common/icons.jsx';
import EmailSentToast from '../../components/common/EmailSentToast.jsx';
import { createBooking as apiCreateBooking } from '../../api/booking.api.js';
import { useAuth } from '../../context/AuthContext.jsx';

// ── Static data ────────────────────────────────────────────────────────────────
const SERVICES = [
  { id: 'elder-care',    name: 'Elder Care',         desc: 'Compassionate daily care for senior citizens at home',         basePrice: 800,  color: 'blue',   svgPath: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
  { id: 'home-nursing',  name: 'Home Nursing',       desc: 'Certified nurses for clinical-grade home medical care',         basePrice: 1200, color: 'teal',   svgPath: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z' },
  { id: 'patient-care',  name: 'Patient Caretaker',  desc: 'Personal attendant for recovery and daily assistance',          basePrice: 700,  color: 'violet', svgPath: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z' },
  { id: 'physiotherapy', name: 'Physiotherapy',      desc: 'Expert physiotherapy sessions in the comfort of your home',    basePrice: 1500, color: 'orange', svgPath: 'm3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z' },
  { id: 'post-surgery',  name: 'Post-Surgery Care',  desc: 'Specialized care and monitoring after surgical procedures',     basePrice: 1100, color: 'rose',   svgPath: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z' },
  { id: 'medical-assist',name: 'Medical Assistance', desc: 'Vitals monitoring, medication support and general medical care', basePrice: 900,  color: 'green',  svgPath: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' },
];

const PALETTE = {
  blue:   { hover: 'hover:border-indigo-300',  sel: 'border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50',   icon: 'bg-indigo-100 text-indigo-600',   tag: 'bg-indigo-50 text-indigo-700' },
  teal:   { hover: 'hover:border-emerald-300', sel: 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', tag: 'bg-emerald-50 text-emerald-700' },
  violet: { hover: 'hover:border-violet-300', sel: 'border-violet-500 ring-2 ring-violet-200 bg-violet-50', icon: 'bg-violet-100 text-violet-600', tag: 'bg-violet-50 text-violet-700' },
  orange: { hover: 'hover:border-orange-300', sel: 'border-orange-500 ring-2 ring-orange-200 bg-orange-50', icon: 'bg-orange-100 text-orange-600', tag: 'bg-orange-50 text-orange-700' },
  rose:   { hover: 'hover:border-rose-300',   sel: 'border-rose-500 ring-2 ring-rose-200 bg-rose-50',     icon: 'bg-rose-100 text-rose-600',     tag: 'bg-rose-50 text-rose-700' },
  green:  { hover: 'hover:border-green-300',  sel: 'border-green-500 ring-2 ring-green-200 bg-green-50',  icon: 'bg-green-100 text-green-600',   tag: 'bg-green-50 text-green-700' },
};

const DURATIONS = [
  { label: '1 Day',   days: 1  },
  { label: '3 Days',  days: 3  },
  { label: '1 Week',  days: 7  },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
  { label: 'Custom',  days: null },
];

const SHIFTS = [
  { label: 'Morning',   time: '6 AM – 2 PM'  },
  { label: 'Afternoon', time: '2 PM – 10 PM' },
  { label: 'Evening',   time: '4 PM – 8 PM'  },
  { label: 'Night',     time: '10 PM – 6 AM' },
  { label: '24 Hours',  time: 'Full Day'      },
];

const EXTRAS = [
  'Wheelchair Support',
  'Bedridden Patient',
  'Medicine Assistance',
  'Hospital Visit Support',
  'Physiotherapy Support',
];

const RELATIONSHIPS = ['Self', 'Spouse', 'Parent', 'Sibling', 'Child', 'Grandparent', 'Other'];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh',
];

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
];

const STEP_LABELS = ['Service', 'Patient', 'Details', 'Location', 'Schedule', 'Review'];

const INITIAL = {
  service: null,
  patientName: '', patientAge: '', gender: '', relationship: '',
  duration: '', shift: '', customDays: '',
  address: '', city: '', state: '', pincode: '',
  date: '', timeSlot: '', extras: [], notes: '',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

function computePrice(booking) {
  if (!booking.service || !booking.duration) return null;
  let days;
  if (booking.duration === 'Custom') {
    if (!booking.customDays || +booking.customDays < 1) return null;
    days = +booking.customDays;
  } else {
    const dur = DURATIONS.find((d) => d.label === booking.duration);
    if (!dur?.days) return null;
    days = dur.days;
  }
  const base = booking.service.basePrice;
  const subtotal = base * days;
  const discount = days >= 30 ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount, days };
}

function validateStep(step, booking) {
  const e = {};
  if (step === 1) {
    if (!booking.service) e.service = 'Please select a service to continue';
  }
  if (step === 2) {
    if (!booking.patientName.trim())              e.patientName   = 'Patient name is required';
    else if (booking.patientName.trim().length < 2) e.patientName = 'Name must be at least 2 characters';
    if (!booking.patientAge)                      e.patientAge    = 'Patient age is required';
    else if (+booking.patientAge < 1 || +booking.patientAge > 120) e.patientAge = 'Enter a valid age (1–120)';
    if (!booking.gender)                          e.gender        = 'Please select a gender';
    if (!booking.relationship)                    e.relationship  = 'Please select a relationship';
  }
  if (step === 3) {
    if (!booking.duration)                        e.duration      = 'Please select a duration';
    if (booking.duration === 'Custom' && !booking.customDays) e.customDays = 'Enter number of days';
    if (!booking.shift)                           e.shift         = 'Please select a shift';
  }
  if (step === 4) {
    if (!booking.address.trim())                  e.address       = 'Address is required';
    if (!booking.city.trim())                     e.city          = 'City is required';
    if (!booking.state)                           e.state         = 'Please select a state';
    if (!booking.pincode || !/^\d{6}$/.test(booking.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
  }
  if (step === 5) {
    if (!booking.date)                            e.date          = 'Please select a start date';
    if (!booking.timeSlot)                        e.timeSlot      = 'Please select a time slot';
  }
  return e;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0" />
      {msg}
    </p>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-2 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-right">{value || '—'}</span>
    </div>
  );
}

function SummaryPanel({ booking, price }) {
  const shiftTime = booking.shift ? SHIFTS.find((s) => s.label === booking.shift)?.time : null;
  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 px-5 py-4">
          <p className="text-[11px] font-semibold text-indigo-100 uppercase tracking-wider mb-0.5">Booking Summary</p>
          <p className="text-base font-bold text-white">Angels One Healthcare</p>
        </div>
        <div className="p-5 space-y-3">
          <SummaryRow label="Service"  value={booking.service?.name} />
          <SummaryRow label="Duration" value={booking.duration === 'Custom' && booking.customDays ? `${booking.customDays} days` : booking.duration} />
          <SummaryRow label="Shift"    value={shiftTime ? `${booking.shift} (${shiftTime})` : booking.shift} />
          <SummaryRow label="City"     value={booking.city} />
          <SummaryRow label="Date"     value={booking.date} />
          <SummaryRow label="Time"     value={booking.timeSlot} />

          {booking.extras?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Add-ons</p>
              <div className="flex flex-wrap gap-1">
                {booking.extras.map((ex) => (
                  <span key={ex} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{ex}</span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 mt-1">
            {price ? (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>₹{fmt(booking.service.basePrice)} × {price.days} day{price.days > 1 ? 's' : ''}</span>
                  <span>₹{fmt(price.subtotal)}</span>
                </div>
                {price.discount > 0 && (
                  <div className="flex justify-between text-green-600 text-xs">
                    <span>Monthly discount (10%)</span>
                    <span>−₹{fmt(price.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 mt-1">
                  <span>Estimated Total</span>
                  <span className="text-indigo-600">₹{fmt(price.total)}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed pt-1">*Taxes may apply. Final price confirmed after caregiver assignment.</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a service and duration to see the estimated cost.</p>
            )}
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 p-3">
            <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
            <p className="text-xs text-green-700 font-medium">OTP-secured service completion</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ProgressBar({ step }) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="flex items-center">
          {STEP_LABELS.map((label, i) => {
            const num = i + 1;
            const done = num < step;
            const active = num === step;
            return (
              <Fragment key={label}>
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done   ? 'bg-indigo-600 border-indigo-600 text-white'
                    : active ? 'bg-white border-indigo-600 text-indigo-600'
                    :          'bg-white border-slate-300 text-slate-400'
                  }`}>
                    {done ? '✓' : num}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${
                    active ? 'text-indigo-600' : done ? 'text-indigo-500' : 'text-slate-400'
                  }`}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 mx-1 transition-colors ${done ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Service Selection ──────────────────────────────────────────────────
function StepService({ booking, errors, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Choose a Service</h2>
      <p className="text-slate-500 text-sm mb-5">All professionals are verified, background-checked and trained.</p>
      {errors.service && <FieldError msg={errors.service} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {SERVICES.map((svc) => {
          const pal = PALETTE[svc.color];
          const selected = booking.service?.id === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => onSelect(svc)}
              aria-pressed={selected}
              className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                selected ? pal.sel : `border-slate-200 bg-white ${pal.hover} hover:shadow-sm`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${pal.icon}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={svc.svgPath} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="font-bold text-slate-900 text-sm">{svc.name}</p>
                    {selected && <CheckCircleIcon className="w-4 h-4 text-indigo-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{svc.desc}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pal.tag}`}>
                    from ₹{fmt(svc.basePrice)}/day
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: Patient Information ────────────────────────────────────────────────
function StepPatient({ booking, errors, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Patient Information</h2>
      <p className="text-slate-500 text-sm mb-6">Tell us about the person who will receive care.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="patientName" className="label-style">Full Name <span className="text-red-500">*</span></label>
          <input
            id="patientName" name="patientName" type="text" autoComplete="name"
            placeholder="Patient's full name"
            value={booking.patientName} onChange={onChange}
            className={`input-style ${errors.patientName ? 'border-red-400 bg-red-50/50' : ''}`}
          />
          <FieldError msg={errors.patientName} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="patientAge" className="label-style">Age <span className="text-red-500">*</span></label>
            <input
              id="patientAge" name="patientAge" type="number" min="1" max="120"
              placeholder="Age in years"
              value={booking.patientAge} onChange={onChange}
              className={`input-style ${errors.patientAge ? 'border-red-400 bg-red-50/50' : ''}`}
            />
            <FieldError msg={errors.patientAge} />
          </div>
          <div>
            <p className="label-style">Gender <span className="text-red-500">*</span></p>
            <div className="flex gap-4 mt-2.5">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio" name="gender" value={g}
                    checked={booking.gender === g} onChange={onChange}
                    className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700">{g}</span>
                </label>
              ))}
            </div>
            <FieldError msg={errors.gender} />
          </div>
        </div>

        <div>
          <label htmlFor="relationship" className="label-style">Relationship to Patient <span className="text-red-500">*</span></label>
          <select
            id="relationship" name="relationship"
            value={booking.relationship} onChange={onChange}
            className={`input-style ${errors.relationship ? 'border-red-400 bg-red-50/50' : ''}`}
          >
            <option value="">Select relationship</option>
            {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <FieldError msg={errors.relationship} />
        </div>

        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
          <p className="text-xs text-indigo-700 font-semibold mb-1">Why we ask this</p>
          <p className="text-xs text-indigo-600 leading-relaxed">
            Patient details help us match the right caregiver and brief them on specific requirements before arrival.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Service Details ────────────────────────────────────────────────────
function StepDetails({ booking, errors, onChange, onShift }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Service Details</h2>
      <p className="text-slate-500 text-sm mb-6">Choose how long you need care and during which part of the day.</p>
      <div className="space-y-6">
        <div>
          <label htmlFor="duration" className="label-style">Service Duration <span className="text-red-500">*</span></label>
          <select
            id="duration" name="duration"
            value={booking.duration} onChange={onChange}
            className={`input-style ${errors.duration ? 'border-red-400 bg-red-50/50' : ''}`}
          >
            <option value="">Select duration</option>
            {DURATIONS.map((d) => <option key={d.label} value={d.label}>{d.label}{d.days >= 30 ? ' (10% off)' : ''}</option>)}
          </select>
          <FieldError msg={errors.duration} />
          {booking.duration === 'Custom' && (
            <div className="mt-3">
              <label htmlFor="customDays" className="label-style">Number of Days <span className="text-red-500">*</span></label>
              <input
                id="customDays" name="customDays" type="number" min="1" max="365"
                placeholder="e.g. 45"
                value={booking.customDays} onChange={onChange}
                className={`input-style ${errors.customDays ? 'border-red-400 bg-red-50/50' : ''}`}
              />
              <FieldError msg={errors.customDays} />
            </div>
          )}
        </div>

        <div>
          <p className="label-style">Service Shift <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-1">
            {SHIFTS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onShift(s.label)}
                aria-pressed={booking.shift === s.label}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  booking.shift === s.label
                    ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                <p className="text-sm font-bold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.time}</p>
              </button>
            ))}
          </div>
          <FieldError msg={errors.shift} />
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Location ───────────────────────────────────────────────────────────
function StepLocation({ booking, errors, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Service Location</h2>
      <p className="text-slate-500 text-sm mb-6">Where should the caregiver come? We verify serviceability before confirming.</p>
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="label-style">Full Address <span className="text-red-500">*</span></label>
          <textarea
            id="address" name="address" rows={3}
            placeholder="House / flat no., street, landmark..."
            value={booking.address} onChange={onChange}
            className={`input-style resize-none ${errors.address ? 'border-red-400 bg-red-50/50' : ''}`}
          />
          <FieldError msg={errors.address} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="label-style">City <span className="text-red-500">*</span></label>
            <input
              id="city" name="city" type="text" placeholder="City"
              value={booking.city} onChange={onChange}
              className={`input-style ${errors.city ? 'border-red-400 bg-red-50/50' : ''}`}
            />
            <FieldError msg={errors.city} />
          </div>
          <div>
            <label htmlFor="pincode" className="label-style">Pincode <span className="text-red-500">*</span></label>
            <input
              id="pincode" name="pincode" type="text" inputMode="numeric" maxLength={6}
              placeholder="6-digit pincode"
              value={booking.pincode} onChange={onChange}
              className={`input-style ${errors.pincode ? 'border-red-400 bg-red-50/50' : ''}`}
            />
            <FieldError msg={errors.pincode} />
          </div>
        </div>

        <div>
          <label htmlFor="state" className="label-style">State <span className="text-red-500">*</span></label>
          <select
            id="state" name="state"
            value={booking.state} onChange={onChange}
            className={`input-style ${errors.state ? 'border-red-400 bg-red-50/50' : ''}`}
          >
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <FieldError msg={errors.state} />
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
          <MapPinIcon className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            We serve <strong>Mumbai, Pune, Delhi NCR, Bengaluru, Hyderabad, Chennai</strong> and 50+ cities across India.
            Our team will confirm availability for your pincode.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Step 5: Schedule & Extras ──────────────────────────────────────────────────
function StepSchedule({ booking, errors, onChange, onExtra }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Schedule & Preferences</h2>
      <p className="text-slate-500 text-sm mb-6">When should the caregiver arrive, and do you have any special requirements?</p>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="label-style">Start Date <span className="text-red-500">*</span></label>
            <input
              id="date" name="date" type="date" min={today}
              value={booking.date} onChange={onChange}
              className={`input-style ${errors.date ? 'border-red-400 bg-red-50/50' : ''}`}
            />
            <FieldError msg={errors.date} />
          </div>
          <div>
            <label htmlFor="timeSlot" className="label-style">Preferred Arrival Time <span className="text-red-500">*</span></label>
            <select
              id="timeSlot" name="timeSlot"
              value={booking.timeSlot} onChange={onChange}
              className={`input-style ${errors.timeSlot ? 'border-red-400 bg-red-50/50' : ''}`}
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <FieldError msg={errors.timeSlot} />
          </div>
        </div>

        <div>
          <p className="label-style">Additional Requirements <span className="text-xs font-normal text-slate-400">(optional)</span></p>
          <p className="text-xs text-slate-400 mb-3">Select all that apply — we brief your caregiver on these before arrival.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXTRAS.map((ex) => {
              const checked = booking.extras.includes(ex);
              return (
                <label
                  key={ex}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    checked ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="checkbox" checked={checked} onChange={() => onExtra(ex)}
                    className="h-4 w-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">{ex}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="label-style">Special Instructions <span className="text-xs font-normal text-slate-400">(optional)</span></label>
          <textarea
            id="notes" name="notes" rows={3}
            placeholder="Medical history, dietary restrictions, specific care instructions for the caregiver..."
            value={booking.notes} onChange={onChange}
            className="input-style resize-none"
          />
        </div>
      </div>
    </div>
  );
}

// ── Step 6: Review ─────────────────────────────────────────────────────────────
function ReviewItem({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="font-semibold text-slate-800 text-right">{value}</span>
    </div>
  );
}

function ReviewSection({ title, step, onEdit, children }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <button
          type="button" onClick={() => onEdit(step)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  );
}

function StepReview({ booking, price, onEdit }) {
  const svc = booking.service;
  const pal = svc ? PALETTE[svc.color] : null;
  const shiftEntry = booking.shift ? SHIFTS.find((s) => s.label === booking.shift) : null;
  const durationLabel = booking.duration === 'Custom' && booking.customDays
    ? `${booking.customDays} days (Custom)` : booking.duration;

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Review Your Booking</h2>
      <p className="text-slate-500 text-sm mb-6">Please confirm all details before we process your request.</p>
      <div className="space-y-3">

        <ReviewSection title="Service" step={1} onEdit={onEdit}>
          {svc && (
            <div className="flex items-center gap-3 py-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pal.icon}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={svc.svgPath} />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{svc.name}</p>
                <p className="text-xs text-slate-500">{svc.desc}</p>
              </div>
            </div>
          )}
        </ReviewSection>

        <ReviewSection title="Patient Details" step={2} onEdit={onEdit}>
          <ReviewItem label="Name"         value={booking.patientName} />
          <ReviewItem label="Age"          value={booking.patientAge ? `${booking.patientAge} years` : ''} />
          <ReviewItem label="Gender"       value={booking.gender} />
          <ReviewItem label="Relationship" value={booking.relationship} />
        </ReviewSection>

        <ReviewSection title="Service Details" step={3} onEdit={onEdit}>
          <ReviewItem label="Duration" value={durationLabel} />
          <ReviewItem label="Shift"    value={shiftEntry ? `${shiftEntry.label} (${shiftEntry.time})` : ''} />
        </ReviewSection>

        <ReviewSection title="Location" step={4} onEdit={onEdit}>
          <ReviewItem label="Address"  value={booking.address} />
          <ReviewItem label="City"     value={booking.city} />
          <ReviewItem label="State"    value={booking.state} />
          <ReviewItem label="Pincode"  value={booking.pincode} />
        </ReviewSection>

        <ReviewSection title="Schedule" step={5} onEdit={onEdit}>
          <ReviewItem label="Start Date" value={booking.date} />
          <ReviewItem label="Time"       value={booking.timeSlot} />
          {booking.extras.length > 0 && (
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-500 shrink-0">Add-ons</span>
              <span className="font-semibold text-slate-800 text-right text-xs">{booking.extras.join(', ')}</span>
            </div>
          )}
          {booking.notes && <ReviewItem label="Notes" value={booking.notes} />}
        </ReviewSection>

        {price && (
          <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-3">Estimated Cost</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>₹{fmt(svc.basePrice)}/day × {price.days} day{price.days > 1 ? 's' : ''}</span>
                <span>₹{fmt(price.subtotal)}</span>
              </div>
              {price.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Monthly discount (10%)</span>
                  <span>−₹{fmt(price.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 border-t border-indigo-200 pt-2">
                <span>Estimated Total</span>
                <span className="text-indigo-700">₹{fmt(price.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-slate-400 leading-relaxed text-center">
        By confirming, you agree to our{' '}
        <a href="#" className="text-indigo-500 hover:underline">Terms of Service</a>.
        Payment is collected at service completion — no advance payment required.
      </p>
    </div>
  );
}

// ── Main BookService ───────────────────────────────────────────────────────────
export default function BookService() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step,      setStep]      = useState(1);
  const [booking,   setBooking]   = useState(INITIAL);
  const [errors,    setErrors]    = useState({});
  const [confirmed,      setConfirmed]      = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState('');
  const [bookingId,      setBookingId]      = useState('');

  const TOTAL = STEP_LABELS.length;
  const price = computePrice(booking);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBooking((b) => ({ ...b, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleSelect = (svc) => {
    setBooking((b) => ({ ...b, service: svc }));
    setErrors((er) => ({ ...er, service: '' }));
  };

  const handleShift = (label) => {
    setBooking((b) => ({ ...b, shift: label }));
    setErrors((er) => ({ ...er, shift: '' }));
  };

  const handleExtra = (ex) => {
    setBooking((b) => ({
      ...b,
      extras: b.extras.includes(ex) ? b.extras.filter((x) => x !== ex) : [...b.extras, ex],
    }));
  };

  const handleNext = () => {
    const errs = validateStep(step, booking);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (targetStep) => {
    setErrors({});
    setStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/app/book' } });
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      const shiftObj = SHIFTS.find((s) => s.label === booking.shift);
      const durObj   = DURATIONS.find((d) => d.label === booking.duration);
      const days     = booking.duration === 'Custom' ? +booking.customDays : (durObj?.days ?? 0);

      let endDate;
      if (booking.date && days > 1) {
        const start = new Date(booking.date);
        start.setDate(start.getDate() + days - 1);
        endDate = start.toISOString().split('T')[0];
      }

      const address = [booking.address, booking.city, booking.state, booking.pincode]
        .filter(Boolean).join(', ');

      const noteParts = [];
      if (booking.extras.length) noteParts.push(`Add-ons: ${booking.extras.join(', ')}`);
      if (booking.notes.trim())  noteParts.push(booking.notes.trim());

      const payload = {
        service:      booking.service.name,
        patient:      booking.patientName,
        patientAge:   booking.patientAge ? +booking.patientAge : undefined,
        gender:       booking.gender.toUpperCase(),
        relationship: booking.relationship,
        startDate:    booking.date,
        endDate:      endDate || undefined,
        shift:        booking.shift,
        shiftTime:    shiftObj?.time || '',
        address,
        amount:       price?.total || 0,
        notes:        noteParts.join('\n') || undefined,
      };

      const res = await apiCreateBooking(payload);
      setBookingId(res.data.booking._id || res.data.booking.id);
      setConfirmed(true);
      setShowEmailToast(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-16">
        <EmailSentToast
          show={showEmailToast}
          message="Booking confirmation sent!"
          detail="Check your email for booking details and updates."
        />
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Received!</h1>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Your request for{' '}
            <strong className="text-slate-800">{booking.service?.name}</strong> has been submitted.
            A dedicated caregiver will be assigned and you will be notified shortly.
          </p>

          <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">Booking Reference</p>
            <p className="text-3xl font-black text-indigo-700 tracking-widest">{bookingId}</p>
            <p className="text-xs text-indigo-400 mt-1">Save this for future reference</p>
          </div>

          <div className="text-sm text-left bg-slate-50 rounded-xl p-4 mb-8 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Service</span>
              <span className="font-semibold text-slate-800">{booking.service?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient</span>
              <span className="font-semibold text-slate-800">{booking.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Start Date</span>
              <span className="font-semibold text-slate-800">{booking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shift</span>
              <span className="font-semibold text-slate-800">{booking.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="font-semibold text-slate-800">{booking.city}, {booking.state}</span>
            </div>
            {price && (
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-500">Estimated Total</span>
                <span className="font-bold text-indigo-700">₹{fmt(price.total)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              to="/app/bookings"
              className="block w-full text-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="block w-full text-center border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            Need help?{' '}
            <a href="tel:+919999999999" className="text-indigo-500 font-semibold hover:underline">+91 99999 99999</a>
            {' '}(24/7 Support)
          </p>
        </div>
      </div>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="section-container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Angels One Home">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <HeartIcon className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="font-bold text-[15px] leading-none text-indigo-700">Angels One</p>
              <p className="text-[9px] font-medium tracking-widest uppercase text-emerald-600">Healthcare Services</p>
            </div>
          </Link>

          <p className="text-sm font-bold text-slate-700">Book a Service</p>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="section-container py-8">
        <ProgressBar step={step} />

        <div className="flex gap-8 items-start">
          {/* Form panel */}
          <div className="flex-1 min-w-0">
            <div key={step} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in">
              {step === 1 && <StepService  booking={booking} errors={errors} onSelect={handleSelect} />}
              {step === 2 && <StepPatient  booking={booking} errors={errors} onChange={onChange} />}
              {step === 3 && <StepDetails  booking={booking} errors={errors} onChange={onChange} onShift={handleShift} />}
              {step === 4 && <StepLocation booking={booking} errors={errors} onChange={onChange} />}
              {step === 5 && <StepSchedule booking={booking} errors={errors} onChange={onChange} onExtra={handleExtra} />}
              {step === 6 && <StepReview   booking={booking} price={price} onEdit={handleEdit} />}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5 gap-3">
              <div className="flex items-center gap-3">
                {step > 1 ? (
                  <button
                    type="button" onClick={handlePrev}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Previous
                  </button>
                ) : <div />}
                <button
                  type="button" onClick={handleSave}
                  className={`text-xs font-semibold transition-colors ${saved ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {saved ? '✓ Saved!' : 'Save progress'}
                </button>
              </div>

              {step < TOTAL ? (
                <button
                  type="button" onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-sm font-bold text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg transition-all"
                >
                  {step === TOTAL - 1 ? 'Review Booking' : 'Next'}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitError && (
                    <p className="text-xs text-red-600 font-medium">{submitError}</p>
                  )}
                  <button
                    type="button" onClick={handleConfirm} disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-sm font-bold text-white shadow-md hover:bg-green-700 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4" />
                    )}
                    {submitting ? 'Submitting…' : 'Confirm Booking'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile summary */}
            <div className="lg:hidden mt-5">
              <details className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-slate-700 text-sm select-none">
                  <span className="flex items-center gap-2">
                    <CurrencyRupeeIcon className="w-4 h-4 text-indigo-500" />
                    Booking Summary
                    {price && <span className="text-indigo-600 font-bold">· ₹{fmt(price.total)}</span>}
                  </span>
                  <span className="text-slate-400 text-xs">tap to expand</span>
                </summary>
                <div className="border-t border-slate-100 px-5 py-4 space-y-2.5">
                  <SummaryRow label="Service"  value={booking.service?.name} />
                  <SummaryRow label="Duration" value={booking.duration} />
                  <SummaryRow label="Shift"    value={booking.shift} />
                  <SummaryRow label="City"     value={booking.city} />
                  {price && (
                    <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-slate-200 pt-2">
                      <span>Estimated Total</span>
                      <span className="text-indigo-600">₹{fmt(price.total)}</span>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>

          {/* Desktop summary sidebar */}
          <SummaryPanel booking={booking} price={price} />
        </div>
      </div>
    </div>
  );
}
