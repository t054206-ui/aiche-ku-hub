const tones = {
  live: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-brand-50 text-brand-700 ring-brand-200',
  soft: 'bg-brand-100 text-brand-800 ring-brand-200/70',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  warn: 'bg-amber-50 text-amber-800 ring-amber-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  onDark: 'bg-white/10 text-white ring-white/20',
}

export default function Badge({ tone = 'info', dot = false, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${tone === 'live' ? 'animate-pulse-dot bg-red-500' : 'bg-current'}`}
        />
      )}
      {children}
    </span>
  )
}
