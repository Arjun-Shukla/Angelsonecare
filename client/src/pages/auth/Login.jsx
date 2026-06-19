import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout       from '../../components/layout/AuthLayout.jsx';
import FormInput        from '../../components/common/FormInput.jsx';
import FormPassword     from '../../components/common/FormPassword.jsx';
import GoogleAuthButton from '../../components/common/GoogleAuthButton.jsx';
import { useForm }      from '../../hooks/useForm.js';
import { useAuth }      from '../../hooks/useAuth.js';

const DEMO_ACCOUNTS = [
  {
    email: 'arjunshukla489@gmail.com', password: 'Client@123',
    user: { _id: 'mock-001', name: 'Arjun Shukla', email: 'arjunshukla489@gmail.com', phone: '9876543210', role: 'CLIENT', avatar: null },
    redirect: '/app',
  },
  {
    email: 'priya.desai@angelsone.com', password: 'Leader@123',
    user: { _id: 'leader-001', name: 'Priya Desai', email: 'priya.desai@angelsone.com', phone: '+91 98765 12345', role: 'LEADER', avatar: null },
    redirect: '/leader',
  },
  {
    email: 'admin@angelsone.com', password: 'Admin@123',
    user: { _id: 'admin-001', name: 'Rajesh Angels', email: 'admin@angelsone.com', phone: '+91 98100 00001', role: 'ADMIN', avatar: null },
    redirect: '/admin',
  },
];

const validators = {
  email:    (v) => !v?.trim()                             ? 'Email address is required'
                 : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address'
                 : '',
  password: (v) => !v           ? 'Password is required'
                 : v.length < 6 ? 'Password must be at least 6 characters'
                 : '',
};

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
      <svg className="mt-0.5 w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

export default function Login() {
  const { values, errors, touched, onChange, onBlur, validate } = useForm(
    { email: '', password: '', remember: false },
    validators
  );
  const [loading,   setLoading]   = useState(false);
  const [authError, setAuthError] = useState('');
  const { setUser } = useAuth();
  const navigate    = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email === values.email.trim() && a.password === values.password
      );
      if (match) {
        setUser(match.user);
        navigate(match.redirect);
      } else {
        setLoading(false);
        setAuthError('Invalid email or password. Please check your credentials and try again.');
      }
    }, 1000);
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your Angels One account"
    >
      {/* Demo credential hint */}
      <div className="mb-5 rounded-xl bg-blue-50 border border-blue-200 p-4">
        <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Demo Accounts</p>
        <div className="space-y-1.5 text-xs text-slate-600 font-mono">
          <p><span className="text-slate-400">Client  →</span> arjunshukla489@gmail.com / <strong>Client@123</strong></p>
          <p><span className="text-slate-400">Leader  →</span> priya.desai@angelsone.com / <strong>Leader@123</strong></p>
          <p><span className="text-slate-400">Admin   →</span> admin@angelsone.com / <strong>Admin@123</strong></p>
        </div>
      </div>

      <ErrorBanner message={authError} />

      <form onSubmit={onSubmit} noValidate className="space-y-5">

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

        <div>
          <FormPassword
            label="Password"
            name="password"
            required
            placeholder="Enter your password"
            value={values.password}
            onChange={onChange}
            onBlur={onBlur}
            error={touched.password ? errors.password : ''}
            autoComplete="current-password"
          />

          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer select-none items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={values.remember}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
          )}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or continue with</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <GoogleAuthButton label="Continue with Google" />

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
          Sign up for free
        </Link>
      </p>
    </AuthLayout>
  );
}
