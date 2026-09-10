import SmartLink from './SmartLink'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-wide whitespace-nowrap select-none transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-brand-700 text-white shadow-card hover:bg-brand-800 hover:shadow-lift',
  accent: 'bg-brand-500 text-white shadow-card hover:bg-brand-600 hover:shadow-lift',
  light: 'bg-white text-brand-700 shadow-card hover:bg-brand-50 hover:shadow-lift',
  outline: 'border border-line bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50',
  'outline-light': 'border border-white/40 text-white hover:bg-white/10',
  ghost: 'text-brand-700 hover:bg-brand-50',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  children,
  ...rest
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href !== undefined) {
    return (
      <SmartLink href={href} className={classes} {...rest}>
        {children}
      </SmartLink>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
