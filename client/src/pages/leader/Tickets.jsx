import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { listTickets, addMessage, updateStatus } from '../../api/ticket.api.js';
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

const STATUS_STYLES = {
  OPEN:        'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  SOLVED:      'bg-green-100 text-green-700',
  UNSOLVED:    'bg-rose-100 text-rose-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-slate-100 text-slate-500',
};

const CLOSED_STATUSES = ['SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'];

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-500';
  return <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>{status.replace('_', ' ')}</span>;
}

function MessageBubble({ msg, currentUserId }) {
  const senderId = msg.sender?._id || msg.sender;
  const isMe     = senderId?.toString() === currentUserId?.toString();
  const senderRole = msg.sender?.role;
  const senderName = msg.sender?.name || 'Support';

  const formatAt = (at) => {
    if (!at) return '';
    return new Date(at).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (senderRole === 'CLIENT') {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs sm:max-w-sm">
          <p className="text-xs text-right text-slate-400 font-medium mb-1">Client · {formatAt(msg.at)}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl rounded-tr-sm px-4 py-3">
            <p className="text-sm text-slate-800">{msg.text}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isMe) {
    return (
      <div className="flex justify-start">
        <div className="max-w-xs sm:max-w-sm">
          <p className="text-xs text-slate-400 font-medium mb-1">You · {formatAt(msg.at)}</p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl rounded-tl-sm px-4 py-3">
            <p className="text-sm text-slate-800">{msg.text}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-xs sm:max-w-sm text-center">
        <p className="text-xs text-slate-400 font-medium mb-1">{senderName} · {formatAt(msg.at)}</p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
          <p className="text-sm text-slate-600">{msg.text}</p>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ ticket, currentUserId, onUpdate }) {
  const [expanded,   setExpanded]   = useState(false);
  const [messages,   setMessages]   = useState(ticket.messages || []);
  const [reply,      setReply]      = useState('');
  const [sending,    setSending]    = useState(false);
  const [actionBusy, setActionBusy] = useState(null); // 'SOLVED' | 'UNSOLVED' | null
  const [status,     setStatus]     = useState(ticket.status);

  // Sync when parent updates ticket via socket
  useEffect(() => { setStatus(ticket.status); }, [ticket.status]);
  useEffect(() => { setMessages(ticket.messages || []); }, [ticket.messages]);

  const isClosed = CLOSED_STATUSES.includes(status);

  async function handleSend() {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const res = await addMessage(ticket._id, reply.trim());
      const updated = res.data?.ticket;
      if (updated) {
        setMessages(updated.messages || []);
        onUpdate && onUpdate(updated);
      }
      setReply('');
    } catch {
      // keep reply text in textarea
    } finally {
      setSending(false);
    }
  }

  async function handleAction(newStatus) {
    if (actionBusy) return;
    setActionBusy(newStatus);
    try {
      const res = await updateStatus(ticket._id, newStatus);
      const updated = res.data?.ticket;
      setStatus(newStatus);
      onUpdate && onUpdate({ ...ticket, status: newStatus, ...updated });
    } catch {
      // silent
    } finally {
      setActionBusy(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold font-mono">
              {ticket.ticketId || ticket._id?.slice(-8).toUpperCase()}
            </span>
            <h3 className="font-semibold text-slate-800 text-sm">{ticket.subject}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={status} />
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${PRIORITY_STYLES[ticket.priority] || 'bg-slate-100 text-slate-600'}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>{ticket.category}</span>
          {ticket.booking && <span>Booking: {ticket.booking.service || '—'}</span>}
          <span>Client: {ticket.user?.name || '—'}</span>
          <span>{ticket.user?.email || '—'}</span>
          <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
        >
          {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          {expanded ? 'Collapse' : 'View Conversation'}
          {messages.length > 0 && (
            <span className="text-xs text-slate-400">({messages.length})</span>
          )}
        </button>

        {/* SOLVED / UNSOLVED action buttons — only for open tickets */}
        {!isClosed && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction('SOLVED')}
              disabled={!!actionBusy}
              className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              <CheckBadgeIcon className="w-4 h-4" />
              {actionBusy === 'SOLVED' ? 'Marking…' : 'Mark SOLVED'}
            </button>
            <button
              onClick={() => handleAction('UNSOLVED')}
              disabled={!!actionBusy}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 px-3 py-1.5 rounded-xl transition-colors"
            >
              {actionBusy === 'UNSOLVED' ? 'Marking…' : 'Mark UNSOLVED'}
            </button>
          </div>
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
          <div className="space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">No messages yet.</p>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} currentUserId={currentUserId} />
            ))}
          </div>

          {!isClosed ? (
            <div className="pt-2 space-y-2">
              <textarea
                rows={3}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply to the client..."
                className="input-style resize-none w-full"
              />
              <button
                onClick={handleSend}
                disabled={!reply.trim() || sending}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {sending ? 'Sending…' : 'Send Reply'}
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center pt-2">This ticket has been closed.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeaderTickets() {
  const { user }   = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('all');
  const [tickets,   setTickets]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    listTickets()
      .then(res => setTickets(res.data?.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Real-time: receive new tickets without page refresh
  useEffect(() => {
    if (!socket) return;

    const handleNew = (ticket) => {
      setTickets(prev => {
        if (prev.some(t => t._id === ticket._id)) return prev;
        return [ticket, ...prev];
      });
    };

    const handleStatusUpdate = ({ ticketId, status, resolvedBy, statusUpdatedAt }) => {
      setTickets(prev => prev.map(t =>
        t._id === ticketId ? { ...t, status, resolvedBy, statusUpdatedAt } : t
      ));
    };

    socket.on('ticket:created',        handleNew);
    socket.on('ticket:status_updated', handleStatusUpdate);

    return () => {
      socket.off('ticket:created',        handleNew);
      socket.off('ticket:status_updated', handleStatusUpdate);
    };
  }, [socket]);

  const handleUpdate = (updated) => {
    setTickets(prev => {
      const idx = prev.findIndex(t => t._id === updated._id);
      if (idx === -1) return prev;
      const next = [...prev]; next[idx] = { ...next[idx], ...updated }; return next;
    });
  };

  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  const visible = activeTab === 'open'
    ? tickets.filter(t => !['SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'].includes(t.status))
    : tickets;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
        <p className="text-sm text-slate-500 mt-1">View and respond to client support tickets</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TagIcon className="w-4 h-4" />
          All Tickets
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {tickets.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'open'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Needs Action
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'open' ? 'bg-indigo-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
            {openCount}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <TagIcon className="w-12 h-12 mx-auto mb-3 text-slate-200" />
          <p className="font-medium text-slate-500">
            {activeTab === 'open' ? 'No open tickets' : 'No tickets yet'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'open' ? 'All tickets have been resolved.' : 'Tickets raised by clients will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              currentUserId={user?._id}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
