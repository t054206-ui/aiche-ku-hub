/**
 * =====================================================================
 *  SITE_CONFIG — the one place to change society-wide details.
 *  Anything set to "#" is a placeholder: the UI shows it as "coming soon"
 *  until a real URL is entered here.
 * =====================================================================
 */
export const SITE_CONFIG = {
  societyName: 'AIChE',
  chapterName: 'Kuwait University Student Chapter',
  shortName: 'AIChE KU',
  arabicName: 'المعهد الأمريكي للمهندسين الكيميائيين',
  university: 'Kuwait University',
  department: 'Chemical Engineering',
  academicYear: '2026/27',

  tagline: 'Everything AIChE KU, in one place.',
  description:
    'Connecting Chemical Engineering students through events, opportunities, learning, and community.',
  footerLine: 'Connecting Chemical Engineering students.',

  // Contact
  email: 'kuwait.aiche@gmail.com',
  phoneDisplay: '+965 5118 5082',
  whatsappUrl: 'https://wa.me/96551185082',

  // Social profiles
  instagramHandle: '@aiche_ku',
  instagramUrl: 'https://www.instagram.com/aiche_ku',
  linkedinUrl: 'https://www.linkedin.com/company/aiche-ku/',

  // Key destinations
  joinUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSea8EOJiGVELoelm7ri4R39gPt7npNEv0aYFtvv-rtAs_IaSg/viewform', // member registration form
  eventRegistrationUrl: '#', // TODO: general event registration form
  whatsappCommunityUrl: '#', // TODO: WhatsApp community invite link
  websiteUrl: '#', // TODO: AIChE KU website (if separate from this hub)
  feedbackUrl: '#', // TODO: feedback form URL
  membershipInfoUrl: '#', // TODO: membership information page
}

/** Navigation shown in the top bar and mobile menu. */
export const NAV_ITEMS = [
  { label: 'Home', href: '#top' },
  { label: 'Events', href: '#events' },
  { label: 'Academics', href: '#/plans' },
  { label: 'Resources', href: '#resources' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

/** Social channels — reused by the hero, "Follow AIChE KU", contact and footer. */
export const SOCIALS = [
  {
    id: 'instagram',
    label: 'Instagram',
    handle: SITE_CONFIG.instagramHandle,
    url: SITE_CONFIG.instagramUrl,
    icon: 'Instagram',
    hint: 'Announcements, stories and event recaps',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'AIChE Kuwait University',
    url: SITE_CONFIG.linkedinUrl,
    icon: 'Linkedin',
    hint: 'Professional updates and alumni network',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    handle: SITE_CONFIG.phoneDisplay,
    url: SITE_CONFIG.whatsappUrl,
    icon: 'WhatsApp',
    hint: 'Message the committee directly',
  },
  {
    id: 'email',
    label: 'Email',
    handle: SITE_CONFIG.email,
    url: `mailto:${SITE_CONFIG.email}`,
    icon: 'Mail',
    hint: 'For partnerships, sponsors and formal requests',
  },
]
