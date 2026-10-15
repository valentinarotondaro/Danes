// src/components/home/homeContent.js
//
// Fixed marketing copy for the home page. Kept out of the components so the
// templates stay short and the text is easy to edit in one place.
// Real data (courses, events) comes from Appwrite, not from here.

export const LEARNERS = [{ name: 'Sofia' }, { name: 'Tomas' }, { name: 'Galina' }]

export const STEPS = [
  { n: 1, tone: 'sky', title: 'Discover your Danish level', text: 'A free 15-minute placement test shows your level, your strengths and exactly where to start.' },
  { n: 2, tone: 'red', title: 'Explore our courses', text: 'Self-paced lessons for everyday life: the bakery, the bus, the doctor and your first brev.' },
  { n: 3, tone: 'sky', title: 'Join the Speaking Club', text: 'A weekly video hangout where you practise out loud with other learners and native speakers.' },
  { n: 4, tone: 'red', title: 'Come to our events', text: 'Julefrokost, hygge nights and city walks with your class. New DANES events every month.' },
]

export const VALUES = ['Community', 'Confidence', 'Support', 'Belonging', 'Opportunities', 'Motivation']

export const REVIEWS = [
  { quote: 'I went from panicking at Netto to actually chatting with the cashier. The Speaking Club made the difference.', name: 'Sofia', from: 'Argentina' },
  { quote: 'Recorded lessons meant I could study around night shifts. My CPR appointment last week was fully in Danish.', name: 'Tomas', from: 'Colombia' },
  { quote: 'My teacher understood exactly what expat life needed: job Danish, not just textbook Danish.', name: 'Galina', from: 'Ukraine' },
]

export const FAQ = [
  { q: 'Do I need Danish to get started?', a: 'No. The level test places you, and A1 starts from hej.' },
  { q: 'What happens after my first lesson?', a: 'You get your next lesson and a seat suggestion for the Friday Speaking Club.' },
  { q: 'Can I pause or cancel my plan?', a: 'Yes, any time from your account. You keep access until the end of the month.' },
  { q: 'Can I use DANES to prepare for an exam?', a: 'Yes. Danish for the exam prepares you for Prøve i Dansk 1–3 and Studieprøven.' },
  { q: 'How can I join the events?', a: 'Pick an event and save your spot. Events are included in the Social and Complete packages.' },
  { q: 'What if I’m an introvert?', a: 'Speaking Club groups are small, and you can listen first. Nobody is put on the spot.' },
]