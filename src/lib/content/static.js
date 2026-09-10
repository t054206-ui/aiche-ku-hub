/** The bundled content from src/data, in the shape ContentProvider hands to components. */
import { SITE_CONFIG, NAV_ITEMS, SOCIALS } from '../../data/site'
import { LINK_GROUPS } from '../../data/links'
import { EVENTS } from '../../data/events'
import { ANNOUNCEMENTS } from '../../data/announcements'
import { ABOUT } from '../../data/about'
import { RESOURCE_CATEGORIES } from '../../data/resources'
import { TEAM } from '../../data/team'
import { OUR_YEAR } from '../../data/stats'
import { GALLERY } from '../../data/gallery'
import { COURSE_CATALOG, COURSE_CATEGORIES } from '../../data/academic/courses'
import { ACADEMIC_PLANS } from '../../data/academic/plans'
import { ASSISTANT } from '../../data/academic/assistant'

export const STATIC_CONTENT = {
  source: 'static',
  loadedAt: null,
  site: SITE_CONFIG,
  navItems: NAV_ITEMS,
  socials: SOCIALS,
  linkGroups: LINK_GROUPS,
  events: EVENTS,
  announcements: ANNOUNCEMENTS,
  about: ABOUT,
  resources: RESOURCE_CATEGORIES,
  team: TEAM,
  ourYear: OUR_YEAR,
  gallery: GALLERY,
  courses: COURSE_CATALOG,
  courseCategories: COURSE_CATEGORIES,
  plans: ACADEMIC_PLANS,
  assistant: ASSISTANT,
}
