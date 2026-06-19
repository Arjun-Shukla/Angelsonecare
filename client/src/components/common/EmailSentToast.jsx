import { useEffect, useState } from 'react';
import { EnvelopeIcon, CheckCircleIcon } from './icons.jsx';

export default function EmailSentToast({
  show,
  message = 'Email notifications sent!',
  detail  = 'All relevant parties have been notified.',
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 bg-white border border-green-200 shadow-2xl px-5 py-4 rounded-2xl max-w-xs">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <EnvelopeIcon className="w-5 h-5 text-green-600 animate-bounce" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-3 h-3 text-white" strokeWidth={2.5} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-snug">{message}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{detail}</p>
        </div>
      </div>
    </div>
  );
}
