import { ASSISTANT } from '../../data/academic/assistant'

function Chip({ on, onClick, children }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full px-3.5 py-2 font-display text-sm font-semibold transition-colors ${on ? 'bg-brand-700 text-white' : 'bg-white text-brand-700 ring-1 ring-inset ring-line hover:ring-brand-300'}`}>
      {children}
    </button>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  )
}

export default function Preferences({ prefs, onChange }) {
  const toggleDay = (day) => onChange({ avoidDays: prefs.avoidDays.includes(day) ? prefs.avoidDays.filter((d) => d !== day) : [...prefs.avoidDays, day] })
  const select = 'h-11 w-full appearance-none rounded-full border border-line bg-white px-4 font-display text-sm font-semibold text-brand-700 focus:border-brand-300'
  return (
    <div className="grid gap-5">
      <Field label="How many courses do you want to take?">
        <div className="flex flex-wrap gap-2">
          {ASSISTANT.courseCountOptions.map((n) => (
            <Chip key={n} on={prefs.courseCount === n} onClick={() => onChange({ courseCount: n })}>{n}</Chip>
          ))}
        </div>
      </Field>
      <Field label="Preferred time" hint="Saved for when live class schedules are connected.">
        <div className="flex flex-wrap gap-2">
          {ASSISTANT.timeOptions.map((t) => (
            <Chip key={t.id} on={prefs.timeOfDay === t.id} onClick={() => onChange({ timeOfDay: t.id })}>{t.label}</Chip>
          ))}
        </div>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Earliest class">
          <select value={prefs.earliest} onChange={(e) => onChange({ earliest: e.target.value })} className={select} aria-label="Earliest class">
            {ASSISTANT.hourOptions.map((h) => <option key={h}>{h}</option>)}
          </select>
        </Field>
        <Field label="Latest class">
          <select value={prefs.latest} onChange={(e) => onChange({ latest: e.target.value })} className={select} aria-label="Latest class">
            {ASSISTANT.hourOptions.map((h) => <option key={h}>{h}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Days to avoid">
        <div className="flex flex-wrap gap-2">
          {ASSISTANT.days.map((d) => (
            <Chip key={d} on={prefs.avoidDays.includes(d)} onClick={() => toggleDay(d)}>{d.slice(0, 3)}</Chip>
          ))}
        </div>
      </Field>
      <Field label="Anything else?">
        <textarea value={prefs.notes} onChange={(e) => onChange({ notes: e.target.value })} rows={2} placeholder="e.g. I don't want classes too close together." className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-muted/80 focus:border-brand-300" />
      </Field>
    </div>
  )
}
