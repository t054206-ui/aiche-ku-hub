import Badge from './ui/Badge'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { dateParts, formatTimeRange, relativeDayLabel, REGISTRATION_STATUS } from '../lib/events'
import { ANALYTICS_EVENTS } from '../lib/analytics'

export default function EventCard({ event, highlight = false }) {
  const { day, month, weekday } = dateParts(event.date)
  const registration = REGISTRATION_STATUS[event.status] || REGISTRATION_STATUS.open
  const relative = event.timing ? relativeDayLabel(event.timing.daysUntil) : null

  return (
    <article
      className={`group relative flex gap-4 rounded-2xl border bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:gap-6 sm:p-6 ${
        highlight ? 'border-brand-200' : 'border-line hover:border-brand-200'
      }`}
    >
      {/* Date block */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 py-3 text-brand-700 sm:w-20">
        <span className="font-display text-[11px] font-semibold uppercase tracking-widest text-brand-500">{weekday}</span>
        <span className="font-display text-3xl font-semibold leading-none sm:text-4xl">{day}</span>
        <span className="font-display text-xs font-semibold uppercase tracking-widest">{month}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={registration.tone}>{registration.label}</Badge>
          {relative && <span className="font-display text-xs font-semibold uppercase tracking-wider text-brand-600">{relative}</span>}
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">{event.title}</h3>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
          <li className="flex items-center gap-1.5">
            <Icon name="Clock" className="h-4 w-4 text-brand-400" />
            {formatTimeRange(event.startTime, event.endTime)}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="MapPin" className="h-4 w-4 text-brand-400" />
            {event.location}
          </li>
        </ul>
        {event.description && <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{event.description}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {registration.cta ? (
            <Button
              size="sm"
              variant={event.status === 'open' ? 'primary' : 'outline'}
              href={event.registrationUrl}
              trackAs={ANALYTICS_EVENTS.EVENT_REGISTER}
              trackMeta={{ eventId: event.id, source: 'events-list' }}
            >
              {registration.cta}
              <Icon name="ArrowUpRight" className="h-4 w-4" />
            </Button>
          ) : (
            <span className="font-display text-sm text-ink-muted">{registration.label}</span>
          )}
          {event.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
              {event.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-muted">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}
