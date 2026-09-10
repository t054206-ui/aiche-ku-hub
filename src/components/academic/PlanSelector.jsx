import { useId } from 'react'
import Icon from '../ui/Icon'
import { usePlanner } from '../../lib/planner/store'

/** "Select your academic year" — a native select styled like the site's inputs (works great on phones). */
export default function PlanSelector({ value, onChange, label = 'Select your academic year', compact = false }) {
  const id = useId()
  const { plans } = usePlanner()
  return (
    <div className={compact ? '' : 'rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5'}>
      <label htmlFor={id} className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-full border border-line bg-surface pl-4 pr-11 font-display text-base font-semibold text-brand-700 focus:border-brand-300"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} · {p.major}
              {p.current ? ' (current)' : ''}
            </option>
          ))}
        </select>
        <Icon name="ChevronDown" className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-500" />
      </div>
      {!compact && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Available academic years">
          {plans.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onChange(p.id)}
                className={`rounded-full px-3 py-1.5 font-display text-xs font-semibold transition-colors ${
                  p.id === value ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                }`}
              >
                {p.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
