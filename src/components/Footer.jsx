import Logo from './Logo'
import SmartLink from './ui/SmartLink'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { routeHref, ROUTES } from '../lib/router'

const footerLinks = (NAV_ITEMS) => [...NAV_ITEMS.filter((i) => i.href !== '#/plans'), { label: 'Academic plans', href: routeHref(ROUTES.plans) }, { label: 'Plan my semester', href: routeHref(ROUTES.planner) }]
import { ANALYTICS_EVENTS } from '../lib/analytics'

export default function Footer() {
  const { site: SITE_CONFIG, navItems: NAV_ITEMS, socials: SOCIALS } = useContent()
  const FOOTER_LINKS = footerLinks(NAV_ITEMS)
  const year = new Date().getFullYear()
  return (
    <footer className="bg-brand-900 text-white">
      <div className="container-hub py-12 sm:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo variant="v2" className="h-12 text-white sm:h-14" />
            <p className="mt-4 text-sm text-white/70">{SITE_CONFIG.footerLine}</p>
            <p dir="rtl" lang="ar" className="mt-2 font-arabic text-sm text-brand-200/80 text-left">
              {SITE_CONFIG.arabicName}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Explore</p>
              <ul className="mt-3 space-y-2">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <SmartLink href={item.href} className="font-display text-sm text-white/80 transition-colors hover:text-white">
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Follow</p>
              <ul className="mt-3 flex gap-2">
                {SOCIALS.map((s) => (
                  <li key={s.id}>
                    <SmartLink
                      href={s.url}
                      aria-label={s.label}
                      title={s.label}
                      trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
                      trackMeta={{ id: s.id, source: 'footer' }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-700"
                    >
                      <Icon name={s.icon} className="h-4 w-4" />
                    </SmartLink>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-white/70">{SITE_CONFIG.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_CONFIG.societyName} {SITE_CONFIG.chapterName}
          </p>
          <p>Run by students, for students.</p>
        </div>
      </div>
    </footer>
  )
}
