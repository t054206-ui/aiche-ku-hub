import Hero from '../components/Hero'
import WhatsHappening from '../components/WhatsHappening'
import LinkHub from '../components/LinkHub'
import StudentTools from '../components/StudentTools'
import UpcomingEvents from '../components/UpcomingEvents'
import Announcements from '../components/Announcements'
import About from '../components/About'
import Resources from '../components/Resources'
import Team from '../components/Team'
import OurYear from '../components/OurYear'
import Gallery from '../components/Gallery'
import SocialLinks from '../components/SocialLinks'
import Contact from '../components/Contact'
import { useScrollToAnchor } from '../lib/router'

/** The original single-page hub. Section order is intentional: identity → what's happening → links → tools → events → the rest. */
export default function HomePage({ anchor }) {
  useScrollToAnchor(anchor)
  return (
    <>
      <Hero />
      <WhatsHappening />
      <LinkHub />
      <StudentTools />
      <UpcomingEvents />
      <Announcements />
      <About />
      <Resources />
      <Team />
      <OurYear />
      <Gallery />
      <SocialLinks />
      <Contact />
    </>
  )
}
