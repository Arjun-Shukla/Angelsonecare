import { ArrowRightIcon } from './icons.jsx';

const variants = {
  primary:   'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50',
  teal:      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg',
  ghost:     'text-indigo-600 hover:bg-indigo-50',
  white:     'bg-white text-indigo-700 shadow-md hover:shadow-lg hover:bg-indigo-50',
  'white-outline': 'bg-transparent text-white border-2 border-white/60 hover:border-white hover:bg-white hover:text-indigo-700',
};

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-6 py-3 text-base',
  lg:  'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className = '',
  as: Tag = 'button',
  href,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const classes = `${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
        {arrow && <ArrowRightIcon className="w-4 h-4" />}
      </a>
    );
  }

  return (
    <Tag className={classes} {...props}>
      {children}
      {arrow && <ArrowRightIcon className="w-4 h-4" />}
    </Tag>
  );
}
