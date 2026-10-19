// scripts/seed-events.mjs
//
// Adds sample events in the four cities, with every field the event detail
// page uses (agenda, words, host, meeting point). Run with: npm run seed:events
//
// Safe to re-run: an event whose title already exists is skipped.
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

// host = the teacher's first name in the teachers collection.
// Dates carry Danish time: +02:00 until 25 Oct (summer time), +01:00 after.
// Images live in public/img, so the URL starts with /img/.
const EVENTS = [
  // --- Copenhagen ---
  {
    title: 'Carlsberg Byen: a walk through brewery history',
    description: 'Walk through the old Carlsberg brewery, now a new part of the city. We talk about history, buildings and beer, then practise over coffee.',
    city: 'Copenhagen',
    location: 'Elefantporten, Carlsberg Byen',
    meetingPoint: 'Under the Elephant Gate on Ny Carlsberg Vej. Look for the red DANES sign.',
    imageUrl: '/img/event-carlsberg.jpg',
    dateTime: '2026-10-24T14:00:00+02:00',
    durationMinutes: 120,
    capacity: 20,
    spotsBooked: 9,
    price: 0,
    host: 'Sara',
    agenda: [
      '14:00 | Meet at the Elephant Gate | Name tags and hellos',
      '14:20 | Walk through Carlsberg Byen | Old brewery buildings, new homes',
      '15:15 | Coffee break | Order in Danish',
      '15:45 | Wrap-up | Three new words each',
    ],
    words: [
      'en port | a gate',
      'et bryggeri | a brewery',
      'en elefant | an elephant',
      'Skål! | Cheers!',
      'Hvor gammel er den? | How old is it?',
    ],
  },
  {
    title: 'Taste Danish at Torvehallerne',
    description: 'A morning at the food market: ask for prices, try samples and share smørrebrød. The easiest way to use your Danish at a counter.',
    city: 'Copenhagen',
    location: 'Torvehallerne, Frederiksborggade 21',
    meetingPoint: 'At the main entrance on Frederiksborggade.',
    imageUrl: '/img/event-torvehallerne.jpg',
    dateTime: '2026-11-21T10:00:00+01:00',
    durationMinutes: 90,
    capacity: 14,
    spotsBooked: 6,
    price: 0,
    host: 'Sara',
    agenda: [
      '10:00 | Meet at the market | Coffee first',
      '10:20 | Tasting round | Ask for prices and samples',
      '11:00 | Smørrebrød together | Read the menu out loud',
    ],
    words: [
      'Hvad koster det? | How much is it?',
      'en smagsprøve | a taste sample',
      'rugbrød | rye bread',
      'Jeg vil gerne have… | I would like…',
      'Det smager godt | It tastes good',
    ],
  },

  // --- Aarhus ---
  {
    title: 'ARoS: talk about art in Danish',
    description: 'Colours, feelings and opinions: we walk through ARoS and Your rainbow panorama, then each pick a work and say why we like it. Museum ticket not included.',
    city: 'Aarhus',
    location: 'ARoS, Aros Allé 2',
    meetingPoint: 'In the foyer, by the ticket desk.',
    imageUrl: '/img/event-aros.jpg',
    dateTime: '2026-10-31T13:00:00+01:00',
    durationMinutes: 120,
    capacity: 16,
    spotsBooked: 11,
    price: 0,
    host: 'Mette',
    agenda: [
      '13:00 | Meet in the foyer | Tickets and hellos',
      '13:15 | Your rainbow panorama | Colours and directions in Danish',
      '14:00 | Pick a work you like | Say why, in three sentences',
      '14:30 | Coffee in the café | Small talk about the visit',
    ],
    words: [
      'et maleri | a painting',
      'en farve | a colour',
      'Jeg kan godt lide… | I like…',
      'smuk | beautiful',
      'mærkelig | strange',
    ],
  },
  {
    title: 'Christmas in Den Gamle By',
    description: 'The old town dressed for Christmas. We walk the streets, learn the Christmas words and order æbleskiver like a Dane. Entry ticket not included.',
    city: 'Aarhus',
    location: 'Den Gamle By, Viborgvej 2',
    meetingPoint: 'Outside the main entrance on Viborgvej.',
    imageUrl: '/img/event-gamle-by.jpg',
    dateTime: '2026-12-05T11:00:00+01:00',
    durationMinutes: 150,
    capacity: 20,
    spotsBooked: 4,
    price: 0,
    host: 'Jonas',
    agenda: [
      '11:00 | Meet at the entrance | Tickets and hellos',
      '11:20 | Christmas streets | Old shops and Christmas words',
      '12:30 | Æbleskiver and gløgg | Order in Danish',
      '13:15 | Goodbye | Glædelig jul!',
    ],
    words: [
      'Glædelig jul | Merry Christmas',
      'æbleskiver | Danish pancake balls',
      'gløgg | mulled wine',
      'en nisse | a Christmas elf',
      'et juletræ | a Christmas tree',
    ],
  },

  // --- Esbjerg ---
  {
    title: 'Coastal walk to Men at Sea',
    description: 'A fresh walk by the sea to the four white giants of Mennesket ved Havet. Weather words, nature words, and hot chocolate at the end.',
    city: 'Esbjerg',
    location: 'Mennesket ved Havet, Sædding Strandvej',
    meetingPoint: 'In the car park at Mennesket ved Havet. Look for the red DANES sign.',
    imageUrl: '/img/event-men-at-sea.jpg',
    dateTime: '2026-11-07T10:00:00+01:00',
    durationMinutes: 90,
    capacity: 15,
    spotsBooked: 7,
    price: 0,
    host: 'Jonas',
    agenda: [
      '10:00 | Meet at the car park | Coats on, hellos',
      '10:15 | Walk along the coast | Weather and nature words',
      '10:45 | At the four white men | Describe what you see',
      '11:15 | Hot chocolate | Small talk to finish',
    ],
    words: [
      'havet | the sea',
      'Det blæser | It is windy',
      'en kæmpe | a giant',
      'koldt | cold',
      'Skal vi gå? | Shall we go?',
    ],
  },
  {
    // Full on purpose: shows "Join the waitlist" in the demo
    title: 'Hygge night: board games in Danish',
    description: 'Tea, candles and easy board games. Count, ask and argue in Danish, the most fun way to practise. Beginners welcome.',
    city: 'Esbjerg',
    location: 'Esbjerg Hovedbibliotek',
    meetingPoint: 'At the library café on the ground floor.',
    imageUrl: '/img/event-board-games.jpg',
    dateTime: '2026-11-13T18:30:00+01:00',
    durationMinutes: 150,
    capacity: 12,
    spotsBooked: 12,
    price: 0,
    host: 'Sara',
    agenda: [
      '18:30 | Tea and hellos | Find your table',
      '18:45 | Learn the rules in Danish | Easy games first',
      '19:45 | Bigger games | Count, ask, win',
      '20:45 | Godnat | Pick next month’s game',
    ],
    words: [
      'Det er din tur | It is your turn',
      'en terning | a die',
      'Jeg vandt! | I won!',
      'at snyde | to cheat',
      'hyggeligt | cosy',
    ],
  },

  // --- Odense ---
  {
    title: 'Fairy tale walk with H.C. Andersen',
    description: 'Walk the old streets where Hans Christian Andersen grew up, then read a short fairy tale together in easy Danish.',
    city: 'Odense',
    location: 'H.C. Andersens Hus',
    meetingPoint: 'By the museum entrance.',
    imageUrl: '/img/event-odense-old-town.jpg',
    dateTime: '2026-11-14T10:30:00+01:00',
    durationMinutes: 120,
    capacity: 16,
    spotsBooked: 5,
    price: 0,
    host: 'Mette',
    agenda: [
      '10:30 | Meet at the museum | Hellos',
      '10:45 | Walk the old town | Short fairy tale words',
      '11:30 | Read a tale together | Easy Danish version',
      '12:15 | Coffee | What was your favourite?',
    ],
    words: [
      'et eventyr | a fairy tale',
      'Der var engang… | Once upon a time…',
      'en prinsesse | a princess',
      'en ælling | a duckling',
      'grim | ugly',
    ],
  },
  {
    title: 'Street food night at Storms Pakhus',
    description: 'Pick a stall, order in Danish and share a long table. A relaxed Friday night with food from all over the world.',
    city: 'Odense',
    location: 'Storms Pakhus',
    meetingPoint: 'Just inside the main entrance.',
    imageUrl: '/img/event-storms-pakhus.jpg',
    dateTime: '2026-11-27T17:30:00+01:00',
    durationMinutes: 120,
    capacity: 18,
    spotsBooked: 8,
    price: 0,
    host: 'Mette',
    agenda: [
      '17:30 | Meet at the entrance | Hellos',
      '17:45 | Choose your food | Order in Danish',
      '18:30 | Eat together | Talk about your week',
      '19:15 | Godnat | See you next time',
    ],
    words: [
      'Hvad anbefaler du? | What do you recommend?',
      'stærk | spicy',
      'en gaffel | a fork',
      'Må jeg sidde her? | May I sit here?',
      'mæt | full (after eating)',
    ],
  },
]

async function run() {
  // Load teachers and existing events once, then match in JavaScript
  const [teachers, existing] = await Promise.all([
    databases.listDocuments(DB_ID, 'teachers', [Query.limit(100)]),
    databases.listDocuments(DB_ID, 'events', [Query.limit(100)]),
  ])
  const takenTitles = new Set(existing.documents.map((e) => e.title))

  // 'Mette' also matches 'Mette Hansen'
  const findTeacherId = (name) =>
    teachers.documents.find((t) => t.name.toLowerCase().startsWith(name.toLowerCase()))?.$id

  for (const { host, ...event } of EVENTS) {
    if (takenTitles.has(event.title)) {
      console.log(`  · ${event.title} (already exists, skipped)`)
      continue
    }

    const teacherId = findTeacherId(host)
    if (!teacherId) console.log(`    (no teacher called "${host}" yet, saved without host)`)

    try {
      await databases.createDocument(DB_ID, 'events', ID.unique(), {
        ...event,
        ...(teacherId && { teacherId }),
        published: true,
      })
      console.log(`  ✓ ${event.title} (${event.city})`)
    } catch (err) {
      console.error(`  ✗ ${event.title} — ${err.message}`)
    }
  }

  console.log('\nDone. Open /events to see them.')
}

run().catch((err) => {
  console.error('\nSeeding failed:', err)
  process.exit(1)
})