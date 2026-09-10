import { Section } from './ui/Section'
import Reveal from './ui/Reveal'
import Icon from './ui/Icon'
import Logo from './Logo'
import { ABOUT } from '../data'

export default function About() {
  return (
    <Section id="about" tone="white" aria-labelledby="about-title">
      <div className="grid gap-10 md:grid-cols-5 md:gap-12">
        <Reveal className="md:col-span-2">
          <p className="eyebrow text-brand-500">{ABOUT.eyebrow}</p>
          <h2 id="about-title" className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-700 sm:text-3xl">
            {ABOUT.title}
          </h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft sm:text-base">
            {ABOUT.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Logo variant="arabic" className="mt-8 h-24 text-brand-200" />
        </Reveal>

        <ul className="grid grid-cols-1 content-start gap-3 sm:grid-cols-2 md:col-span-3">
          {ABOUT.highlights.map((h, i) => (
            <Reveal as="li" key={h.label} delay={i * 60}>
              <div className="flex h-full gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-card">
                  <Icon name={h.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-ink">{h.label}</h3>
                  <p className="mt-0.5 text-sm text-ink-muted">{h.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
