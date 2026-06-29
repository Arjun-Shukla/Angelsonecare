import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckIcon,
  ArrowPathIcon,
} from '../../components/common/icons.jsx';
import EmailSentToast from '../../components/common/EmailSentToast.jsx';
import { getBooking, generateOtp, verifyOtp as apiVerifyOtp } from '../../api/booking.api.js';

function OtpInput({ otp, setOtp, inputRefs, disabled }) {
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
    const next = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    if (inputRefs.current[focusIdx]) inputRefs.current[focusIdx].focus();
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
          disabled={disabled}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-800 bg-white disabled:bg-slate-50 disabled:text-slate-300"
        />
      ))}
    </div>
  );
}

export default function VerifyOTP() {
  const { id } = useParams();
  const [booking,        setBooking]        = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [otp,            setOtp]            = useState(['', '', '', '', '', '']);
  const [phase,          setPhase]          = useState('generate'); // 'generate' | 'verify'
  const [status,         setStatus]         = useState('idle');   // 'idle' | 'loading' | 'error' | 'success'
  const [showEmailToast, setShowEmailToast] = useState(false);
  const [genBusy,        setGenBusy]        = useState(false);
  const [genError,       setGenError]       = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    getBooking(id)
      .then(res => {
        const b = res.data.booking;
        setBooking(b);
        // If OTP was already generated, skip to verify phase
        if (b.status === 'COMPLETION_REQUESTED') setPhase('verify');
      })
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="animate-fade-in flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerateOtp = async () => {
    setGenBusy(true);
    setGenError('');
    try {
      await generateOtp(booking._id || id);
      setPhase('verify');
      setShowEmailToast(true);
      setTimeout(() => setShowEmailToast(false), 4000);
    } catch (err) {
      setGenError(err.response?.data?.message || 'Failed to generate OTP. Please try again.');
    } finally {
      setGenBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.join('').length < 6) return;
    setStatus('loading');
    try {
      await apiVerifyOtp(booking._id || id, otp.join(''));
      setStatus('success');
      setShowEmailToast(true);
    } catch (err) {
      setStatus('error');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 50);
    }
  };

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
            Booking #{(booking._id || id).slice(-8)} has been successfully verified and closed.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left mb-8 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Service</span>
              <span className="font-semibold text-slate-800">{booking.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Client</span>
              <span className="font-semibold text-slate-800">{booking.client?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient</span>
              <span className="font-semibold text-slate-800">{booking.patient}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/leader/bookings"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              View Assigned Bookings
            </Link>
            <Link
              to="/leader"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 text-slate-700 hover:border-indigo-400 font-semibold rounded-xl transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isComplete = otp.join('').length === 6;

  return (
    <div className="animate-fade-in max-w-lg mx-auto space-y-6">
      <EmailSentToast
        show={showEmailToast}
        message="OTP sent to client's email!"
        detail="Ask the client for the 6-digit code from their email."
      />

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to={`/leader/progress/${booking._id || id}`} className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeftIcon className="w-4 h-4" />
          Update Progress
        </Link>
      </div>

      {/* Booking summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 className="font-bold text-slate-800 mb-3">Booking Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span className="font-semibold text-slate-800">{booking.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client</span>
            <span className="font-semibold text-slate-800">{booking.client?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Patient</span>
            <span className="font-semibold text-slate-800">{booking.patient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Start Date</span>
            <span className="font-semibold text-slate-800">
              {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Phase 1: Generate OTP */}
      {phase === 'generate' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">Ready to Complete Service?</h1>
          <p className="text-sm text-slate-500 mb-6">
            Click below to send a 6-digit OTP to the client's email. Once they share it with you, enter it to mark the service complete.
          </p>
          {genError && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl">
              <ExclamationCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700">{genError}</p>
            </div>
          )}
          <button
            onClick={handleGenerateOtp}
            disabled={genBusy}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {genBusy ? (
              <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Sending OTP…</>
            ) : 'Send OTP to Client Email'}
          </button>
        </div>
      )}

      {/* Phase 2: Verify OTP */}
      {phase === 'verify' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2 text-center">Enter OTP from Client</h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Ask the client for the 6-digit code sent to their email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <OtpInput
              otp={otp}
              setOtp={val => { setStatus('idle'); setOtp(val); }}
              inputRefs={inputRefs}
              disabled={status === 'loading'}
            />

            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <ExclamationCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <p className="text-sm text-rose-700 font-medium">Invalid OTP. Please check with the client and try again.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isComplete || status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              {status === 'loading' ? (
                <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Verifying…</>
              ) : 'Verify & Complete Service'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center mb-2">Client didn't receive the OTP or it expired?</p>
            <button
              onClick={() => { setGenError(''); setOtp(['', '', '', '', '', '']); handleGenerateOtp(); }}
              disabled={genBusy}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-slate-600 hover:text-indigo-700 rounded-xl transition-colors"
            >
              {genBusy ? (
                <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Sending new OTP…</>
              ) : (
                <><ArrowPathIcon className="w-4 h-4" /> Resend OTP to Client</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
