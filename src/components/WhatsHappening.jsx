import { useMemo } from 'react'
import Badge from './ui/Badge'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { EVENTS, SITE_CONFIG } from '../data'
import { formatEventDate, formatTimeRange, getFeaturedEvent, relativeDayLabel, REGISTRATION_STATUS } from '../lib/events'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const STATUS_TONE = { now: 'live', next: 'info', soon: 'soft', none: 'soft' }

/**
 * "WHAT'S HAPPENING AT AICHE?" — the live panel overlapping the hero.
 * Chooses HAPPENING NOW / NEXT UP / COMING SOON from the event dates.
 */
export default function WhatsHappening() {
  const { event, status, label } = useMemo(() => getFeaturedEvent(EVENTS, new Date()), [])
  const registration = event ? REGISTRATION_STATUS[event.status] || REGISTRATION_STATUS.open : null
  const relative = event ? relativeDayLabel(event.timing.daysUntil) : null

  return (
    <section id="now" aria-labelledby="now-title" className="container-hub relative z-10 -mt-14 sm:-mt-16">
      <div className="animate-fade-up rounded-2xl border border-line bg-white p-5 shadow-lift sm:p-7" style={{ animationDelay: '360ms' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="now-title" className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            What&apos;s happening at AIChE?
          </h2>
          <Badge tone={STATUS_TONE[status]} dot={status !== 'none'}>
            {label}
          </Badge>
        </div>

        {event ? (
          <div className="mt-4 gap-6 sm:flex sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-semibold leading-tight text-brand-700 sm:text-3xl">
                {event.title}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                <li className="flex items-center gap-1.5">
                  <Icon name="CalendarDays" className="h-4 w-4 text-brand-500" />
                  <span>
                    {formatEventDate(event.date)}
                    {relative && <span className="ml-1.5 font-medium text-brand-600">· {relative}</span>}
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Icon name="Clock" className="h-4 w-4 text-brand-500" />
                  {formatTimeRange(event.startTime, event.endTime)}
                </li>
                <li className="flex items-center gap-1.5">
                  <Icon name="MapPin" className="h-4 w-4 text-brand-500" />
                  {event.location}
                </li>
              </ul>
              {event.description && <p className="mt-3 max-w-prose text-[15px] text-ink-soft">{event.description}</p>}
            </div>

            <div className="mt-5 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0 sm:flex-col sm:items-end">
              {registration.cta ? (
                <Button
                  href={event.registrationUrl}
                  size="lg"
                  variant={status === 'now' ? 'accent' : 'primary'}
                  trackAs={ANALYTICS_EVENTS.EVENT_REGISTER}
                  trackMeta={{ eventId: event.id, source: 'whats-happening' }}
                  className="w-full sm:w-auto"
                >
                  {status === 'now' ? 'Register now' : registration.cta}
                  <Icon name="ArrowUpRight" className="h-4 w-4" />
                </Button>
              ) : (
                <Badge tone={registration.tone}>{registration.label}</Badge>
              )}
              <Button variant="ghost" size="sm" href="#events">
                All events
                <Icon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 gap-6 sm:flex sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-semibold text-brand-700 sm:text-3xl">Something exciting is coming…</h3>
              <p className="mt-2 max-w-prose text-[15px] text-ink-soft">
                New events are announced first on Instagram. Follow {SITE_CONFIG.instagramHandle} so you don&apos;t miss out.
              </p>
            </div>
            <Button
              href={SITE_CONFIG.instagramUrl}
              variant="outline"
              className="mt-5 sm:mt-0"
              trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
              trackMeta={{ id: 'instagram', source: 'whats-happening' }}
            >
              <Icon name="Instagram" className="h-4 w-4" />
              Follow on Instagram
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
