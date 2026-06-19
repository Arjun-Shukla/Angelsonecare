import { ArrowRightIcon } from './icons.jsx';

const variants = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
  secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
  teal:      'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg',
  ghost:     'text-blue-600 hover:bg-blue-50',
  white:     'bg-white text-blue-700 shadow-md hover:shadow-lg hover:bg-blue-50',
  'white-outline': 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-700',
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
