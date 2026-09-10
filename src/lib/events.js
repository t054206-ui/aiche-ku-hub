/**
 * Date helpers for events. Events store a plain ISO date ("2026-10-06") plus
 * optional "HH:MM" start/end times, interpreted in the visitor's local time
 * (for students in Kuwait that is Kuwait time).
 */

const DAY_MS = 24 * 60 * 60 * 1000
const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000 // assume 3 hours when no end time is given

/** How many days ahead an event counts as "Next up" (otherwise "Coming soon"). */
export const FEATURED_WINDOW_DAYS = 14

export const REGISTRATION_STATUS = {
  open: { label: 'Registration open', tone: 'success', cta: 'Register' },
  soon: { label: 'Registration opens soon', tone: 'info', cta: 'Notify me' },
  closed: { label: 'Registration closed', tone: 'neutral', cta: null },
  full: { label: 'Fully booked', tone: 'warn', cta: null },
  none: { label: 'No registration needed', tone: 'soft', cta: 'Add to calendar' },
}

function toDate(date, time) {
  return new Date(`${date}T${time || '00:00'}:00`)
}

export function getEventTiming(event, now = new Date()) {
  const start = toDate(event.date, event.startTime)
  const end = event.endTime
    ? toDate(event.date, event.endTime)
    : new Date(start.getTime() + DEFAULT_DURATION_MS)

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const startDay = new Date(start)
  startDay.setHours(0, 0, 0, 0)
  const daysUntil = Math.round((startDay - startOfToday) / DAY_MS)

  return {
    start,
    end,
    daysUntil,
    isToday: daysUntil === 0,
    isNow: now >= start && now <= end,
    isPast: now > end,
  }
}

export function getUpcomingEvents(events, now = new Date(), limit = 3) {
  return events
    .map((event) => ({ ...event, timing: getEventTiming(event, now) }))
    .filter((event) => !event.timing.isPast)
    .sort((a, b) => a.timing.start - b.timing.start)
    .slice(0, limit)
}

/**
 * Picks the event for the "What's happening?" panel.
 * Priority: happening right now → pinned → soonest upcoming.
 * Returns { event, status: 'now' | 'next' | 'soon' | 'none', label }.
 */
export function getFeaturedEvent(events, now = new Date()) {
  const upcoming = getUpcomingEvents(events, now, Infinity)
  const event =
    upcoming.find((e) => e.timing.isNow) ||
    upcoming.find((e) => e.pinned) ||
    upcoming[0]

  if (!event) return { event: null, status: 'none', label: 'Next up' }
  if (event.timing.isNow) return { event, status: 'now', label: 'Happening now' }
  if (event.timing.daysUntil <= FEATURED_WINDOW_DAYS) return { event, status: 'next', label: 'Next up' }
  return { event, status: 'soon', label: 'Coming soon' }
}

/* ---------- formatting ---------- */

export function formatEventDate(date, style = 'long') {
  const d = toDate(date, '12:00')
  if (style === 'short') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatTime(time) {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function formatTimeRange(startTime, endTime) {
  if (!startTime) return 'Time TBA'
  return endTime ? `${formatTime(startTime)} – ${formatTime(endTime)}` : formatTime(startTime)
}

export function dateParts(date) {
  const d = toDate(date, '12:00')
  return {
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }),
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }),
  }
}

export function relativeDayLabel(daysUntil) {
  if (daysUntil === 0) return 'Today'
  if (daysUntil === 1) return 'Tomorrow'
  if (daysUntil > 1 && daysUntil <= 7) return `In ${daysUntil} days`
  return null
}
