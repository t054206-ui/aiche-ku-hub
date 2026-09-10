import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import Logo from '../Logo'
import { ASSISTANT } from '../../data/academic/assistant'
import { respond } from '../../lib/assistant/respond'
import { askModel, buildContext, llmEnabled } from '../../lib/assistant/llm'
import { track, ANALYTICS_EVENTS } from '../../lib/analytics'

const QUICK_PROMPTS = ['What should I take next?', 'What if I take 5 courses?', 'Prerequisites of Heat Transfer', 'No classes before 9 AM']

/** Conversational layer over the planning engine. */
export default function Chat({ planner, suggestion, onSuggestionRequested, onPrefsOverride }) {
  const { plan, catalog, state, data, pushMessage, setPrefs, setMany } = planner
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [data.messages.length, busy])

  const applyActions = (actions = []) => {
    for (const action of actions) {
      if (action.type === 'setPrefs') setPrefs(action.prefs)
      if (action.type === 'markCompleted') setMany('completed', action.codes, true)
      if (action.type === 'markInProgress') setMany('inProgress', action.codes, true)
    }
  }

  const send = async (text) => {
    const message = text.trim()
    if (!message || busy) return
    setInput('')
    pushMessage({ role: 'user', content: message })
    track(ANALYTICS_EVENTS.LINK_CLICK, { id: 'assistant-message' })
    setBusy(true)

    // Always compute the grounded, rule-based answer first.
    const local = respond(message, { plan, catalog, state, prefs: data.prefs })
    applyActions(local.actions)
    if (local.prefsOverride) onPrefsOverride?.(local.prefsOverride)
    if (local.suggestion) onSuggestionRequested?.()

    let reply = local.text
    if (llmEnabled()) {
      try {
        const history = [...data.messages, { role: 'user', content: message }].map((m) => ({ role: m.role, content: m.content }))
        reply = await askModel({ messages: history, context: { ...buildContext({ plan, catalog, state, prefs: data.prefs, suggestion }), ruleBasedAnswer: local.text } })
      } catch {
        reply = local.text // fall back to the built-in answer
      }
    }
    pushMessage({ role: 'assistant', content: reply })
    setBusy(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <section aria-labelledby="chat-title" className="flex h-full min-h-[28rem] flex-col rounded-2xl border border-line bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white"><Icon name="Bot" className="h-5 w-5" /></span>
        <div className="min-w-0">
          <h2 id="chat-title" className="font-display text-base font-semibold text-ink">{ASSISTANT.name}</h2>
          <p className="truncate text-xs text-ink-muted">Working from {plan.major} · {plan.years}{llmEnabled() ? ' · Claude-powered' : ''}</p>
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {data.messages.length === 0 && (
          <div className="rounded-2xl rounded-tl-md bg-surface p-3 text-sm text-ink-soft">
            <p>{ASSISTANT.intro}</p>
            <p className="mt-2">Try one of the prompts below, or type your own question.</p>
          </div>
        )}
        {data.messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-tr-md bg-brand-700 text-white' : 'rounded-tl-md bg-surface text-ink'}`}>{m.content}</div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-md bg-surface px-3.5 py-2.5 text-sm text-ink-muted">Thinking…</div>
          </div>
        )}
      </div>

      <div className="border-t border-line p-3">
        <ul className="mb-2 flex gap-2 overflow-x-auto pb-1" aria-label="Suggested questions">
          {QUICK_PROMPTS.map((p) => (
            <li key={p} className="shrink-0">
              <button type="button" onClick={() => send(p)} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100">{p}</button>
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about courses, prerequisites, or what-ifs…" aria-label="Message the assistant" className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted/80 focus:border-brand-300" />
          <button type="submit" disabled={!input.trim() || busy} aria-label="Send" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40">
            <Icon name="Send" className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between">
          <span className="h-4 w-8 text-brand-200"><Logo variant="v1" className="h-4" /></span>
          {data.messages.length > 0 && (
            <button type="button" onClick={planner.clearMessages} className="text-xs text-ink-muted hover:text-brand-700">Clear chat</button>
          )}
        </div>
      </div>
    </section>
  )
}
