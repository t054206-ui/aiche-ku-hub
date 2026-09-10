import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { STATIC_CONTENT } from './static'
import * as map from './mapRows'

const CACHE_KEY = 'aiche-ku:content:v1'
const TABLES = ['site_config', 'nav_items', 'socials', 'link_groups', 'links', 'events', 'announcements', 'sections', 'about_highlights', 'resource_categories', 'resources', 'team_members', 'year_stats', 'gallery_items', 'course_categories', 'courses', 'academic_plans', 'assistant_settings']

/** Reads every content table in parallel and maps rows to the shapes components use. */
export async function fetchContent() {
  const results = await Promise.all(TABLES.map((t) => supabase.from(t).select('*')))
  const failed = results.find((r) => r.error)
  if (failed) throw failed.error
  const [siteRows, nav, socials, groups, links, events, announcements, sections, highlights, resCats, resItems, team, stats, gallery, catRows, courses, plans, assistantRows] = results.map((r) => r.data ?? [])
  const section = (id) => sections.find((s) => s.id === id)
  const S = STATIC_CONTENT
  return {
    source: 'supabase',
    loadedAt: Date.now(),
    site: map.mapSite(siteRows[0], S.site),
    navItems: nav.length ? map.mapNavItems(nav) : S.navItems,
    socials: socials.length ? map.mapSocials(socials) : S.socials,
    linkGroups: groups.length ? map.mapLinkGroups(groups, links) : S.linkGroups,
    events: map.mapEvents(events),
    announcements: map.mapAnnouncements(announcements),
    about: map.mapAbout(section('about'), highlights, S.about),
    resources: resCats.length ? map.mapResources(resCats, resItems) : S.resources,
    team: map.mapTeam(team),
    ourYear: map.mapOurYear(section('our_year'), stats, S.ourYear),
    gallery: map.mapGallery(section('gallery'), gallery, S.gallery),
    courses: courses.length ? map.mapCourses(courses) : S.courses,
    courseCategories: map.mapCourseCategories(catRows, S.courseCategories),
    plans: plans.length ? map.mapPlans(plans) : S.plans,
    assistant: map.mapAssistant(assistantRows[0], S.assistant),
  }
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.source === 'supabase' ? { ...parsed, assistant: { ...STATIC_CONTENT.assistant, ...parsed.assistant } } : null
  } catch {
    return null
  }
}

const ContentContext = createContext(STATIC_CONTENT)

/**
 * Serves content to the whole app. Renders the bundled defaults immediately,
 * then swaps in live Supabase content (and remembers it for the next visit).
 * If Supabase is not configured or unreachable, the static content stays.
 */
export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => (supabase ? readCache() ?? STATIC_CONTENT : STATIC_CONTENT))
  const [status, setStatus] = useState(supabase ? 'loading' : 'static')

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    fetchContent()
      .then((live) => {
        if (cancelled) return
        setContent(live)
        setStatus('live')
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(live))
        } catch {
          /* cache is optional */
        }
      })
      .catch((error) => {
        if (cancelled) return
        if (import.meta.env.DEV) console.warn('[content] Supabase unavailable, using bundled content:', error?.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => ({ ...content, status }), [content, status])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export const useContent = () => useContext(ContentContext)
