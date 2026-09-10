import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { SITE_CONFIG } from '../data'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const CONTACT_OPTIONS = [
  {
    id: 'email',
    icon: 'Mail',
    title: 'Email us',
    detail: SITE_CONFIG.email,
    url: `mailto:${SITE_CONFIG.email}`,
    cta: 'Send an email',
  },
  {
    id: 'instagram',
    icon: 'Instagram',
    title: 'Instagram DM',
    detail: SITE_CONFIG.instagramHandle,
    url: SITE_CONFIG.instagramUrl,
    cta: 'Message on Instagram',
  },
  {
    id: 'whatsapp',
    icon: 'WhatsApp',
    title: 'WhatsApp',
    detail: SITE_CONFIG.phoneDisplay,
    url: SITE_CONFIG.whatsappUrl,
    cta: 'Chat on WhatsApp',
  },
]

export default function Contact() {
  return (
    <Section id="contact" aria-labelledby="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow="Contact"
        title="Get in touch"
        description="Questions, ideas, or want to collaborate? Contact the committee through any channel."
      />
      <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        {CONTACT_OPTIONS.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 60}>
            <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{c.title}</h3>
              <p className="mt-0.5 break-all text-sm text-ink-soft">{c.detail}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  href={c.url}
                  variant="outline"
                  size="sm"
                  trackAs={ANALYTICS_EVENTS.CONTACT_CLICK}
                  trackMeta={{ id: c.id }}
                >
                  {c.cta}
                  <Icon name="ArrowUpRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      <p className="mt-6 text-sm text-ink-muted">
        Contact the committee: we usually reply within a day or two during the semester.
      </p>
    </Section>
  )
}
