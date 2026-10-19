// scripts/seed-sessions.mjs
//
// Adds upcoming Friday Speaking Club sessions with topics, words and a host.
//   npm run seed:sessions            → the 6 Friday sessions (skips existing titles)
//   npm run seed:sessions -- --demo  → also a session starting in 5 minutes,
//                                      to show the Join button live in a demo
//
// Uses the same server API key as provision-appwrite.mjs (never VITE_).

import 'dotenv/config'
import { Client, Databases, ID, Query } from 'node-appwrite'

const ENDPOINT = process.env.APPWRITE_ENDPOINT
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID

for (const [name, val] of Object.entries({ ENDPOINT, PROJECT_ID, API_KEY, DB_ID })) {
  if (!val) {
    console.error(`Missing ${name} in your .env — add it before running this script.`)
    process.exit(1)
  }
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY)
const databases = new Databases(client)

// Danish time: +02:00 until 25 Oct (summer time), +01:00 after.
const SESSIONS = [
  {
    title: 'At the doctor',
    level: 'A1',
    dateTime: '2026-10-23T17:00:00+02:00',
    host: 'Sara',
    spotsBooked: 5,
    topics: [
      'When did you last go to the doctor?',
      'How do you book an appointment here?',
      'What’s different from your home country?',
    ],
    words: [
      'en tid hos lægen | a doctor’s appointment',
      'Jeg har ondt i … | My … hurts',
      'en recept | a prescription',
      'det gule kort | the yellow health card',
    ],
  },
  {
    title: 'Small talk at work',
    level: 'A2',
    dateTime: '2026-10-30T17:00:00+01:00',
    host: 'Mette',
    spotsBooked: 6,
    topics: [
      'What did you do this weekend?',
      'What do you usually eat for lunch?',
      'How do you say no politely?',
    ],
    words: [
      'Hvordan går det? | How are you?',
      'en kollega | a colleague',
      'frokost | lunch',
      'Hav en god weekend | Have a good weekend',
    ],
  },
  {
    title: 'Housing and neighbours',
    level: 'B1',
    dateTime: '2026-11-06T17:00:00+01:00',
    host: 'Jonas',
    spotsBooked: 3,
    topics: [
      'Describe where you live.',
      'What do you do if a neighbour is noisy?',
      'Renting or buying in Denmark: what do you think?',
    ],
    words: [
      'en lejlighed | an apartment',
      'huslejen | the rent',
      'en nabo | a neighbour',
      'at flytte | to move house',
    ],
  },
  {
    title: 'Shopping for food',
    level: 'A1',
    dateTime: '2026-11-13T17:00:00+01:00',
    host: 'Sara',
    spotsBooked: 4,
    topics: [
      'What do you buy every week?',
      'Where do you like to shop?',
      'Which Danish food do you like?',
    ],
    words: [
      'Hvad koster det? | How much is it?',
      'en pose | a bag',
      'på tilbud | on sale',
      'Kan jeg betale med kort? | Can I pay by card?',
    ],
  },
  {
    title: 'Hygge and the dark season',
    level: 'A2',
    dateTime: '2026-11-20T17:00:00+01:00',
    host: 'Mette',
    spotsBooked: 2,
    topics: [
      'What does hygge mean to you?',
      'How do you get through the dark months?',
      'What is your favourite winter tradition?',
    ],
    words: [
      'mørket | the dark',
      'et stearinlys | a candle',
      'hyggeligt | cosy',
      'at slappe af | to relax',
    ],
  },
  {
    title: 'The job interview',
    level: 'B1',
    dateTime: '2026-11-27T17:00:00+01:00',
    host: 'Jonas',
    spotsBooked: 7,
    topics: [
      'Tell us about yourself in one minute.',
      'What are your strengths?',
      'What would you ask the employer?',
    ],
    words: [
      'en jobsamtale | a job interview',
      'erfaring | experience',
      'mine styrker | my strengths',
      'Hvornår kan du starte? | When can you start?',
    ],
  },
]

// --demo: one extra session that starts in 5 minutes (room already open)
function demoSession() {
  const start = new Date(Date.now() + 5 * 60000)
  const hhmm = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return {
    title: `Demo: Small talk at work (${hhmm})`, // the time keeps each demo title unique
    level: 'A2',
    dateTime: start.toISOString(),
    host: 'Mette',
    spotsBooked: 3,
    topics: SESSIONS[1].topics,
    words: SESSIONS[1].words,
  }
}

async function run() {
  const list = process.argv.includes('--demo') ? [...SESSIONS, demoSession()] : SESSIONS

  const [teachers, existing] = await Promise.all([
    databases.listDocuments(DB_ID, 'teachers', [Query.limit(100)]),
    databases.listDocuments(DB_ID, 'liveClasses', [Query.limit(100)]),
  ])
  const takenTitles = new Set(existing.documents.map((s) => s.title))
  const findTeacherId = (name) =>
    teachers.documents.find((t) => t.name.toLowerCase().startsWith(name.toLowerCase()))?.$id

  for (const { host, ...session } of list) {
    if (takenTitles.has(session.title)) {
      console.log(`  · ${session.title} (already exists, skipped)`)
      continue
    }

    const teacherId = findTeacherId(host)
    if (!teacherId) console.log(`    (no teacher called "${host}" yet, saved without host)`)

    try {
      await databases.createDocument(DB_ID, 'liveClasses', ID.unique(), {
        ...session,
        ...(teacherId && { teacherId }),
        capacity: 8,
        price: 0, // included in the Speaking Club plans
        durationMinutes: 45,
        published: true,
      })
      console.log(`  ✓ ${session.title} (${session.level})`)
    } catch (err) {
      console.error(`  ✗ ${session.title} — ${err.message}`)
    }
  }

  console.log('\nDone. Open /live-classes to see them.')
}

run().catch((err) => {
  console.error('\nSeeding failed:', err)
  process.exit(1)
})