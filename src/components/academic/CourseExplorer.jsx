import { useId, useMemo, useState } from 'react'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
import CourseRow from './CourseRow'
import { useCourseDetail } from './CourseDetail'
import { searchCourses } from '../../lib/planner/engine'
import { usePlanner } from '../../lib/planner/store'

/** Search any course on the selected sheet and add it to your plan. */
export default function CourseExplorer({ compact = false }) {
  const { catalog, state, togglePinned } = usePlanner()
  const [q, setQ] = useState('')
  const id = useId()
  const open = useCourseDetail()
  const results = useMemo(() => searchCourses(catalog, q), [catalog, q])

  return (
    <section aria-labelledby={`${id}-title`} className={compact ? '' : 'mt-10'}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-500">Course explorer</p>
          <h2 id={`${id}-title`} className="mt-3 font-display text-xl font-semibold text-brand-700 sm:text-2xl">Find a course</h2>
        </div>
      </div>
      <div className="relative mt-4">
        <Icon name="Search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or code… e.g. Heat Transfer, 0640343"
          aria-label="Search courses"
          autoComplete="off"
          className="h-12 w-full rounded-full border border-line bg-white pl-12 pr-4 text-[15px] text-ink shadow-card placeholder:text-ink-muted/80 focus:border-brand-300"
        />
      </div>
      {q.trim() && (
        <div className="mt-3 rounded-2xl border border-line bg-white p-2 shadow-card" aria-live="polite">
          {results.length ? (
            <ul className="divide-y divide-line/70">
              {results.map((c) => (
                <li key={c.code}>
                  <CourseRow
                    course={c}
                    catalog={catalog}
                    state={state}
                    onOpen={open}
                    showStatus
                    trailing={
                      <Button size="sm" variant={state.pinned.has(c.code) ? 'outline' : 'primary'} onClick={() => togglePinned(c.code)} aria-label={state.pinned.has(c.code) ? `Remove ${c.name} from my plan` : `Add ${c.name} to my plan`}>
                        <Icon name={state.pinned.has(c.code) ? 'Check' : 'Plus'} className="h-4 w-4" />
                        <span className="hidden sm:inline">{state.pinned.has(c.code) ? 'In plan' : 'Add to my plan'}</span>
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-sm text-ink-soft">No course on this sheet matches “{q}”. Try a course code or a shorter name.</p>
          )}
        </div>
      )}
    </section>
  )
}
