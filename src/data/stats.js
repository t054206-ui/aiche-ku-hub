/**
 * =====================================================================
 *  OUR YEAR — activity categories with optional numbers.
 *  Leave `value` as null until you have a real figure; the card then
 *  shows the description only. Example: value: 12
 * =====================================================================
 */
export const OUR_YEAR = {
  eyebrow: 'Our year',
  title: 'AIChE KU in action',
  description: 'Active across the whole academic year, from welcome week to the closing ceremony.',
  note: 'Figures are updated by the committee each semester.',
  stats: [
    { id: 'events', label: 'Events', value: null, icon: 'CalendarDays', text: 'Talks, meetups and socials across both semesters.' },
    { id: 'workshops', label: 'Workshops', value: null, icon: 'Wrench', text: 'Hands-on skills sessions led by students and professionals.' },
    { id: 'visits', label: 'Industrial visits', value: null, icon: 'Factory', text: "Site visits to Kuwait's process industries." },
    { id: 'volunteering', label: 'Volunteering', value: null, icon: 'HeartHandshake', text: 'Community and campus initiatives.' },
    { id: 'competitions', label: 'Competitions', value: null, icon: 'Trophy', text: 'Local and regional AIChE challenges.' },
  ],
}
