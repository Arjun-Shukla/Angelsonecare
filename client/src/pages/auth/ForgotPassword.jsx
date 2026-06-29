import { useState } from 'react';
import { Link }    from 'react-router-dom';
import AuthLayout   from '../../components/layout/AuthLayout.jsx';
import FormInput    from '../../components/common/FormInput.jsx';
import { useForm }  from '../../hooks/useForm.js';
import { CheckCircleIcon, ArrowLeftIcon } from '../../components/common/icons.jsx';

const validators = {
  email: (v) =>
    !v?.trim()                              ? 'Email address is required'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address'
    : '',
};

export default function ForgotPassword() {
  const { values, errors, touched, onChange, onBlur, validate, reset } = useForm(
    { email: '' },
    validators
  );
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Placeholder — password reset email not yet implemented
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  const tryAgain = () => {
    setSent(false);
    reset();
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Check your inbox
          </h1>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            We've sent a password reset link to{' '}
            <span className="font-semibold text-slate-700">{values.email}</span>.
            It may take a minute to arrive — check your spam folder too.
          </p>

          <div className="mt-9 w-full space-y-3">
            <Link
              to="/login"
              className="block w-full text-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg"
            >
              Back to Sign In
            </Link>
            <button
              type="button"
              onClick={tryAgain}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Try a different email address
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Reset your password"
      subheading="Enter your account email and we'll send a secure reset link"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormInput
          label="Email address"
          name="email"
          type="email"
          required
          placeholder="Enter your account email"
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.email ? errors.email : ''}
          autoComplete="email"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
          )}
          {loading ? 'Sending link…' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
