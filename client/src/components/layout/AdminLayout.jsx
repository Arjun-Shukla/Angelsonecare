import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import {
  HeartIcon,
  Squares2x2Icon,
  ClipboardListIcon,
  UserGroupIcon,
  TagIcon,
  StarIcon,
  CogIcon,
  MenuIcon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  HomeModernIcon,
} from '../common/icons.jsx';

const navItems = [
  { label: 'Dashboard',  to: '/admin',           end: true, Icon: Squares2x2Icon },
  { label: 'Bookings',   to: '/admin/bookings',             Icon: ClipboardListIcon },
  { label: 'Leaders',    to: '/admin/leaders',              Icon: UserGroupIcon },
  { label: 'Tickets',    to: '/admin/tickets',              Icon: TagIcon },
  { label: 'Reviews',    to: '/admin/reviews',              Icon: StarIcon },
  { label: 'Analytics',  to: '/admin/analytics',            Icon: ChartBarIcon },
];

const settingsItem = { label: 'Settings', to: '/admin/settings', Icon: CogIcon };

function SidebarContent({ onClose }) {
  const navigate    = useNavigate();
  const { setUser } = useAuth();

  function handleSignOut() {
    setUser(null);
    localStorage.removeItem('accessToken');
    navigate('/');
    if (onClose) onClose();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-slate-700/50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <HeartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">Angels One</span>
            <span className="block text-[9px] text-blue-400 tracking-widest uppercase mt-0.5">Admin Portal</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, to, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        <div className="border-t border-slate-700/50 mt-2 pt-2">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mb-0.5"
          >
            <HomeModernIcon className="w-5 h-5 flex-shrink-0" />
            Go to Homepage
          </Link>
          <NavLink
            to={settingsItem.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <settingsItem.Icon className="w-5 h-5 flex-shrink-0" />
            {settingsItem.label}
          </NavLink>
        </div>
      </nav>

      <div className="bg-slate-800 rounded-xl mx-3 p-3 mt-3 mb-3">
        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1.5">Platform Status</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
          <span className="text-xs text-slate-300">All Systems Operational</span>
        </div>
      </div>

      <div className="border-t border-slate-700/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              RA
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Rajesh Angels</p>
              <span className="inline-block bg-blue-600/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-medium">ADMIN</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors flex-shrink-0"
            title="Sign Out"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-slate-900 z-30">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 lg:hidden transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      <header className="lg:hidden fixed top-0 inset-x-0 z-30 bg-slate-900 flex items-center justify-between px-4 h-14">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-white hover:bg-slate-800"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-white">Angels One Admin</span>
        <button className="p-1.5 rounded-lg text-white hover:bg-slate-800">
          <BellIcon className="w-5 h-5" />
        </button>
      </header>

      <div className="lg:ml-64 flex-1 min-h-screen bg-slate-50">
        <main className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
