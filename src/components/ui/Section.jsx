const tones = {
  default: '',
  white: 'bg-white',
  dark: 'bg-brand-700 text-white',
}

export function Section({ id, tone = 'default', className = '', children, ...rest }) {
  return (
    <section id={id} className={`scroll-mt-16 py-14 sm:py-20 ${tones[tone]} ${className}`} {...rest}>
      <div className="container-hub">{children}</div>
    </section>
  )
}

export function SectionHeading({ id, eyebrow, title, description, action, dark = false }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow ${dark ? 'text-brand-200' : 'text-brand-500'}`}>{eyebrow}</p>}
        <h2
          id={id}
          className={`mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${dark ? 'text-white' : 'text-brand-700'}`}
        >
          {title}
        </h2>
        {description && (
          <p className={`mt-2 text-[15px] leading-relaxed sm:text-base ${dark ? 'text-white/75' : 'text-ink-soft'}`}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
