import { Link } from 'react-router-dom';
import { HeartIcon } from '../../components/common/icons.jsx';

export default function OAuthCallback() {
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
          Please wait while we securely verify your account. You'll be redirected in a moment.
        </p>

        <p className="mt-6 text-xs text-slate-400">
          Taking too long?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Return to login
          </Link>
        </p>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} Angels One Healthcare Services
      </p>
    </div>
  );
}
