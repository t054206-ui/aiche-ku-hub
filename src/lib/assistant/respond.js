/**
 * Built-in assistant: turns a student's message into an answer using ONLY the
 * planning engine and the selected major sheet. Every answer is traceable to
 * data in src/data/academic. When it cannot answer from that data it says so.
 *
 * Returns { text, actions?: [{ type, ... }], suggestion?: boolean }
 */
import { ASSISTANT } from '../../data/academic/assistant'
import { canTakeTogether, displayName, findCourseInText, getEligibility, requirementText, suggestSemester, whatIfSkip } from '../planner/engine'

const HELP = [
  'Here is what I can help with, using your selected major sheet:',
  '• "What should I take next?" — a suggested semester.',
  '• "Can I take Heat Transfer and Mass Transfer together?"',
  '• "What if I delay Fluid Mechanics?" or "What if I take 5 courses?"',
  '• "What are the prerequisites of 0640343?"',
  '• "I finished Calculus A and Physics 1" or "I am taking Organic Chemistry".',
  '• "No classes before 9 AM" or "Avoid Thursdays" — I will save your preferences.',
].join('\n')

const listCourses = (courses) => courses.map((c) => `${displayName(c)} (${c.code})`).join(', ')

export function respond(message, { plan, catalog, state, prefs }) {
  const text = message.trim()
  const lower = text.toLowerCase()
  const mentioned = findCourseInText(text, catalog)
  const actions = []

  if (/^(hi|hello|hey|salam|hala|help|what can you do)\b/.test(lower)) {
    return { text: `Hi! I am the ${ASSISTANT.name}, working from the ${plan.major} major sheet (${plan.years}).\n\n${HELP}` }
  }

  // --- "What if I take N courses?" / "I want 5 courses" ---
  const countMatch = lower.match(/\b(\d)\s*(courses?|classes?|subjects?)\b/) || lower.match(/\btake\s+(\d)\b/)
  if (countMatch && !mentioned.length) {
    const n = Number(countMatch[1])
    if (n >= 1 && n <= 8) {
      actions.push({ type: 'setPrefs', prefs: { courseCount: n } })
      return { text: `Got it — I will plan for ${n} course${n === 1 ? '' : 's'}. Here is an updated suggestion.`, actions, suggestion: true, prefsOverride: { courseCount: n } }
    }
  }

  // --- Time / day preferences ---
  const timeMatch = lower.match(/\b(before|after|earlier than|later than)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  const dayMatch = ASSISTANT.days.filter((d) => lower.includes(d.toLowerCase().slice(0, 3)))
  if (timeMatch || (dayMatch.length && /avoid|no |not |free|off|don'?t/.test(lower)) || /\b(morning|afternoon)\b/.test(lower) && /prefer|want|like|only/.test(lower)) {
    const prefsPatch = {}
    if (timeMatch) {
      const hour = Number(timeMatch[2])
      const suffix = timeMatch[4] ? timeMatch[4].toUpperCase() : hour < 8 ? 'PM' : hour >= 12 ? 'PM' : 'AM'
      const label = `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${timeMatch[3] ?? '00'} ${suffix}`
      if (/before|earlier/.test(timeMatch[1])) prefsPatch.earliest = label
      else prefsPatch.latest = label
    }
    if (dayMatch.length) prefsPatch.avoidDays = [...new Set([...(prefs.avoidDays ?? []), ...dayMatch])]
    if (/\bmorning\b/.test(lower)) prefsPatch.timeOfDay = 'morning'
    if (/\bafternoon\b/.test(lower)) prefsPatch.timeOfDay = 'afternoon'
    actions.push({ type: 'setPrefs', prefs: prefsPatch })
    const saved = Object.entries(prefsPatch)
      .map(([k, v]) => (k === 'earliest' ? `earliest class ${v}` : k === 'latest' ? `latest class ${v}` : k === 'avoidDays' ? `avoid ${v.join(', ')}` : `prefer ${v} classes`))
      .join('; ')
    return {
      text: `Got it. I have saved your preference (${saved}). Class sections and times are not connected to the assistant yet, so I cannot apply this to specific sections — but it will be used as soon as live schedules are available.`,
      actions,
    }
  }

  // --- "I finished / completed X, Y" ---
  if (mentioned.length && /\b(finish|finished|completed?|passed|done with|already took|have taken)\b/.test(lower)) {
    actions.push({ type: 'markCompleted', codes: mentioned.map((c) => c.code) })
    return { text: `Marked as completed: ${listCourses(mentioned)}. Here is what that opens up for you.`, actions, suggestion: true }
  }

  // --- "I am taking X" ---
  if (mentioned.length && /\b(currently|now|this semester|am taking|i'?m taking|registered in)\b/.test(lower)) {
    actions.push({ type: 'markInProgress', codes: mentioned.map((c) => c.code) })
    return { text: `Noted — you are currently taking ${listCourses(mentioned)}. I will treat these as in progress (they count for co-requisites, not for prerequisites).`, actions, suggestion: true }
  }

  // --- "What if I don't take / skip / delay X?" ---
  if (mentioned.length && /\b(what if|skip|delay|postpone|drop|don'?t take|do not take|without)\b/.test(lower)) {
    const course = mentioned[0]
    const result = whatIfSkip(course.code, catalog)
    if (!result) return { text: ASSISTANT.unknownAnswer }
    if (!result.affected.length) {
      return { text: `Delaying ${displayName(course)} (${course.code}) does not block any other compulsory course on this sheet, so the effect is limited to the course itself. Remember this is a planning view, not a graduation guarantee.` }
    }
    const direct = result.affected.filter((d) => d.depth === 1)
    const later = result.affected.filter((d) => d.depth > 1)
    const lines = [
      `If you delay ${displayName(course)} (${course.code}), these courses wait too, because they need it as a ${direct[0]?.via ?? 'prerequisite'}:`,
      `• Directly: ${direct.map((d) => `${displayName(d.course)} (${d.course.code})`).join(', ')}`,
    ]
    if (later.length) lines.push(`• Further down the chain: ${later.map((d) => displayName(d.course)).join(', ')}`)
    lines.push(`The longest chain behind it is ${result.chainLength} course${result.chainLength > 1 ? 's' : ''} deep, so delaying it by a semester can push that chain back by a semester as well. This is a planning estimate based on the sheet, not a guaranteed graduation timeline.`)
    return { text: lines.join('\n') }
  }

  // --- "Can I take X and Y together?" ---
  if (mentioned.length >= 2 && /\b(together|same semester|with|and)\b/.test(lower) && /\b(can|could|possible|allowed|take)\b/.test(lower)) {
    const [a, b] = mentioned
    const result = canTakeTogether(a.code, b.code, state, catalog)
    const head = result.ok ? `Yes — ${displayName(a)} and ${displayName(b)} can be taken in the same semester.` : `Not as things stand:`
    return { text: `${head}\n${result.reasons.map((r) => `• ${r}`).join('\n')}\n\nBased on the prerequisite information on the ${plan.years} sheet. Please confirm section availability with the university.` }
  }

  // --- "Prerequisites of X" / "Am I eligible for X" / any single course mention ---
  if (mentioned.length) {
    const course = mentioned[0]
    const elig = getEligibility(course, state, catalog)
    const pre = (course.prerequisites ?? []).map((r) => requirementText(r, catalog))
    const co = (course.corequisites ?? []).map((r) => requirementText(r, catalog))
    const lines = [`${course.name} (${course.code})${course.credits != null ? ` — ${course.credits} credit${course.credits === 1 ? '' : 's'}` : ' — credits not listed on the sheet'}.`]
    lines.push(pre.length ? `Prerequisites: ${pre.join('; ')}.` : 'No prerequisites are listed on this sheet.')
    if (co.length) lines.push(`Co-requisites: ${co.join('; ')}.`)
    const status = {
      completed: 'You marked this course as completed.',
      'in-progress': 'You are currently taking this course.',
      eligible: 'Based on what you marked, you meet its prerequisites and could take it next semester.',
      'needs-coreq': `You meet its prerequisites; take it together with ${elig.missingCo.map((r) => r.text).join(' and ')}.`,
      blocked: `You are not eligible yet — still missing: ${elig.missingPre.map((r) => r.text).join(', ')}.`,
    }[elig.status]
    if (status) lines.push(status)
    if (elig.unchecked.length) lines.push(`I cannot check: ${elig.unchecked.map((r) => r.text).join('; ')}.`)
    if (course.notes) lines.push(`Note: ${course.notes}`)
    return { text: lines.join('\n') }
  }

  // --- Recommendation ---
  if (/\b(what should i take|next|recommend|suggest|plan|which courses|options|eligible|can i take)\b/.test(lower)) {
    const s = suggestSemester(plan, catalog, state, prefs)
    if (!s.courses.length) {
      return {
        text: `Based on the ${plan.years} sheet and the courses you marked, no compulsory course is open to you yet. Mark the courses you have completed (including foundation courses like Pre-Calculus if you are exempt) and I will try again.`,
        suggestion: true,
      }
    }
    return {
      text: `Based on the ${plan.years} sheet and what you have completed, here is a ${s.courses.length}-course suggestion (${s.totalCredits} credits): ${s.courses.map(({ course }) => displayName(course)).join(', ')}. The full breakdown with reasons is in the suggestion panel.`,
      suggestion: true,
    }
  }

  if (/\b(credits?|how many|progress)\b/.test(lower)) {
    return { text: `You have marked ${state.completed.size} course${state.completed.size === 1 ? '' : 's'} as completed. Credit totals in this tool only count the courses you marked, so treat them as an estimate and check your official transcript.` }
  }

  return { text: `${ASSISTANT.unknownAnswer}\n\n${HELP}` }
}
