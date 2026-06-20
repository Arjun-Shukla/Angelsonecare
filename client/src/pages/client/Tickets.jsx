import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { listTickets, createTicket, addMessage } from '../../api/ticket.api.js';
import { listBookings } from '../../api/booking.api.js';
import { ChevronDownIcon, ChevronUpIcon, TagIcon, CheckCircleIcon } from '../../components/common/icons.jsx';

const TICKET_STATUS_STYLES = {
  OPEN:        'bg-amber-100 text-amber-700',
  SOLVED:      'bg-green-100 text-green-700',
  UNSOLVED:    'bg-rose-100 text-rose-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  RESOLVED:    'bg-green-100 text-green-700',
  CLOSED:      'bg-slate-100 text-slate-500',
};

const PRIORITY_STYLES = {
  HIGH:   'bg-rose-100 text-rose-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW:    'bg-slate-100 text-slate-600',
};

const CATEGORIES = [
  'Service Issue', 'Billing Query', 'Information Update',
  'Caregiver Feedback', 'General Inquiry', 'Emergency',
];

const CLOSED_STATUSES = ['RESOLVED', 'CLOSED', 'SOLVED', 'UNSOLVED'];

function StatusBadge({ status }) {
  const style = TICKET_STATUS_STYLES[status] || 'bg-slate-100 text-slate-500';
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function TicketCard({ ticket, currentUserId }) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState(ticket.messages || []);
  const [status,   setStatus]   = useState(ticket.status);
  const [reply,    setReply]    = useState('');
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);

  // Sync when parent updates ticket via socket
  useEffect(() => { setStatus(ticket.status); }, [ticket.status]);
  useEffect(() => { setMessages(ticket.messages || []); }, [ticket.messages]);

  async function handleSend() {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const res = await addMessage(ticket._id, reply.trim());
      setMessages(res.data?.ticket?.messages || messages);
      setReply('');
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      // silent — keep reply in textarea
    } finally {
      setSending(false);
    }
  }

  const isMyMsg = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    return senderId?.toString() === currentUserId?.toString();
  };

  const formatAt = (at) => {
    if (!at) return '';
    return new Date(at).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const isClosed = CLOSED_STATUSES.includes(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {ticket.ticketId || ticket._id?.slice(-8).toUpperCase()}
              </span>
              <StatusBadge status={status} />
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 text-base leading-snug">{ticket.subject}</h3>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-500">
              <span>{ticket.category}</span>
              {ticket.booking && (
                <><span>·</span><span>Booking: {ticket.booking.service || ticket.booking}</span></>
              )}
              <span>·</span>
              <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Who resolved the ticket + when — shown in real time after socket update */}
            {isClosed && ticket.resolvedBy && (
              <p className="text-xs text-slate-400 mt-1.5">
                Marked <span className="font-semibold">{status}</span> by{' '}
                <span className="font-semibold">{ticket.resolvedBy?.name || 'Support Team'}</span>
                {ticket.statusUpdatedAt && <> · {formatAt(ticket.statusUpdatedAt)}</>}
              </p>
            )}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors flex-shrink-0 mt-1"
          >
            {expanded ? 'Hide' : 'View Conversation'}
            {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-2">No messages yet.</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${isMyMsg(msg) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 ${
                isMyMsg(msg)
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
              }`}>
                {!isMyMsg(msg) && (
                  <p className="text-xs font-semibold mb-1 text-slate-500">{msg.sender?.name || 'Support'}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${isMyMsg(msg) ? 'text-blue-200' : 'text-slate-400'}`}>
                  {formatAt(msg.at)}
                </p>
              </div>
            </div>
          ))}

          {!isClosed && (
            <div className="pt-2">
              {sent && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  Reply sent!
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !reply.trim()}
                  className="self-end bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {sending ? '…' : 'Send'}
                </button>
              </div>
            </div>
          )}

          {isClosed && (
            <p className="text-xs text-slate-400 text-center pt-1">
              This ticket has been closed. No further replies allowed.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function NewTicketForm({ bookings, onCreated }) {
  const [form,    setForm]    = useState({ bookingId: '', category: '', subject: '', description: '' });
  const [errors,  setErrors]  = useState({});
  const [busy,    setBusy]    = useState(false);
  const [success, setSuccess] = useState(null);

  function validate() {
    const e = {};
    if (!form.category) e.category = 'Please select a category';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.description.trim().length < 20) e.description = 'Please provide at least 20 characters';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setBusy(true);
    try {
      const res = await createTicket({
        bookingId:   form.bookingId || undefined,
        category:    form.category,
        subject:     form.subject.trim(),
        description: form.description.trim(),
      });
      const ticket = res.data?.ticket;
      setSuccess(ticket?.ticketId || 'TKT-submitted');
      setForm({ bookingId: '', category: '', subject: '', description: '' });
      setErrors({});
      if (onCreated) onCreated(ticket);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit ticket. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Ticket Raised!</h3>
        <p className="text-slate-500 text-sm mb-4">
          Your ticket <span className="font-semibold text-slate-700">{success}</span> has been submitted. Our team will respond within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
        >
          Raise Another Ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <div>
        <label className="label-style">Related Booking <span className="text-slate-400 font-normal">(optional)</span></label>
        <select
          value={form.bookingId}
          onChange={e => setForm(f => ({ ...f, bookingId: e.target.value }))}
          className="input-style"
        >
          <option value="">— No specific booking —</option>
          {bookings.map(b => (
            <option key={b._id} value={b._id}>
              {b.service} — {(b._id).slice(-8).toUpperCase()} ({b.status})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-style">Category</label>
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="input-style"
        >
          <option value="">— Select category —</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="label-style">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          placeholder="Briefly describe your issue"
          className="input-style"
        />
        {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
      </div>

      <div>
        <label className="label-style">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe the issue in detail (minimum 20 characters)"
          rows={5}
          className="input-style resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{form.description.length} / 20 minimum</p>
        {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
      </div>

      {errors.submit && (
        <p className="text-xs text-rose-500 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">{errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {busy ? 'Submitting…' : 'Submit Ticket'}
      </button>
    </form>
  );
}

export default function Tickets() {
  const { user }   = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('list');
  const [tickets,   setTickets]   = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      listTickets().catch(() => ({ data: { tickets: [] } })),
      listBookings().catch(() => ({ data: { bookings: [] } })),
    ]).then(([tickRes, bookRes]) => {
      setTickets(tickRes.data?.tickets ?? []);
      setBookings(bookRes.data?.bookings ?? []);
    }).finally(() => setLoading(false));
  }, []);

  // Real-time: update ticket status when leader/admin marks it SOLVED or UNSOLVED
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = ({ ticketId, status, resolvedBy, statusUpdatedAt }) => {
      setTickets(prev => prev.map(t =>
        t._id === ticketId ? { ...t, status, resolvedBy, statusUpdatedAt } : t
      ));
    };

    socket.on('ticket:status_updated', handleStatusUpdate);
    socket.on('ticket:solved',         handleStatusUpdate);
    socket.on('ticket:unsolved',       handleStatusUpdate);

    return () => {
      socket.off('ticket:status_updated', handleStatusUpdate);
      socket.off('ticket:solved',         handleStatusUpdate);
      socket.off('ticket:unsolved',       handleStatusUpdate);
    };
  }, [socket]);

  const handleCreated = (newTicket) => {
    if (newTicket) setTickets(prev => [newTicket, ...prev]);
    setActiveTab('list');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">Raise issues or track existing support requests.</p>
      </div>

      <div className="flex gap-2">
        {[{ id: 'list', label: 'My Tickets' }, { id: 'new', label: 'Raise New Ticket' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            {tab.id === 'list' && tickets.length > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tickets.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <TagIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No tickets yet</p>
              <p className="text-slate-400 text-sm mt-1">Raise a ticket if you need support.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Raise a Ticket
              </button>
            </div>
          ) : (
            tickets.map(t => (
              <TicketCard key={t._id} ticket={t} currentUserId={user?._id} />
            ))
          )}
        </div>
      )}

      {activeTab === 'new' && (
        <NewTicketForm bookings={bookings} onCreated={handleCreated} />
      )}
    </div>
  );
}
