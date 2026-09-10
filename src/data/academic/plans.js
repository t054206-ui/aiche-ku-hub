import { req } from './courses'

const { c } = req

/**
 * =====================================================================
 *  ACADEMIC_PLANS — one entry per academic-year version of the major sheet.
 *
 *  To add a new academic year: copy the latest entry, change `id`, `label`,
 *  `years`, `officialSheet.pdf` and whatever changed in the requirements.
 *  The selector, the plan view and the Schedule Assistant pick it up
 *  automatically.
 *
 *  `semesters` — set this when the department publishes an official
 *  semester-by-semester plan, e.g.
 *     semesters: [
 *       { year: 1, term: 'Fall',   courses: ['0410101', '0420101', '0420105', '9988123'] },
 *       { year: 1, term: 'Spring', courses: ['0410102', '0430101', '0430105'] },
 *     ]
 *  While it is null the page groups courses by the level encoded in the
 *  course number (1xx → Year 1 … 4xx → Year 4) and says so.
 *
 *  `overrides` — per-plan differences from the base catalog in ./courses.js
 *  (older sheets list different prerequisites for a few courses).
 * =====================================================================
 */

const MATH_SCIENCE = ['0430101', '0430105', '0430102', '0430107', '0410101', '0410102', '0410111', '0410211', '0410240', '0420101', '0420105', '0420208', '0420217', '0420269']

const CHE_CORE_2024 = ['0640211', '0640241', '0640242', '0640291', '0640321', '0640324', '0640343', '0640344', '0640345', '0640351', '0640352', '0640482', '0640393', '0640428', '0640440', '0640443', '0640461', '0640472', '0640491']
const CHE_CORE_OLD = CHE_CORE_2024.filter((code) => code !== '0640482') // Industrial Safety was a department elective before 2024

const DEPT_ELECTIVES_2024 = ['0640304', '0640314', '0640353', '0640395', '0640449', '0640452', '0640457', '0640462', '0640463', '0640465', '0640471', '0640474', '0640475', '0640478', '0640479', '0640481', '0640484', '0640493', '0640495', '0640445', '0640316', '0640333', '0640450']
const DEPT_ELECTIVES_OLD = ['0640304', '0640314', '0640327', '0640353', '0640395', '0640449', '0640452', '0640457', '0640462', '0640463', '0640465', '0640471', '0640474', '0640475', '0640478', '0640479', '0640481', '0640482', '0640484', '0640493', '0640495', '0640445', '0640316', '0640333', '0640450']

/** General Education elective departments listed on the 2024 sheet (student picks 6 credits). */
const GEN_ED_ELECTIVE_DEPARTMENTS = [
  { code: '0200', department: 'College of Law', courses: '105 Human Rights · 106 Constitutional System of Kuwait' },
  { code: '0900', department: 'College of Sharia', courses: '102 Islamic Culture' },
  { code: '0910', department: 'Tafsir & Hadith', courses: '233 Biography of the Prophet' },
  { code: '0310', department: 'Arabic Language & Literature', courses: 'All courses' },
  { code: '0320', department: 'English Language & Literature', courses: 'All courses' },
  { code: '0330', department: 'History', courses: 'All courses' },
  { code: '0360', department: 'Philosophy', courses: 'All courses' },
  { code: '0380', department: 'Mass Communication', courses: 'All courses' },
  { code: '0810', department: 'Educational Administration & Planning', courses: 'All courses' },
  { code: '0820', department: 'Foundations of Education', courses: 'All courses' },
  { code: '0920', department: 'Creed & Da‘wah', courses: 'All courses' },
  { code: '0930', department: 'Fiqh & its Foundations', courses: 'All courses' },
  { code: '0940', department: 'Comparative Fiqh & Sharia Policy', courses: 'All courses' },
  { code: '1340', department: 'Geography', courses: 'All courses' },
  { code: '1350', department: 'Psychology', courses: 'All courses' },
  { code: '1360', department: 'Political Science', courses: 'All courses' },
  { code: '1370', department: 'Sociology', courses: 'All courses' },
  { code: '9989', department: 'Language Centre', courses: 'All courses' },
]

const electiveSlotsOld = [
  { id: 'che-elective', label: 'Chemical Engineering elective', credits: 3, chooseFrom: ['0640473', '0630241'], rule: '3 credits only — Polymer Engineering or Material Science.' },
  { id: 'dept-elective-1', label: 'Department elective 1', credits: 3, chooseFrom: 'dept-electives', rule: 'At least 200 level. 6 credits in total from the Department Electives list (two courses).' },
  { id: 'dept-elective-2', label: 'Department elective 2', credits: 3, chooseFrom: 'dept-electives', rule: 'At least 200 level. 6 credits in total from the Department Electives list (two courses).' },
  { id: 'sci-elective', label: 'Department or College of Science elective', credits: 3, chooseFrom: null, rule: 'At least 200 level, 3 credits, from the Department or the College of Science, with consent of the Department.' },
]

const genEdOld = {
  id: 'gen-ed',
  title: 'General Education',
  courses: ['9988123', '9988221'],
  slots: [
    { id: 'gen-ed-restricted', label: 'Restricted elective', credits: 3, chooseFrom: ['0330100', '0330102'], rule: 'General Education restricted elective, as listed on the sheet.' },
    { id: 'gen-ed-elective-1', label: 'General Education elective 1', credits: 3, chooseFrom: null, rule: 'From the list available for Engineering students.' },
    { id: 'gen-ed-elective-2', label: 'General Education elective 2', credits: 3, chooseFrom: null, rule: 'From the list available for Engineering students.' },
  ],
}

export const ACADEMIC_PLANS = [
  {
    id: 'che-2024',
    majorId: 'che',
    major: 'Chemical Engineering',
    label: '2024 – Current',
    years: '2024–Current',
    current: true,
    appliesTo: 'Students who joined the Chemical Engineering programme in 2024 or later.',
    officialSheet: {
      title: 'ChE Major Sheet (2024–Current)',
      pdf: '/major-sheets/che-major-sheet-2024-current.pdf',
      pages: 16,
      publisher: 'AIChE Kuwait University Student Chapter',
    },
    semesters: null,
    requirements: [
      { id: 'math-science', title: 'Mathematics & Science', courses: MATH_SCIENCE },
      {
        id: 'college',
        title: 'College of Engineering & Petroleum',
        courses: ['0600201', '0600208', '0600209', '0600304', '0600307'],
        slots: [{ id: 'eng-restricted', label: 'Engineering restricted elective', credits: 3, chooseFrom: null, rule: 'Any 0600 course that is not mandatory.' }],
      },
      { id: 'che-core', title: 'Chemical Engineering (compulsory)', courses: CHE_CORE_2024 },
      {
        id: 'che-electives',
        title: 'Chemical Engineering electives',
        courses: [],
        slots: [
          { id: 'che-elective', label: 'Chemical Engineering elective', credits: 3, chooseFrom: ['0640473', '0630241', '0640327'], rule: '3 credits only — Polymer Engineering, Material Science or Corrosion Engineering.' },
          ...electiveSlotsOld.slice(1),
        ],
      },
      {
        ...genEdOld,
        slots: [
          { id: 'gen-ed-restricted', label: 'Restricted elective', credits: 3, chooseFrom: ['0330100', '0600310'], rule: 'General Education restricted elective, as listed on the sheet.' },
          ...genEdOld.slots.slice(1),
        ],
      },
    ],
    deptElectives: DEPT_ELECTIVES_2024,
    genEdElectiveDepartments: GEN_ED_ELECTIVE_DEPARTMENTS,
    overrides: {},
    notes: [
      'Introduction to Design and Product Fabrication (0600201) replaces Engineering Graphics and the Electrical Engineering Fundamentals pair from earlier sheets.',
      'Industrial Safety (0640482) is a compulsory course on this sheet.',
      'An Engineering restricted elective (any non-mandatory 0600 course) was added.',
    ],
  },
  {
    id: 'che-2019',
    majorId: 'che',
    major: 'Chemical Engineering',
    label: '2019 – 2023',
    years: '2019–2023',
    current: false,
    appliesTo: 'Students who joined the Chemical Engineering programme between 2019 and 2023.',
    officialSheet: {
      title: 'ChE Major Sheet (2019–2023)',
      pdf: '/major-sheets/che-major-sheet-2019-2023.pdf',
      pages: 17,
      publisher: 'AIChE Kuwait University Student Chapter',
    },
    semesters: null,
    requirements: [
      { id: 'math-science', title: 'Mathematics & Science', courses: MATH_SCIENCE },
      { id: 'college', title: 'College of Engineering & Petroleum', courses: ['0600104', '0600205', '0600207', '0600208', '0600209', '0600304', '0600307'] },
      { id: 'che-core', title: 'Chemical Engineering (compulsory)', courses: CHE_CORE_OLD },
      { id: 'che-electives', title: 'Chemical Engineering electives', courses: [], slots: electiveSlotsOld },
      genEdOld,
    ],
    deptElectives: DEPT_ELECTIVES_OLD,
    genEdElectiveDepartments: null,
    overrides: {
      '0430101': { prerequisites: [c('0410091'), c('9988098')] },
      '0640291': { prerequisites: [c('0600104'), c('0640211')] },
      '0640324': { prerequisites: [c('0420269'), c('0600307'), c('0640321')] },
      '0640352': { prerequisites: [c('0600207'), c('0640351'), c('0600304')] },
      '0640440': { prerequisites: [c('0640345'), c('0600307')] },
      '0640491': { prerequisites: [c('0640351'), c('0640393'), c('0640440')], corequisites: [] },
      '0640482': { prerequisites: [], corequisites: [c('0640351')] },
    },
    notes: [
      'Course 0640302 does not count as a Department elective (note printed on the sheet).',
      'Industrial Safety (0640482) is a Department elective on this sheet.',
    ],
  },
  {
    id: 'che-2015',
    majorId: 'che',
    major: 'Chemical Engineering',
    label: '2015 – 2018',
    years: '2015–2018',
    current: false,
    appliesTo: 'Students who joined the Chemical Engineering programme between 2015 and 2018.',
    officialSheet: {
      title: 'ChE Major Sheet (2015–2018)',
      pdf: '/major-sheets/che-major-sheet-2015-2018.pdf',
      pages: 17,
      publisher: 'AIChE Kuwait University Student Chapter',
    },
    semesters: null,
    requirements: [
      { id: 'math-science', title: 'Mathematics & Science', courses: MATH_SCIENCE },
      { id: 'college', title: 'College of Engineering & Petroleum', courses: ['0600104', '0600205', '0600207', '0600208', '0600209', '0600304', '0600307'] },
      { id: 'che-core', title: 'Chemical Engineering (compulsory)', courses: CHE_CORE_OLD },
      { id: 'che-electives', title: 'Chemical Engineering electives', courses: [], slots: electiveSlotsOld },
      genEdOld,
    ],
    deptElectives: DEPT_ELECTIVES_OLD,
    genEdElectiveDepartments: null,
    overrides: {
      '0430101': { prerequisites: [c('0410091'), c('9988098')] },
      '0640211': { corequisites: [c('0420208')] },
      '0640291': { prerequisites: [c('0600104'), c('0640211')], corequisites: [] },
      '0640324': { prerequisites: [c('0420269'), c('0600307'), c('0640321')], corequisites: [] },
      '0640345': { prerequisites: [], corequisites: [c('0640343')] },
      '0640352': { prerequisites: [c('0600207'), c('0640351'), c('0600304')] },
      '0640428': { prerequisites: [c('0640324')] },
      '0640440': { prerequisites: [c('0640345'), c('0600307')] },
      '0640491': { prerequisites: [c('0640351'), c('0640393'), c('0640440')], corequisites: [] },
      '0640482': { prerequisites: [], corequisites: [c('0640351')] },
    },
    notes: [
      'Course 0640302 does not count as a Department elective (note printed on the sheet).',
      'Industrial Safety (0640482) is a Department elective on this sheet.',
    ],
  },
]

export const DEFAULT_PLAN_ID = ACADEMIC_PLANS.find((p) => p.current)?.id ?? ACADEMIC_PLANS[0].id

export const getPlan = (id) => ACADEMIC_PLANS.find((p) => p.id === id) ?? null
