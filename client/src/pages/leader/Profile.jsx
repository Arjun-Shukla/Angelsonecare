import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { updateMe } from '../../api/auth.api.js';
import { CheckIcon } from '../../components/common/icons.jsx';

const ALL_SPECIALIZATIONS = [
  'Elder Care', 'Home Nursing', 'Patient Caretaker',
  'Physiotherapy', 'Post-Surgery Care', 'Medical Assistance',
];

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white'
      }`}
    >
      {label}
    </button>
  );
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${on ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function LeaderProfile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState('');

  const initials = (user?.name || 'L')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const [form, setForm] = useState({
    name:            user?.name            ?? '',
    email:           user?.email           ?? '',
    phone:           user?.phone           ?? '',
    experience:      user?.experience      ?? '',
    location:        user?.location        ?? '',
    specializations: user?.specializations ?? [],
    bio:             user?.bio             ?? '',
  });

  const [notifications, setNotifications] = useState({
    newBooking:      true,
    ticketUpdate:    true,
    serviceReminder: true,
    systemAlerts:    false,
  });

  function handleFormChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleSpecialization(spec) {
    setForm(prev => {
      const has = prev.specializations.includes(spec);
      return {
        ...prev,
        specializations: has
          ? prev.specializations.filter(s => s !== spec)
          : [...prev.specializations, spec],
      };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await updateMe({
        name:            form.name.trim(),
        phone:           form.phone.trim(),
        experience:      form.experience.trim(),
        location:        form.location.trim(),
        bio:             form.bio.trim(),
        specializations: form.specializations,
      });
      const updatedUser = res.data?.user;
      if (updatedUser) setUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-800">{user?.name || '—'}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">LEADER</span>
              {user?.location && (
                <span className="text-sm text-slate-500">{user.location}</span>
              )}
              {user?.experience && (
                <span className="text-sm text-slate-500">· {user.experience}</span>
              )}
            </div>
            {user?.email && (
              <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <TabButton label="Professional Info" active={activeTab === 'info'}     onClick={() => setActiveTab('info')} />
        <TabButton label="Settings"          active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </div>

      {activeTab === 'info' && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="font-bold text-slate-800 text-lg">Professional Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-style">Full Name</label>
              <input
                type="text"
                className="input-style"
                value={form.name}
                onChange={e => handleFormChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="label-style">Email</label>
              <input
                type="email"
                className="input-style bg-slate-50 text-slate-400 cursor-not-allowed"
                value={form.email}
                disabled
              />
            </div>
            <div>
              <label className="label-style">Phone</label>
              <input
                type="tel"
                className="input-style"
                value={form.phone}
                onChange={e => handleFormChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="label-style">Experience</label>
              <input
                type="text"
                className="input-style"
                placeholder="e.g., 3 years"
                value={form.experience}
                onChange={e => handleFormChange('experience', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Location / Area</label>
              <input
                type="text"
                className="input-style"
                placeholder="e.g., Bandra, Mumbai"
                value={form.location}
                onChange={e => handleFormChange('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label-style">Specializations</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_SPECIALIZATIONS.map(spec => {
                const selected = form.specializations.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialization(spec)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                      selected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {selected && <CheckIcon className="w-3 h-3 inline mr-1" strokeWidth={3} />}
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label-style">Bio <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              rows={4}
              className="input-style resize-none"
              placeholder="Write a short professional bio..."
              value={form.bio}
              onChange={e => handleFormChange('bio', e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saved && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium animate-fade-in">
                <CheckIcon className="w-4 h-4" strokeWidth={3} />
                Saved!
              </div>
            )}
          </div>
        </form>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-slate-800 text-lg">Notifications</h2>
            {[
              { key: 'newBooking',      label: 'New Booking Assigned',  desc: 'Get notified when a new booking is assigned to you' },
              { key: 'ticketUpdate',    label: 'Ticket Updates',        desc: 'Receive alerts for replies on tickets' },
              { key: 'serviceReminder', label: 'Service Reminders',     desc: 'Daily reminders for upcoming tasks' },
              { key: 'systemAlerts',    label: 'System Alerts',         desc: 'Platform maintenance and important notices' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle
                  on={notifications[item.key]}
                  onToggle={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                />
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-slate-800 text-lg">Change Password</h2>
            <PasswordChangeForm />
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordChangeForm() {
  const [current, setCurrent] = useState('');
  const [next,    setNext]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!current) { setError('Please enter your current password.'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setSuccess(true);
    setCurrent(''); setNext(''); setConfirm('');
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { label: 'Current Password', value: current, onChange: setCurrent, placeholder: 'Enter current password' },
        { label: 'New Password',     value: next,    onChange: setNext,    placeholder: 'At least 8 characters' },
        { label: 'Confirm',          value: confirm, onChange: setConfirm, placeholder: 'Repeat new password' },
      ].map(f => (
        <div key={f.label}>
          <label className="label-style">{f.label}</label>
          <input type="password" className="input-style" value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder} />
        </div>
      ))}
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {success && <p className="text-xs text-green-600 font-medium">Password updated successfully!</p>}
      <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors">
        Update Password
      </button>
    </form>
  );
}
