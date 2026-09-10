import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './ui/Button'
import SmartLink from './ui/SmartLink'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

export default function Nav() {
  const { site: SITE_CONFIG, navItems: NAV_ITEMS, socials: SOCIALS } = useContent()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav
        aria-label="Primary"
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_0_0_var(--color-line),0_8px_24px_-16px_rgb(2_74_135/0.25)]' : ''
        }`}
      >
        <div className="container-hub flex h-14 items-center justify-between gap-4 sm:h-16">
          <SmartLink href="#top" className="flex items-center text-brand-700" aria-label="AIChE Kuwait University — back to top">
            <Logo variant="v1" className="h-7 sm:h-8" />
          </SmartLink>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  className="rounded-full px-3.5 py-2 font-display text-[15px] font-medium text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button size="sm" href={SITE_CONFIG.joinUrl} trackAs={ANALYTICS_EVENTS.JOIN_CLICK} trackMeta={{ source: 'nav' }}>
              Join AIChE
            </Button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-14 bottom-0 z-40 animate-fade-in bg-white md:hidden">
          <div className="container-hub flex h-full flex-col py-4">
            <ul className="divide-y divide-line">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <SmartLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-xl font-medium text-brand-700"
                  >
                    {item.label}
                    <Icon name="ChevronRight" className="h-5 w-5 text-brand-300" />
                  </SmartLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              {SOCIALS.map((s) => (
                <SmartLink
                  key={s.id}
                  href={s.url}
                  aria-label={s.label}
                  trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
                  trackMeta={{ id: s.id, source: 'menu' }}
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <Icon name={s.icon} className="h-5 w-5" />
                </SmartLink>
              ))}
            </div>
            <p className="mt-auto pb-6 font-display text-sm text-ink-muted">{SITE_CONFIG.tagline}</p>
          </div>
        </div>
      )}
    </>
  )
}
