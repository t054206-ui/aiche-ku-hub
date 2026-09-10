import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_PLAN_ID, getPlan } from '../../data/academic/plans'
import { buildCatalog } from './engine'

const STORAGE_KEY = 'aiche-ku:planner:v1'

const DEFAULT_PREFS = {
  courseCount: 4,
  timeOfDay: 'none',
  earliest: '8:00 AM',
  latest: '5:00 PM',
  avoidDays: [],
  notes: '',
}

const EMPTY = {
  planId: DEFAULT_PLAN_ID,
  completed: [],
  inProgress: [],
  pinned: [],
  prefs: DEFAULT_PREFS,
  messages: [],
  step: 0,
}

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    return { ...EMPTY, ...parsed, prefs: { ...DEFAULT_PREFS, ...(parsed.prefs ?? {}) }, planId: getPlan(parsed.planId) ? parsed.planId : DEFAULT_PLAN_ID }
  } catch {
    return EMPTY
  }
}

const PlannerContext = createContext(null)

/**
 * Planner state shared by the Academic Plans page, the Course Explorer and the
 * Schedule Assistant. Persisted in localStorage so a student's selections
 * survive a refresh. Swap `load`/the effect below for an API when student
 * accounts and saved schedules arrive.
 */
export function PlannerProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* storage may be unavailable (private mode) — the session still works */
    }
  }, [data])

  const plan = useMemo(() => getPlan(data.planId) ?? getPlan(DEFAULT_PLAN_ID), [data.planId])
  const catalog = useMemo(() => buildCatalog(plan), [plan])

  const state = useMemo(
    () => ({ completed: new Set(data.completed), inProgress: new Set(data.inProgress), pinned: new Set(data.pinned) }),
    [data.completed, data.inProgress, data.pinned],
  )

  const update = useCallback((patch) => setData((d) => ({ ...d, ...(typeof patch === 'function' ? patch(d) : patch) })), [])

  const toggleIn = useCallback(
    (key, code, force) =>
      setData((d) => {
        const has = d[key].includes(code)
        const next = force === undefined ? !has : force
        if (next === has) return d
        const other = key === 'completed' ? 'inProgress' : key === 'inProgress' ? 'completed' : null
        return {
          ...d,
          [key]: next ? [...d[key], code] : d[key].filter((c) => c !== code),
          ...(next && other ? { [other]: d[other].filter((c) => c !== code) } : {}),
        }
      }),
    [],
  )

  const api = useMemo(
    () => ({
      data,
      plan,
      catalog,
      state,
      setPlan: (planId) => update({ planId }),
      setStep: (step) => update({ step }),
      toggleCompleted: (code, force) => toggleIn('completed', code, force),
      toggleInProgress: (code, force) => toggleIn('inProgress', code, force),
      togglePinned: (code, force) => toggleIn('pinned', code, force),
      setMany: (key, codes, on) =>
        setData((d) => {
          const set = new Set(d[key])
          codes.forEach((c) => (on ? set.add(c) : set.delete(c)))
          const other = key === 'completed' ? 'inProgress' : 'completed'
          return { ...d, [key]: [...set], [other]: on ? d[other].filter((c) => !codes.includes(c)) : d[other] }
        }),
      setPrefs: (patch) => update((d) => ({ prefs: { ...d.prefs, ...patch } })),
      pushMessage: (message) => update((d) => ({ messages: [...d.messages, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), ...message }].slice(-60) })),
      clearMessages: () => update({ messages: [] }),
      reset: () => setData({ ...EMPTY, planId: data.planId }),
    }),
    [data, plan, catalog, state, update, toggleIn],
  )

  return <PlannerContext.Provider value={api}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used inside <PlannerProvider>')
  return ctx
}
