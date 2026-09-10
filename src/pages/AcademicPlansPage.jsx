import { useEffect } from 'react'
import { Section } from '../components/ui/Section'
import Icon from '../components/ui/Icon'
import SmartLink from '../components/ui/SmartLink'
import PlanSelector from '../components/academic/PlanSelector'
import PlanOverview from '../components/academic/PlanOverview'
import PlanCourses from '../components/academic/PlanCourses'
import CourseExplorer from '../components/academic/CourseExplorer'
import { usePlanner } from '../lib/planner/store'

export default function AcademicPlansPage({ params }) {
  const { plan, catalog, state, setPlan, getPlan } = usePlanner()

  // #/plans?plan=che-2019 preselects a sheet.
  useEffect(() => {
    const wanted = params.get('plan')
    if (wanted && getPlan(wanted) && wanted !== plan.id) setPlan(wanted)
  }, [params, plan.id, setPlan, getPlan])

  return (
    <>
      <div className="bg-brand-700 text-white">
        <div className="container-hub py-8 sm:py-10">
          <SmartLink href="#top" className="flex w-fit items-center gap-1 font-display text-sm text-brand-200 hover:text-white">
            <Icon name="ChevronLeft" className="h-4 w-4" />
            Back to AIChE KU
          </SmartLink>
          <p className="eyebrow mt-4 text-brand-200">Academic plans</p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Find your major sheet</h1>
          <p className="mt-2 max-w-xl text-white/80">Choose the academic year you joined the programme to see the Chemical Engineering study plan that applies to you, with prerequisites for every course.</p>
        </div>
      </div>

      <Section className="pt-8 sm:pt-10" aria-label="Academic plan">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
          <PlanSelector value={plan.id} onChange={setPlan} />
          <PlanOverview plan={plan} catalog={catalog} state={state} />
        </div>
        <PlanCourses plan={plan} catalog={catalog} state={state} />
        <CourseExplorer />
      </Section>
    </>
  )
}
