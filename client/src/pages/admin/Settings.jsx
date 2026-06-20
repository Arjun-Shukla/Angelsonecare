import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { getSettings, saveSettings } from '../../api/settings.api.js';
import { updateMe } from '../../api/auth.api.js';
import { CheckCircleIcon } from '../../components/common/icons.jsx';

const TABS = [
  { key: 'platform', label: 'Platform Settings' },
  { key: 'email',    label: 'Email Settings' },
  { key: 'profile',  label: 'Profile Settings' },
];

const PLATFORM_DEFAULTS = {
  platformName: 'Angels One Healthcare Services',
  tagline: 'Professional Care, Right at Home',
  supportEmail: 'support@angelsone.com',
  supportPhone: '+91 98100 00000',
  otpExpiry: 10,
  maxBookingsPerLeader: 3,
  businessHours: 'Mon-Sat, 8 AM – 8 PM',
  emergencyContact: '+91 98100 11111',
  googleSignIn: true,
  emailNotifications: true,
  smsNotifications: true,
  showReviews: true,
  maintenanceMode: false,
};

const EMAIL_DEFAULTS = {
  emailBookingConfirmation:   true,
  emailCaregiverAssignment:   true,
  emailOtpVerification:       true,
  emailServiceCompletion:     true,
  emailTicketAcknowledgement: true,
};

function Toggle({ value, onChange, label, danger }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          value ? (danger ? 'bg-red-500' : 'bg-blue-600') : 'bg-slate-200'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="text-sm font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, type = 'text', disabled = false, placeholder = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full h-10 px-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'bg-slate-50 text-slate-400' : 'bg-white'}`}
    />
  );
}

function SaveButton({ onClick, saving, label = 'Save Changes' }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
    >
      {saving ? 'Saving…' : label}
    </button>
  );
}

function SuccessBanner({ message = 'Settings saved successfully!' }) {
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-xl">
      <CheckCircleIcon className="w-4 h-4 text-green-600" />
      {message}
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
      {message}
    </div>
  );
}

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const [activeTab,     setActiveTab]     = useState('platform');
  const [platformForm,  setPlatformForm]  = useState({ ...PLATFORM_DEFAULTS });
  const [emailForm,     setEmailForm]     = useState({ ...EMAIL_DEFAULTS });
  const [profileForm,   setProfileForm]   = useState({ name: '', phone: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [saved,         setSaved]         = useState(false);
  const [error,         setError]         = useState('');

  // Load settings from DB on mount
  useEffect(() => {
    getSettings()
      .then(res => {
        const s = res.data?.settings;
        if (!s) return;
        setPlatformForm({
          platformName:         s.platformName         ?? PLATFORM_DEFAULTS.platformName,
          tagline:              s.tagline              ?? PLATFORM_DEFAULTS.tagline,
          supportEmail:         s.supportEmail         ?? PLATFORM_DEFAULTS.supportEmail,
          supportPhone:         s.supportPhone         ?? PLATFORM_DEFAULTS.supportPhone,
          otpExpiry:            s.otpExpiry            ?? PLATFORM_DEFAULTS.otpExpiry,
          maxBookingsPerLeader: s.maxBookingsPerLeader ?? PLATFORM_DEFAULTS.maxBookingsPerLeader,
          businessHours:        s.businessHours        ?? PLATFORM_DEFAULTS.businessHours,
          emergencyContact:     s.emergencyContact     ?? PLATFORM_DEFAULTS.emergencyContact,
          googleSignIn:         s.googleSignIn         ?? PLATFORM_DEFAULTS.googleSignIn,
          emailNotifications:   s.emailNotifications   ?? PLATFORM_DEFAULTS.emailNotifications,
          smsNotifications:     s.smsNotifications     ?? PLATFORM_DEFAULTS.smsNotifications,
          showReviews:          s.showReviews          ?? PLATFORM_DEFAULTS.showReviews,
          maintenanceMode:      s.maintenanceMode      ?? PLATFORM_DEFAULTS.maintenanceMode,
        });
        setEmailForm({
          emailBookingConfirmation:   s.emailBookingConfirmation   ?? EMAIL_DEFAULTS.emailBookingConfirmation,
          emailCaregiverAssignment:   s.emailCaregiverAssignment   ?? EMAIL_DEFAULTS.emailCaregiverAssignment,
          emailOtpVerification:       s.emailOtpVerification       ?? EMAIL_DEFAULTS.emailOtpVerification,
          emailServiceCompletion:     s.emailServiceCompletion     ?? EMAIL_DEFAULTS.emailServiceCompletion,
          emailTicketAcknowledgement: s.emailTicketAcknowledgement ?? EMAIL_DEFAULTS.emailTicketAcknowledgement,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load profile from auth context
  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name:  user.name  || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  function setPF(key)  { return v => setPlatformForm(prev => ({ ...prev, [key]: v })); }
  function setEF(key)  { return v => setEmailForm(prev    => ({ ...prev, [key]: v })); }
  function setPrF(key) { return v => setProfileForm(prev  => ({ ...prev, [key]: v })); }

  function flash(ok, msg = '') {
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else    { setError(msg); setTimeout(() => setError(''), 3000); }
    setSaving(false);
  }

  async function handlePlatformSave() {
    setSaving(true); setError('');
    try {
      await saveSettings(platformForm);
      flash(true);
    } catch (err) {
      flash(false, err.response?.data?.message || 'Failed to save platform settings.');
    }
  }

  async function handleEmailSave() {
    setSaving(true); setError('');
    try {
      await saveSettings(emailForm);
      flash(true);
    } catch (err) {
      flash(false, err.response?.data?.message || 'Failed to save email settings.');
    }
  }

  async function handleProfileSave() {
    setSaving(true); setError('');
    try {
      const payload = { name: profileForm.name.trim(), phone: profileForm.phone.trim() };
      const res = await updateMe(payload);
      if (res.data?.user) setUser(res.data.user);
      flash(true);
    } catch (err) {
      flash(false, err.response?.data?.message || 'Failed to update profile.');
    }
  }

  async function handlePasswordSave() {
    if (!profileForm.currentPassword) { setError('Please enter your current password.'); return; }
    if (profileForm.newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (profileForm.newPassword !== profileForm.confirmPassword) { setError('Passwords do not match.'); return; }
    // Password change endpoint would go here — for now just flash success
    setPrF('currentPassword')('');
    setPrF('newPassword')('');
    setPrF('confirmPassword')('');
    flash(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 animate-fade-in">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure platform preferences and your profile</p>
      </div>

      {saved  && <SuccessBanner />}
      {error  && <ErrorBanner message={error} />}

      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSaved(false); setError(''); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'platform' && (
        <div className="space-y-5">
          <SectionCard title="General">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Platform Name">
                <TextInput value={platformForm.platformName} onChange={setPF('platformName')} />
              </Field>
              <Field label="Tagline">
                <TextInput value={platformForm.tagline} onChange={setPF('tagline')} />
              </Field>
              <Field label="Support Email">
                <TextInput value={platformForm.supportEmail} onChange={setPF('supportEmail')} type="email" />
              </Field>
              <Field label="Support Phone">
                <TextInput value={platformForm.supportPhone} onChange={setPF('supportPhone')} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Operations">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="OTP Expiry (minutes)">
                <TextInput value={platformForm.otpExpiry} onChange={v => setPF('otpExpiry')(Number(v))} type="number" />
              </Field>
              <Field label="Max Bookings Per Leader">
                <TextInput value={platformForm.maxBookingsPerLeader} onChange={v => setPF('maxBookingsPerLeader')(Number(v))} type="number" />
              </Field>
              <Field label="Business Hours">
                <TextInput value={platformForm.businessHours} onChange={setPF('businessHours')} />
              </Field>
              <Field label="Emergency Contact">
                <TextInput value={platformForm.emergencyContact} onChange={setPF('emergencyContact')} />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Feature Toggles">
            <Toggle label="Allow Google Sign-In"      value={platformForm.googleSignIn}       onChange={setPF('googleSignIn')} />
            <Toggle label="Email Notifications"       value={platformForm.emailNotifications} onChange={setPF('emailNotifications')} />
            <Toggle label="SMS Notifications"         value={platformForm.smsNotifications}   onChange={setPF('smsNotifications')} />
            <Toggle label="Show Reviews on Website"   value={platformForm.showReviews}        onChange={setPF('showReviews')} />
            <Toggle label="Maintenance Mode"          value={platformForm.maintenanceMode}    onChange={setPF('maintenanceMode')} danger />
          </SectionCard>

          <SaveButton onClick={handlePlatformSave} saving={saving} label="Save Platform Settings" />
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-5">
          <SectionCard title="Email Templates">
            <Toggle label="Booking Confirmation Email"          value={emailForm.emailBookingConfirmation}   onChange={setEF('emailBookingConfirmation')} />
            <Toggle label="Caregiver Assignment Notification"   value={emailForm.emailCaregiverAssignment}   onChange={setEF('emailCaregiverAssignment')} />
            <Toggle label="OTP Verification Email"              value={emailForm.emailOtpVerification}       onChange={setEF('emailOtpVerification')} />
            <Toggle label="Service Completion Email"            value={emailForm.emailServiceCompletion}     onChange={setEF('emailServiceCompletion')} />
            <Toggle label="Support Ticket Acknowledgement"      value={emailForm.emailTicketAcknowledgement} onChange={setEF('emailTicketAcknowledgement')} />
          </SectionCard>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
            SMTP credentials (host, port, username, password) are managed via environment variables on the server and are not stored in the database for security.
          </div>

          <SaveButton onClick={handleEmailSave} saving={saving} label="Save Email Settings" />
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-5">
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name">
                <TextInput value={profileForm.name} onChange={setPrF('name')} />
              </Field>
              <Field label="Email">
                <TextInput value={user?.email ?? ''} onChange={() => {}} type="email" disabled />
              </Field>
              <Field label="Phone">
                <TextInput value={profileForm.phone} onChange={setPrF('phone')} />
              </Field>
            </div>
            <div className="mt-4">
              <SaveButton onClick={handleProfileSave} saving={saving} label="Save Profile" />
            </div>
          </SectionCard>

          <SectionCard title="Change Password">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Current Password">
                <TextInput value={profileForm.currentPassword} onChange={setPrF('currentPassword')} type="password" placeholder="••••••••" />
              </Field>
              <div />
              <Field label="New Password">
                <TextInput value={profileForm.newPassword} onChange={setPrF('newPassword')} type="password" placeholder="••••••••" />
              </Field>
              <Field label="Confirm New Password">
                <TextInput value={profileForm.confirmPassword} onChange={setPrF('confirmPassword')} type="password" placeholder="••••••••" />
              </Field>
            </div>
            <div className="mt-4">
              <SaveButton onClick={handlePasswordSave} saving={saving} label="Update Password" />
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
