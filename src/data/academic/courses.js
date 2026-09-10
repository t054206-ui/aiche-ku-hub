/**
 * =====================================================================
 *  COURSE CATALOG — Chemical Engineering, Kuwait University
 *
 *  Source: the AIChE KU major-sheet PDFs (2015–2018, 2019–2023, 2024–Current)
 *  in /public/major-sheets. Every code, name, credit value and requirement
 *  below was transcribed from those sheets — nothing was added from memory.
 *  Where a sheet leaves something blank (e.g. credits for department
 *  electives) the field is null and the UI says so.
 *
 *  ⚠️  The official PDF is always the source of truth. Verify this file
 *      against it before relying on it for advising.
 *
 *  Requirement objects (used for `prerequisites` and `corequisites`;
 *  everything inside an array must be satisfied — AND):
 *    { type: 'course', code: '0410101' }
 *    { type: 'anyOf',  codes: ['0600307', '0600308'] }      // OR
 *    { type: 'credits', min: 45 }                           // completed credits
 *    { type: 'gpa', min: 3.0 }                              // cannot be checked by the site
 *    { type: 'note', text: 'Consent of the Department' }    // informational only
 *
 *  Plan-specific differences (e.g. 2019 vs 2024 prerequisites) live in
 *  `overrides` inside each plan in ./plans.js, so this file holds the
 *  2024–Current version as the base.
 * =====================================================================
 */

const c = (code) => ({ type: 'course', code })
const anyOf = (...codes) => ({ type: 'anyOf', codes })
const credits = (min) => ({ type: 'credits', min })
const gpa = (min) => ({ type: 'gpa', min })
const note = (text) => ({ type: 'note', text })

/** Category ids → display labels. */
export const COURSE_CATEGORIES = {
  foundation: { label: 'Foundation (pre-programme)', short: 'Foundation', order: 0 },
  'math-science': { label: 'Mathematics & Science', short: 'Math & Science', order: 1 },
  college: { label: 'College of Engineering & Petroleum', short: 'College', order: 2 },
  'che-core': { label: 'Chemical Engineering (compulsory)', short: 'ChE core', order: 3 },
  'che-elective': { label: 'Chemical Engineering electives', short: 'ChE elective', order: 4 },
  'dept-elective': { label: 'Department electives', short: 'Dept. elective', order: 5 },
  'gen-ed': { label: 'General Education', short: 'Gen. Ed.', order: 6 },
  other: { label: 'Other', short: 'Other', order: 7 },
}

export const COURSE_CATALOG = [
  // ---- Foundation courses (referenced as prerequisites; not credit-bearing on the sheet) ----
  { code: '9988098', name: 'Pre-English', credits: 0, category: 'foundation', prerequisites: [], corequisites: [], notes: 'Foundation course. Students who are exempt can mark it as completed.' },
  { code: '0410091', name: 'Pre-Calculus', credits: 0, category: 'foundation', prerequisites: [], corequisites: [], notes: 'Foundation course. Students who are exempt can mark it as completed.' },
  { code: '0420092', name: 'Pre-Chemistry', credits: 0, category: 'foundation', prerequisites: [], corequisites: [], notes: 'Foundation course. Students who are exempt can mark it as completed.' },

  // ---- Mathematics and Science ----
  { code: '0430101', name: 'Physics 1', credits: 3, category: 'math-science', prerequisites: [c('9988098')], corequisites: [c('0410101')] },
  { code: '0430105', name: 'Physics 1 Lab', credits: 1, category: 'math-science', prerequisites: [], corequisites: [c('0430101')] },
  { code: '0430102', name: 'Physics 2', credits: 3, category: 'math-science', prerequisites: [c('0430101')], corequisites: [] },
  { code: '0430107', name: 'Physics 2 Lab', credits: 1, category: 'math-science', prerequisites: [c('0430105')], corequisites: [c('0430102')] },
  { code: '0410101', name: 'Calculus A', credits: 3, category: 'math-science', prerequisites: [c('0410091')], corequisites: [] },
  { code: '0410102', name: 'Calculus B', credits: 3, category: 'math-science', prerequisites: [c('0410101')], corequisites: [] },
  { code: '0410111', name: 'Linear Algebra', credits: 3, category: 'math-science', prerequisites: [c('0410091')], corequisites: [] },
  { code: '0410211', name: 'Calculus C', credits: 3, category: 'math-science', prerequisites: [c('0410102'), c('0410111')], corequisites: [] },
  { code: '0410240', name: 'Ordinary Differential Equations', short: 'Differential Equations', credits: 3, category: 'math-science', prerequisites: [c('0410111')], corequisites: [c('0410211')] },
  { code: '0420101', name: 'Chemistry 1', credits: 3, category: 'math-science', prerequisites: [c('0420092')], corequisites: [] },
  { code: '0420105', name: 'Chemistry 1 Lab', credits: 1, category: 'math-science', prerequisites: [], corequisites: [c('0420101')] },
  { code: '0420208', name: 'General & Analytical Chemistry', short: 'Analytical Chemistry', credits: 4, category: 'math-science', prerequisites: [c('0420101'), c('0420105')], corequisites: [] },
  { code: '0420217', name: 'Physical Chemistry', credits: 3, category: 'math-science', prerequisites: [c('0420208'), c('0410102'), c('0430107'), c('0430102')], corequisites: [] },
  { code: '0420269', name: 'Organic Chemistry', credits: 4, category: 'math-science', prerequisites: [c('0420208')], corequisites: [] },

  // ---- College of Engineering and Petroleum ----
  { code: '0600201', name: 'Introduction to Design and Product Fabrication', short: 'Intro. Design & Product Fabrication', credits: 3, category: 'college', prerequisites: [c('0430102')], corequisites: [] },
  { code: '0600104', name: 'Engineering Graphics and Design', short: 'Engineering Graphics', credits: 2, category: 'college', prerequisites: [], corequisites: [], notes: 'Appears on the 2015–2018 and 2019–2023 sheets only.' },
  { code: '0600205', name: 'Electrical Engineering Fundamentals', credits: 3, category: 'college', prerequisites: [c('0430102')], corequisites: [c('0410240'), c('0600207')], notes: 'Appears on the 2015–2018 and 2019–2023 sheets only.' },
  { code: '0600207', name: 'Electrical Engineering Fundamentals Lab', credits: 1, category: 'college', prerequisites: [c('0430107')], corequisites: [c('0600205')], notes: 'Appears on the 2015–2018 and 2019–2023 sheets only.' },
  { code: '0600208', name: 'Engineering Thermodynamics', credits: 3, category: 'college', prerequisites: [c('0430102'), c('0410102')], corequisites: [] },
  { code: '0600209', name: 'Engineering Economy', credits: 3, category: 'college', prerequisites: [c('0410211')], corequisites: [] },
  { code: '0600304', name: 'Engineering Probability and Statistics', short: 'Probability & Statistics', credits: 3, category: 'college', prerequisites: [c('0410211')], corequisites: [] },
  { code: '0600307', name: 'Applied Numerical Methods and Programming for Engineers', short: 'Numerical Methods', credits: 3, category: 'college', prerequisites: [c('0410240')], corequisites: [] },
  { code: '0600308', name: 'Course 0600308', credits: null, category: 'other', prerequisites: [], corequisites: [], unlisted: true, notes: 'Referenced by some department electives ("0600307 or 0600308") but not described on the major sheet.' },
  { code: '0600310', name: 'Engineering Ethics', credits: 3, category: 'gen-ed', prerequisites: [c('9988221')], corequisites: [] },

  // ---- Major requirements (compulsory) ----
  { code: '0640211', name: 'Basic Principles in Chemical Engineering', short: 'Basic Principles ChE', credits: 3, category: 'che-core', prerequisites: [], corequisites: [c('0420208'), c('0600208')] },
  { code: '0640241', name: 'Fluid Mechanics', credits: 3, category: 'che-core', prerequisites: [c('0430102')], corequisites: [c('0410211'), c('0410240')] },
  { code: '0640242', name: 'Fluid Mechanics Laboratory', short: 'Fluid Mechanics Lab', credits: 1, category: 'che-core', prerequisites: [c('0640241')], corequisites: [] },
  { code: '0640291', name: 'Fundamentals of Chemical Engineering Design', short: 'Fundamentals of ChE Design', credits: 3, category: 'che-core', prerequisites: [c('0600201'), c('0640211')], corequisites: [c('0600209')] },
  { code: '0640321', name: 'Chemical Engineering Thermodynamics', short: 'ChE Thermodynamics', credits: 3, category: 'che-core', prerequisites: [c('0600208'), c('0420217')], corequisites: [] },
  { code: '0640324', name: 'Kinetics and Reactor Design (A)', short: 'Kinetics A', credits: 3, category: 'che-core', prerequisites: [c('0420269'), c('0600307'), c('0420217')], corequisites: [c('0640291')] },
  { code: '0640343', name: 'Heat Transfer', credits: 3, category: 'che-core', prerequisites: [c('0410240'), c('0600208'), c('0640241')], corequisites: [] },
  { code: '0640344', name: 'Heat Transfer Laboratory', short: 'Heat Transfer Lab', credits: 1, category: 'che-core', prerequisites: [c('0640242'), c('0640343'), c('9988221')], corequisites: [] },
  { code: '0640345', name: 'Mass Transfer', credits: 3, category: 'che-core', prerequisites: [c('0640211')], corequisites: [c('0640343')] },
  { code: '0640351', name: 'Process Dynamics and Control', short: 'Process Control', credits: 3, category: 'che-core', prerequisites: [c('0640324'), c('0640343')], corequisites: [] },
  { code: '0640352', name: 'Process Dynamics and Control Lab', short: 'Process Control Lab', credits: 1, category: 'che-core', prerequisites: [c('0640351'), c('0600304')], corequisites: [] },
  { code: '0640482', name: 'Industrial Safety', credits: 3, category: 'che-core', prerequisites: [], corequisites: [c('0640351')] },
  { code: '0640393', name: 'Chemical Process Synthesis', short: 'Process Synthesis', credits: 3, category: 'che-core', prerequisites: [c('0600209'), c('0640291'), c('0640324'), c('0640345')], corequisites: [] },
  { code: '0640428', name: 'Kinetics and Reactor Design (B)', short: 'Kinetics B', credits: 3, category: 'che-core', prerequisites: [c('0640324'), c('0640345')], corequisites: [] },
  { code: '0640440', name: 'Mass Transfer Operations', credits: 3, category: 'che-core', prerequisites: [c('0640345'), c('0640321'), c('0600307')], corequisites: [] },
  { code: '0640443', name: 'Mass Transfer Operations Lab', credits: 1, category: 'che-core', prerequisites: [c('0640344'), c('0640440')], corequisites: [] },
  { code: '0640461', name: 'Water Desalination', credits: 3, category: 'che-core', prerequisites: [c('0640343')], corequisites: [] },
  { code: '0640472', name: 'Petroleum Refining Engineering', short: 'Petroleum Refining', credits: 3, category: 'che-core', prerequisites: [c('0420269'), c('0640440')], corequisites: [] },
  { code: '0640491', name: 'Plant Design', credits: 3, category: 'che-core', prerequisites: [c('0640482'), c('0640393'), c('0640440')], corequisites: [c('0640428')] },

  // ---- Chemical Engineering electives ("3 credits only" group) ----
  { code: '0640473', name: 'Polymer Engineering', credits: 3, category: 'che-elective', prerequisites: [c('0420269')], corequisites: [] },
  { code: '0630241', name: 'Material Science', credits: 3, category: 'che-elective', prerequisites: [c('0420101'), c('0420105')], corequisites: [] },
  { code: '0640327', name: 'Corrosion Engineering', credits: 3, category: 'che-elective', prerequisites: [credits(45)], corequisites: [], notes: 'The 2024–Current sheet prints this course with the number 0640473 (the same as Polymer Engineering); earlier sheets list it as 0640327. Verify the number with the department.' },

  // ---- Department electives (credits are not listed on the sheet) ----
  { code: '0640304', name: 'Intro. to Environmental Engineering', credits: null, category: 'dept-elective', prerequisites: [credits(45)], corequisites: [] },
  { code: '0640314', name: 'Properties of Materials', credits: null, category: 'dept-elective', prerequisites: [c('0640291')], corequisites: [] },
  { code: '0640353', name: 'Mathematical Methods in Chemical Engineering', credits: null, category: 'dept-elective', prerequisites: [anyOf('0600308', '0600307')], corequisites: [c('0640343')] },
  { code: '0640395', name: 'Engineering Training', credits: null, category: 'dept-elective', prerequisites: [credits(90)], corequisites: [] },
  { code: '0640449', name: 'Multi-component Phase Separation', credits: null, category: 'dept-elective', prerequisites: [c('0640440')], corequisites: [] },
  { code: '0640452', name: 'System Analysis and Simulation', credits: null, category: 'dept-elective', prerequisites: [anyOf('0600307', '0600308'), c('0640343')], corequisites: [] },
  { code: '0640457', name: 'Optimization Techniques', credits: null, category: 'dept-elective', prerequisites: [anyOf('0600307', '0600308')], corequisites: [] },
  { code: '0640462', name: 'Intro. to Biochemical Engineering', credits: null, category: 'dept-elective', prerequisites: [c('0640324')], corequisites: [] },
  { code: '0640463', name: 'Wastewater Treatment', credits: null, category: 'dept-elective', prerequisites: [c('0640211')], corequisites: [] },
  { code: '0640465', name: 'Air Pollution', credits: null, category: 'dept-elective', prerequisites: [credits(90)], corequisites: [] },
  { code: '0640471', name: 'Gas Engineering', credits: null, category: 'dept-elective', prerequisites: [c('0640321'), c('0640345')], corequisites: [] },
  { code: '0640474', name: 'Petrochemical Engineering', credits: null, category: 'dept-elective', prerequisites: [c('0420269'), c('0640211')], corequisites: [] },
  { code: '0640475', name: 'Gas Sweetening', credits: null, category: 'dept-elective', prerequisites: [c('0640321'), c('0640345')], corequisites: [] },
  { code: '0640478', name: 'Liquefied Natural Gas', credits: null, category: 'dept-elective', prerequisites: [c('0640321')], corequisites: [] },
  { code: '0640479', name: 'Rheology and Polymer Processing', credits: null, category: 'dept-elective', prerequisites: [anyOf('0600307', '0600308'), c('0640242')], corequisites: [] },
  { code: '0640481', name: 'Operations Research', credits: null, category: 'dept-elective', prerequisites: [anyOf('0600307', '0600308')], corequisites: [] },
  { code: '0640484', name: 'Topics in Chemical Engineering', credits: null, category: 'dept-elective', prerequisites: [credits(75)], corequisites: [] },
  { code: '0640493', name: 'Equipment Design', credits: null, category: 'dept-elective', prerequisites: [c('0640345')], corequisites: [] },
  { code: '0640495', name: 'Senior Project', credits: null, category: 'dept-elective', prerequisites: [credits(100), gpa(3.0)], corequisites: [] },
  { code: '0640445', name: 'Thin Film Structure and Deposition', credits: null, category: 'dept-elective', prerequisites: [c('0640345')], corequisites: [] },
  { code: '0640316', name: 'Hydrogen Technology', credits: null, category: 'dept-elective', prerequisites: [credits(45)], corequisites: [] },
  { code: '0640333', name: 'Artificial Intelligence for Chemical Engineering', credits: null, category: 'dept-elective', prerequisites: [c('0640211'), c('0600307')], corequisites: [] },
  { code: '0640450', name: 'Troubleshooting Chemical Engineering Operations', credits: null, category: 'dept-elective', prerequisites: [c('0640291')], corequisites: [c('0640440')] },

  // ---- General Education ----
  { code: '9988123', name: 'English 123', short: 'English 123 (Writing Skills)', credits: 3, category: 'gen-ed', prerequisites: [c('9988098')], corequisites: [] },
  { code: '9988221', name: 'English 221', short: 'English 221 (Technical Writing)', credits: 3, category: 'gen-ed', prerequisites: [credits(30), c('9988123')], corequisites: [] },
  { code: '0330100', name: 'History of Kuwait', credits: 3, category: 'gen-ed', prerequisites: [], corequisites: [] },
  { code: '0330102', name: 'Islamic Cultural History', credits: 3, category: 'gen-ed', prerequisites: [], corequisites: [], notes: 'Appears on the 2015–2018 and 2019–2023 sheets only.' },
]

export const COURSE_INDEX = Object.fromEntries(COURSE_CATALOG.map((course) => [course.code, course]))

/** Year-level encoded in the course number (0640211 → 2, 0640491 → 4). Foundation courses are level 0. */
export function courseLevel(code) {
  const digit = Number(code[4])
  return Number.isNaN(digit) ? 0 : digit
}

// Re-exported helpers so plans.js can build overrides with the same shorthand.
export const req = { c, anyOf, credits, gpa, note }
