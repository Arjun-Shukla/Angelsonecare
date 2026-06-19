import { useState } from 'react';
import { MOCK_LEADER_TICKETS } from '../../data/mockLeader.js';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TagIcon,
  CheckBadgeIcon,
} from '../../components/common/icons.jsx';

const PRIORITY_STYLES = {
  HIGH:   'bg-rose-100 text-rose-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW:    'bg-slate-100 text-slate-600',
};

function StatusBadge({ status }) {
  const style = status === 'OPEN'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-green-100 text-green-700';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>{status}</span>;
}

function MessageBubble({ msg }) {
  if (msg.from === 'Client') {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs sm:max-w-sm">
          <p className="text-xs text-right text-slate-400 font-medium mb-1">Client · {msg.at}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-slate-800">{msg.text}</p>
          </div>
        </div>
      </div>
    );
  }
  if (msg.from === 'Leader') {
    return (
      <div className="flex justify-start">
        <div className="max-w-xs sm:max-w-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">You · {msg.at}</p>
          <div className="bg-teal-50 border border-teal-200 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-sm text-slate-800">{msg.text}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center">
      <div className="max-w-xs sm:max-w-sm text-center">
        <p className="text-xs text-slate-400 font-medium mb-1">Support · {msg.at}</p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
          <p className="text-sm text-slate-600">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, expanded, onToggle, reply, onReplyChange, onSend, sentMsgs, localStatus, onResolve }) {
  const effectiveStatus = localStatus ?? ticket.status;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold font-mono">
              {ticket.id}
            </span>
            <h3 className="font-semibold text-slate-800 text-sm">{ticket.subject}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={effectiveStatus} />
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${PRIORITY_STYLES[ticket.priority] || 'bg-slate-100 text-slate-600'}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>{ticket.category}</span>
          <span>Booking #{ticket.bookingId}</span>
          <span>Client: {ticket.clientName}</span>
          <span>{ticket.createdAt}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
        >
          {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          {expanded ? 'Collapse' : 'View Conversation'}
        </button>
        {effectiveStatus === 'OPEN' && (
          <button
            onClick={onResolve}
            className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <CheckBadgeIcon className="w-4 h-4" />
            Mark as Resolved
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
          <div className="space-y-3">
            {ticket.messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {(sentMsgs || []).map((msg, i) => (
              <MessageBubble key={`sent-${i}`} msg={{ from: 'Leader', text: msg.text, at: msg.at }} />
            ))}
          </div>

          {effectiveStatus === 'OPEN' ? (
            <div className="pt-2 space-y-2">
              <textarea
                rows={3}
                value={reply}
                onChange={e => onReplyChange(e.target.value)}
                placeholder="Type your reply..."
                className="input-style resize-none w-full"
              />
              <button
                onClick={onSend}
                disabled={!reply.trim()}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Send Reply
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center pt-2">This ticket has been resolved.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeaderTickets() {
  const [activeTab, setActiveTab] = useState('list');
  const [expandedId, setExpandedId] = useState(null);
  const [replies, setReplies] = useState({});
  const [sentReplies, setSentReplies] = useState({});
  const [localStatuses, setLocalStatuses] = useState({});

  const visibleTickets = activeTab === 'open'
    ? MOCK_LEADER_TICKETS.filter(t => (localStatuses[t.id] ?? t.status) === 'OPEN')
    : MOCK_LEADER_TICKETS;

  function handleToggle(id) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function handleReplyChange(id, val) {
    setReplies(prev => ({ ...prev, [id]: val }));
  }

  function handleSend(id) {
    const text = (replies[id] || '').trim();
    if (!text) return;
    const now = new Date();
    const at = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' — ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setSentReplies(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { text, at }],
    }));
    setReplies(prev => ({ ...prev, [id]: '' }));
  }

  function handleResolve(id) {
    setLocalStatuses(prev => ({ ...prev, [id]: 'RESOLVED' }));
  }

  const openCount = MOCK_LEADER_TICKETS.filter(t => (localStatuses[t.id] ?? t.status) === 'OPEN').length;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
        <p className="text-sm text-slate-500 mt-1">View and respond to client tickets assigned to you</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TagIcon className="w-4 h-4" />
          All Tickets
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'list' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {MOCK_LEADER_TICKETS.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'open'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Open Tickets
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'open' ? 'bg-teal-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
            {openCount}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {visibleTickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <TagIcon className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No open tickets</p>
            <p className="text-xs text-slate-400 mt-1">All tickets have been resolved.</p>
          </div>
        ) : (
          visibleTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              expanded={expandedId === ticket.id}
              onToggle={() => handleToggle(ticket.id)}
              reply={replies[ticket.id] || ''}
              onReplyChange={val => handleReplyChange(ticket.id, val)}
              onSend={() => handleSend(ticket.id)}
              sentMsgs={sentReplies[ticket.id]}
              localStatus={localStatuses[ticket.id]}
              onResolve={() => handleResolve(ticket.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
