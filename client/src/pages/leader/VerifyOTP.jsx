import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_LEADER_BOOKINGS } from '../../data/mockLeader.js';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckIcon,
  ArrowPathIcon,
} from '../../components/common/icons.jsx';
import EmailSentToast from '../../components/common/EmailSentToast.jsx';

function OtpInput({ otp, setOtp, inputRefs }) {
  function handleChange(e, index) {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const char = val[val.length - 1];
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0 && inputRefs.current[index - 1]) {
        const next = [...otp];
        next[index - 1] = '';
        setOtp(next);
        inputRefs.current[index - 1].focus();
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    if (inputRefs.current[focusIdx]) {
      inputRefs.current[focusIdx].focus();
    }
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {otp.map((char, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-800 bg-white"
        />
      ))}
    </div>
  );
}

export default function VerifyOTP() {
  const { id } = useParams();
  const booking = MOCK_LEADER_BOOKINGS.find(b => b.id === id);

  const [otp,            setOtp]            = useState(['', '', '', '', '', '']);
  const [status,         setStatus]         = useState('idle');
  const [showEmailToast, setShowEmailToast] = useState(false);
  const inputRefs = useRef([]);

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

  if (status === 'success') {
    return (
      <div className="animate-fade-in max-w-lg mx-auto mt-8">
        <EmailSentToast
          show={showEmailToast}
          message="Service completion emails sent!"
          detail="Client, leader, and admin have all been notified."
        />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-12 h-12 text-green-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Service Completed!</h1>
          <p className="text-slate-500 mb-6">
            Booking #{id} has been successfully verified and closed.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left mb-8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Service</span>
              <span className="font-semibold text-slate-800">{booking.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Client</span>
              <span className="font-semibold text-slate-800">{booking.client.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duration</span>
              <span className="font-semibold text-slate-800">{booking.startDate} → {booking.endDate}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/leader/bookings"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
            >
              View Assigned Bookings
            </Link>
            <Link
              to="/leader"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 text-slate-700 hover:border-teal-400 font-semibold rounded-xl transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    setStatus('loading');
    setTimeout(() => {
      if (otp.join('') === '123456') {
        setStatus('success');
        setShowEmailToast(true);
      } else {
        setStatus('error');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }, 50);
      }
    }, 1500);
  }

  const isComplete = otp.join('').length === 6;

  return (
    <div className="animate-fade-in max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to={`/leader/progress/${id}`} className="flex items-center gap-1 hover:text-teal-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Go Back
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="font-bold text-slate-800 mb-3">Booking Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span className="font-semibold text-slate-800">{booking.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client</span>
            <span className="font-semibold text-slate-800">{booking.client.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Patient</span>
            <span className="font-semibold text-slate-800">{booking.patient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Duration</span>
            <span className="font-semibold text-slate-800">{booking.startDate} → {booking.endDate}</span>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-teal-800">
          For demo purposes, the OTP is: <span className="font-bold tracking-widest">123456</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h1 className="text-xl font-bold text-slate-800 mb-2 text-center">Verify & Complete Service</h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Ask the client for the 6-digit OTP sent to their registered mobile number.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <OtpInput otp={otp} setOtp={val => { setStatus('idle'); setOtp(val); }} inputRefs={inputRefs} />

          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <ExclamationCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700 font-medium">Invalid OTP. Please check with the client and try again.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isComplete || status === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {status === 'loading' ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify & Complete Service'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
