import { useId, useMemo, useState } from 'react'
import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import SmartLink, { isPlaceholder } from './ui/SmartLink'
import Icon from './ui/Icon'
import { searchResources } from '../data/resources'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

function ResourceRow({ item, categoryTitle }) {
  const placeholder = isPlaceholder(item.url)
  return (
    <SmartLink
      href={item.url}
      trackAs={ANALYTICS_EVENTS.RESOURCE_CLICK}
      trackMeta={{ id: item.id, category: categoryTitle }}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-brand-50"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-medium text-ink group-hover:text-brand-700">{item.title}</span>
        {item.description && <span className="block text-sm text-ink-muted">{item.description}</span>}
      </span>
      {placeholder ? (
        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-brand-500 group-hover:bg-white">
          Soon
        </span>
      ) : (
        <Icon name={item.url.startsWith('#') ? 'ChevronRight' : 'ArrowUpRight'} className="h-4 w-4 shrink-0 text-brand-300 group-hover:text-brand-700" />
      )}
    </SmartLink>
  )
}

function CategoryCard({ category, open, onToggle, index }) {
  const panelId = `resources-${category.id}`
  return (
    <Reveal as="li" delay={index * 60}>
      <div className={`rounded-2xl border bg-white shadow-card transition-colors ${open ? 'border-brand-200' : 'border-line'}`}>
        <button
          type="button"
          className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${open ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700'}`}>
            <Icon name={category.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-semibold text-ink sm:text-lg">{category.title}</span>
            <span className="block text-sm text-ink-muted">{category.blurb}</span>
          </span>
          <span className="flex items-center gap-2 text-ink-muted">
            <span className="hidden text-xs sm:inline">{category.items.length} links</span>
            <Icon name="ChevronDown" className={`h-5 w-5 transition-transform duration-300 ${open ? 'rotate-180 text-brand-700' : ''}`} />
          </span>
        </button>
        <div id={panelId} hidden={!open} className="border-t border-line px-2 py-2">
          <ul className="divide-y divide-line/70">
            {category.items.map((item) => (
              <li key={item.id}>
                <ResourceRow item={item} categoryTitle={category.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  )
}

export default function Resources() {
  const { resources: RESOURCE_CATEGORIES } = useContent()
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(RESOURCE_CATEGORIES[0]?.id ?? null)
  const inputId = useId()
  const results = useMemo(() => searchResources(query, RESOURCE_CATEGORIES), [query, RESOURCE_CATEGORIES])
  const searching = query.trim().length > 0

  return (
    <Section id="resources" aria-labelledby="resources-title">
      <SectionHeading
        id="resources-title"
        eyebrow="Student resources"
        title="A resource centre for ChE students"
        description="Study help, career prep, AIChE materials and opportunities — curated by the committee."
      />

      <div className="mt-8">
        <label htmlFor={inputId} className="sr-only">
          Search AIChE resources
        </label>
        <div className="relative">
          <Icon name="Search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AIChE resources… e.g. CV, internship, competition"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-line bg-white pl-12 pr-4 font-sans text-[15px] text-ink shadow-card placeholder:text-ink-muted/80 focus:border-brand-300"
          />
        </div>
      </div>

      {searching ? (
        <div className="mt-6 rounded-2xl border border-line bg-white p-2 shadow-card" role="region" aria-live="polite">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wider text-ink-muted">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {results.length > 0 ? (
            <ul className="divide-y divide-line/70">
              {results.map((item) => (
                <li key={`${item.category.id}-${item.id}`}>
                  <ResourceRow item={item} categoryTitle={item.category.title} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 pb-4 pt-2 text-sm text-ink-soft">
              No matches. Try “CV”, “internship”, “workshop”, “membership” or “competition”.
            </p>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {RESOURCE_CATEGORIES.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              open={openId === category.id}
              onToggle={() => setOpenId((current) => (current === category.id ? null : category.id))}
            />
          ))}
        </ul>
      )}
    </Section>
  )
}
