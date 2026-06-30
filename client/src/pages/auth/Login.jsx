import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout       from '../../components/layout/AuthLayout.jsx';
import FormInput        from '../../components/common/FormInput.jsx';
import FormPassword     from '../../components/common/FormPassword.jsx';
import GoogleAuthButton from '../../components/common/GoogleAuthButton.jsx';
import { useForm }      from '../../hooks/useForm.js';
import { useAuth }      from '../../hooks/useAuth.js';

const ROLE_REDIRECT = {
  CLIENT: '/app',
  LEADER: '/leader',
  ADMIN:  '/admin',
};

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
  const { login } = useAuth();
  const navigate  = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(values.email.trim(), values.password);
      navigate(ROLE_REDIRECT[user.role] ?? '/app');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your Angels One Health account"
    >
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
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
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
        <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
          Sign up for free
        </Link>
      </p>
    </AuthLayout>
  );
}
