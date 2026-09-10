import { useToast } from './Toast'
import { useEmailSheet } from './EmailSheet'
import { track } from '../../lib/analytics'
import { isRouteHref, navigate } from '../../lib/router'

/** "#" (or empty) means the committee has not added the real URL yet. */
export const isPlaceholder = (url) => !url || url === '#' || url.startsWith('TODO')

/**
 * One link component for everything:
 *  • internal anchors ("#events") scroll smoothly on the page
 *  • external URLs open in a new tab
 *  • placeholders show a toast instead of navigating
 *  • optional analytics via trackAs / trackMeta
 */
export default function SmartLink({
  href,
  children,
  className = '',
  trackAs,
  trackMeta,
  onClick,
  ...rest
}) {
  const toast = useToast()
  const openEmail = useEmailSheet()
  const placeholder = isPlaceholder(href)
  const route = !placeholder && isRouteHref(href)
  const internal = !placeholder && !route && href.startsWith('#')
  // http(s) opens a new tab; mailto:/tel: also get a new browsing context so they
  // still work when the page is embedded (e.g. a sandboxed preview frame).
  const external = !placeholder && /^(https?:\/\/|mailto:|tel:)/i.test(href)

  const handleClick = (event) => {
    onClick?.(event)
    if (trackAs) track(trackAs, { href, ...trackMeta })

    if (placeholder) {
      event.preventDefault()
      toast('This link will be added soon.')
      return
    }
    if (/^mailto:/i.test(href)) {
      // Show the email sheet (mail app / Gmail / copy) instead of a bare mailto: navigation.
      event.preventDefault()
      const [address, query = ''] = href.slice(7).split('?')
      const subject = new URLSearchParams(query).get('subject') || undefined
      openEmail(decodeURIComponent(address), subject)
      return
    }
    if (route) {
      // In-app page (#/plans, #/planner?plan=…): let the router render it, scrolled to the top.
      event.preventDefault()
      navigate(href)
      return
    }
    if (internal) {
      const target = href.length > 1 ? document.getElementById(href.slice(1)) : null
      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.history.replaceState(null, '', href)
      } else if (window.location.hash.startsWith('#/')) {
        // Section lives on the home page: go home, then HomePage scrolls to it.
        event.preventDefault()
        window.location.hash = href
        window.scrollTo({ top: 0 })
      }
    }
  }

  return (
    <a
      href={placeholder ? '#' : href}
      className={className}
      onClick={handleClick}
      aria-disabled={placeholder || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
