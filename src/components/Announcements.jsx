import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Badge from './ui/Badge'
import SmartLink from './ui/SmartLink'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { formatEventDate } from '../lib/events'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const CATEGORY_STYLE = {
  NEW: { tone: 'info', bar: 'bg-brand-500' },
  REMINDER: { tone: 'warn', bar: 'bg-amber-400' },
  UPDATE: { tone: 'soft', bar: 'bg-brand-300' },
}

export default function Announcements() {
  const { announcements: ANNOUNCEMENTS } = useContent()
  if (ANNOUNCEMENTS.length === 0) return null

  return (
    <Section id="announcements" aria-labelledby="announcements-title">
      <SectionHeading id="announcements-title" eyebrow="Announcements" title="Latest from the committee" />
      <ol className="mt-8 grid grid-cols-1 gap-3">
        {ANNOUNCEMENTS.map((a, i) => {
          const style = CATEGORY_STYLE[a.category] || CATEGORY_STYLE.UPDATE
          return (
            <Reveal as="li" key={a.id} delay={i * 70}>
              <article className="relative flex gap-4 overflow-hidden rounded-2xl border border-line bg-white p-4 shadow-card sm:items-center sm:p-5">
                <span className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} aria-hidden="true" />
                <div className="min-w-0 flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={style.tone} dot={a.isNew}>
                      {a.category}
                    </Badge>
                    <time dateTime={a.date} className="text-xs text-ink-muted">
                      {formatEventDate(a.date, 'short')}
                    </time>
                  </div>
                  <p className="mt-2 text-[15px] font-medium leading-snug text-ink sm:text-base">{a.text}</p>
                </div>
                {a.url && (
                  <SmartLink
                    href={a.url}
                    trackAs={ANALYTICS_EVENTS.LINK_CLICK}
                    trackMeta={{ id: `announcement:${a.id}`, source: 'announcements' }}
                    className="hidden shrink-0 items-center gap-1 font-display text-sm font-semibold text-brand-700 hover:text-brand-500 sm:inline-flex"
                  >
                    {a.linkLabel || 'Open'}
                    <Icon name="ChevronRight" className="h-4 w-4" />
                  </SmartLink>
                )}
                {a.url && (
                  <SmartLink
                    href={a.url}
                    aria-label={a.linkLabel || 'Open'}
                    trackAs={ANALYTICS_EVENTS.LINK_CLICK}
                    trackMeta={{ id: `announcement:${a.id}`, source: 'announcements' }}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-brand-50 text-brand-700 sm:hidden"
                  >
                    <Icon name="ChevronRight" className="h-5 w-5" />
                  </SmartLink>
                )}
              </article>
            </Reveal>
          )
        })}
      </ol>
    </Section>
  )
}
