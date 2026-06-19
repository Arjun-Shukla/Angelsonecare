import { useState } from 'react';
import { MOCK_ALL_TICKETS } from '../../data/mockAdmin.js';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '../../components/common/icons.jsx';

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'];

const statusBadge = {
  OPEN:        'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-slate-100 text-slate-500',
};

const priorityBadge = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-orange-100 text-orange-700',
  LOW:    'bg-slate-100 text-slate-500',
};

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

function MessageBubble({ msg }) {
  if (msg.from === 'Client') {
    return (
      <div className="flex justify-end mb-2">
        <div className="max-w-xs sm:max-w-md bg-blue-50 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-blue-600 mb-0.5">Client · {msg.at}</p>
          <p className="text-xs text-slate-700">{msg.text}</p>
        </div>
      </div>
    );
  }
  if (msg.from === 'Leader') {
    return (
      <div className="flex justify-start mb-2">
        <div className="max-w-xs sm:max-w-md bg-teal-50 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-teal-600 mb-0.5">Leader · {msg.at}</p>
          <p className="text-xs text-slate-700">{msg.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center mb-2">
      <div className="max-w-xs sm:max-w-md bg-slate-50 rounded-xl px-3 py-2 text-center">
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">Support · {msg.at}</p>
        <p className="text-xs text-slate-600">{msg.text}</p>
      </div>
    </div>
  );
}

function AdminReplyBubble({ text }) {
  return (
    <div className="flex justify-center mb-2">
      <div className="max-w-xs sm:max-w-md bg-slate-100 rounded-xl px-3 py-2 text-center">
        <p className="text-[10px] font-bold text-slate-600 mb-0.5">Admin</p>
        <p className="text-xs text-slate-700">{text}</p>
      </div>
    </div>
  );
}

export default function AdminTickets() {
  const [localTickets] = useState([...MOCK_ALL_TICKETS]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [replies, setReplies] = useState({});
  const [adminReplies, setAdminReplies] = useState({});
  const [localStatuses, setLocalStatuses] = useState({});

  const counts = STATUS_FILTERS.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? localTickets.length : localTickets.filter(t => t.status === s).length;
    return acc;
  }, {});

  const filtered = localTickets.filter(t => {
    const effectiveStatus = localStatuses[t.id] || t.status;
    const matchStatus = filter === 'ALL' || effectiveStatus === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || t.id.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  function sendReply(id) {
    const text = (replies[id] || '').trim();
    if (!text) return;
    setAdminReplies(prev => ({ ...prev, [id]: [...(prev[id] || []), text] }));
    setReplies(prev => ({ ...prev, [id]: '' }));
  }

  function updateStatus(id, status) {
    setLocalStatuses(prev => ({ ...prev, [id]: status }));
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ticket Management</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Open: {counts.OPEN}</span>
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">In Progress: {counts.IN_PROGRESS}</span>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Resolved: {counts.RESOLVED}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(ticket => {
          const effectiveStatus = localStatuses[ticket.id] || ticket.status;
          const isExpanded = expandedId === ticket.id;
          const extraReplies = adminReplies[ticket.id] || [];

          return (
            <div key={ticket.id} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0">{ticket.id}</span>
                  <p className="text-sm font-semibold text-slate-800">{ticket.subject}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[effectiveStatus]}`}>
                    {effectiveStatus.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityBadge[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                    {ticket.assignedTo ? `Assigned: ${ticket.assignedTo}` : 'Unassigned'}
                  </span>
                </div>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-800 flex-shrink-0"
                >
                  {isExpanded ? (
                    <><ChevronUpIcon className="w-4 h-4" /> Collapse</>
                  ) : (
                    <><ChevronDownIcon className="w-4 h-4" /> View Details</>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                <span>{ticket.clientName}</span>
                <span>·</span>
                <span>{ticket.service}</span>
                <span>·</span>
                <span>{ticket.bookingId}</span>
                <span>·</span>
                <span>{ticket.createdAt}</span>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="mb-3">
                    {ticket.messages.map((msg, i) => (
                      <MessageBubble key={i} msg={msg} />
                    ))}
                    {extraReplies.map((text, i) => (
                      <AdminReplyBubble key={`admin-${i}`} text={text} />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-3 border-t border-slate-100">
                    <div className="flex flex-1 gap-2">
                      <textarea
                        rows={1}
                        placeholder="Reply as Admin..."
                        value={replies[ticket.id] || ''}
                        onChange={e => setReplies(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => sendReply(ticket.id)}
                        className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        Reply
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <select
                        value={effectiveStatus}
                        onChange={e => updateStatus(ticket.id, e.target.value)}
                        className="h-9 px-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {}}
                        className="px-3 py-2 bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8">No tickets found.</p>
        )}
      </div>
    </div>
  );
}
