import Logo from './Logo'
import Button from './ui/Button'
import SmartLink from './ui/SmartLink'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const HERO_SOCIALS = ['instagram', 'linkedin', 'email']

export default function Hero() {
  const { site: SITE_CONFIG, socials: SOCIALS } = useContent()
  const socials = SOCIALS.filter((s) => HERO_SOCIALS.includes(s.id))

  return (
    <header id="top" className="relative overflow-hidden bg-brand-700 text-white">
      <div className="hero-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <div className="container-hub relative pb-22 pt-8 sm:pb-28 sm:pt-16">
        <div className="animate-fade-up">
          <Logo variant="v1" className="h-14 text-white sm:hidden" />
          <Logo variant="v2" className="hidden h-[4.6rem] text-white sm:block md:h-24" />
        </div>

        <h1 className="sr-only">
          {SITE_CONFIG.societyName} {SITE_CONFIG.chapterName}
        </h1>

        <p
          className="mt-6 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-200 animate-fade-up sm:text-xs sm:tracking-[0.25em]"
          style={{ animationDelay: '80ms' }}
        >
          Student Chapter · {SITE_CONFIG.department}
        </p>

        <p
          className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:mt-4 sm:text-xl animate-fade-up"
          style={{ animationDelay: '140ms' }}
        >
          {SITE_CONFIG.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 animate-fade-up sm:mt-8 sm:flex sm:flex-wrap" style={{ animationDelay: '200ms' }}>
          <Button
            variant="light"
            size="lg"
            href={SITE_CONFIG.joinUrl}
            trackAs={ANALYTICS_EVENTS.JOIN_CLICK}
            trackMeta={{ source: 'hero' }}
          >
            Join AIChE
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Button>
          <Button variant="outline-light" size="lg" href="#events" className="px-4 sm:px-6">
            <span className="sm:hidden">See events</span>
            <span className="hidden sm:inline">See upcoming events</span>
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-2 animate-fade-up sm:mt-8" style={{ animationDelay: '260ms' }}>
          {socials.map((s) => (
            <SmartLink
              key={s.id}
              href={s.url}
              aria-label={s.label}
              title={s.label}
              trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
              trackMeta={{ id: s.id, source: 'hero' }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-brand-700"
            >
              <Icon name={s.icon} className="h-5 w-5" />
            </SmartLink>
          ))}
          <span className="ml-2 hidden font-display text-sm text-white/60 sm:inline">{SITE_CONFIG.instagramHandle}</span>
        </div>

        <p
          dir="rtl"
          lang="ar"
          className="mt-8 font-arabic text-[13px] text-brand-200/70 animate-fade-up text-left sm:mt-10 sm:text-sm"
          style={{ animationDelay: '320ms' }}
        >
          {SITE_CONFIG.arabicName}
        </p>
      </div>
    </header>
  )
}
