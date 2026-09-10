import { supabase } from './supabase'
import { registerAnalyticsProvider } from './analytics'

/** Sends every track() call to the analytics_events table when Supabase is configured. */
export function enableSupabaseAnalytics() {
  if (!supabase) return false
  registerAnalyticsProvider((payload) => {
    const { event, ts, path, ...props } = payload
    supabase
      .from('analytics_events')
      .insert({ event, props, path })
      .then(({ error }) => {
        if (error && import.meta.env.DEV) console.warn('[analytics] insert failed:', error.message)
      })
  })
  return true
}
