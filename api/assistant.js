/**
 * Serverless endpoint for the optional Claude-powered chat (Vercel / Netlify style).
 *
 *   POST /api/assistant  { messages: [{role, content}], context: {...} }
 *   → { reply: string }
 *
 * Deploy with ANTHROPIC_API_KEY set in the host's environment, then set
 * VITE_ASSISTANT_ENDPOINT=/api/assistant when building the site. The model is
 * given the major-sheet data as its only source of truth and told to say when
 * the answer is not in that data. Nothing else on the site depends on this file.
 */
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic() // reads ANTHROPIC_API_KEY

const SYSTEM = `You are the AIChE Schedule Assistant for Chemical Engineering students at Kuwait University.

You help students plan their next semester. You must work ONLY from the JSON context provided in the conversation: the selected major sheet (courses, credits, prerequisites, co-requisites, notes), the student's completed / in-progress courses, their preferences, and the rule-based suggestion.

Rules:
- Never invent course codes, names, credits, prerequisites, graduation requirements, class sections, times, instructors, or rooms. If something is not in the context, say: "I don't have enough official information to confirm this. Please check the official Kuwait University course information."
- Class sections and times are not available. If the student asks about times or days, acknowledge their preference and explain it cannot be applied yet.
- Keep answers short, warm and concrete, in plain language. Use the student's own course names. Use short bullet lists for more than two items.
- Present everything as planning help, not guaranteed graduation predictions. Remind the student to confirm with official Kuwait University academic advising when it matters.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { messages = [], context = {} } = req.body ?? {}
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'messages required' })

  const history = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }))
  if (!history.length || history[0].role !== 'user') return res.status(400).json({ error: 'conversation must start with a user message' })

  try {
    const response = await client.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1500,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [
        { type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `Major sheet and student context (JSON):\n${JSON.stringify(context)}` },
      ],
      messages: history,
    })

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ reply: "I can't help with that request. I can help you plan courses from your major sheet." })
    }
    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()
    return res.status(200).json({ reply })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'The assistant is busy. Please try again in a moment.' })
    if (error instanceof Anthropic.AuthenticationError) return res.status(500).json({ error: 'Assistant is not configured (missing API key).' })
    if (error instanceof Anthropic.APIError) return res.status(502).json({ error: `Assistant error (${error.status}).` })
    return res.status(500).json({ error: 'Unexpected assistant error.' })
  }
}
