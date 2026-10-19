// src/components/speaking/speakingContent.js
//
// Fixed copy for the Speaking Club page. Sessions and hosts are real data
// from Appwrite (liveClasses and teachers); this is only the marketing text.

import sofia from '@/assets/img/avatar-sofia.jpg'
import tomas from '@/assets/img/avatar-tomas.jpg'
import galina from '@/assets/img/avatar-galina.jpg'

export const LEARNERS = [
  { name: 'Sofia', photo: sofia },
  { name: 'Tomas', photo: tomas },
  { name: 'Galina', photo: galina },
]

export const LEVEL_FILTERS = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'A1–A2' },
  { value: 'advanced', label: 'B1 and up' },
]

// Which liveClass levels each filter shows
export const LEVELS_IN_FILTER = { beginner: ['A1', 'A2'], advanced: ['B1'] }

export const FLOW = [
  { tone: 'sky', min: '0–5 min', title: 'Warm-up', text: 'Hej, names and one thing about your week. Everyone speaks in the first five minutes.' },
  { tone: 'red', min: '5–20 min', title: 'Pairs', text: 'Breakout rooms of two with a question card. Low pressure, lots of talking time.' },
  { tone: 'sky', min: '20–40 min', title: 'Group talk', text: 'Back together on the week’s topic. Your host keeps it moving and helps with words.' },
  { tone: 'red', min: '40–45 min', title: 'Words to keep', text: 'Three useful phrases from today, saved to your account for next week.' },
]

export const GROUP_POINTS = [
  'Book the same slot and keep your group',
  'See who’s in your group before you join',
  'Meet them in person at the monthly events',
]

export const READY = [
  { title: 'No app to install', text: 'Sessions open in your browser. Click the link in your account and you’re in.' },
  { title: 'Headphones help', text: 'They cut the echo and make it easier to follow what people say.' },
  { title: 'Camera on is nice', text: 'But not required. Many people start with audio only.' },
  { title: 'Mistakes are the point', text: 'Nobody corrects you mid-sentence. Your host collects tips for the end.' },
]

export const PLANS = [
  { name: 'Speaking Club', what: 'Every Friday session', price: 250 },
  { name: 'Social', what: 'Speaking Club + events', price: 329 },
  { name: 'Starter', what: 'A course + Speaking Club', price: 549, featured: true },
  { name: 'Complete', what: 'Course, club and events', price: 729 },
]

export const FAQ = [
  { q: 'What level do I need?', a: 'Any. A1–A2 groups start from simple phrases, and B1 groups are for people who can already hold a short conversation.' },
  { q: 'What if I don’t understand anything?', a: 'That’s normal in week one. Your host speaks slowly and switches to English for a word if you’re stuck.' },
  { q: 'Can I keep the same group?', a: 'Yes. Book the same slot each Friday and you stay with the same people.' },
  { q: 'What happens if a session is full?', a: 'Join the waitlist. If someone cancels, we email you and the seat is yours.' },
  { q: 'Is the session recorded?', a: 'No. What’s said in the group stays in the group.' },
]