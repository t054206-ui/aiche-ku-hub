/**
 * Optional Claude-powered chat. Disabled unless VITE_ASSISTANT_ENDPOINT is set
 * (see /api/assistant.js for a ready-to-deploy serverless function). The
 * endpoint receives the conversation plus a grounding context built ONLY from
 * the selected major sheet and the student's selections, and is instructed to
 * answer from that context alone.
 */
import { ASSISTANT } from '../../data/academic/assistant'
import { displayName, getEligibility, requirementText } from '../planner/engine'

export const llmEnabled = () => Boolean(ASSISTANT.llmEndpoint)

export function buildContext({ plan, catalog, state, prefs, suggestion }) {
  const courses = [...catalog.values()]
    .filter((c) => c.inPlan && !c.unlisted)
    .map((c) => ({
      code: c.code,
      name: c.name,
      credits: c.credits,
      category: c.category,
      compulsory: c.compulsory,
      prerequisites: (c.prerequisites ?? []).map((r) => requirementText(r, catalog)),
      corequisites: (c.corequisites ?? []).map((r) => requirementText(r, catalog)),
      status: getEligibility(c, state, catalog).status,
      notes: c.notes ?? null,
    }))
  return {
    plan: { id: plan.id, major: plan.major, years: plan.years, notes: plan.notes, officialSheet: plan.officialSheet.title },
    student: {
      completed: [...state.completed],
      inProgress: [...state.inProgress],
      pinned: [...state.pinned],
      preferences: prefs,
    },
    suggestion: suggestion
      ? { courses: suggestion.courses.map(({ course, reasons }) => ({ code: course.code, name: displayName(course), reasons })), totalCredits: suggestion.totalCredits, notes: suggestion.notes }
      : null,
    courses,
  }
}

export async function askModel({ messages, context }) {
  const response = await fetch(ASSISTANT.llmEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  })
  if (!response.ok) throw new Error(`Assistant endpoint returned ${response.status}`)
  const data = await response.json()
  if (!data?.reply) throw new Error('Assistant endpoint returned no reply')
  return data.reply
}
