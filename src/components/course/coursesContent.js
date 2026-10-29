// Fixed copy for the Courses page. The course cards themselves come from
// Appwrite; this is the text around them.

export const LEVEL_FILTERS = [
  { value: 'All', label: 'All levels' },
  { value: 'A1', label: 'A1 Beginner' },
  { value: 'A2', label: 'A2 Elementary' },
  { value: 'B1', label: 'B1 Intermediate' },
]

export const INCLUDED = [
  { n: '01', title: 'Short video lessons', text: 'Watch on the bus or after work. Every lesson is one real situation, start to finish.' },
  { n: '02', title: 'Practice after every lesson', text: 'Quick exercises to check what stuck before you move on.' },
  { n: '03', title: 'Your progress, saved', text: 'Pick up where you left off on any device, and see how far you’ve come.' },
  { n: '04', title: 'Speak it on Fridays', text: 'Add the Speaking Club and use the week’s words with real people.' },
]

export const PATH = [
  { level: 'A1 Beginner', course: 'Danish for newcomers', can: 'Introduce yourself, order at the bakery, and understand the basics of a letter from the kommune.' },
  { level: 'A2 Elementary', course: 'Danish for work', can: 'Write a short email, follow a team meeting and hold your own in small talk at lunch.' },
  { level: 'B1 Intermediate', course: 'Danish for the exam', can: 'Read, write and speak with confidence for Prøve i Dansk 1–3 and Studieprøven.' },
]

export const PLANS = [
  { name: 'Course', what: 'One course of your choice.', price: 399, features: ['All lessons and exercises', 'Track your progress'] },
  {
    name: 'Starter', what: 'Learn the words, then use them on Friday.', price: 549, featured: true, tag: 'Course + club',
    features: ['One course of your choice', 'Weekly Speaking Club', 'Save 100 kr. every month'],
  },
  { name: 'Complete', what: 'Everything DANES has, in one plan.', price: 729, features: ['One course of your choice', 'Weekly Speaking Club', 'Monthly events and city walks'] },
]

export const FAQ = [
  { q: 'Are the lessons live or recorded?', a: 'Lessons are recorded, so you watch them when it suits you. Live practice happens in the Friday Speaking Club.' },
  { q: 'Which course should I start with?', a: 'Take the free level test. It places you and recommends the course that fits.' },
  { q: 'Can I switch to another course?', a: 'Yes. Change your course from your account; your plan stays the same.' },
  { q: 'How much time do I need each week?', a: 'Lessons are short, so you can fit them around work. Go as fast or as slow as you like.' },
  { q: 'Can I pause or cancel my plan?', a: 'Yes, any time from your account. You keep access until the end of the month.' },
]