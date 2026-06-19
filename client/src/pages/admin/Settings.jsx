import { useState } from 'react';
import { MOCK_ADMIN } from '../../data/mockAdmin.js';
import { CheckCircleIcon } from '../../components/common/icons.jsx';

const TABS = [
  { key: 'platform', label: 'Platform Settings' },
  { key: 'email',    label: 'Email Settings' },
  { key: 'profile',  label: 'Profile Settings' },
];

const defaultPlatform = {
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

const defaultEmail = {
  smtpHost: 'smtp.titan.email',
  smtpPort: 587,
  smtpUsername: 'support@angelsone.com',
  smtpPassword: '',
  bookingConfirmation: true,
  caregiverAssignment: true,
  otpVerification: true,
  serviceCompletion: true,
  ticketAcknowledgement: true,
  testEmailTo: '',
};

const defaultProfile = {
  name: MOCK_ADMIN.name,
  email: MOCK_ADMIN.email,
  phone: MOCK_ADMIN.phone,
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function Toggle({ value, onChange, label, danger }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          value
            ? danger ? 'bg-red-500' : 'bg-blue-600'
            : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
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

function SaveButton({ onClick, label = 'Save Changes' }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
    >
      {label}
    </button>
  );
}

function SuccessBanner() {
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-xl">
      <CheckCircleIcon className="w-4 h-4 text-green-600" />
      Settings saved successfully!
    </div>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('platform');
  const [platformForm, setPlatformForm] = useState({ ...defaultPlatform });
  const [emailForm, setEmailForm] = useState({ ...defaultEmail });
  const [profileForm, setProfileForm] = useState({ ...defaultProfile });
  const [saved, setSaved] = useState(false);
  const [testSent, setTestSent] = useState(false);

  function setPF(key) { return v => setPlatformForm(prev => ({ ...prev, [key]: v })); }
  function setEF(key) { return v => setEmailForm(prev => ({ ...prev, [key]: v })); }
  function setPrF(key) { return v => setProfileForm(prev => ({ ...prev, [key]: v })); }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleTestEmail() {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2000);
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Configure platform preferences and your profile</p>
      </div>

      {saved && <SuccessBanner />}

      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
                <TextInput value={platformForm.otpExpiry} onChange={setPF('otpExpiry')} type="number" />
              </Field>
              <Field label="Max Bookings Per Leader">
                <TextInput value={platformForm.maxBookingsPerLeader} onChange={setPF('maxBookingsPerLeader')} type="number" />
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
            <Toggle label="Allow Google Sign-In" value={platformForm.googleSignIn} onChange={setPF('googleSignIn')} />
            <Toggle label="Email Notifications" value={platformForm.emailNotifications} onChange={setPF('emailNotifications')} />
            <Toggle label="SMS Notifications" value={platformForm.smsNotifications} onChange={setPF('smsNotifications')} />
            <Toggle label="Show Reviews on Website" value={platformForm.showReviews} onChange={setPF('showReviews')} />
            <Toggle label="Maintenance Mode" value={platformForm.maintenanceMode} onChange={setPF('maintenanceMode')} danger />
          </SectionCard>

          <SaveButton onClick={handleSave} label="Save Platform Settings" />
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-5">
          <SectionCard title="SMTP Configuration">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="SMTP Host">
                <TextInput value={emailForm.smtpHost} onChange={setEF('smtpHost')} />
              </Field>
              <Field label="SMTP Port">
                <TextInput value={emailForm.smtpPort} onChange={setEF('smtpPort')} type="number" />
              </Field>
              <Field label="SMTP Username">
                <TextInput value={emailForm.smtpUsername} onChange={setEF('smtpUsername')} />
              </Field>
              <Field label="SMTP Password">
                <TextInput value={emailForm.smtpPassword} onChange={setEF('smtpPassword')} type="password" placeholder="••••••••" />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Email Templates">
            <Toggle label="Booking Confirmation Email" value={emailForm.bookingConfirmation} onChange={setEF('bookingConfirmation')} />
            <Toggle label="Caregiver Assignment Notification" value={emailForm.caregiverAssignment} onChange={setEF('caregiverAssignment')} />
            <Toggle label="OTP Verification Email" value={emailForm.otpVerification} onChange={setEF('otpVerification')} />
            <Toggle label="Service Completion Email" value={emailForm.serviceCompletion} onChange={setEF('serviceCompletion')} />
            <Toggle label="Support Ticket Acknowledgement" value={emailForm.ticketAcknowledgement} onChange={setEF('ticketAcknowledgement')} />
          </SectionCard>

          <SectionCard title="Test Email">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Field label="Recipient Email">
                  <TextInput
                    value={emailForm.testEmailTo}
                    onChange={setEF('testEmailTo')}
                    type="email"
                    placeholder="test@example.com"
                  />
                </Field>
              </div>
              <button
                onClick={handleTestEmail}
                className="h-10 px-4 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors flex-shrink-0"
              >
                Send Test Email
              </button>
            </div>
            {testSent && (
              <p className="mt-2 text-sm font-medium text-green-700">✓ Test email sent!</p>
            )}
          </SectionCard>

          <SaveButton onClick={handleSave} label="Save Email Settings" />
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
                <TextInput value={profileForm.email} onChange={setPrF('email')} type="email" disabled />
              </Field>
              <Field label="Phone">
                <TextInput value={profileForm.phone} onChange={setPrF('phone')} />
              </Field>
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
          </SectionCard>

          <SaveButton onClick={handleSave} label="Save Changes" />
        </div>
      )}
    </div>
  );
}
