import { useState } from 'react';
import { Link }    from 'react-router-dom';
import AuthLayout       from '../../components/layout/AuthLayout.jsx';
import FormInput        from '../../components/common/FormInput.jsx';
import FormPassword     from '../../components/common/FormPassword.jsx';
import GoogleAuthButton from '../../components/common/GoogleAuthButton.jsx';
import { useForm }      from '../../hooks/useForm.js';

const validators = {
  name: (v) =>
    !v?.trim()          ? 'Full name is required'
    : v.trim().length < 2 ? 'Name must be at least 2 characters'
    : '',

  email: (v) =>
    !v?.trim()                              ? 'Email address is required'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address'
    : '',

  phone: (v) =>
    !v?.trim() ? 'Phone number is required'
    : !/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) ? 'Enter a valid 10-digit Indian mobile number'
    : '',

  password: (v) =>
    !v                ? 'Password is required'
    : v.length < 8    ? 'Password must be at least 8 characters'
    : !/[A-Z0-9]/.test(v) ? 'Include at least one number or uppercase letter'
    : '',

  confirm: (v, all) =>
    !v                  ? 'Please confirm your password'
    : v !== all.password  ? 'Passwords do not match'
    : '',

  terms: (v) => !v ? 'You must accept the terms to continue' : '',
};

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
      <svg className="mt-0.5 w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

export default function Signup() {
  const { values, errors, touched, onChange, onBlur, validate } = useForm(
    { name: '', email: '', phone: '', password: '', confirm: '', terms: false },
    validators
  );
  const [loading,   setLoading]   = useState(false);
  const [authError, setAuthError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;
    setLoading(true);
    // Placeholder — backend registration not yet implemented
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <AuthLayout
      heading="Create your account"
      subheading="Join Angels One and access professional home healthcare"
    >
      <ErrorBanner message={authError} />

      {/* Google first — social sign-up is less friction */}
      <GoogleAuthButton label="Sign up with Google" />

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or register with email</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-4">

        <FormInput
          label="Full name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          value={values.name}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.name ? errors.name : ''}
          autoComplete="name"
        />

        <FormInput
          label="Email address"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={values.email}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.email ? errors.email : ''}
          autoComplete="email"
        />

        <FormInput
          label="Phone number"
          name="phone"
          type="tel"
          required
          placeholder="10-digit mobile number"
          value={values.phone}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.phone ? errors.phone : ''}
          hint="Used for OTP verification when services are completed"
          autoComplete="tel"
        />

        <FormPassword
          label="Password"
          name="password"
          required
          placeholder="Min. 8 characters"
          value={values.password}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.password ? errors.password : ''}
          hint={!touched.password || !errors.password ? 'At least 8 characters with a number or uppercase letter' : undefined}
          autoComplete="new-password"
        />

        <FormPassword
          label="Confirm password"
          name="confirm"
          required
          placeholder="Re-enter your password"
          value={values.confirm}
          onChange={onChange}
          onBlur={onBlur}
          error={touched.confirm ? errors.confirm : ''}
          autoComplete="new-password"
        />

        {/* Terms */}
        <div>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={onChange}
              onBlur={onBlur}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              I agree to the{' '}
              <a href="#" className="font-semibold text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="font-semibold text-blue-600 hover:underline">Privacy Policy</a>
            </span>
          </label>
          {touched.terms && errors.terms && (
            <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.terms}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
          )}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
