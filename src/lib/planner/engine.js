/**
 * Planning engine — pure functions over the course catalog and a student state.
 * It only reasons about what the major sheet says (prerequisites, co-requisites,
 * credit thresholds). It knows nothing about class sections or times yet; see
 * ./schedule.js for the future live-schedule layer.
 *
 * state = {
 *   completed:  Set<code>,
 *   inProgress: Set<code>,
 *   pinned:     Set<code>,   // courses the student added from the explorer
 * }
 */
import { COURSE_CATALOG, COURSE_CATEGORIES, courseLevel } from '../../data/academic/courses'

/** Build the effective catalog for a plan (base catalog + plan overrides + membership flags). */
export function buildCatalog(plan) {
  const map = new Map()
  for (const base of COURSE_CATALOG) {
    const override = plan?.overrides?.[base.code] ?? {}
    map.set(base.code, { ...base, ...override, level: courseLevel(base.code), compulsory: false, electiveGroup: null, inPlan: false })
  }
  if (plan) {
    for (const group of plan.requirements) {
      for (const code of group.courses ?? []) {
        const course = map.get(code)
        if (course) Object.assign(course, { compulsory: true, inPlan: true, requirementGroup: group.id })
      }
      for (const slot of group.slots ?? []) {
        const codes = slot.chooseFrom === 'dept-electives' ? plan.deptElectives : Array.isArray(slot.chooseFrom) ? slot.chooseFrom : []
        for (const code of codes) {
          const course = map.get(code)
          if (course && !course.compulsory) Object.assign(course, { inPlan: true, electiveGroup: slot.id, requirementGroup: group.id })
        }
      }
    }
    for (const code of plan.deptElectives ?? []) {
      const course = map.get(code)
      if (course && !course.compulsory) course.inPlan = true
    }
  }
  return map
}

export const displayName = (course) => course?.short || course?.name || 'Unknown course'

export function requirementText(reqItem, catalog) {
  const name = (code) => {
    const course = catalog.get(code)
    return course ? `${displayName(course)} (${code})` : code
  }
  switch (reqItem.type) {
    case 'course':
      return name(reqItem.code)
    case 'anyOf':
      return reqItem.codes.map(name).join(' or ')
    case 'credits':
      return `Complete ${reqItem.min} credits`
    case 'gpa':
      return `Minimum GPA of ${reqItem.min.toFixed(2)}`
    case 'note':
      return reqItem.text
    default:
      return 'Unknown requirement'
  }
}

export function completedCredits(state, catalog) {
  let total = 0
  for (const code of state.completed) total += catalog.get(code)?.credits ?? 0
  return total
}

/** Prerequisite check. Returns { met: true | false | null (cannot be checked), text }. */
export function checkPrerequisite(reqItem, state, catalog) {
  const text = requirementText(reqItem, catalog)
  switch (reqItem.type) {
    case 'course':
      return { met: state.completed.has(reqItem.code), text }
    case 'anyOf':
      return { met: reqItem.codes.some((code) => state.completed.has(code)), text }
    case 'credits':
      return { met: completedCredits(state, catalog) >= reqItem.min, text: `${text} (you have marked ${completedCredits(state, catalog)})` }
    case 'gpa':
    case 'note':
      return { met: null, text: `${text} — not checked by this tool` }
    default:
      return { met: null, text }
  }
}

/** Co-requisite check: satisfied if completed, in progress, or taken in the same semester. */
export function checkCorequisite(reqItem, state, catalog, concurrent = new Set()) {
  const has = (code) => state.completed.has(code) || state.inProgress.has(code) || concurrent.has(code)
  const text = requirementText(reqItem, catalog)
  if (reqItem.type === 'course') return { met: has(reqItem.code), text }
  if (reqItem.type === 'anyOf') return { met: reqItem.codes.some(has), text }
  return checkPrerequisite(reqItem, state, catalog)
}

/**
 * Eligibility of one course for next semester.
 * status: completed | in-progress | eligible | needs-coreq | blocked
 */
export function getEligibility(course, state, catalog, concurrent = new Set()) {
  if (state.completed.has(course.code)) return { status: 'completed', missingPre: [], missingCo: [], unchecked: [] }
  if (state.inProgress.has(course.code)) return { status: 'in-progress', missingPre: [], missingCo: [], unchecked: [] }

  const pre = (course.prerequisites ?? []).map((r) => ({ ...r, ...checkPrerequisite(r, state, catalog) }))
  const co = (course.corequisites ?? []).map((r) => ({ ...r, ...checkCorequisite(r, state, catalog, concurrent) }))
  const missingPre = pre.filter((r) => r.met === false)
  const missingCo = co.filter((r) => r.met === false)
  const unchecked = [...pre, ...co].filter((r) => r.met === null)

  if (missingPre.length) return { status: 'blocked', missingPre, missingCo, unchecked }
  if (missingCo.length) return { status: 'needs-coreq', missingPre, missingCo, unchecked }
  return { status: 'eligible', missingPre, missingCo, unchecked }
}

/** Courses in the plan that list `code` as a prerequisite or co-requisite. */
export function directDependents(code, catalog) {
  const out = []
  for (const course of catalog.values()) {
    if (!course.inPlan) continue
    const mentions = (list) => (list ?? []).some((r) => (r.type === 'course' && r.code === code) || (r.type === 'anyOf' && r.codes.includes(code)))
    if (mentions(course.prerequisites)) out.push({ course, via: 'prerequisite' })
    else if (mentions(course.corequisites)) out.push({ course, via: 'corequisite' })
  }
  return out
}

/** Everything downstream of `code` (compulsory courses only), with the longest prerequisite chain length. */
export function transitiveDependents(code, catalog) {
  const seen = new Map()
  const walk = (current, depth) => {
    for (const { course, via } of directDependents(current, catalog)) {
      if (!course.compulsory) continue
      const prev = seen.get(course.code)
      if (!prev || prev.depth < depth) seen.set(course.code, { course, depth, via })
      if (!prev) walk(course.code, depth + 1)
    }
  }
  walk(code, 1)
  const list = [...seen.values()].sort((a, b) => a.depth - b.depth || a.course.level - b.course.level)
  return { list, chainLength: list.reduce((m, d) => Math.max(m, d.depth), 0) }
}

const LAB_PATTERN = /\blab(oratory)?\b/i
const isLab = (course) => LAB_PATTERN.test(course.name)

/** Which compulsory lecture a lab belongs to (its co-requisite or prerequisite lecture, if any). */
function pairedLecture(lab, catalog) {
  const candidates = [...(lab.corequisites ?? []), ...(lab.prerequisites ?? [])].filter((r) => r.type === 'course').map((r) => catalog.get(r.code))
  return candidates.find((c) => c && !isLab(c) && c.name.split(' ')[0] === lab.name.split(' ')[0]) ?? null
}

/**
 * Suggest a semester.
 * Priority: pinned courses → courses that unlock the most downstream courses → lower level first.
 * Labs are paired with their lecture. Elective slots fill the remaining load.
 */
export function suggestSemester(plan, catalog, state, prefs) {
  const target = Math.max(1, Math.min(8, Number(prefs.courseCount) || 4))
  const notes = []
  const chosen = []
  const chosenSet = new Set()

  const remaining = [...catalog.values()].filter((c) => c.compulsory && !state.completed.has(c.code) && !state.inProgress.has(c.code))

  const score = (course) => {
    const unlock = transitiveDependents(course.code, catalog).list.length
    let s = unlock * 2 + (5 - course.level) * 1.5
    if (state.pinned.has(course.code)) s += 100
    if (isLab(course)) s -= 1
    return s
  }

  const eligibleNow = () =>
    remaining
      .filter((c) => !chosenSet.has(c.code))
      .map((c) => ({ course: c, elig: getEligibility(c, state, catalog, chosenSet) }))
      .filter(({ elig }) => elig.status === 'eligible' || elig.status === 'needs-coreq')

  const add = (course, reasons) => {
    if (chosenSet.has(course.code) || chosen.length >= target) return false
    chosen.push({ course, reasons })
    chosenSet.add(course.code)
    return true
  }

  // Pinned courses first — but only if they are actually available.
  for (const code of state.pinned) {
    const course = catalog.get(code)
    if (!course || state.completed.has(code) || state.inProgress.has(code)) continue
    const elig = getEligibility(course, state, catalog, chosenSet)
    if (elig.status === 'blocked') {
      notes.push(`${displayName(course)} (${code}) is on your list, but its prerequisites are not complete: ${elig.missingPre.map((r) => r.text).join(', ')}.`)
    } else {
      add(course, ['You added this course to your plan.', ...(elig.status === 'needs-coreq' ? [`Take it together with ${elig.missingCo.map((r) => r.text).join(' and ')}.`] : [])])
    }
  }

  // Greedy fill with the highest-value eligible compulsory courses.
  let guard = 0
  while (chosen.length < target && guard++ < 50) {
    const options = eligibleNow()
    if (!options.length) break
    // Prefer courses whose co-requisites are already satisfiable this semester.
    options.sort((a, b) => {
      const aReady = a.elig.status === 'eligible' ? 1 : 0
      const bReady = b.elig.status === 'eligible' ? 1 : 0
      if (aReady !== bReady) return bReady - aReady
      return score(b.course) - score(a.course)
    })
    const { course, elig } = options[0]

    if (elig.status === 'needs-coreq') {
      // Only take it if every missing co-requisite can be taken now too.
      const coCourses = elig.missingCo.flatMap((r) => (r.type === 'course' ? [catalog.get(r.code)] : r.codes.map((x) => catalog.get(x)))).filter(Boolean)
      const room = target - chosen.length
      const coEligible = coCourses.every((cc) => cc && getEligibility(cc, state, catalog, chosenSet).status !== 'blocked')
      if (!coEligible || coCourses.length + 1 > room) {
        // Skip this one for now by marking it unavailable this round.
        remaining.splice(remaining.indexOf(course), 1)
        continue
      }
      add(course, reasonsFor(course, state, catalog, chosenSet, `Taken together with its co-requisite ${coCourses.map(displayName).join(', ')}.`))
      for (const cc of coCourses) add(cc, [`Co-requisite of ${displayName(course)}.`, ...reasonsFor(cc, state, catalog, chosenSet)])
    } else {
      add(course, reasonsFor(course, state, catalog, chosenSet))
    }

    // Pair a lab with its lecture when the lab is available.
    if (!isLab(course)) {
      const lab = remaining.find((c) => isLab(c) && !chosenSet.has(c.code) && pairedLecture(c, catalog)?.code === course.code)
      if (lab && chosen.length < target && getEligibility(lab, state, catalog, chosenSet).status !== 'blocked') {
        add(lab, [`Lab that goes with ${displayName(course)}.`])
      }
    }
  }

  // Fill the rest with elective slots.
  const electiveSuggestions = []
  if (chosen.length < target) {
    const slots = plan.requirements.flatMap((g) => g.slots ?? [])
    for (const slot of slots) {
      if (chosen.length + electiveSuggestions.length >= target) break
      const codes = slot.chooseFrom === 'dept-electives' ? plan.deptElectives : Array.isArray(slot.chooseFrom) ? slot.chooseFrom : []
      const options = codes
        .map((code) => catalog.get(code))
        .filter((c) => c && !state.completed.has(c.code) && !state.inProgress.has(c.code) && !chosenSet.has(c.code))
        .map((c) => ({ course: c, elig: getEligibility(c, state, catalog, chosenSet) }))
        .filter(({ elig }) => elig.status === 'eligible')
      electiveSuggestions.push({ slot, options: options.slice(0, 4).map((o) => o.course) })
    }
  }

  const totalCredits = chosen.reduce((sum, { course }) => sum + (course.credits ?? 0), 0)
  const unknownCredits = chosen.some(({ course }) => course.credits == null)

  if (remaining.length === 0) notes.push('Every compulsory course on this sheet is marked completed or in progress. Only elective slots remain.')
  if (chosen.length === 0 && remaining.length > 0) notes.push('None of the remaining compulsory courses are open to you yet based on what you marked. Check the "Not yet eligible" list to see what is missing.')

  const wantsTimePrefs = prefs.timeOfDay !== 'none' || prefs.avoidDays?.length || prefs.notes?.trim()
  if (wantsTimePrefs) notes.push('Class times and sections are not connected to the assistant yet, so your time and day preferences are saved but not applied. They will be used once live schedules are available.')

  return { courses: chosen, electiveSuggestions, totalCredits, unknownCredits, notes, target }
}

function reasonsFor(course, state, catalog, concurrent, extra) {
  const reasons = []
  const pre = (course.prerequisites ?? []).filter((r) => r.type === 'course' || r.type === 'anyOf')
  if (pre.length) {
    const names = pre.map((r) => (r.type === 'course' ? displayName(catalog.get(r.code)) : r.codes.map((x) => displayName(catalog.get(x))).join(' or ')))
    reasons.push(`You have completed its prerequisite${names.length > 1 ? 's' : ''}: ${names.join(', ')}.`)
  } else if (!(course.prerequisites ?? []).length) {
    reasons.push('It has no prerequisites on this sheet.')
  }
  const unlocks = transitiveDependents(course.code, catalog).list
  if (unlocks.length) {
    const examples = unlocks.slice(0, 2).map((d) => displayName(d.course)).join(', ')
    reasons.push(`It unlocks ${unlocks.length} later course${unlocks.length > 1 ? 's' : ''} (e.g. ${examples}).`)
  }
  if (extra) reasons.push(extra)
  return reasons
}

/** Every remaining compulsory course grouped by eligibility, for the "also eligible / not yet" lists. */
export function remainingByStatus(catalog, state, concurrent = new Set()) {
  const groups = { eligible: [], 'needs-coreq': [], blocked: [] }
  for (const course of catalog.values()) {
    if (!course.compulsory || state.completed.has(course.code) || state.inProgress.has(course.code) || concurrent.has(course.code)) continue
    const elig = getEligibility(course, state, catalog, concurrent)
    groups[elig.status]?.push({ course, elig })
  }
  for (const list of Object.values(groups)) list.sort((a, b) => a.course.level - b.course.level || a.course.code.localeCompare(b.course.code))
  return groups
}

/** "What if I skip/delay X?" */
export function whatIfSkip(code, catalog) {
  const course = catalog.get(code)
  if (!course) return null
  const { list, chainLength } = transitiveDependents(code, catalog)
  return { course, affected: list, chainLength }
}

/** Can two courses be taken in the same semester? */
export function canTakeTogether(codeA, codeB, state, catalog) {
  const a = catalog.get(codeA)
  const b = catalog.get(codeB)
  if (!a || !b) return { ok: null, reasons: ['I could not find one of those courses on this major sheet.'] }
  const reasons = []
  const requires = (x, y) => (x.prerequisites ?? []).some((r) => (r.type === 'course' && r.code === y.code) || (r.type === 'anyOf' && r.codes.includes(y.code)))
  if (requires(a, b)) reasons.push(`${displayName(a)} lists ${displayName(b)} as a prerequisite, so ${displayName(b)} has to be completed first.`)
  if (requires(b, a)) reasons.push(`${displayName(b)} lists ${displayName(a)} as a prerequisite, so ${displayName(a)} has to be completed first.`)
  const concurrent = new Set([codeA, codeB])
  for (const course of [a, b]) {
    const elig = getEligibility(course, state, catalog, concurrent)
    if (elig.status === 'blocked') reasons.push(`${displayName(course)} is not open to you yet — missing: ${elig.missingPre.map((r) => r.text).join(', ')}.`)
    if (elig.status === 'needs-coreq') reasons.push(`${displayName(course)} needs ${elig.missingCo.map((r) => r.text).join(' and ')} in the same semester or earlier.`)
    if (elig.status === 'completed') reasons.push(`You marked ${displayName(course)} as completed.`)
  }
  const ok = reasons.length === 0
  return { ok, reasons: ok ? ['Based on the prerequisite information on this sheet, nothing prevents taking them together.'] : reasons }
}

/** Progress summary for the header cards. */
export function planProgress(plan, catalog, state) {
  const compulsory = [...catalog.values()].filter((c) => c.compulsory)
  const done = compulsory.filter((c) => state.completed.has(c.code))
  const credits = done.reduce((s, c) => s + (c.credits ?? 0), 0)
  const totalCredits = compulsory.reduce((s, c) => s + (c.credits ?? 0), 0)
  return { totalCourses: compulsory.length, doneCourses: done.length, credits, totalCredits }
}

/** Group plan courses for display: by level (Year 1–4) or by category. */
export function groupCourses(plan, catalog, mode = 'level') {
  const codes = plan.requirements.flatMap((g) => g.courses)
  const courses = codes.map((code) => catalog.get(code)).filter(Boolean)
  if (mode === 'category') {
    return plan.requirements.map((g) => ({ id: g.id, title: g.title, courses: g.courses.map((c) => catalog.get(c)).filter(Boolean), slots: g.slots ?? [] }))
  }
  const byLevel = new Map()
  for (const course of courses) {
    const lvl = Math.min(4, Math.max(1, course.level || 1))
    if (!byLevel.has(lvl)) byLevel.set(lvl, [])
    byLevel.get(lvl).push(course)
  }
  return [...byLevel.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([level, list]) => ({
      id: `year-${level}`,
      title: `Year ${level}`,
      subtitle: `${level}00-level courses`,
      courses: list.sort((a, b) => (COURSE_CATEGORIES[a.category]?.order ?? 9) - (COURSE_CATEGORIES[b.category]?.order ?? 9) || a.code.localeCompare(b.code)),
      slots: [],
    }))
}

/** Search the catalog (code, name, category). */
export function searchCourses(catalog, query, { planOnly = true } = {}) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return [...catalog.values()]
    .filter((c) => (!planOnly || c.inPlan) && !c.unlisted)
    .filter((c) => c.code.includes(q) || c.name.toLowerCase().includes(q) || (c.short ?? '').toLowerCase().includes(q) || (COURSE_CATEGORIES[c.category]?.label ?? '').toLowerCase().includes(q))
    .slice(0, 12)
}

/** Find a course mentioned in free text (by code, then by name/alias). */
export function findCourseInText(text, catalog) {
  const codes = text.match(/\b\d{7}\b/g) ?? []
  const found = codes.map((code) => catalog.get(code)).filter(Boolean)
  if (found.length) return found
  const lower = text.toLowerCase()
  const matches = []
  for (const course of catalog.values()) {
    if (course.unlisted) continue
    const names = [course.name, course.short].filter(Boolean).map((n) => n.toLowerCase())
    if (names.some((n) => n.length > 3 && lower.includes(n))) matches.push(course)
  }
  // Prefer longer (more specific) matches, e.g. "heat transfer lab" over "heat transfer".
  return matches.sort((a, b) => b.name.length - a.name.length).filter((c, i, arr) => !arr.slice(0, i).some((prev) => prev.name.toLowerCase().includes(c.name.toLowerCase())))
}
