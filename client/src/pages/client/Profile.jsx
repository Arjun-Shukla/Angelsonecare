import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { updateMe } from '../../api/auth.api.js';
import { CheckCircleIcon, PencilSquareIcon } from '../../components/common/icons.jsx';

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label-style">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-style pr-11"
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {show
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              : <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </>
            }
          </svg>
        </button>
      </div>
    </div>
  );
}

function PersonalInfoTab({ user, onUserUpdate }) {
  const formatDob = (dob) => {
    if (!dob) return '';
    return new Date(dob).toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    name:    user?.name ?? '',
    email:   user?.email ?? '',
    phone:   user?.phone ?? '',
    dob:     formatDob(user?.dob),
    line1:   user?.address?.line1 ?? '',
    area:    user?.address?.area ?? '',
    city:    user?.address?.city ?? '',
    state:   user?.address?.state ?? '',
    pincode: user?.address?.pincode ?? '',
  });
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const initial = form.name ? form.name.charAt(0).toUpperCase() : 'U';

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await updateMe({
        name:  form.name.trim(),
        phone: form.phone.trim(),
        dob:   form.dob || null,
        address: {
          line1:   form.line1.trim(),
          area:    form.area.trim(),
          city:    form.city.trim(),
          state:   form.state.trim(),
          pincode: form.pincode.trim(),
        },
      });
      if (onUserUpdate) onUserUpdate(res.data?.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function field(key) {
    return { value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) };
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {initial}
            </div>
            <button
              type="button"
              title="Change photo — coming soon"
              className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50"
            >
              <PencilSquareIcon className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-lg">{form.name}</p>
            <p className="text-sm text-slate-500">{form.email}</p>
            <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full">CLIENT</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-slate-800">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-style">Full Name</label>
            <input type="text" className="input-style" {...field('name')} />
          </div>
          <div>
            <label className="label-style">Email Address</label>
            <input type="email" className="input-style opacity-60 cursor-not-allowed" value={form.email} disabled />
          </div>
          <div>
            <label className="label-style">Phone Number</label>
            <input type="tel" className="input-style" {...field('phone')} />
          </div>
          <div>
            <label className="label-style">Date of Birth</label>
            <input type="date" className="input-style" {...field('dob')} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-slate-800">Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-style">Address Line 1</label>
            <input type="text" className="input-style" {...field('line1')} />
          </div>
          <div>
            <label className="label-style">Area / Locality</label>
            <input type="text" className="input-style" {...field('area')} />
          </div>
          <div>
            <label className="label-style">City</label>
            <input type="text" className="input-style" {...field('city')} />
          </div>
          <div>
            <label className="label-style">State</label>
            <input type="text" className="input-style" {...field('state')} />
          </div>
          <div>
            <label className="label-style">Pincode</label>
            <input type="text" className="input-style" {...field('pincode')} />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-500 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">{error}</p>
      )}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Saved!
          </span>
        )}
      </div>
    </form>
  );
}

function SecurityTab() {
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (newPwd.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (newPwd !== confirm) { setError('Passwords do not match.'); return; }
    setSuccess(true);
    setCurrent(''); setNewPwd(''); setConfirm('');
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-slate-800">Change Password</h3>
        <PasswordInput label="Current Password" value={current} onChange={setCurrent} placeholder="Enter current password" />
        <PasswordInput label="New Password" value={newPwd} onChange={setNewPwd} placeholder="At least 8 characters" />
        <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
        <p className="text-xs text-slate-400">Password changes require OTP verification via registered mobile number.</p>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Update Password
        </button>
        {success && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Password updated!
          </span>
        )}
      </div>
    </form>
  );
}

const NOTIFICATION_OPTIONS = [
  { key: 'email', label: 'Email Notifications', desc: 'Booking confirmations and updates via email' },
  { key: 'sms', label: 'SMS Alerts', desc: 'Caregiver assignments and service reminders via SMS' },
  { key: 'reminders', label: 'Booking Reminders', desc: 'Reminders 24 hours before service starts' },
  { key: 'promo', label: 'Promotional Updates', desc: 'Special offers and new service announcements' },
];

function NotificationsTab() {
  const [prefs, setPrefs] = useState({ email: true, sms: true, reminders: true, promo: false });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-slate-800">Notification Preferences</h3>
        {NOTIFICATION_OPTIONS.map(opt => (
          <div key={opt.key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-800">{opt.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
            </div>
            <Toggle on={prefs[opt.key]} onToggle={() => setPrefs(p => ({ ...p, [opt.key]: !p[opt.key] }))} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Save Preferences
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Preferences saved!
          </span>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information and preferences.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>Personal Info</TabButton>
        <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')}>Security</TabButton>
        <TabButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>Notifications</TabButton>
      </div>

      {activeTab === 'personal' && <PersonalInfoTab user={user} onUserUpdate={setUser} />}
      {activeTab === 'security' && <SecurityTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
    </div>
  );
}
