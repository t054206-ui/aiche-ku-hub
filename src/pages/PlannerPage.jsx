import { useEffect, useMemo, useState } from 'react'
import { Section } from '../components/ui/Section'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'
import SmartLink from '../components/ui/SmartLink'
import Badge from '../components/ui/Badge'
import PlanSelector from '../components/academic/PlanSelector'
import CoursePicker from '../components/planner/CoursePicker'
import Preferences from '../components/planner/Preferences'
import Suggestion from '../components/planner/Suggestion'
import Chat from '../components/planner/Chat'
import Disclaimer from '../components/planner/Disclaimer'
import CourseExplorer from '../components/academic/CourseExplorer'
import { usePlanner } from '../lib/planner/store'
import { suggestSemester } from '../lib/planner/engine'
import { useContent } from '../lib/content'
import { routeHref, ROUTES } from '../lib/router'

const STEPS = [
  { id: 'plan', title: 'Your academic plan', icon: 'GraduationCap' },
  { id: 'completed', title: 'What have you completed?', icon: 'ListChecks' },
  { id: 'current', title: 'What are you taking now?', icon: 'BookMarked' },
  { id: 'prefs', title: 'Your preferences', icon: 'SlidersHorizontal' },
]

function StepCard({ index, step, active, done, summary, onOpen, children }) {
  return (
    <li className={`rounded-2xl border bg-white shadow-card transition-colors ${active ? 'border-brand-200' : 'border-line'}`}>
      <button type="button" onClick={onOpen} aria-expanded={active} className="flex w-full items-center gap-3 p-4 text-left sm:p-5">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${done ? 'bg-emerald-50 text-emerald-600' : active ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700'}`}>
          <Icon name={done && !active ? 'Check' : step.icon} className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">Step {index + 1}</span>
          <span className="block font-display text-base font-semibold text-ink sm:text-lg">{step.title}</span>
          {!active && summary && <span className="block truncate text-sm text-ink-muted">{summary}</span>}
        </span>
        <Icon name="ChevronDown" className={`h-5 w-5 shrink-0 text-ink-muted transition-transform ${active ? 'rotate-180' : ''}`} />
      </button>
      {active && <div className="border-t border-line p-4 sm:p-5">{children}</div>}
    </li>
  )
}

export default function PlannerPage({ params }) {
  const planner = usePlanner()
  const { plan, catalog, state, data, setPlan, setStep, toggleCompleted, toggleInProgress, setMany, setPrefs, getPlan } = planner
  const { assistant: ASSISTANT } = useContent()
  const [prefsOverride, setPrefsOverride] = useState(null)
  const [version, setVersion] = useState(0)
  const [showResult, setShowResult] = useState(() => data.completed.length > 0)

  // #/planner?plan=che-2019 → preselect the sheet handed over from the plans page.
  useEffect(() => {
    const wanted = params.get('plan')
    if (wanted && getPlan(wanted) && wanted !== plan.id) setPlan(wanted)
  }, [params, plan.id, setPlan, getPlan])

  const prefs = useMemo(() => ({ ...data.prefs, ...(prefsOverride ?? {}) }), [data.prefs, prefsOverride])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const suggestion = useMemo(() => suggestSemester(plan, catalog, state, prefs), [plan, catalog, state, prefs, version])

  const step = data.step ?? 0
  const next = () => {
    if (step >= STEPS.length - 1) {
      setShowResult(true)
      setStep(-1)
      document.getElementById('suggestion-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else setStep(step + 1)
  }

  const summaries = [
    `${plan.major} · ${plan.years}`,
    `${data.completed.length} course${data.completed.length === 1 ? '' : 's'} completed`,
    `${data.inProgress.length} course${data.inProgress.length === 1 ? '' : 's'} in progress`,
    `${prefs.courseCount} courses · ${prefs.timeOfDay === 'none' ? 'any time' : prefs.timeOfDay}${prefs.avoidDays.length ? ` · avoid ${prefs.avoidDays.map((d) => d.slice(0, 3)).join(', ')}` : ''}`,
  ]

  return (
    <>
      <div className="bg-brand-700 text-white">
        <div className="container-hub py-8 sm:py-10">
          <SmartLink href={routeHref(ROUTES.plans)} className="flex w-fit items-center gap-1 font-display text-sm text-brand-200 hover:text-white">
            <Icon name="ChevronLeft" className="h-4 w-4" />
            Academic plans
          </SmartLink>
          <p className="eyebrow mt-4 text-brand-200">{ASSISTANT.tagline}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{ASSISTANT.name}</h1>
          <p className="mt-2 max-w-xl text-white/80">Tell the assistant what you have done and how you like to study. It suggests a semester using only your major sheet, and you can chat with it about what-ifs.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="onDark">{plan.major}</Badge>
            <Badge tone="onDark">{plan.years}</Badge>
            <Badge tone="onDark">{data.completed.length} completed</Badge>
          </div>
        </div>
      </div>

      <Section className="pt-8 sm:pt-10" aria-label="Schedule assistant">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
          <div className="min-w-0 space-y-6">
            <ol className="space-y-3">
              <StepCard index={0} step={STEPS[0]} active={step === 0} done onOpen={() => setStep(step === 0 ? -1 : 0)} summary={summaries[0]}>
                <PlanSelector value={plan.id} onChange={setPlan} compact />
                <p className="mt-3 text-sm text-ink-soft">{plan.appliesTo}</p>
                <div className="mt-4 flex justify-end"><Button onClick={next}>Continue<Icon name="ArrowRight" className="h-4 w-4" /></Button></div>
              </StepCard>

              <StepCard index={1} step={STEPS[1]} active={step === 1} done={data.completed.length > 0} onOpen={() => setStep(step === 1 ? -1 : 1)} summary={summaries[1]}>
                <p className="mb-3 text-sm text-ink-soft">Tick everything you have passed. Include foundation courses (Pre-Calculus, Pre-English, Pre-Chemistry) if you completed or were exempt from them.</p>
                <CoursePicker plan={plan} catalog={catalog} selected={state.completed} exclude={state.inProgress} onToggle={toggleCompleted} onSetMany={(codes, on) => setMany('completed', codes, on)} mode="completed" />
                <div className="mt-4 flex justify-end"><Button onClick={next}>Continue<Icon name="ArrowRight" className="h-4 w-4" /></Button></div>
              </StepCard>

              <StepCard index={2} step={STEPS[2]} active={step === 2} done={step > 2 || showResult} onOpen={() => setStep(step === 2 ? -1 : 2)} summary={summaries[2]}>
                <p className="mb-3 text-sm text-ink-soft">Courses you are taking this semester count for co-requisites but not yet as completed prerequisites.</p>
                <CoursePicker plan={plan} catalog={catalog} selected={state.inProgress} exclude={state.completed} onToggle={toggleInProgress} onSetMany={(codes, on) => setMany('inProgress', codes, on)} mode="inProgress" />
                <div className="mt-4 flex justify-end"><Button onClick={next}>Continue<Icon name="ArrowRight" className="h-4 w-4" /></Button></div>
              </StepCard>

              <StepCard index={3} step={STEPS[3]} active={step === 3} done={showResult} onOpen={() => setStep(step === 3 ? -1 : 3)} summary={summaries[3]}>
                <Preferences prefs={data.prefs} onChange={(patch) => { setPrefs(patch); setPrefsOverride(null) }} />
                <div className="mt-5 flex justify-end"><Button size="lg" onClick={next}><Icon name="Sparkles" className="h-4 w-4" />Suggest my semester</Button></div>
              </StepCard>
            </ol>

            {(showResult || step === -1) && (
              <Suggestion plan={plan} catalog={catalog} state={state} suggestion={suggestion} onRegenerate={() => setVersion((v) => v + 1)} />
            )}

            <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
              <CourseExplorer compact />
              {state.pinned.size > 0 && (
                <p className="mt-3 text-sm text-ink-soft">
                  {state.pinned.size} course{state.pinned.size === 1 ? '' : 's'} added to your plan — the assistant puts them first when they are open to you.
                </p>
              )}
            </div>
            <Disclaimer />
          </div>

          <div className="lg:sticky lg:top-20">
            <Chat planner={planner} suggestion={suggestion} onSuggestionRequested={() => { setShowResult(true); setStep(-1) }} onPrefsOverride={(p) => { setPrefsOverride(null); setPrefs(p) }} />
            <Disclaimer className="mt-3" />
          </div>
        </div>
      </Section>
    </>
  )
}
