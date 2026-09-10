/**
 * =====================================================================
 *  RESOURCES — grouped by category. Each item can carry tags to help
 *  the search box. URLs set to "#" show as "coming soon".
 * =====================================================================
 */
export const RESOURCE_CATEGORIES = [
  {
    id: 'chemeng',
    title: 'Chemical Engineering',
    icon: 'FlaskConical',
    blurb: 'Study support and tools for coursework.',
    items: [
      { id: 'major-sheets', title: 'Major sheets & academic plans', description: 'Your study plan by academic year, with prerequisites for every course.', url: '#/plans', tags: ['major sheet', 'plan', 'prerequisites', 'courses', 'academic year'] },
      { id: 'planner', title: 'Plan my semester', description: 'AI-assisted semester planning based on your major sheet.', url: '#/planner', tags: ['schedule', 'semester', 'assistant', 'planner', 'registration'] },
      { id: 'study', title: 'Study resources', description: 'Notes, past papers and study guides shared by members.', url: '#', tags: ['study', 'notes', 'exam'] },
      { id: 'websites', title: 'Useful websites', description: 'Reference sites every ChE student should bookmark.', url: '#', tags: ['reference', 'websites'] },
      { id: 'tools', title: 'Engineering tools', description: 'Calculators, property databases and simulation software.', url: '#', tags: ['tools', 'software', 'simulation'] },
    ],
  },
  {
    id: 'career',
    title: 'Career',
    icon: 'Briefcase',
    blurb: 'Get ready for internships and your first role.',
    items: [
      { id: 'internships', title: 'Internship opportunities', description: 'Openings and how to apply.', url: '#', tags: ['internship', 'training', 'jobs'] },
      { id: 'cv', title: 'CV resources', description: 'Templates and tips for an engineering CV.', url: '#', tags: ['cv', 'resume'] },
      { id: 'interview', title: 'Interview resources', description: 'Common questions and preparation guides.', url: '#', tags: ['interview', 'preparation'] },
      { id: 'platforms', title: 'Career platforms', description: 'Where to find graduate programmes and roles.', url: '#', tags: ['jobs', 'platforms', 'linkedin'] },
    ],
  },
  {
    id: 'aiche',
    title: 'AIChE',
    icon: 'Library',
    blurb: 'Make the most of the global institute.',
    items: [
      { id: 'aiche-resources', title: 'AIChE resources', description: 'Learning materials, webinars and publications.', url: '#', tags: ['aiche', 'learning', 'webinar'] },
      { id: 'aiche-membership', title: 'Membership', description: 'Benefits of AIChE membership and how to join.', url: '#', tags: ['membership', 'join'] },
      { id: 'aiche-competitions', title: 'Competitions', description: 'Chem-E-Car, design competitions and more.', url: '#', tags: ['competition', 'chem-e-car'] },
    ],
  },
  {
    id: 'opportunities',
    title: 'Opportunities',
    icon: 'Sparkles',
    blurb: 'Ways to grow outside the classroom.',
    items: [
      { id: 'competitions', title: 'Competitions', description: 'Local and regional challenges open to students.', url: '#', tags: ['competition'] },
      { id: 'volunteering', title: 'Volunteering', description: 'Help run chapter events and community initiatives.', url: '#', tags: ['volunteering', 'community'] },
      { id: 'workshops', title: 'Workshops', description: 'Upcoming skill sessions you can register for.', url: '#events', tags: ['workshop', 'training'] },
      { id: 'scholarships', title: 'Scholarships', description: 'Funding and awards for engineering students.', url: '#', tags: ['scholarship', 'funding', 'award'] },
    ],
  },
]

/** Flat list used by the search box. */
export function searchResources(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const results = []
  for (const category of RESOURCE_CATEGORIES) {
    for (const item of category.items) {
      const haystack = [item.title, item.description, category.title, ...(item.tags || [])]
        .join(' ')
        .toLowerCase()
      if (haystack.includes(q)) results.push({ ...item, category })
    }
  }
  return results
}
