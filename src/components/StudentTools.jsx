import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { routeHref, ROUTES } from '../lib/router'
import { DEFAULT_PLAN_ID } from '../data/academic/plans'
import { ANALYTICS_EVENTS } from '../lib/analytics'

const TOOLS = [
  {
    id: 'plans',
    icon: 'GraduationCap',
    title: 'Academic plans',
    text: 'Find your major sheet and academic plan.',
    detail: 'Pick your academic year and see every course with its prerequisites.',
    cta: 'Explore',
    href: routeHref(ROUTES.plans),
  },
  {
    id: 'planner',
    icon: 'Bot',
    title: 'Plan my semester',
    text: 'Get help planning your next semester.',
    detail: 'Tell the assistant what you have completed and get a suggested course load.',
    cta: 'Start planning',
    href: routeHref(ROUTES.planner, { plan: DEFAULT_PLAN_ID }),
    accent: true,
  },
]

/** Homepage entry point for the two academic tools. */
export default function StudentTools() {
  return (
    <Section id="tools" aria-labelledby="tools-title" className="pt-0 sm:pt-0">
      <SectionHeading id="tools-title" eyebrow="Student tools" title="Built for ChE students" description="Your major sheet and a planning assistant, right here in the hub." />
      <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <Reveal as="li" key={tool.id} delay={i * 80}>
            <div className={`flex h-full flex-col rounded-2xl border p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-6 ${tool.accent ? 'border-brand-700 bg-brand-700 text-white' : 'border-line bg-white'}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.accent ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700'}`}>
                <Icon name={tool.icon} className="h-6 w-6" />
              </span>
              <h3 className={`mt-4 font-display text-xl font-semibold ${tool.accent ? 'text-white' : 'text-brand-700'}`}>{tool.title}</h3>
              <p className={`mt-1 font-medium ${tool.accent ? 'text-white/90' : 'text-ink'}`}>{tool.text}</p>
              <p className={`mt-1 text-sm ${tool.accent ? 'text-white/70' : 'text-ink-muted'}`}>{tool.detail}</p>
              <div className="mt-5">
                <Button href={tool.href} variant={tool.accent ? 'light' : 'primary'} trackAs={ANALYTICS_EVENTS.LINK_CLICK} trackMeta={{ id: `tool:${tool.id}`, source: 'student-tools' }}>
                  {tool.cta}
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
