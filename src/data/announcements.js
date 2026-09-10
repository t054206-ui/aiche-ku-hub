import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  ANNOUNCEMENTS — newest first. Keep them short (one sentence).
 *  category   "NEW" | "REMINDER" | "UPDATE"
 *  date       "YYYY-MM-DD"
 *  url        optional link (internal "#events" or external)
 *  isNew      shows the pulsing NEW badge
 * =====================================================================
 */
export const ANNOUNCEMENTS = [
  {
    id: 'membership-open',
    category: 'NEW',
    date: '2026-09-08',
    text: `${SITE_CONFIG.academicYear} membership registration is now open.`,
    url: SITE_CONFIG.joinUrl,
    linkLabel: 'Join now',
    isNew: true,
  },
  {
    id: 'workshop-closing',
    category: 'REMINDER',
    date: '2026-09-07',
    text: 'Welcome Meeting registration closes soon.',
    url: '#events',
    linkLabel: 'See events',
  },
  {
    id: 'resources-added',
    category: 'UPDATE',
    date: '2026-09-01',
    text: 'New student resources have been added to the hub.',
    url: '#resources',
    linkLabel: 'Browse resources',
  },
]
