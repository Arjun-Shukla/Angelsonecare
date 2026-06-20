import { useState, useEffect } from 'react';
import { getAllLeaders, createLeader, updateUser, deactivateUser } from '../../api/user.api.js';
import {
  PlusIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  StarIcon,
} from '../../components/common/icons.jsx';

const AVATAR_COLORS = ['bg-blue-600', 'bg-teal-600', 'bg-violet-600', 'bg-orange-500'];

const ALL_SPECIALIZATIONS = [
  'Elder Care', 'Home Nursing', 'Physiotherapy', 'Patient Caretaker',
  'Post-Surgery Care', 'Medical Assistance',
];

const emptyForm = {
  name: '', email: '', phone: '', password: '', experience: '', location: '',
  specializations: [],
};

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function LeaderCard({ leader, index, onEdit, onToggle }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isActive    = leader.isActive !== false;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {initials(leader.name)}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{leader.name}</p>
            <p className="text-xs text-slate-500">{leader.email}</p>
            {leader.location && <p className="text-xs text-slate-400">{leader.location}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      {leader.specializations?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {leader.specializations.map(s => (
            <span key={s} className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-slate-500">
        {leader.experience && (
          <div>
            <p className="font-semibold text-slate-700">{leader.experience}</p>
            <p>Experience</p>
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-700">
            {new Date(leader.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
          <p>Joined</p>
        </div>
      </div>

      {leader.bio && (
        <p className="text-xs text-slate-400 italic mb-3 line-clamp-2">{leader.bio}</p>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
        <button
          onClick={() => onEdit(leader)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
        >
          <PencilSquareIcon className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onToggle(leader._id, isActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            isActive
              ? 'border border-red-200 text-red-600 hover:bg-red-50'
              : 'border border-green-200 text-green-600 hover:bg-green-50'
          }`}
        >
          {isActive
            ? <><NoSymbolIcon className="w-3.5 h-3.5" /> Deactivate</>
            : <><CheckIcon className="w-3.5 h-3.5" /> Activate</>
          }
        </button>
      </div>
    </div>
  );
}

export default function Leaders() {
  const [leaders,     setLeaders]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId,      setEditId]      = useState(null);
  const [addForm,     setAddForm]     = useState({ ...emptyForm });
  const [search,      setSearch]      = useState('');
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState('');
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    getAllLeaders()
      .then(res => setLeaders(res.data?.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCount   = leaders.filter(l => l.isActive !== false).length;
  const inactiveCount = leaders.filter(l => l.isActive === false).length;

  const filtered = leaders.filter(l => {
    const q = search.toLowerCase();
    return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
  });

  function handleEdit(leader) {
    setEditId(leader._id);
    setAddForm({
      name:            leader.name          ?? '',
      email:           leader.email         ?? '',
      phone:           leader.phone         ?? '',
      password:        '',
      experience:      leader.experience    ?? '',
      location:        leader.location      ?? '',
      specializations: leader.specializations ?? [],
    });
    setFormError('');
    setCredentials(null);
    setShowAddForm(true);
  }

  async function handleToggle(id, currentlyActive) {
    try {
      if (currentlyActive) {
        await deactivateUser(id);
        setLeaders(prev => prev.map(l => l._id === id ? { ...l, isActive: false } : l));
      } else {
        const res = await updateUser(id, { isActive: true });
        setLeaders(prev => prev.map(l => l._id === id ? { ...l, ...res.data?.user } : l));
      }
    } catch {
      // silent
    }
  }

  async function handleSave() {
    setFormError('');
    if (!addForm.name.trim()) { setFormError('Name is required.'); return; }
    if (!editId && !addForm.email.trim()) { setFormError('Email is required.'); return; }
    if (!editId && !addForm.password.trim()) { setFormError('Password is required.'); return; }

    setSaving(true);
    try {
      if (editId) {
        const payload = {
          name:            addForm.name.trim(),
          phone:           addForm.phone.trim(),
          experience:      addForm.experience.trim(),
          location:        addForm.location.trim(),
          specializations: addForm.specializations,
        };
        const res = await updateUser(editId, payload);
        setLeaders(prev => prev.map(l => l._id === editId ? { ...l, ...res.data?.user } : l));
      } else {
        const payload = {
          name:            addForm.name.trim(),
          email:           addForm.email.trim(),
          phone:           addForm.phone.trim(),
          password:        addForm.password.trim(),
          experience:      addForm.experience.trim(),
          location:        addForm.location.trim(),
          specializations: addForm.specializations,
        };
        const res = await createLeader(payload);
        const newLeader = res.data?.user;
        if (newLeader) {
          setLeaders(prev => [{ ...newLeader, isActive: true, createdAt: new Date().toISOString() }, ...prev]);
          setCredentials({ email: addForm.email.trim(), password: addForm.password.trim() });
        }
      }
      if (!editId) {
        // Keep form open to show credentials
        setEditId(null);
        setAddForm({ ...emptyForm });
      } else {
        setShowAddForm(false);
        setEditId(null);
        setAddForm({ ...emptyForm });
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function toggleSpec(spec) {
    setAddForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  }

  function closeForm() {
    setShowAddForm(false);
    setEditId(null);
    setAddForm({ ...emptyForm });
    setFormError('');
    setCredentials(null);
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leader Management</h1>
          {!loading && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Total: {leaders.length}</span>
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Active: {activeCount}</span>
              <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Inactive: {inactiveCount}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditId(null); setAddForm({ ...emptyForm }); setFormError(''); setCredentials(null); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Leader
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">{editId ? 'Edit Leader' : 'Add New Leader'}</h2>

          {credentials ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-green-800 mb-2">✓ Leader account created successfully!</p>
              <p className="text-xs text-green-700">Share these login credentials with the leader:</p>
              <div className="mt-2 space-y-1 font-mono text-sm">
                <p><span className="text-slate-500">Email:</span> {credentials.email}</p>
                <p><span className="text-slate-500">Password:</span> {credentials.password}</p>
              </div>
              <button onClick={closeForm} className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Name *',       key: 'name',       placeholder: 'Full name' },
                  { label: 'Email *',      key: 'email',      placeholder: 'Email address', disabled: !!editId },
                  { label: 'Phone',        key: 'phone',      placeholder: '+91 XXXXX XXXXX' },
                  ...(!editId ? [{ label: 'Password *', key: 'password', placeholder: 'Set a password', type: 'password' }] : []),
                  { label: 'Experience',   key: 'experience', placeholder: 'e.g. 3 years' },
                  { label: 'Location',     key: 'location',   placeholder: 'City / Area' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      value={addForm[field.key]}
                      onChange={e => setAddForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      className={`w-full h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${field.disabled ? 'bg-slate-50 text-slate-400' : ''}`}
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SPECIALIZATIONS.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpec(spec)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        addForm.specializations.includes(spec)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-3">{formError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                  {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create Leader'}
                </button>
                <button
                  onClick={closeForm}
                  className="px-5 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search leaders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((leader, idx) => (
            <LeaderCard
              key={leader._id}
              leader={leader}
              index={idx}
              onEdit={handleEdit}
              onToggle={handleToggle}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-slate-400 text-sm py-8">
              {search ? 'No leaders match your search.' : 'No leaders registered yet.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
