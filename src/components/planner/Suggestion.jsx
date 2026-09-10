import Icon from '../ui/Icon'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { displayName, remainingByStatus } from '../../lib/planner/engine'
import { useCourseDetail } from '../academic/CourseDetail'

/** "Your suggested semester" — the result panel, styled as a planning tool rather than chat. */
export default function Suggestion({ plan, catalog, state, suggestion, onRegenerate }) {
  const open = useCourseDetail()
  const chosenSet = new Set(suggestion.courses.map(({ course }) => course.code))
  const remaining = remainingByStatus(catalog, state, chosenSet)

  return (
    <section aria-labelledby="suggestion-title" className="rounded-2xl border border-brand-200 bg-white shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3 sm:p-6 sm:pb-3">
        <div>
          <p className="eyebrow text-brand-500">Your suggested semester</p>
          <h2 id="suggestion-title" className="mt-3 font-display text-2xl font-semibold text-brand-700">
            {suggestion.courses.length} course{suggestion.courses.length === 1 ? '' : 's'}
            <span className="ml-2 text-base font-medium text-ink-muted">
              {suggestion.totalCredits} credits{suggestion.unknownCredits ? '+' : ''}
            </span>
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {plan.major} · {plan.years} · based on {state.completed.size} completed and {state.inProgress.size} in-progress course{state.inProgress.size === 1 ? '' : 's'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <Icon name="RotateCcw" className="h-4 w-4" />
          Regenerate
        </Button>
      </div>

      {suggestion.courses.length > 0 ? (
        <ol className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:px-6">
          {suggestion.courses.map(({ course, reasons }, i) => (
            <li key={course.code}>
              <button type="button" onClick={() => open(course.code)} className="flex h-full w-full flex-col rounded-2xl border border-line bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs tabular-nums text-ink-muted">{course.code}</span>
                  <span className="font-display text-xs font-semibold text-white">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700">{i + 1}</span>
                  </span>
                </div>
                <span className="mt-2 font-display text-base font-semibold leading-snug text-ink">{course.name}</span>
                <span className="mt-1 font-display text-sm font-medium uppercase tracking-wider text-brand-500">
                  {course.credits == null ? 'Credits not listed' : `${course.credits} credit${course.credits === 1 ? '' : 's'}`}
                </span>
                {reasons[0] && <span className="mt-2 text-xs leading-relaxed text-ink-muted">{reasons[0]}</span>}
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mx-5 rounded-xl bg-surface p-4 text-sm text-ink-soft sm:mx-6">No compulsory course is open to you yet based on what you marked. Mark completed courses (including foundation courses if you are exempt) and regenerate.</p>
      )}

      {suggestion.electiveSuggestions.length > 0 && (
        <div className="mt-4 px-5 sm:px-6">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Elective slots to fill your load</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {suggestion.electiveSuggestions.map(({ slot, options }) => (
              <li key={slot.id} className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-3">
                <p className="font-display text-sm font-semibold text-brand-700">{slot.label} · {slot.credits} cr</p>
                <p className="mt-0.5 text-xs text-ink-muted">{slot.rule}</p>
                {options.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {options.map((c) => (
                      <li key={c.code}>
                        <button type="button" onClick={() => open(c.code)} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-line hover:ring-brand-300">{displayName(c)}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-5 border-t border-line p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <h3 className="font-display text-base font-semibold text-brand-700">Why these courses?</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {suggestion.courses.length > 0 && <li className="flex gap-2"><Icon name="CircleCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />You have completed the prerequisites listed on the {plan.years} sheet for each of them.</li>}
            {suggestion.courses.length > 0 && <li className="flex gap-2"><Icon name="CircleCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />They are compulsory courses in your academic plan, ordered so the ones that unlock the most later courses come first.</li>}
            <li className="flex gap-2"><Icon name="CircleCheck" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />They match your requested load of {suggestion.target} course{suggestion.target === 1 ? '' : 's'}{suggestion.courses.length < suggestion.target ? ` (only ${suggestion.courses.length} compulsory course${suggestion.courses.length === 1 ? ' is' : 's are'} open to you right now)` : ''}.</li>
            {suggestion.courses.flatMap(({ course, reasons }) => reasons.slice(1).map((r) => ({ course, r }))).slice(0, 4).map(({ course, r }, i) => (
              <li key={i} className="flex gap-2"><Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /><span><span className="font-medium text-ink">{displayName(course)}:</span> {r}</span></li>
            ))}
            {suggestion.notes.map((n) => (
              <li key={n} className="flex gap-2"><Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />{n}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          {remaining.eligible.length + remaining['needs-coreq'].length > 0 && (
            <div>
              <h3 className="font-display text-base font-semibold text-brand-700">Also open to you</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {[...remaining.eligible, ...remaining['needs-coreq']].slice(0, 10).map(({ course, elig }) => (
                  <li key={course.code}>
                    <button type="button" onClick={() => open(course.code)} className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft ring-1 ring-inset ring-line hover:text-brand-700 hover:ring-brand-300">
                      {displayName(course)}{elig.status === 'needs-coreq' ? ' *' : ''}
                    </button>
                  </li>
                ))}
              </ul>
              {remaining['needs-coreq'].length > 0 && <p className="mt-1.5 text-[11px] text-ink-muted">* needs a co-requisite in the same semester</p>}
            </div>
          )}
          {remaining.blocked.length > 0 && (
            <div>
              <h3 className="font-display text-base font-semibold text-brand-700">Not yet eligible</h3>
              <ul className="mt-2 space-y-1">
                {remaining.blocked.slice(0, 6).map(({ course, elig }) => (
                  <li key={course.code} className="text-xs text-ink-soft">
                    <button type="button" onClick={() => open(course.code)} className="font-medium text-ink hover:text-brand-700">{displayName(course)}</button>
                    <span className="text-ink-muted"> — missing {elig.missingPre.map((r) => r.text.replace(/\s\(\d{7}\)/g, '')).join(', ')}</span>
                  </li>
                ))}
                {remaining.blocked.length > 6 && <li className="text-xs text-ink-muted">+ {remaining.blocked.length - 6} more</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-line px-5 py-3 text-xs text-ink-muted sm:px-6">
        <Badge tone="soft">Planning estimate</Badge>
        Based only on the prerequisite information on the major sheet. Confirm availability and requirements with the university.
      </div>
    </section>
  )
}
