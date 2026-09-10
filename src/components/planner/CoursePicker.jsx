import { useMemo, useState } from 'react'
import Icon from '../ui/Icon'
import { useContent } from '../../lib/content'

/**
 * Checklist of plan courses grouped by requirement group.
 * mode = 'completed' | 'inProgress'; `exclude` hides codes already in the other list.
 */
export default function CoursePicker({ plan, catalog, selected, exclude = new Set(), onToggle, onSetMany, mode }) {
  const { courseCategories: COURSE_CATEGORIES } = useContent()
  const [q, setQ] = useState('')
  const [openGroups, setOpenGroups] = useState(() => new Set(plan.requirements.slice(0, 1).map((g) => g.id)))

  const groups = useMemo(() => {
    const foundation = { id: 'foundation', title: COURSE_CATEGORIES.foundation.label, courses: [...catalog.values()].filter((c) => c.category === 'foundation') }
    const planGroups = plan.requirements.map((g) => ({ id: g.id, title: g.title, courses: g.courses.map((c) => catalog.get(c)).filter(Boolean) }))
    const electives = { id: 'electives', title: 'Electives', courses: [...catalog.values()].filter((c) => c.inPlan && !c.compulsory && c.category !== 'foundation') }
    return [foundation, ...planGroups, electives].filter((g) => g.courses.length)
  }, [plan, catalog])

  const filter = q.trim().toLowerCase()
  const visible = (course) => !exclude.has(course.code) && (!filter || course.name.toLowerCase().includes(filter) || course.code.includes(filter))
  const toggleGroup = (id) => setOpenGroups((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div>
      <div className="relative">
        <Icon name="Search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter courses…" aria-label="Filter courses" className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted/80 focus:border-brand-300" />
      </div>
      <ul className="mt-3 space-y-2">
        {groups.map((group) => {
          const courses = group.courses.filter(visible)
          if (!courses.length) return null
          const chosen = courses.filter((c) => selected.has(c.code)).length
          const isOpen = openGroups.has(group.id) || Boolean(filter)
          return (
            <li key={group.id} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button type="button" onClick={() => toggleGroup(group.id)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <Icon name="ChevronDown" className={`h-4 w-4 shrink-0 text-brand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  <span className="truncate font-display text-sm font-semibold text-ink">{group.title}</span>
                  <span className="shrink-0 text-xs tabular-nums text-ink-muted">{chosen}/{courses.length}</span>
                </button>
                <button type="button" onClick={() => onSetMany(courses.map((c) => c.code), chosen !== courses.length)} className="shrink-0 rounded-full px-2.5 py-1 font-display text-xs font-semibold text-brand-700 hover:bg-brand-50">
                  {chosen === courses.length ? 'Clear' : 'All'}
                </button>
              </div>
              {isOpen && (
                <ul className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2">
                  {courses.map((c) => {
                    const on = selected.has(c.code)
                    return (
                      <li key={c.code} className="bg-white">
                        <label className={`flex cursor-pointer items-start gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-brand-50/60 ${on ? 'bg-brand-50/40' : ''}`}>
                          <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-brand-700" checked={on} onChange={() => onToggle(c.code)} aria-label={`${c.name} ${mode === 'completed' ? 'completed' : 'in progress'}`} />
                          <span className="min-w-0">
                            <span className="block font-medium leading-snug text-ink">{c.name}</span>
                            <span className="block font-mono text-[11px] text-ink-muted">{c.code}{c.credits != null ? ` · ${c.credits} cr` : ''}</span>
                          </span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
