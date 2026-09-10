import { ToastProvider } from './components/ui/Toast'
import { EmailSheetProvider } from './components/ui/EmailSheet'
import { PlannerProvider } from './lib/planner/store'
import { CourseDetailProvider } from './components/academic/CourseDetail'
import { ROUTES, useRoute } from './lib/router'
import Nav from './components/Nav'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AcademicPlansPage from './pages/AcademicPlansPage'
import PlannerPage from './pages/PlannerPage'

/**
 * AIChE KU digital hub.
 *  • Home (#, #events, …) — the single-page hub
 *  • #/plans   — Academic plans / major sheets
 *  • #/planner — Schedule Assistant
 * All content lives in src/data/*, not in components.
 */
function Page({ route }) {
  if (route.path === ROUTES.plans) return <AcademicPlansPage params={route.params} />
  if (route.path === ROUTES.planner) return <PlannerPage params={route.params} />
  return <HomePage anchor={route.anchor} />
}

export default function App() {
  const route = useRoute()
  return (
    <ToastProvider>
      <EmailSheetProvider>
        <PlannerProvider>
          <CourseDetailProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            <Nav />
            <main id="main">
              <Page route={route} />
            </main>
            <Footer />
          </CourseDetailProvider>
        </PlannerProvider>
      </EmailSheetProvider>
    </ToastProvider>
  )
}
