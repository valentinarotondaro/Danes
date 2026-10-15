// scripts/seed-city-walks.mjs
//
// Seeds the 3 "city walks" events shown on the homepage hi-fi (Aarhus /
// Copenhagen / Billund), so the real "Join us in our city walks" section
// has live Appwrite data instead of an empty state.
//
// Usage: node scripts/seed-city-walks.mjs
// Safe to re-run — skips any event whose title already exists.

import 'dotenv/config'
import { Client, Databases, Query, ID } from 'node-appwrite'

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

function nextFriday(hour) {
  const d = new Date()
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7))
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

const events = [
  {
    title: 'Exploring La Cabra',
    description: "Start the morning at one of Aarhus' most loved coffee roasteries. We'll chat in Danish about hygge and small talk while we practice ordering like a local.",
    location: 'La Cabra, Aarhus',
    city: 'Aarhus',
    imageUrl: '/img/aarhus-la-cabra.jpg',
    dateTime: nextFriday(9),
    capacity: 15,
    published: true,
  },
  {
    title: 'Film night: Druk',
    description: "Watch Thomas Vinterberg's award-winning Druk with Danish subtitles, then stay for a chat about the film, its humour, and what it says about Danish culture.",
    location: 'Empire Bio, Copenhagen',
    city: 'Copenhagen',
    imageUrl: '/img/copenhagen-druk.avif',
    dateTime: nextFriday(19),
    capacity: 25,
    published: true,
  },
  {
    title: 'Exploring Lego House',
    description: "Head to Billund for a playful day at LEGO House, where the famous brick was born. We'll explore the zones and practice everyday Danish along the way. Lunch included.",
    location: 'LEGO House, Billund',
    city: 'Billund',
    imageUrl: '/img/billund-legohouse.jpg',
    dateTime: nextFriday(10),
    capacity: 20,
    published: true,
  },
]

for (const ev of events) {
  const existing = await databases.listDocuments(DB_ID, 'events', [Query.equal('title', ev.title)])
  if (existing.total > 0) {
    console.log(`· "${ev.title}" already exists, skipped`)
    continue
  }
  const doc = await databases.createDocument(DB_ID, 'events', ID.unique(), ev)
  console.log(`✓ Created "${ev.title}" (${doc.$id})`)
}

console.log('\nDone.')
