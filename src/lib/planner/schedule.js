/**
 * FUTURE: live class sections.
 *
 * Nothing on the site uses real section data yet — the university timetable is
 * not connected. When it is, sections should be loaded (from a CMS/API) in this
 * shape and the assistant can start applying time/day preferences and detecting
 * conflicts. The helpers below are generic and already tested against this shape.
 *
 * section = {
 *   id: 'S1', courseCode: '0640343', section: '01', instructor: 'TBA',
 *   room: 'TBA', meetings: [{ day: 'Sunday', start: '08:00', end: '09:15' }],
 *   capacity: 30, enrolled: 12,
 * }
 */

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function meetingsOverlap(a, b) {
  return a.day === b.day && toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end)
}

/** Returns pairs of sections that clash. */
export function detectConflicts(sections) {
  const conflicts = []
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const clash = sections[i].meetings.some((m) => sections[j].meetings.some((n) => meetingsOverlap(m, n)))
      if (clash) conflicts.push([sections[i], sections[j]])
    }
  }
  return conflicts
}

/** Does a section respect the student's time/day preferences? */
export function matchesPreferences(section, prefs) {
  const earliest = prefs.earliest ? toMinutes(prefs.earliest) : 0
  const latest = prefs.latest ? toMinutes(prefs.latest) : 24 * 60
  return section.meetings.every((m) => !prefs.avoidDays?.includes(m.day) && toMinutes(m.start) >= earliest && toMinutes(m.end) <= latest)
}
