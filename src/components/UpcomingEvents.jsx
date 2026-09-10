import { useMemo } from 'react'
import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import EventCard from './EventCard'
import { EVENTS, SITE_CONFIG } from '../data'
import { getUpcomingEvents } from '../lib/events'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const MAX_EVENTS = 3

export default function UpcomingEvents() {
  const upcoming = useMemo(() => getUpcomingEvents(EVENTS, new Date(), MAX_EVENTS), [])

  return (
    <Section id="events" tone="white" aria-labelledby="events-title">
      <SectionHeading
        id="events-title"
        eyebrow="Upcoming events"
        title="What's on this semester"
        description="Workshops, visits and meetups — register early, seats are limited."
        action={
          <Button
            variant="outline"
            size="sm"
            href={SITE_CONFIG.instagramUrl}
            trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
            trackMeta={{ id: 'instagram', source: 'events' }}
          >
            <Icon name="Instagram" className="h-4 w-4" />
            Event updates
          </Button>
        }
      />

      {upcoming.length > 0 ? (
        <ol className="mt-8 grid grid-cols-1 gap-4">
          {upcoming.map((event, i) => (
            <Reveal as="li" key={event.id} delay={i * 80}>
              <EventCard event={event} highlight={i === 0} />
            </Reveal>
          ))}
        </ol>
      ) : (
        <Reveal className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-8 text-center">
          <Icon name="CalendarDays" className="mx-auto h-8 w-8 text-brand-300" />
          <p className="mt-3 font-display text-lg font-semibold text-brand-700">No events scheduled yet</p>
          <p className="mt-1 text-sm text-ink-soft">New events are announced on Instagram first.</p>
        </Reveal>
      )}

      <p className="mt-6 text-sm text-ink-muted">
        Events are added throughout the semester. Follow {SITE_CONFIG.instagramHandle} for the latest.
      </p>
    </Section>
  )
}
