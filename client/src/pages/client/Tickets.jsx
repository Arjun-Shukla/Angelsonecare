import { useState } from 'react';
import { MOCK_TICKETS, MOCK_BOOKINGS } from '../../data/mockClient.js';
import { ChevronDownIcon, ChevronUpIcon, TagIcon, CheckCircleIcon } from '../../components/common/icons.jsx';
import EmailSentToast from '../../components/common/EmailSentToast.jsx';

const TICKET_STATUS_STYLES = {
  OPEN: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-green-100 text-green-700',
};

const PRIORITY_STYLES = {
  HIGH: 'bg-rose-100 text-rose-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-slate-100 text-slate-600',
};

const CATEGORIES = [
  'Service Issue', 'Billing Query', 'Information Update',
  'Caregiver Feedback', 'General Inquiry', 'Emergency',
];

function TicketCard({ ticket }) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState(ticket.messages);
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!reply.trim()) return;
    setMessages(prev => [...prev, {
      from: 'User',
      text: reply.trim(),
      at: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }]);
    setReply('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ticket.id}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TICKET_STATUS_STYLES[ticket.status]}`}>
                {ticket.status}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 text-base leading-snug">{ticket.subject}</h3>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
              <span>{ticket.category}</span>
              <span>·</span>
              <span>Booking #{ticket.bookingId}</span>
              <span>·</span>
              <span>{ticket.createdAt}</span>
            </div>
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
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'User' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5 ${
                msg.from === 'User'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'User' ? 'text-blue-200' : 'text-slate-400'}`}>{msg.at}</p>
              </div>
            </div>
          ))}

          {ticket.status === 'OPEN' && (
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
                  className="self-end bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NewTicketForm() {
  const [form,           setForm]           = useState({ bookingId: '', category: '', subject: '', description: '' });
  const [errors,         setErrors]         = useState({});
  const [success,        setSuccess]        = useState(null);
  const [showEmailToast, setShowEmailToast] = useState(false);

  function validate() {
    const e = {};
    if (!form.bookingId) e.bookingId = 'Please select a booking';
    if (!form.category) e.category = 'Please select a category';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (form.description.trim().length < 20) e.description = 'Please provide at least 20 characters';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const ticketId = `TKT-${String(Math.floor(Math.random() * 900) + 100)}`;
    setSuccess(ticketId);
    setShowEmailToast(true);
    setForm({ bookingId: '', category: '', subject: '', description: '' });
    setErrors({});
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-sm">
        <EmailSentToast
          show={showEmailToast}
          message="Ticket notification sent!"
          detail="Our support team has been notified via email."
        />
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Ticket Raised!</h3>
        <p className="text-slate-500 text-sm mb-4">Your support ticket <span className="font-semibold text-slate-700">{success}</span> has been submitted successfully. Our team will respond within 24 hours.</p>
        <button
          onClick={() => { setSuccess(null); setShowEmailToast(false); }}
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
        <label className="label-style">Select Booking</label>
        <select
          value={form.bookingId}
          onChange={e => setForm(f => ({ ...f, bookingId: e.target.value }))}
          className="input-style"
        >
          <option value="">— Select a booking —</option>
          {MOCK_BOOKINGS.map(b => (
            <option key={b.id} value={b.id}>AO{b.id.replace('AO', '')} — {b.service}</option>
          ))}
        </select>
        {errors.bookingId && <p className="text-xs text-rose-500 mt-1">{errors.bookingId}</p>}
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

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Submit Ticket
      </button>
    </form>
  );
}

export default function Tickets() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">Raise issues or track existing support requests.</p>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'list', label: 'My Tickets' },
          { id: 'new', label: 'Raise New Ticket' },
        ].map(tab => (
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
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div className="space-y-4">
          {MOCK_TICKETS.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <TagIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No tickets yet</p>
            </div>
          ) : (
            MOCK_TICKETS.map(t => <TicketCard key={t.id} ticket={t} />)
          )}
        </div>
      )}

      {activeTab === 'new' && <NewTicketForm />}
    </div>
  );
}
