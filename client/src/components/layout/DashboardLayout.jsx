import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  Squares2x2Icon,
  ClipboardListIcon,
  TagIcon,
  StarIcon,
  UserCircleIcon,
  MenuIcon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeModernIcon,
  HeartIcon,
} from '../common/icons.jsx';

const navItems = [
  { label: 'Dashboard', to: '/app', end: true, Icon: Squares2x2Icon },
  { label: 'My Bookings', to: '/app/bookings', Icon: ClipboardListIcon },
  { label: 'My Tickets', to: '/app/tickets', Icon: TagIcon },
  { label: 'Reviews', to: '/app/reviews', Icon: StarIcon },
  { label: 'Profile', to: '/app/profile', Icon: UserCircleIcon },
];

function SidebarContent({ user, onNavigate }) {
  const navigate    = useNavigate();
  const { setUser } = useAuth();
  const initial     = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/');
    if (onNavigate) onNavigate();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <HeartIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-black text-indigo-700 tracking-tight">Angels One</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">Healthcare</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, to, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
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

        <div className="pt-2 mt-1 border-t border-slate-100">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <HomeModernIcon className="w-5 h-5 flex-shrink-0" />
            Go to Homepage
          </Link>
        </div>

        <div className="pt-2">
          <button
            onClick={() => { navigate('/book'); if (onNavigate) onNavigate(); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-semibold py-2.5 px-4 rounded-full transition-all shadow-sm hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Book a Service
          </button>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
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

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 z-30">
        <SidebarContent user={user} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
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
        <SidebarContent user={user} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-slate-100 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-base font-black text-indigo-700">Angels One</span>
        <button className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100">
          <BellIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="lg:ml-64 flex-1 min-h-screen">
        <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
