import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HeartIcon } from '../../components/common/icons.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api`;

const ROLE_HOME = {
  CLIENT: '/app',
  LEADER: '/leader',
  ADMIN:  '/admin',
};

export default function OAuthCallback() {
  const [searchParams]   = useSearchParams();
  const navigate         = useNavigate();
  const { setUser }      = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token      = searchParams.get('token');
    const role       = searchParams.get('role');
    const oauthError = searchParams.get('error');

    if (oauthError || !token) {
      setErrorMsg('Google sign-in was cancelled or failed. Please try again.');
      return;
    }

    localStorage.setItem('accessToken', token);

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('profile fetch failed');
        return res.json();
      })
      .then(({ data }) => {
        setUser(data.user);
        navigate(ROLE_HOME[data.user.role] ?? '/', { replace: true });
      })
      .catch(() => {
        // /me unreachable — navigate with partial info so the user isn't stuck
        setUser({ role });
        navigate(ROLE_HOME[role] ?? '/', { replace: true });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign-in Failed</h2>
          <p className="text-sm text-slate-500 mb-6">{errorMsg}</p>
          <Link
            to="/login"
            className="block w-full text-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-10 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700">Completing sign-in…</p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Verifying your account and loading your dashboard.
        </p>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} Angels One Healthcare Services
      </p>
    </div>
  );
}
