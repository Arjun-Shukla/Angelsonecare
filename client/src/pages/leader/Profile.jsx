import { useState } from 'react';
import { MOCK_LEADER } from '../../data/mockLeader.js';
import { StarIcon, CheckIcon } from '../../components/common/icons.jsx';

const ALL_SPECIALIZATIONS = [
  'Elder Care',
  'Home Nursing',
  'Patient Caretaker',
  'Physiotherapy',
  'Post-Surgery Care',
  'Medical Assistance',
];

const initials = MOCK_LEADER.name
  .split(' ')
  .map(w => w[0])
  .join('')
  .toUpperCase();

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
        active
          ? 'bg-teal-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white'
      }`}
    >
      {label}
    </button>
  );
}

export default function LeaderProfile() {
  const [activeTab, setActiveTab] = useState('info');
  const [saved, setSaved] = useState(false);
  const [availability, setAvailability] = useState(MOCK_LEADER.availability);

  const [form, setForm] = useState({
    name: MOCK_LEADER.name,
    email: MOCK_LEADER.email,
    phone: MOCK_LEADER.phone,
    experience: MOCK_LEADER.experience,
    location: MOCK_LEADER.location,
    specializations: [...MOCK_LEADER.specializations],
    bio: MOCK_LEADER.bio,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    newBooking: true,
    ticketUpdate: true,
    serviceReminder: true,
    systemAlerts: false,
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

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handlePasswordUpdate(e) {
    e.preventDefault();
    setPasswords({ current: '', next: '', confirm: '' });
  }

  function toggleNotification(key) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-800">{form.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">LEADER</span>
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-700">{MOCK_LEADER.rating}</span>
              </div>
              <span className="text-sm text-slate-500">{MOCK_LEADER.totalCompleted} completed services</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <TabButton label="Professional Info" active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
        <TabButton label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
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
                value={form.experience}
                onChange={e => handleFormChange('experience', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-style">Location</label>
              <input
                type="text"
                className="input-style"
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
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
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
            <label className="label-style">Bio</label>
            <textarea
              rows={4}
              className="input-style resize-none"
              value={form.bio}
              onChange={e => handleFormChange('bio', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
            >
              Save Changes
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
              { key: 'newBooking',       label: 'New Booking Assigned',     desc: 'Get notified when a new booking is assigned to you' },
              { key: 'ticketUpdate',     label: 'Ticket Updates',           desc: 'Receive alerts for replies on your tickets' },
              { key: 'serviceReminder',  label: 'Service Reminders',        desc: 'Daily reminders for upcoming tasks' },
              { key: 'systemAlerts',     label: 'System Alerts',            desc: 'Platform maintenance and important notices' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                    notifications[item.key] ? 'bg-teal-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-bold text-slate-800 text-lg">Availability</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Current status</p>
                <p className="text-xs text-slate-400 mt-0.5">Toggle your availability for new assignments</p>
              </div>
              <button
                onClick={() => setAvailability(prev => prev === 'Available' ? 'Unavailable' : 'Available')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  availability === 'Available'
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${availability === 'Available' ? 'bg-green-500' : 'bg-rose-500'}`} />
                {availability}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-4">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="label-style">Current Password</label>
                <input
                  type="password"
                  className="input-style"
                  value={passwords.current}
                  onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="label-style">New Password</label>
                <input
                  type="password"
                  className="input-style"
                  value={passwords.next}
                  onChange={e => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="label-style">Confirm New Password</label>
                <input
                  type="password"
                  className="input-style"
                  value={passwords.confirm}
                  onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
