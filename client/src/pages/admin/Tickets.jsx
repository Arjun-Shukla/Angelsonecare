import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { listTickets, addMessage, updateStatus } from '../../api/ticket.api.js';
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '../../components/common/icons.jsx';

const STATUS_FILTERS = ['ALL', 'OPEN', 'IN_PROGRESS', 'SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'];

const statusBadge = {
  OPEN:        'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  SOLVED:      'bg-green-100 text-green-700',
  UNSOLVED:    'bg-rose-100 text-rose-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-slate-100 text-slate-500',
};

const priorityBadge = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-orange-100 text-orange-700',
  LOW:    'bg-slate-100 text-slate-500',
};

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'];

const CLOSED_STATUSES = ['SOLVED', 'UNSOLVED', 'RESOLVED', 'CLOSED'];

function formatAt(at) {
  if (!at) return '';
  return new Date(at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }) {
  const role = msg.sender?.role;
  const name = msg.sender?.name || 'Support';

  if (role === 'CLIENT') {
    return (
      <div className="flex justify-end mb-2">
        <div className="max-w-xs sm:max-w-md bg-indigo-50 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-indigo-600 mb-0.5">Client · {formatAt(msg.at)}</p>
          <p className="text-xs text-slate-700">{msg.text}</p>
        </div>
      </div>
    );
  }
  if (role === 'LEADER') {
    return (
      <div className="flex justify-start mb-2">
        <div className="max-w-xs sm:max-w-md bg-emerald-50 rounded-xl px-3 py-2">
          <p className="text-[10px] font-bold text-emerald-600 mb-0.5">Leader · {formatAt(msg.at)}</p>
          <p className="text-xs text-slate-700">{msg.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center mb-2">
      <div className="max-w-xs sm:max-w-md bg-slate-50 rounded-xl px-3 py-2 text-center">
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">{name} · {formatAt(msg.at)}</p>
        <p className="text-xs text-slate-600">{msg.text}</p>
      </div>
    </div>
  );
}

function TicketRow({ ticket, onUpdate }) {
  const [expanded,  setExpanded]  = useState(false);
  const [messages,  setMessages]  = useState(ticket.messages || []);
  const [status,    setStatus]    = useState(ticket.status);
  const [replyText, setReplyText] = useState('');
  const [sending,   setSending]   = useState(false);
  const [updating,  setUpdating]  = useState(false);
  const [updateErr, setUpdateErr] = useState('');

  // Sync when parent updates ticket via socket
  useEffect(() => { setStatus(ticket.status); }, [ticket.status]);
  useEffect(() => { setMessages(ticket.messages || []); }, [ticket.messages]);

  const isClosed = CLOSED_STATUSES.includes(status);

  async function handleReply() {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      const res = await addMessage(ticket._id, replyText.trim());
      const updated = res.data?.ticket;
      if (updated) {
        setMessages(updated.messages || []);
        onUpdate && onUpdate(updated);
      }
      setReplyText('');
    } catch {
      // keep text
    } finally {
      setSending(false);
    }
  }

  async function handleStatusUpdate() {
    setUpdating(true);
    setUpdateErr('');
    try {
      const res = await updateStatus(ticket._id, status);
      const updated = res.data?.ticket;
      onUpdate && onUpdate({ ...ticket, status, ...updated });
    } catch (err) {
      setStatus(ticket.status);
      setUpdateErr(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div className="flex items-start gap-3 flex-wrap">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0">
            {ticket.ticketId || ticket._id?.slice(-8).toUpperCase()}
          </span>
          <p className="text-sm font-semibold text-slate-800">{ticket.subject}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[status] || 'bg-slate-100 text-slate-500'}`}>
            {status.replace('_', ' ')}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityBadge[ticket.priority] || 'bg-slate-100 text-slate-500'}`}>
            {ticket.priority}
          </span>
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex-shrink-0"
        >
          {expanded
            ? <><ChevronUpIcon className="w-4 h-4" /> Collapse</>
            : <><ChevronDownIcon className="w-4 h-4" /> View Details</>
          }
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
        <span>{ticket.user?.name || '—'}</span>
        <span>·</span>
        <span>{ticket.user?.email || '—'}</span>
        <span>·</span>
        <span>{ticket.category}</span>
        {ticket.booking && <><span>·</span><span>{ticket.booking.service}</span></>}
        <span>·</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="mb-3 max-h-72 overflow-y-auto">
            {messages.length === 0
              ? <p className="text-xs text-slate-400 text-center py-2">No messages.</p>
              : messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
            }
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-3 border-t border-slate-100">
            {!isClosed && (
              <div className="flex flex-1 gap-2">
                <textarea
                  rows={1}
                  placeholder="Reply as Admin..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || sending}
                  className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex-shrink-0"
                >
                  {sending ? '…' : 'Reply'}
                </button>
              </div>
            )}
            <div className="flex flex-col gap-1">
              {updateErr && <p className="text-xs text-red-600">{updateErr}</p>}
              <div className="flex gap-2 items-center">
                <select
                  value={status}
                  onChange={e => { setStatus(e.target.value); setUpdateErr(''); }}
                  className="h-9 px-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || status === ticket.status}
                  className="px-3 py-2 bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                >
                  {updating ? '…' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTickets() {
  const { socket }  = useSocket();
  const [tickets,   setTickets]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('ALL');
  const [search,    setSearch]    = useState('');

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

  const counts = {
    ALL:         tickets.length,
    OPEN:        tickets.filter(t => t.status === 'OPEN').length,
    IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    SOLVED:      tickets.filter(t => t.status === 'SOLVED').length,
    UNSOLVED:    tickets.filter(t => t.status === 'UNSOLVED').length,
    RESOLVED:    tickets.filter(t => t.status === 'RESOLVED').length,
    CLOSED:      tickets.filter(t => t.status === 'CLOSED').length,
  };

  const filtered = tickets.filter(t => {
    const matchStatus = filter === 'ALL' || t.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || (t.ticketId || '').toLowerCase().includes(q)
      || (t.user?.name || '').toLowerCase().includes(q)
      || (t.user?.email || '').toLowerCase().includes(q)
      || t.subject.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ticket Management</h1>
        {!loading && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">Open: {counts.OPEN}</span>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">In Progress: {counts.IN_PROGRESS}</span>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Solved: {counts.SOLVED}</span>
            <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">Unsolved: {counts.UNSOLVED}</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">Closed: {counts.CLOSED + counts.RESOLVED}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 h-10 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['ALL', 'OPEN', 'IN_PROGRESS', 'SOLVED', 'UNSOLVED'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ticket => (
            <TicketRow key={ticket._id} ticket={ticket} onUpdate={handleUpdate} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">
              {search ? 'No tickets match your search.' : 'No tickets found.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
