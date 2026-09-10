import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import SmartLink, { isPlaceholder } from './ui/SmartLink'
import Icon from './ui/Icon'
import { SOCIALS } from '../data'
import { ANALYTICS_EVENTS } from '../lib/analytics'

export default function SocialLinks() {
  return (
    <Section id="follow" tone="white" aria-labelledby="follow-title">
      <SectionHeading id="follow-title" eyebrow="Social media" title="Follow AIChE KU" description="Announcements go out on Instagram first — turn on notifications." />
      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {SOCIALS.map((s, i) => (
          <Reveal as="li" key={s.id} delay={i * 60}>
            <SmartLink
              href={s.url}
              trackAs={ANALYTICS_EVENTS.SOCIAL_CLICK}
              trackMeta={{ id: s.id, source: 'follow' }}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-lift sm:p-5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand-700 shadow-card transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="mt-4 font-display text-base font-semibold text-ink">{s.label}</span>
              <span className="mt-0.5 truncate text-sm text-brand-700">{s.handle}</span>
              <span className="mt-2 text-xs leading-relaxed text-ink-muted">{s.hint}</span>
              {isPlaceholder(s.url) && (
                <span className="mt-3 self-start rounded-full bg-brand-50 px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider text-brand-500">
                  Coming soon
                </span>
              )}
            </SmartLink>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
