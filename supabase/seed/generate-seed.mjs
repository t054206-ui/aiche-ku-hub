// Generates supabase/seed/seed.sql from the static data files in src/data.
// Run with: node supabase/seed/generate-seed.mjs   (bundled via esbuild in package.json script)
import { SITE_CONFIG, NAV_ITEMS, SOCIALS } from '../../src/data/site.js'
import { LINK_GROUPS } from '../../src/data/links.js'
import { EVENTS } from '../../src/data/events.js'
import { ANNOUNCEMENTS } from '../../src/data/announcements.js'
import { ABOUT } from '../../src/data/about.js'
import { RESOURCE_CATEGORIES } from '../../src/data/resources.js'
import { TEAM } from '../../src/data/team.js'
import { OUR_YEAR } from '../../src/data/stats.js'
import { GALLERY } from '../../src/data/gallery.js'
import { COURSE_CATALOG, COURSE_CATEGORIES } from '../../src/data/academic/courses.js'
import { ACADEMIC_PLANS } from '../../src/data/academic/plans.js'
import { ASSISTANT } from '../../src/data/academic/assistant.js'

const q = (v) => {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'number') return String(v)
  return `'${String(v).replace(/'/g, "''")}'`
}
const arr = (a) => (a && a.length ? `array[${a.map(q).join(',')}]::text[]` : `'{}'::text[]`)
const iarr = (a) => `array[${a.join(',')}]::int[]`
const j = (v) => `${q(JSON.stringify(v ?? null))}::jsonb`
const row = (table, cols, values) => `insert into ${table} (${cols.join(',')}) values (${values.join(',')}) on conflict do nothing;`
const out = []

const s = SITE_CONFIG
out.push(row('site_config', ['id','society_name','chapter_name','short_name','arabic_name','university','department','academic_year','tagline','description','footer_line','email','phone_display','whatsapp_url','instagram_handle','instagram_url','linkedin_url','join_url','event_registration_url','whatsapp_community_url','website_url','feedback_url','membership_info_url'],
  [1, s.societyName, s.chapterName, s.shortName, s.arabicName, s.university, s.department, s.academicYear, s.tagline, s.description, s.footerLine, s.email, s.phoneDisplay, s.whatsappUrl, s.instagramHandle, s.instagramUrl, s.linkedinUrl, s.joinUrl, s.eventRegistrationUrl, s.whatsappCommunityUrl, s.websiteUrl, s.feedbackUrl, s.membershipInfoUrl].map(q)))
NAV_ITEMS.forEach((n, i) => out.push(row('nav_items', ['id','label','href','sort_order'], [q(n.label.toLowerCase()), q(n.label), q(n.href), i])))
SOCIALS.forEach((x, i) => out.push(row('socials', ['id','label','handle','url','icon','hint','sort_order'], [q(x.id), q(x.label), q(x.handle), q(x.url), q(x.icon), q(x.hint), i])))
LINK_GROUPS.forEach((g, gi) => { out.push(row('link_groups', ['id','title','sort_order'], [q(g.id), q(g.title), gi])); g.links.forEach((l, li) => out.push(row('links', ['id','group_id','title','subtitle','url','icon','featured','sort_order'], [q(l.id), q(g.id), q(l.title), q(l.subtitle), q(l.url), q(l.icon), q(!!l.featured), li]))) })
EVENTS.forEach((e) => out.push(row('events', ['id','title','date','start_time','end_time','location','description','registration_url','status','pinned','tags'], [q(e.id), q(e.title), q(e.date), q(e.startTime), q(e.endTime), q(e.location), q(e.description), q(e.registrationUrl), q(e.status), q(!!e.pinned), arr(e.tags)])))
ANNOUNCEMENTS.forEach((a) => out.push(row('announcements', ['id','category','date','text','url','link_label','is_new'], [q(a.id), q(a.category), q(a.date), q(a.text), q(a.url), q(a.linkLabel), q(!!a.isNew)])))
out.push(row('sections', ['id','eyebrow','title','description','extra'], [q('about'), q(ABOUT.eyebrow), q(ABOUT.title), q(null), j({ paragraphs: ABOUT.paragraphs })]))
ABOUT.highlights.forEach((h, i) => out.push(row('about_highlights', ['id','icon','label','text','sort_order'], [q(h.label.toLowerCase().replace(/\s+/g,'-')), q(h.icon), q(h.label), q(h.text), i])))
out.push(row('sections', ['id','eyebrow','title','description','note'], [q('our_year'), q(OUR_YEAR.eyebrow), q(OUR_YEAR.title), q(OUR_YEAR.description), q(OUR_YEAR.note)]))
OUR_YEAR.stats.forEach((x, i) => out.push(row('year_stats', ['id','label','value','icon','text','sort_order'], [q(x.id), q(x.label), q(x.value), q(x.icon), q(x.text), i])))
out.push(row('sections', ['id','eyebrow','title','extra'], [q('gallery'), q('Gallery'), q('Moments from our events'), j({ viewMoreUrl: GALLERY.viewMoreUrl, viewMoreLabel: GALLERY.viewMoreLabel })]))
GALLERY.items.forEach((g, i) => out.push(row('gallery_items', ['id','src','alt','title','date_label','sort_order'], [q(g.id), q(g.src), q(g.alt), q(g.title), q(g.date), i])))
RESOURCE_CATEGORIES.forEach((c, ci) => { out.push(row('resource_categories', ['id','title','icon','blurb','sort_order'], [q(c.id), q(c.title), q(c.icon), q(c.blurb), ci])); c.items.forEach((it, ii) => out.push(row('resources', ['id','category_id','title','description','url','tags','sort_order'], [q(`${c.id}:${it.id}`), q(c.id), q(it.title), q(it.description), q(it.url), arr(it.tags), ii]))) })
TEAM.forEach((m, i) => out.push(row('team_members', ['id','role','name','photo_url','instagram','linkedin','email','sort_order'], [q(m.id), q(m.role), q(m.name), q(m.photo), q(m.socials?.instagram), q(m.socials?.linkedin), q(m.socials?.email), i])))
Object.entries(COURSE_CATEGORIES).forEach(([id, c]) => out.push(row('course_categories', ['id','label','short','sort_order'], [q(id), q(c.label), q(c.short), c.order])))
COURSE_CATALOG.forEach((c) => out.push(row('courses', ['code','name','short','credits','category','prerequisites','corequisites','notes','unlisted'], [q(c.code), q(c.name), q(c.short), q(c.credits ?? null), q(c.category), j(c.prerequisites ?? []), j(c.corequisites ?? []), q(c.notes), q(!!c.unlisted)])))
ACADEMIC_PLANS.forEach((p, i) => out.push(row('academic_plans', ['id','major_id','major','label','years','is_current','applies_to','sheet_title','sheet_pdf','sheet_pages','sheet_publisher','semesters','requirements','dept_electives','gen_ed_elective_departments','overrides','notes','sort_order'], [q(p.id), q(p.majorId), q(p.major), q(p.label), q(p.years), q(!!p.current), q(p.appliesTo), q(p.officialSheet.title), q(p.officialSheet.pdf), q(p.officialSheet.pages), q(p.officialSheet.publisher), p.semesters ? j(p.semesters) : 'null', j(p.requirements), arr(p.deptElectives), p.genEdElectiveDepartments ? j(p.genEdElectiveDepartments) : 'null', j(p.overrides ?? {}), arr(p.notes), i])))
out.push(row('assistant_settings', ['id','name','tagline','intro','disclaimer','unknown_answer','course_count_options','time_options','hour_options','days'], [1, q(ASSISTANT.name), q(ASSISTANT.tagline), q(ASSISTANT.intro), q(ASSISTANT.disclaimer), q(ASSISTANT.unknownAnswer), iarr(ASSISTANT.courseCountOptions), j(ASSISTANT.timeOptions), arr(ASSISTANT.hourOptions), arr(ASSISTANT.days)]))

const fs = await import('node:fs')
const path = new URL('./seed.sql', import.meta.url)
fs.writeFileSync(path, `-- Generated from src/data by generate-seed.mjs — do not edit by hand.\nbegin;\n${out.join('\n')}\ncommit;\n`)
console.log(`seed.sql: ${out.length} rows`)
