# AIChE Kuwait University Student Chapter — Digital Hub

A mobile-first, single-page "digital hub" for the AIChE KU Student Chapter: links, what's happening,
upcoming events, announcements, resources, team, gallery, social media and contact — all in one place.

Built with **React 19 + Vite + Tailwind CSS v4**. No backend required.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Updating content (no design changes needed)

All content lives in `src/data/`. Components never hard-code text or URLs.

| File | What it controls |
| --- | --- |
| `src/data/site.js` | Society name, description, email, phone/WhatsApp, Instagram, LinkedIn, join / registration / feedback URLs, navigation |
| `src/data/links.js` | The main link hub — grouped links (Most important, Connect, Resources, Contact) |
| `src/data/events.js` | Upcoming events (also powers the "What's happening?" panel) |
| `src/data/announcements.js` | Announcements with NEW / REMINDER / UPDATE labels |
| `src/data/about.js` | About text and the six highlight cards |
| `src/data/resources.js` | Resource categories + items (searchable) |
| `src/data/team.js` | Committee members, roles, photos, socials |
| `src/data/stats.js` | "Our year" activity categories and optional numbers |
| `src/data/gallery.js` | Gallery images and the "View more" link |
| `src/data/academic/plans.js` | Academic years / major sheets (requirements, elective slots, official PDF, per-year prerequisite differences) |
| `src/data/academic/courses.js` | Course catalog: codes, names, credits, prerequisites, co-requisites |
| `src/data/academic/assistant.js` | Schedule Assistant copy, disclaimer and option lists |

### Placeholders
Any URL set to `"#"` is treated as **not yet available**: the UI shows a small "Soon" pill and a
toast ("This link will be added soon") instead of navigating. Replace them with real URLs as they
become available. Nothing else needs to change.

### Events
```js
{
  id: 'cv-workshop',
  title: 'CV & Interview Workshop',
  date: '2026-10-06',        // YYYY-MM-DD
  startTime: '17:00',        // 24h, optional
  endTime: '19:00',          // optional
  location: 'Venue TBA',
  description: '…',
  registrationUrl: 'https://…',
  status: 'open',            // open | soon | closed | full | none
  pinned: false,             // true = always featured in "What's happening?"
}
```
* Past events disappear automatically.
* The "What's happening?" panel shows **HAPPENING NOW** (during the event), **NEXT UP** (within 14
  days, see `FEATURED_WINDOW_DAYS` in `src/lib/events.js`) or **COMING SOON**. With no events it shows
  "Something exciting is coming…".

### Photos
* Team photos → `public/images/team/`, then set `photo: '/images/team/name.jpg'` in `team.js`.
* Gallery photos → `public/images/gallery/`, then set `src` in `gallery.js`.

### Icons
Data files reference icons by name (e.g. `icon: 'CalendarDays'`). The registry is
`src/components/ui/Icon.jsx` — add any [lucide](https://lucide.dev/icons) icon there to use it.

## Academic plans & Schedule Assistant

Two in-app pages live behind hash routes so the hub stays a single deployable page:

* **`#/plans` — Academic plans.** Students pick the academic year they joined (2024–Current, 2019–2023, 2015–2018) and see that year's Chemical Engineering study plan, grouped by year level or by category exactly as the major sheet lists it, with prerequisites for every course, elective slots, the Department Electives list, and buttons to view/download the official PDF from `public/major-sheets/`.
* **`#/planner` — AIChE Schedule Assistant.** A four-step planner (plan → completed → taking now → preferences) that suggests a semester using only the selected sheet's prerequisite data, explains why, lists what else is open and what is still blocked, and offers a chat for questions and "what ifs". Selections persist in the browser (`localStorage`).

### Where the course data came from
Everything in `src/data/academic/courses.js` and `plans.js` was transcribed from the three AIChE KU major-sheet PDFs. The sheets list courses **by category, not by semester**, so `semesters` is `null` on every plan and the page groups courses by the level in the course number. When the department publishes an official semester plan, fill in `semesters` (example in `plans.js`) and the "By year" view switches to it automatically. Credits for Department Electives are not printed on the sheet and are stored as `null`.

**Always verify against the PDF before advising anyone.** Known items to check: Corrosion Engineering is printed as `0640473` on the 2024 sheet (same number as Polymer Engineering); the 2015 sheet's Mass Transfer prerequisite is blank.

### Adding an academic year
Copy the latest entry in `ACADEMIC_PLANS`, change `id`, `label`, `years`, `officialSheet.pdf` (drop the PDF into `public/major-sheets/`), and put any changed prerequisites in `overrides`. Nothing else needs to change.

### How the assistant stays accurate
`src/lib/planner/engine.js` is a pure, rule-based engine: eligibility, co-requisites, credit thresholds, downstream "unlocks", what-if chains and the suggestion ranking all come from the data files. It never invents courses, sections, times or graduation requirements; GPA and consent rules are shown as "not checked". Time/day preferences are stored but explicitly reported as not applied until live sections exist (`src/lib/planner/schedule.js` holds the future conflict-detection helpers).

**Optional Claude-powered chat.** Deploy `api/assistant.js` (a serverless function using `@anthropic-ai/sdk`, model `claude-opus-5`, with server-side refusal fallbacks enabled) with `ANTHROPIC_API_KEY` set on the host, then build with `VITE_ASSISTANT_ENDPOINT=/api/assistant`. The model receives the sheet + student context as its only source of truth and the rule-based answer as a reference; if the endpoint fails, the built-in answer is used. Without the env var the assistant is fully rule-based and works offline.

## Brand
Colours and fonts follow the official AIChE KU brand guide (`src/index.css` → `@theme`):
Pepsi Blue `#024A87`, Sea Sky `#0097D5`, Summer Sky `#71B0DB`, Windsor Way `#A0CAE7`.
Futura is substituted with **Jost** on the web; Arabic text uses **IBM Plex Sans Arabic**.
Official logo lock-ups are vector SVGs in `src/assets/logos/` (also copied to `public/brand/`) and are
rendered by `src/components/Logo.jsx` — never stretch them; size with a height class.

## Project structure
```
src/
  data/            ← all editable content (see table above)
  lib/
    events.js      ← date logic: upcoming, featured, formatting
    analytics.js   ← track() + registerAnalyticsProvider() (no backend yet)
  components/
    ui/            ← Button, Badge, Section, SmartLink, Reveal, Icon, Toast
    Nav, Hero, WhatsHappening, LinkHub, UpcomingEvents, EventCard, Announcements,
    About, Resources, Team, OurYear, Gallery, SocialLinks, Contact, Footer, Logo
```

## Future: analytics and admin
* **Analytics** — every meaningful click already calls `track(event, props)`. Register a provider in
  `src/main.jsx` (Plausible, GA, or your own endpoint) via `registerAnalyticsProvider()`; nothing is
  sent until you do.
* **Admin dashboard** — because content is plain data in `src/data/`, the same shapes can later be
  served from a CMS or database (e.g. Supabase) and loaded at runtime without touching components.
