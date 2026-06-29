import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { getMessages, markMessageRead } from '../../api/message.api.js';
import { EnvelopeIcon, PhoneIcon, CheckCircleIcon } from '../../components/common/icons.jsx';

function MessageCard({ msg, onRead }) {
  const [marking, setMarking] = useState(false);

  async function handleRead() {
    if (msg.isRead || marking) return;
    setMarking(true);
    try {
      await markMessageRead(msg._id);
      onRead(msg._id);
    } catch { /* silent */ } finally {
      setMarking(false);
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${
        msg.isRead ? 'border-slate-100' : 'border-teal-200 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            msg.isRead ? 'bg-slate-100' : 'bg-teal-100'
          }`}>
            <EnvelopeIcon className={`w-5 h-5 ${msg.isRead ? 'text-slate-400' : 'text-teal-600'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-900">{msg.name}</p>
              {!msg.isRead && (
                <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">NEW</span>
              )}
              {msg.service && (
                <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{msg.service}</span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <PhoneIcon className="w-3 h-3" />
                {msg.phone}
              </span>
              {msg.email && (
                <span className="flex items-center gap-1">
                  <EnvelopeIcon className="w-3 h-3" />
                  {msg.email}
                </span>
              )}
              <span>{new Date(msg.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed">{msg.message}</p>
          </div>
        </div>
        {!msg.isRead && (
          <button
            onClick={handleRead}
            disabled={marking}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors flex-shrink-0"
          >
            <CheckCircleIcon className="w-4 h-4" />
            {marking ? '…' : 'Mark Read'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LeaderMessages() {
  const { socket }                = useSocket();
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('ALL');

  useEffect(() => {
    getMessages()
      .then(res => setMessages(res.data?.messages ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNew = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [msg, ...prev];
      });
    };
    socket.on('message:new', handleNew);
    return () => socket.off('message:new', handleNew);
  }, [socket]);

  const handleRead = (id) => {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
  };

  const filtered = filter === 'ALL'
    ? messages
    : filter === 'UNREAD'
      ? messages.filter(m => !m.isRead)
      : messages.filter(m => m.isRead);

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5">Contact form enquiries from the website</p>
        {!loading && (
          <div className="flex gap-2 mt-2">
            <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full">Total: {messages.length}</span>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">Unread: {unreadCount}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {['ALL', 'UNREAD', 'READ'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <EnvelopeIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(msg => (
            <MessageCard key={msg._id} msg={msg} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}
