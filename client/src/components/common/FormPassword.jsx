import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from './icons.jsx';

export default function FormPassword({
  label,
  name,
  error = '',
  hint = '',
  required = false,
  className = '',
  ...rest
}) {
  const [show, setShow] = useState(false);
  const hasError = Boolean(error);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label-style">
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? 'text' : 'password'}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-err` : hint ? `${name}-hint` : undefined}
          className={`input-style pr-20 ${
            hasError ? 'border-red-400 bg-red-50/50 focus:ring-red-400' : ''
          }`}
          {...rest}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {hasError && (
            <ExclamationCircleIcon className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show
              ? <EyeSlashIcon className="w-4 h-4" />
              : <EyeIcon      className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
      {hasError && (
        <p id={`${name}-err`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
      {hint && !hasError && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
}
