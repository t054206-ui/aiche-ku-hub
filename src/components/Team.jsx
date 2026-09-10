import { useState } from 'react'
import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import SmartLink from './ui/SmartLink'
import Icon from './ui/Icon'
import { TEAM } from '../data'

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

function socialLinks(socials = {}) {
  const list = []
  if (socials.instagram) list.push({ id: 'instagram', icon: 'Instagram', url: socials.instagram, label: 'Instagram' })
  if (socials.linkedin) list.push({ id: 'linkedin', icon: 'Linkedin', url: socials.linkedin, label: 'LinkedIn' })
  if (socials.email) list.push({ id: 'email', icon: 'Mail', url: `mailto:${socials.email}`, label: 'Email' })
  return list
}

function TeamCard({ member, index }) {
  const [revealed, setRevealed] = useState(false)
  const links = socialLinks(member.socials)
  const hasLinks = links.length > 0

  return (
    <Reveal as="li" delay={index * 50}>
      <div
        className="group relative flex h-full flex-col items-center rounded-2xl border border-line bg-white p-5 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
        onMouseLeave={() => setRevealed(false)}
      >
        <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-brand-50 sm:h-24 sm:w-24">
          {member.photo ? (
            <img src={member.photo} alt={`${member.name}, ${member.role}`} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-100 font-display text-xl font-semibold text-brand-700" aria-hidden="true">
              {initials(member.name) || 'AI'}
            </div>
          )}
        </div>
        <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">{member.role}</p>
        <h3 className="mt-1 font-display text-base font-semibold text-ink">{member.name}</h3>

        {hasLinks && (
          <>
            <button
              type="button"
              className="mt-3 font-display text-xs font-medium text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline group-hover:opacity-0 group-hover:pointer-events-none md:group-hover:opacity-0"
              aria-expanded={revealed}
              onClick={() => setRevealed((r) => !r)}
            >
              Contact
            </button>
            <ul
              className={`absolute inset-x-0 bottom-4 flex justify-center gap-2 transition-all duration-200 ${
                revealed ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100'
              }`}
            >
              {links.map((l) => (
                <li key={l.id}>
                  <SmartLink href={l.url} aria-label={`${member.name} on ${l.label}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 hover:bg-brand-700 hover:text-white">
                    <Icon name={l.icon} className="h-4 w-4" />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Reveal>
  )
}

export default function Team() {
  return (
    <Section id="team" tone="white" aria-labelledby="team-title">
      <SectionHeading
        id="team-title"
        eyebrow="Our team"
        title="The students behind AIChE KU"
        description="Say hi at any event — the committee is here to help."
      />
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {TEAM.map((member, i) => (
          <TeamCard key={member.id} member={member} index={i} />
        ))}
      </ul>
    </Section>
  )
}
