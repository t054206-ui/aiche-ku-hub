import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal hash router.
 *   #top / #events / …       → home page (existing single-page sections)
 *   #/plans                  → Academic plans page
 *   #/planner?plan=che-2024  → Schedule Assistant
 * Section anchors keep working everywhere: SmartLink sends the visitor home
 * first when the target section is not on the current page.
 */
export const ROUTES = {
  home: '',
  plans: 'plans',
  planner: 'planner',
}

export function parseHash(hash = window.location.hash) {
  if (!hash.startsWith('#/')) return { path: ROUTES.home, params: new URLSearchParams(), anchor: hash.replace('#', '') }
  const [pathPart, query = ''] = hash.slice(2).split('?')
  return { path: pathPart.replace(/\/$/, ''), params: new URLSearchParams(query), anchor: null }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash())
  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function routeHref(path, params) {
  const qs = params ? new URLSearchParams(params).toString() : ''
  return `#/${path}${qs ? `?${qs}` : ''}`
}

export function navigate(hash) {
  if (window.location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = hash
  }
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export const isRouteHref = (href) => typeof href === 'string' && href.startsWith('#/')

/** Scroll to the section named in the hash once the home page has rendered. */
export function useScrollToAnchor(anchor) {
  useEffect(() => {
    if (!anchor || anchor === 'top') return
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [anchor])
}

export function useNavigate() {
  return useCallback((path, params) => navigate(routeHref(path, params)), [])
}
