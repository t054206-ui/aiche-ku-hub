/**
 * Analytics hooks — no backend yet.
 *
 * Every meaningful click in the UI calls `track(eventName, props)`.
 * Nothing is sent anywhere until a provider is registered, e.g. in main.jsx:
 *
 *   import { registerAnalyticsProvider } from './lib/analytics'
 *   registerAnalyticsProvider((payload) => window.plausible?.(payload.event, { props: payload }))
 *   // or: fetch('/api/track', { method: 'POST', body: JSON.stringify(payload) })
 *
 * Suggested metrics this already supports: most clicked link, event registration clicks,
 * Instagram / WhatsApp clicks, resource clicks.
 */

export const ANALYTICS_EVENTS = {
  LINK_CLICK: 'link_click',
  JOIN_CLICK: 'join_click',
  EVENT_REGISTER: 'event_register',
  SOCIAL_CLICK: 'social_click',
  RESOURCE_CLICK: 'resource_click',
  CONTACT_CLICK: 'contact_click',
  GALLERY_VIEW_MORE: 'gallery_view_more',
}

const providers = []

export function registerAnalyticsProvider(fn) {
  if (typeof fn === 'function') providers.push(fn)
}

export function track(event, props = {}) {
  const payload = { event, ...props, ts: Date.now(), path: window.location.pathname }
  if (import.meta.env.DEV && providers.length === 0) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', payload)
  }
  for (const provider of providers) {
    try {
      provider(payload)
    } catch {
      /* never let analytics break the UI */
    }
  }
}
