import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Icon from '../ui/Icon'
import { planProgress } from '../../lib/planner/engine'
import { routeHref, ROUTES } from '../../lib/router'
import { ANALYTICS_EVENTS } from '../../lib/analytics'

/** "Your major sheet" card: summary, official PDF actions, and the hand-off to the assistant. */
export default function PlanOverview({ plan, catalog, state }) {
  const progress = planProgress(plan, catalog, state)
  const groups = plan.requirements.map((g) => ({
    id: g.id,
    title: g.title,
    courses: g.courses.length,
    credits: g.courses.reduce((s, code) => s + (catalog.get(code)?.credits ?? 0), 0) + (g.slots ?? []).reduce((s, slot) => s + (slot.credits ?? 0), 0),
    slots: (g.slots ?? []).length,
  }))

  return (
    <section aria-labelledby="sheet-title" className="rounded-2xl border border-brand-200 bg-white shadow-lift">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="eyebrow text-brand-500">Your major sheet</p>
          <h2 id="sheet-title" className="mt-3 font-display text-2xl font-semibold leading-tight text-brand-700 sm:text-3xl">
            {plan.major}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="info">{plan.years}</Badge>
            {plan.current && <Badge tone="success" dot>Current sheet</Badge>}
          </div>
          <p className="mt-3 max-w-prose text-sm text-ink-soft">{plan.appliesTo}</p>
          {progress.doneCourses > 0 && (
            <p className="mt-2 text-sm text-ink-soft">
              You have marked <span className="font-semibold text-ink">{progress.doneCourses} of {progress.totalCourses}</span> compulsory courses as completed ({progress.credits} credits).
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button href={routeHref(ROUTES.planner, { plan: plan.id })} size="lg" trackAs={ANALYTICS_EVENTS.LINK_CLICK} trackMeta={{ id: 'plan-my-semester', plan: plan.id }} className="w-full sm:w-auto">
            <Icon name="Bot" className="h-4 w-4" />
            Plan my semester
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" href={plan.officialSheet.pdf} trackAs={ANALYTICS_EVENTS.RESOURCE_CLICK} trackMeta={{ id: `major-sheet-view:${plan.id}` }}>
              <Icon name="Eye" className="h-4 w-4" />
              View major sheet
            </Button>
            <Button variant="outline" size="sm" href={plan.officialSheet.pdf} download trackAs={ANALYTICS_EVENTS.RESOURCE_CLICK} trackMeta={{ id: `major-sheet-download:${plan.id}` }}>
              <Icon name="Download" className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-5">
        {groups.map((g) => (
          <li key={g.id} className="bg-white px-4 py-3 first:rounded-bl-2xl last:rounded-br-2xl sm:px-5">
            <p className="font-display text-xl font-semibold tabular-nums text-brand-700">{g.credits}<span className="ml-1 text-xs font-medium text-ink-muted">cr</span></p>
            <p className="text-xs leading-snug text-ink-soft">{g.title}</p>
            <p className="text-[11px] text-ink-muted">
              {g.courses} course{g.courses === 1 ? '' : 's'}
              {g.slots ? ` · ${g.slots} elective slot${g.slots === 1 ? '' : 's'}` : ''}
            </p>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 border-t border-line px-5 py-3 text-xs text-ink-muted sm:px-6">
        <Icon name="FileText" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        The official PDF is the source of truth. Course data on this page was transcribed from the {plan.officialSheet.title} ({plan.officialSheet.pages} pages) — verify anything important against it.
      </p>
    </section>
  )
}
