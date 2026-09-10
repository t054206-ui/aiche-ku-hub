import { Section, SectionHeading } from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import { useContent } from '../lib/content'

export default function OurYear() {
  const { ourYear: OUR_YEAR } = useContent()
  return (
    <Section id="our-year" tone="dark" aria-labelledby="year-title" className="relative overflow-hidden">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <SectionHeading id="year-title" dark eyebrow={OUR_YEAR.eyebrow} title={OUR_YEAR.title} description={OUR_YEAR.description} />

        <ol className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {OUR_YEAR.stats.map((stat, i) => (
            <Reveal as="li" key={stat.id} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-[2px] transition-colors hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-200">
                    <Icon name={stat.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-xs font-semibold text-white/40">{String(i + 1).padStart(2, '0')}</span>
                </div>
                {stat.value !== null && stat.value !== undefined && (
                  <p className="mt-4 font-display text-4xl font-semibold leading-none text-white">{stat.value}</p>
                )}
                <h3 className={`font-display font-semibold text-white ${stat.value != null ? 'mt-1 text-sm uppercase tracking-wider text-brand-200' : 'mt-4 text-lg'}`}>
                  {stat.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{stat.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="mt-6 text-xs text-white/50">{OUR_YEAR.note}</p>
      </div>
    </Section>
  )
}
