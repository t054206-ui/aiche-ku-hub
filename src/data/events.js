import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  EVENTS
 *  ⚠️  SAMPLE DATA — every entry below is a placeholder. Replace the
 *      titles, dates, times, locations and URLs with real events, and
 *      delete the ones you do not need.
 *
 *  date        "YYYY-MM-DD"
 *  startTime   "HH:MM" 24-hour (optional)        endTime  "HH:MM" (optional)
 *  status      "open" | "soon" | "closed" | "full" | "none"
 *  pinned      true → always featured in "What's happening?" (unless something is live)
 *
 *  Past events disappear automatically; the "What's happening?" panel
 *  chooses HAPPENING NOW / NEXT UP / COMING SOON from the dates.
 * =====================================================================
 */
export const EVENTS = [
  {
    id: 'welcome-meeting',
    title: 'Welcome Meeting & Membership Drive',
    date: '2026-09-16',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Location TBA · Kuwait University',
    description:
      'Meet the committee, hear what AIChE KU has planned for the year, and sign up as a member.',
    registrationUrl: SITE_CONFIG.joinUrl,
    status: 'open',
    tags: ['membership', 'social'],
  },
  {
    id: 'cv-interview-workshop',
    title: 'CV & Interview Workshop',
    date: '2026-10-06',
    startTime: '17:00',
    endTime: '19:00',
    location: 'AIChE × Injaz Kuwait · Venue TBA',
    description:
      'Build a standout CV and practise interview skills with industry mentors.',
    registrationUrl: '#',
    status: 'soon',
    tags: ['career', 'workshop'],
  },
  {
    id: 'industrial-visit',
    title: 'Industrial Visit',
    date: '2026-10-20',
    startTime: '09:00',
    endTime: '13:00',
    location: 'Meeting point TBA',
    description:
      'A guided site visit to see chemical engineering in practice. Limited seats.',
    registrationUrl: '#',
    status: 'soon',
    tags: ['industry', 'visit'],
  },
]
