import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EligibilityBadge from './EligibilityBadge'
import { useContent } from '../../lib/content'
import { directDependents, displayName, getEligibility, requirementText } from '../../lib/planner/engine'
import { usePlanner } from '../../lib/planner/store'
import { useToast } from '../ui/Toast'
import { routeHref, ROUTES } from '../../lib/router'
import { track, ANALYTICS_EVENTS } from '../../lib/analytics'

const Ctx = createContext(() => {})

/** Course detail sheet — opened from any course row; "Add to my plan" feeds the assistant. */
export function CourseDetailProvider({ children }) {
  const [code, setCode] = useState(null)
  const open = useCallback((c) => setCode(c), [])
  const close = useCallback(() => setCode(null), [])

  useEffect(() => {
    if (!code) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [code, close])

  return (
    <Ctx.Provider value={open}>
      {children}
      {code && <CourseSheet code={code} onClose={close} />}
    </Ctx.Provider>
  )
}

export const useCourseDetail = () => useContext(Ctx)

function ReqList({ title, items, catalog, state, mode }) {
  if (!items.length) return null
  return (
    <div>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((r, i) => {
          const met = mode === 'pre' ? metPre(r, state) : metCo(r, state)
          return (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
              <Icon name={met === true ? 'CircleCheck' : met === false ? 'CircleDashed' : 'Info'} className={`mt-0.5 h-4 w-4 shrink-0 ${met === true ? 'text-emerald-600' : met === false ? 'text-ink-muted' : 'text-brand-400'}`} />
              <span>{requirementText(r, catalog)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
const metPre = (r, state) => (r.type === 'course' ? state.completed.has(r.code) : r.type === 'anyOf' ? r.codes.some((c) => state.completed.has(c)) : null)
const metCo = (r, state) => (r.type === 'course' ? state.completed.has(r.code) || state.inProgress.has(r.code) : r.type === 'anyOf' ? r.codes.some((c) => state.completed.has(c) || state.inProgress.has(c)) : null)

function CourseSheet({ code, onClose }) {
  const { catalog, state, plan, togglePinned, toggleCompleted, toggleInProgress } = usePlanner()
  const { courseCategories: COURSE_CATEGORIES } = useContent()
  const toast = useToast()
  const course = catalog.get(code)
  if (!course) return null
  const elig = getEligibility(course, state, catalog)
  const unlocks = directDependents(code, catalog)
  const pinned = state.pinned.has(code)

  const addToPlan = () => {
    togglePinned(code)
    track(ANALYTICS_EVENTS.RESOURCE_CLICK, { id: `course-pin:${code}`, on: !pinned })
    toast(pinned ? 'Removed from your plan' : `${displayName(course)} added to your plan`)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="presentation">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 animate-fade-in bg-brand-900/50 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="course-title" className="relative flex max-h-[92vh] w-full max-w-lg animate-fade-up flex-col rounded-t-3xl bg-surface shadow-lift sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 p-5 pb-3 sm:p-6 sm:pb-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs tabular-nums text-ink-muted">{course.code}</span>
              <Badge tone="soft">{COURSE_CATEGORIES[course.category]?.short}</Badge>
              <EligibilityBadge status={elig.status} />
            </div>
            <h2 id="course-title" className="mt-2 font-display text-xl font-semibold leading-tight text-brand-700 sm:text-2xl">
              {course.name}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{course.credits == null ? 'Credits are not listed on this sheet' : `${course.credits} credit${course.credits === 1 ? '' : 's'}`} · {plan.major} {plan.years}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-white hover:text-brand-700">
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-5 sm:px-6">
          {elig.status === 'blocked' && (
            <p className="rounded-xl bg-white p-3 text-sm text-ink-soft">
              Still missing: <span className="font-medium text-ink">{elig.missingPre.map((r) => r.text).join(', ')}</span>.
            </p>
          )}
          {elig.status === 'needs-coreq' && <p className="rounded-xl bg-white p-3 text-sm text-ink-soft">Take together with {elig.missingCo.map((r) => r.text).join(' and ')}.</p>}
          <ReqList title="Prerequisites" items={course.prerequisites ?? []} catalog={catalog} state={state} mode="pre" />
          {!(course.prerequisites ?? []).length && <p className="text-sm text-ink-muted">No prerequisites listed on this sheet.</p>}
          <ReqList title="Co-requisites" items={course.corequisites ?? []} catalog={catalog} state={state} mode="co" />
          {unlocks.length > 0 && (
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">Needed for</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {unlocks.map(({ course: c, via }) => (
                  <li key={c.code} className="rounded-full bg-white px-2.5 py-1 text-xs text-ink-soft ring-1 ring-inset ring-line">
                    {displayName(c)} <span className="text-ink-muted">· {via === 'corequisite' ? 'co-req' : 'prereq'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {course.notes && (
            <p className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
              <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0" />
              {course.notes}
            </p>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-brand-200">
              <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={state.completed.has(code)} onChange={() => toggleCompleted(code)} />
              I completed this
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-brand-200">
              <input type="checkbox" className="h-4 w-4 accent-brand-700" checked={state.inProgress.has(code)} onChange={() => toggleInProgress(code)} />
              I am taking it now
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-b-3xl sm:p-5">
          <Button variant={pinned ? 'outline' : 'primary'} onClick={addToPlan} className="flex-1 sm:flex-none">
            <Icon name={pinned ? 'Check' : 'Plus'} className="h-4 w-4" />
            {pinned ? 'In my plan' : 'Add to my plan'}
          </Button>
          <Button variant="ghost" href={routeHref(ROUTES.planner, { plan: plan.id })} onClick={onClose}>
            <Icon name="Bot" className="h-4 w-4" />
            Ask the assistant
          </Button>
        </div>
      </div>
    </div>
  )
}
