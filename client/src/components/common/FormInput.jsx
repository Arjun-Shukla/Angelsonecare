import { ExclamationCircleIcon } from './icons.jsx';

export default function FormInput({
  label,
  name,
  type = 'text',
  error = '',
  hint = '',
  required = false,
  className = '',
  ...rest
}) {
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
          type={type}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${name}-err` : hint ? `${name}-hint` : undefined
          }
          className={`input-style ${
            hasError ? 'border-red-400 bg-red-50/50 focus:ring-red-400 pr-10' : ''
          }`}
          {...rest}
        />
        {hasError && (
          <ExclamationCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 pointer-events-none" />
        )}
      </div>
      {hasError && (
        <p id={`${name}-err`} role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
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
