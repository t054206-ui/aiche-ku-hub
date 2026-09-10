/**
 * Converts Supabase rows (snake_case tables) into the exact shapes the
 * components already use (the same shapes as src/data). Keeping this mapping
 * in one file means components never know where content came from.
 */
const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
const visible = (rows) => (rows ?? []).filter((r) => r.visible !== false).sort(bySort)
const hhmm = (t) => (t ? String(t).slice(0, 5) : undefined)

export function mapSite(row, fallback) {
  if (!row) return fallback
  return {
    ...fallback,
    societyName: row.society_name,
    chapterName: row.chapter_name,
    shortName: row.short_name,
    arabicName: row.arabic_name ?? fallback.arabicName,
    university: row.university ?? fallback.university,
    department: row.department ?? fallback.department,
    academicYear: row.academic_year ?? fallback.academicYear,
    tagline: row.tagline ?? fallback.tagline,
    description: row.description ?? fallback.description,
    footerLine: row.footer_line ?? fallback.footerLine,
    email: row.email ?? fallback.email,
    phoneDisplay: row.phone_display ?? fallback.phoneDisplay,
    whatsappUrl: row.whatsapp_url ?? fallback.whatsappUrl,
    instagramHandle: row.instagram_handle ?? fallback.instagramHandle,
    instagramUrl: row.instagram_url ?? fallback.instagramUrl,
    linkedinUrl: row.linkedin_url ?? '#',
    joinUrl: row.join_url ?? '#',
    eventRegistrationUrl: row.event_registration_url ?? '#',
    whatsappCommunityUrl: row.whatsapp_community_url ?? '#',
    websiteUrl: row.website_url ?? '#',
    feedbackUrl: row.feedback_url ?? '#',
    membershipInfoUrl: row.membership_info_url ?? '#',
  }
}

export const mapNavItems = (rows) => visible(rows).map((r) => ({ label: r.label, href: r.href }))

export const mapSocials = (rows) => visible(rows).map((r) => ({ id: r.id, label: r.label, handle: r.handle, url: r.url ?? '#', icon: r.icon, hint: r.hint }))

export function mapLinkGroups(groups, links) {
  return visible(groups).map((g) => ({
    id: g.id,
    title: g.title,
    links: visible(links.filter((l) => l.group_id === g.id)).map((l) => ({ id: l.id, title: l.title, subtitle: l.subtitle, url: l.url ?? '#', icon: l.icon, featured: l.featured })),
  }))
}

export const mapEvents = (rows) =>
  visible(rows).map((e) => ({
    id: e.id,
    title: e.title,
    date: String(e.date).slice(0, 10),
    startTime: hhmm(e.start_time),
    endTime: hhmm(e.end_time),
    location: e.location,
    description: e.description,
    registrationUrl: e.registration_url ?? '#',
    status: e.status,
    pinned: e.pinned,
    tags: e.tags ?? [],
  }))

export const mapAnnouncements = (rows) =>
  visible(rows)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((a) => ({ id: a.id, category: a.category, date: String(a.date).slice(0, 10), text: a.text, url: a.url, linkLabel: a.link_label, isNew: a.is_new }))

export function mapAbout(section, highlights, fallback) {
  return {
    eyebrow: section?.eyebrow ?? fallback.eyebrow,
    title: section?.title ?? fallback.title,
    paragraphs: section?.extra?.paragraphs ?? fallback.paragraphs,
    highlights: highlights?.length ? [...highlights].sort(bySort).map((h) => ({ icon: h.icon, label: h.label, text: h.text })) : fallback.highlights,
  }
}

export function mapResources(categories, items) {
  return visible(categories).map((c) => ({
    id: c.id,
    title: c.title,
    icon: c.icon,
    blurb: c.blurb,
    items: visible(items.filter((i) => i.category_id === c.id)).map((i) => ({ id: i.id.replace(`${c.id}:`, ''), title: i.title, description: i.description, url: i.url ?? '#', tags: i.tags ?? [] })),
  }))
}

export const mapTeam = (rows) => visible(rows).map((m) => ({ id: m.id, role: m.role, name: m.name, photo: m.photo_url, socials: { instagram: m.instagram, linkedin: m.linkedin, email: m.email } }))

export function mapOurYear(section, stats, fallback) {
  return {
    eyebrow: section?.eyebrow ?? fallback.eyebrow,
    title: section?.title ?? fallback.title,
    description: section?.description ?? fallback.description,
    note: section?.note ?? fallback.note,
    stats: stats?.length ? [...stats].sort(bySort).map((s) => ({ id: s.id, label: s.label, value: s.value, icon: s.icon, text: s.text })) : fallback.stats,
  }
}

export function mapGallery(section, items, fallback) {
  return {
    viewMoreUrl: section?.extra?.viewMoreUrl ?? fallback.viewMoreUrl,
    viewMoreLabel: section?.extra?.viewMoreLabel ?? fallback.viewMoreLabel,
    items: items?.length ? visible(items).map((g) => ({ id: g.id, src: g.src, alt: g.alt, title: g.title, date: g.date_label })) : fallback.items,
  }
}

export const mapCourses = (rows) =>
  (rows ?? []).map((c) => ({ code: c.code, name: c.name, short: c.short ?? undefined, credits: c.credits, category: c.category, prerequisites: c.prerequisites ?? [], corequisites: c.corequisites ?? [], notes: c.notes ?? undefined, unlisted: c.unlisted || undefined }))

export const mapCourseCategories = (rows, fallback) =>
  rows?.length ? Object.fromEntries(rows.map((r) => [r.id, { label: r.label, short: r.short, order: r.sort_order }])) : fallback

export const mapPlans = (rows) =>
  visible(rows).map((p) => ({
    id: p.id,
    majorId: p.major_id,
    major: p.major,
    label: p.label,
    years: p.years,
    current: p.is_current,
    appliesTo: p.applies_to,
    officialSheet: { title: p.sheet_title, pdf: p.sheet_pdf, pages: p.sheet_pages, publisher: p.sheet_publisher },
    semesters: p.semesters,
    requirements: p.requirements ?? [],
    deptElectives: p.dept_electives ?? [],
    genEdElectiveDepartments: p.gen_ed_elective_departments,
    overrides: p.overrides ?? {},
    notes: p.notes ?? [],
  }))

export function mapAssistant(row, fallback) {
  if (!row) return fallback
  return {
    ...fallback,
    name: row.name,
    tagline: row.tagline ?? fallback.tagline,
    intro: row.intro ?? fallback.intro,
    disclaimer: row.disclaimer ?? fallback.disclaimer,
    unknownAnswer: row.unknown_answer ?? fallback.unknownAnswer,
    courseCountOptions: row.course_count_options?.length ? row.course_count_options : fallback.courseCountOptions,
    timeOptions: row.time_options?.length ? row.time_options : fallback.timeOptions,
    hourOptions: row.hour_options?.length ? row.hour_options : fallback.hourOptions,
    days: row.days?.length ? row.days : fallback.days,
  }
}
