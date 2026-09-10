/** Copy and settings for the Schedule Assistant. */
export const ASSISTANT = {
  name: 'AIChE Schedule Assistant',
  tagline: 'Plan my semester',
  intro:
    'Tell me which courses you have completed and what you are taking now. I will suggest a semester based only on the major sheet you selected.',
  disclaimer:
    'AIChE Schedule Assistant is a planning tool and is not a substitute for official Kuwait University academic advising. Always verify prerequisites, course availability, and graduation requirements with the university.',
  unknownAnswer:
    "I don't have enough official information to confirm this. Please check the official Kuwait University course information.",
  /** Optional Claude-powered chat. Leave unset to use the built-in rule-based assistant only. */
  llmEndpoint: import.meta.env.VITE_ASSISTANT_ENDPOINT || null,
  courseCountOptions: [3, 4, 5, 6],
  timeOptions: [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'none', label: 'No preference' },
  ],
  hourOptions: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
}
