import Icon from '../ui/Icon'
import EligibilityBadge from './EligibilityBadge'
import { COURSE_CATEGORIES } from '../../data/academic/courses'
import { displayName, getEligibility, requirementText } from '../../lib/planner/engine'

/**
 * One course line used by the plan view, the explorer and the assistant lists.
 * `showStatus` adds the student's eligibility (needs planner state).
 */
export default function CourseRow({ course, catalog, state, onOpen, showStatus = false, trailing = null }) {
  const elig = showStatus && state ? getEligibility(course, state, catalog) : null
  const pre = (course.prerequisites ?? []).map((r) => requirementText(r, catalog))
  return (
    <div className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-brand-50/70">
      <button type="button" onClick={() => onOpen?.(course.code)} className="min-w-0 flex-1 text-left" aria-label={`${course.name} details`}>
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-display text-[15px] font-semibold text-ink group-hover:text-brand-700">{course.name}</span>
          <span className="font-mono text-xs tabular-nums text-ink-muted">{course.code}</span>
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span className="font-medium text-ink-soft">{course.credits == null ? 'Credits not listed' : `${course.credits} credit${course.credits === 1 ? '' : 's'}`}</span>
          <span>{COURSE_CATEGORIES[course.category]?.short}</span>
          {pre.length > 0 && (
            <span className="hidden truncate sm:inline">
              <span className="text-ink-muted/80">Prereq: </span>
              {pre.map((p) => p.replace(/\s\(\d{7}\)/g, '')).join(' · ')}
            </span>
          )}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {elig && <EligibilityBadge status={elig.status} />}
        {trailing}
        <button type="button" onClick={() => onOpen?.(course.code)} aria-label={`Open ${displayName(course)}`} className="hidden h-8 w-8 items-center justify-center rounded-full text-brand-300 hover:bg-white hover:text-brand-700 sm:inline-flex">
          <Icon name="ChevronRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
