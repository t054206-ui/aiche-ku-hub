import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import SmartLink, { isPlaceholder } from './ui/SmartLink'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'
import { ANALYTICS_EVENTS } from '../lib/analytics'

function LinkCard({ link, groupId }) {
  const internal = link.url?.startsWith('#')
  const placeholder = isPlaceholder(link.url)
  const featured = Boolean(link.featured)

  return (
    <SmartLink
      href={link.url}
      trackAs={link.id === 'join' ? ANALYTICS_EVENTS.JOIN_CLICK : ANALYTICS_EVENTS.LINK_CLICK}
      trackMeta={{ id: link.id, group: groupId, title: link.title, source: 'link-hub' }}
      className={`group flex min-h-[4.5rem] items-center gap-4 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
        featured
          ? 'border-brand-700 bg-brand-700 text-white shadow-card'
          : 'border-line bg-white text-ink shadow-card hover:border-brand-200'
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
          featured
            ? 'bg-white/15 text-white'
            : 'bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white'
        }`}
      >
        <Icon name={link.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-semibold leading-tight sm:text-base">{link.title}</span>
        {link.subtitle && (
          <span className={`mt-0.5 block truncate text-sm ${featured ? 'text-white/75' : 'text-ink-muted'}`}>
            {link.subtitle}
          </span>
        )}
      </span>
      {placeholder ? (
        <span className={`shrink-0 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold uppercase tracking-wider ${featured ? 'bg-white/15 text-white/80' : 'bg-brand-50 text-brand-500'}`}>
          Soon
        </span>
      ) : (
        <Icon
          name={internal ? 'ChevronRight' : 'ArrowUpRight'}
          className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
            featured ? 'text-white/80' : 'text-brand-300 group-hover:text-brand-700'
          } ${internal ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'}`}
        />
      )}
    </SmartLink>
  )
}

function LinkGroup({ group, index }) {
  const isPrimary = index === 0
  return (
    <Reveal as="div" delay={index * 60} className={`min-w-0 ${isPrimary ? 'md:col-span-3' : ''}`}>
      <h3 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{group.title}</h3>
      <ul className={`grid grid-cols-1 gap-3 ${isPrimary ? 'md:grid-cols-3' : ''}`}>
        {group.links.map((link) => (
          <li key={link.id} className="min-w-0">
            <LinkCard link={link} groupId={group.id} />
          </li>
        ))}
      </ul>
    </Reveal>
  )
}

export default function LinkHub() {
  const { linkGroups: LINK_GROUPS, site: SITE_CONFIG } = useContent()
  return (
    <Section id="links" className="pt-12 sm:pt-16" aria-labelledby="links-title">
      <SectionHeading id="links-title" eyebrow="Link hub" title={SITE_CONFIG.tagline} description="Quick access to the links students ask for most — join, register, follow, and get in touch." />
      <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
        {LINK_GROUPS.map((group, i) => (
          <LinkGroup key={group.id} group={group} index={i} />
        ))}
      </div>
    </Section>
  )
}
