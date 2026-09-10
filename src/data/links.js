import { SITE_CONFIG } from './site'

/**
 * =====================================================================
 *  LINK_GROUPS — the main link hub, organised by category.
 *  • Reorder groups or links by moving them in this array.
 *  • `icon` is a name from src/components/ui/Icon.jsx.
 *  • `featured: true` renders a link as the big filled call-to-action.
 *  • Internal anchors like "#events" scroll on the page instead of leaving it.
 * =====================================================================
 */
export const LINK_GROUPS = [
  {
    id: 'essential',
    title: 'Most important',
    links: [
      {
        id: 'join',
        title: 'Join AIChE',
        subtitle: `Become a member for ${SITE_CONFIG.academicYear}`,
        url: SITE_CONFIG.joinUrl,
        icon: 'UserPlus',
        featured: true,
      },
      {
        id: 'upcoming-events',
        title: 'Upcoming events',
        subtitle: 'See what is on this month',
        url: '#events',
        icon: 'CalendarDays',
      },
      {
        id: 'event-registration',
        title: 'Event registration',
        subtitle: 'Register for the next event',
        url: SITE_CONFIG.eventRegistrationUrl,
        icon: 'Ticket',
      },
    ],
  },
  {
    id: 'connect',
    title: 'Connect',
    links: [
      {
        id: 'instagram',
        title: 'Instagram',
        subtitle: SITE_CONFIG.instagramHandle,
        url: SITE_CONFIG.instagramUrl,
        icon: 'Instagram',
      },
      {
        id: 'linkedin',
        title: 'LinkedIn',
        subtitle: 'Follow the chapter page',
        url: SITE_CONFIG.linkedinUrl,
        icon: 'Linkedin',
      },
      {
        id: 'whatsapp-community',
        title: 'WhatsApp community',
        subtitle: 'Join the student group',
        url: SITE_CONFIG.whatsappCommunityUrl,
        icon: 'WhatsApp',
      },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      {
        id: 'student-resources',
        title: 'Student resources',
        subtitle: 'Study, career and opportunity links',
        url: '#resources',
        icon: 'BookOpen',
      },
      {
        id: 'aiche-resources',
        title: 'AIChE resources',
        subtitle: 'Materials from the global institute',
        url: '#resources',
        icon: 'Library',
      },
      {
        id: 'membership',
        title: 'Membership',
        subtitle: 'Benefits and how to sign up',
        url: SITE_CONFIG.membershipInfoUrl,
        icon: 'BadgeCheck',
      },
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    links: [
      {
        id: 'email',
        title: 'Email us',
        subtitle: SITE_CONFIG.email,
        url: `mailto:${SITE_CONFIG.email}`,
        icon: 'Mail',
      },
      {
        id: 'feedback',
        title: 'Feedback form',
        subtitle: 'Tell us what to improve',
        url: SITE_CONFIG.feedbackUrl,
        icon: 'MessageSquareText',
      },
      {
        id: 'website',
        title: 'AIChE KU website',
        subtitle: 'The full chapter website',
        url: SITE_CONFIG.websiteUrl,
        icon: 'Globe',
      },
    ],
  },
]
