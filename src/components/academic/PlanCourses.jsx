import { useState } from 'react'
import Icon from '../ui/Icon'
import Reveal from '../ui/Reveal'
import CourseRow from './CourseRow'
import { groupCourses } from '../../lib/planner/engine'
import { useCourseDetail } from './CourseDetail'
import { useContent } from '../../lib/content'

const SEMESTER_ORDER = ['Fall', 'Spring', 'Summer']

function SlotRow({ slot, catalog, onOpen }) {
  const options = slot.chooseFrom === 'dept-electives' ? null : Array.isArray(slot.chooseFrom) ? slot.chooseFrom.map((c) => catalog.get(c)).filter(Boolean) : null
  return (
    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-3 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-[15px] font-semibold text-brand-700">{slot.label}</span>
        <span className="text-xs font-medium text-ink-soft">{slot.credits} credits</span>
      </div>
      <p className="mt-0.5 text-xs text-ink-muted">{slot.rule}</p>
      {options && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {options.map((c) => (
            <li key={c.code}>
              <button type="button" onClick={() => onOpen(c.code)} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-inset ring-line hover:ring-brand-300">
                {c.name} <span className="font-mono text-ink-muted">{c.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {slot.chooseFrom === 'dept-electives' && <p className="mt-1.5 text-xs text-brand-700">Choose from the Department Electives list below.</p>}
    </div>
  )
}

/**
 * The study plan itself. Two views:
 *  • By year — official semesters when `plan.semesters` exists, otherwise grouped by course level.
 *  • By category — exactly as the major sheet lists them, including elective slots.
 */
export default function PlanCourses({ plan, catalog, state }) {
  const [view, setView] = useState('year')
  const open = useCourseDetail()
  const { courseCategories } = useContent()
  const hasOfficialSemesters = Array.isArray(plan.semesters) && plan.semesters.length > 0

  const yearGroups = hasOfficialSemesters
    ? [...new Set(plan.semesters.map((s) => s.year))].sort().map((year) => ({
        id: `year-${year}`,
        title: `Year ${year}`,
        semesters: plan.semesters
          .filter((s) => s.year === year)
          .sort((a, b) => SEMESTER_ORDER.indexOf(a.term) - SEMESTER_ORDER.indexOf(b.term))
          .map((s) => ({ ...s, courses: s.courses.map((c) => catalog.get(c)).filter(Boolean) })),
      }))
    : groupCourses(plan, catalog, 'level', courseCategories)
  const categoryGroups = groupCourses(plan, catalog, 'category', courseCategories)
  const deptElectives = (plan.deptElectives ?? []).map((c) => catalog.get(c)).filter(Boolean)

  return (
    <section aria-labelledby="plan-courses-title" className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="plan-courses-title" className="font-display text-xl font-semibold text-brand-700 sm:text-2xl">
            Study plan · {plan.major} {plan.years}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Tap any course for prerequisites, what it unlocks, and to add it to your plan.</p>
        </div>
        <div role="tablist" aria-label="Plan view" className="inline-flex self-start rounded-full bg-white p-1 shadow-card ring-1 ring-inset ring-line">
          {[
            { id: 'year', label: 'By year' },
            { id: 'category', label: 'By category' },
          ].map((tab) => (
            <button key={tab.id} role="tab" type="button" aria-selected={view === tab.id} onClick={() => setView(tab.id)} className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors ${view === tab.id ? 'bg-brand-700 text-white' : 'text-ink-soft hover:text-brand-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'year' && !hasOfficialSemesters && (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800 ring-1 ring-inset ring-brand-200/60">
          <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
          The official sheet lists courses by category, not by semester. Courses here are grouped by the year level in the course number (1xx → Year 1) as a guide. Elective slots are shown in the “By category” view.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {view === 'year' &&
          yearGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 60}>
              <div className="rounded-2xl border border-line bg-white p-2 shadow-card">
                <div className="flex items-baseline justify-between px-3 pb-2 pt-3">
                  <h3 className="font-display text-lg font-semibold text-brand-700">{group.title}</h3>
                  {group.subtitle && <span className="text-xs text-ink-muted">{group.subtitle}</span>}
                </div>
                {group.semesters ? (
                  group.semesters.map((sem) => (
                    <div key={sem.term} className="mb-2">
                      <p className="px-3 pt-1 font-display text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">{sem.term} semester</p>
                      <ul className="divide-y divide-line/70">
                        {sem.courses.map((c) => (
                          <li key={c.code}><CourseRow course={c} catalog={catalog} state={state} onOpen={open} showStatus /></li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <ul className="divide-y divide-line/70">
                    {group.courses.map((c) => (
                      <li key={c.code}><CourseRow course={c} catalog={catalog} state={state} onOpen={open} showStatus /></li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

        {view === 'category' &&
          categoryGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 60} className={group.courses.length + group.slots.length > 8 ? 'md:col-span-2' : ''}>
              <div className="rounded-2xl border border-line bg-white p-2 shadow-card">
                <div className="flex items-baseline justify-between px-3 pb-2 pt-3">
                  <h3 className="font-display text-lg font-semibold text-brand-700">{group.title}</h3>
                  <span className="text-xs text-ink-muted">{group.courses.length} course{group.courses.length === 1 ? '' : 's'}{group.slots.length ? ` · ${group.slots.length} slot${group.slots.length === 1 ? '' : 's'}` : ''}</span>
                </div>
                <ul className={`divide-y divide-line/70 ${group.courses.length > 8 ? 'md:columns-2 md:gap-2 md:divide-y-0' : ''}`}>
                  {group.courses.map((c) => (
                    <li key={c.code} className="break-inside-avoid md:border-b md:border-line/70"><CourseRow course={c} catalog={catalog} state={state} onOpen={open} showStatus /></li>
                  ))}
                </ul>
                {group.slots.length > 0 && (
                  <ul className="space-y-2 p-2">
                    {group.slots.map((slot) => (
                      <li key={slot.id}><SlotRow slot={slot} catalog={catalog} onOpen={open} /></li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
      </div>

      {view === 'category' && deptElectives.length > 0 && (
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-line bg-white p-2 shadow-card">
            <div className="flex items-baseline justify-between px-3 pb-2 pt-3">
              <h3 className="font-display text-lg font-semibold text-brand-700">Department electives list</h3>
              <span className="text-xs text-ink-muted">{deptElectives.length} courses · credits not listed on the sheet</span>
            </div>
            <ul className="divide-y divide-line/70 md:columns-2 md:gap-2 md:divide-y-0">
              {deptElectives.map((c) => (
                <li key={c.code} className="break-inside-avoid md:border-b md:border-line/70"><CourseRow course={c} catalog={catalog} state={state} onOpen={open} showStatus /></li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {plan.notes?.length > 0 && (
        <ul className="mt-6 space-y-1.5 text-sm text-ink-soft">
          {plan.notes.map((n) => (
            <li key={n} className="flex gap-2"><Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />{n}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
