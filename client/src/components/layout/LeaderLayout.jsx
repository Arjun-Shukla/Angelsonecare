import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { MOCK_LEADER } from '../../data/mockLeader.js';
import {
  HeartIcon,
  Squares2x2Icon,
  ClipboardListIcon,
  TagIcon,
  UserCircleIcon,
  MenuIcon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeModernIcon,
  EnvelopeIcon,
} from '../common/icons.jsx';

const navItems = [
  { label: 'Dashboard',         to: '/leader',          end: true,  Icon: Squares2x2Icon },
  { label: 'Assigned Bookings', to: '/leader/bookings',             Icon: ClipboardListIcon },
  { label: 'Tickets',           to: '/leader/tickets',              Icon: TagIcon },
  { label: 'Messages',          to: '/leader/messages',             Icon: EnvelopeIcon },
  { label: 'Profile',           to: '/leader/profile',              Icon: UserCircleIcon },
];

function SidebarContent({ onClose }) {
  const navigate        = useNavigate();
  const { setUser, user } = useAuth();

  const initials = (user?.name || '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/');
    if (onClose) onClose();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <HeartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-black text-slate-800 tracking-tight">Angels One Health</span>
            <span className="block text-xs text-emerald-600 font-semibold mt-0.5">Leader Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, to, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-2 border-t border-slate-100 pt-2">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <HomeModernIcon className="w-5 h-5 flex-shrink-0" />
          Go to Homepage
        </Link>
      </div>

      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Leader</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            {MOCK_LEADER.availability}
          </span>
        </div>

        <div className="flex items-center gap-3 px-1 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <span className="inline-block text-xs bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded">LEADER</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function LeaderLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-30">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-50 lg:hidden transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      <header className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-100 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
            <HeartIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-black text-slate-800">Angels One</span>
        </div>
        <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
          <BellIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="lg:ml-64 flex-1 min-h-screen">
        <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
