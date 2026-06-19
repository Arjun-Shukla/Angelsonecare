import { useState } from 'react';
import { MOCK_LEADERS } from '../../data/mockAdmin.js';
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
  name: '', email: '', phone: '', experience: '', location: '',
  specializations: [],
};

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function LeaderCard({ leader, index, onEdit, onToggle }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isActive = leader.status === 'ACTIVE';

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
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {leader.status}
          </span>
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" filled />
            <span className="text-xs font-bold text-slate-700">{leader.rating}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {leader.specializations.map(s => (
          <span key={s} className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <p className="text-sm font-black text-slate-900">{leader.completedBookings}</p>
          <p className="text-[10px] text-slate-500">Done</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-900">{leader.activeBookings}</p>
          <p className="text-[10px] text-slate-500">Active</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-900">{leader.onTimePercent}%</p>
          <p className="text-[10px] text-slate-500">On-Time</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-900">{leader.joinedDate}</p>
          <p className="text-[10px] text-slate-500">Joined</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
        <button
          onClick={() => onEdit(leader)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
        >
          <PencilSquareIcon className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onToggle(leader.id)}
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
  const [localLeaders, setLocalLeaders] = useState([...MOCK_LEADERS]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [addForm, setAddForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState('');

  const activeCount = localLeaders.filter(l => l.status === 'ACTIVE').length;
  const inactiveCount = localLeaders.filter(l => l.status === 'INACTIVE').length;
  const avgRating = (localLeaders.reduce((s, l) => s + l.rating, 0) / localLeaders.length).toFixed(1);

  const filtered = localLeaders.filter(l => {
    const q = search.toLowerCase();
    return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
  });

  function handleEdit(leader) {
    setEditId(leader.id);
    setAddForm({
      name: leader.name,
      email: leader.email,
      phone: leader.phone,
      experience: leader.experience,
      location: leader.location,
      specializations: [...leader.specializations],
    });
    setShowAddForm(true);
  }

  function handleToggle(id) {
    setLocalLeaders(prev => prev.map(l =>
      l.id === id ? { ...l, status: l.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : l
    ));
  }

  function handleSave() {
    if (!addForm.name.trim()) return;
    if (editId) {
      setLocalLeaders(prev => prev.map(l =>
        l.id === editId ? { ...l, ...addForm } : l
      ));
    } else {
      const newLeader = {
        id: `L00${localLeaders.length + 1}`,
        ...addForm,
        rating: 0,
        completedBookings: 0,
        activeBookings: 0,
        status: 'ACTIVE',
        joinedDate: 'Jun 2026',
        onTimePercent: 100,
      };
      setLocalLeaders(prev => [...prev, newLeader]);
    }
    setShowAddForm(false);
    setEditId(null);
    setAddForm({ ...emptyForm });
  }

  function toggleSpec(spec) {
    setAddForm(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leader Management</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">Total: {localLeaders.length}</span>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Active: {activeCount}</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Inactive: {inactiveCount}</span>
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Avg Rating: {avgRating}★</span>
          </div>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditId(null); setAddForm({ ...emptyForm }); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Leader
        </button>
      </div>

      {(showAddForm) && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">{editId ? 'Edit Leader' : 'Add New Leader'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Name', key: 'name', placeholder: 'Full name' },
              { label: 'Email', key: 'email', placeholder: 'Email address' },
              { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
              { label: 'Experience', key: 'experience', placeholder: 'e.g. 3 years' },
              { label: 'Location', key: 'location', placeholder: 'City' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={addForm[field.key]}
                  onChange={e => setAddForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Save Leader
            </button>
            <button
              onClick={() => { setShowAddForm(false); setEditId(null); setAddForm({ ...emptyForm }); }}
              className="px-5 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((leader, idx) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            index={idx}
            onEdit={handleEdit}
            onToggle={handleToggle}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-slate-400 text-sm py-8">No leaders found.</p>
        )}
      </div>
    </div>
  );
}
