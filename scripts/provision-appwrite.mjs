// scripts/provision-appwrite.mjs
//
// Provisions the entire Appwrite database structure from the Step 3 data
// model: 8 collections, their attributes/indexes, an "admins" Team, and
// role-based permissions (public read where appropriate, Admin-only writes,
// owner-only for profiles/orders).
//
// Run once with: npm run provision
// Safe to re-run — every create call is wrapped so "already exists" errors
// are skipped instead of crashing the script.
//
// Requires APPWRITE_API_KEY, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID and
// APPWRITE_DATABASE_ID in your root .env (NOT prefixed with VITE_ — that
// prefix is what Vite exposes to the browser bundle, and the API key must
// never end up client-side).

import 'dotenv/config'
import {
  Client,
  Databases,
  Teams,
  Permission,
  Role,
  DatabasesIndexType as IndexType,
} from 'node-appwrite'

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
const teams = new Teams(client)

// --- helpers -----------------------------------------------------------

async function ignoreExists(promise, label) {
  try {
    await promise
    console.log(`  ✓ ${label}`)
  } catch (err) {
    if (err.code === 409) {
      console.log(`  · ${label} (already exists, skipped)`)
    } else {
      console.error(`  ✗ ${label} — ${err.message}`)
    }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- admin team ----------------------------------------------------------

async function ensureAdminTeam() {
  console.log('\nAdmin team')
  await ignoreExists(teams.create('admins', 'Admins'), 'Team "admins" created')
  console.log('  → Add yourself to this Team from the Appwrite console (Auth/Teams)')
  console.log('    once you have a user account, so your admin routes/guards work.')
}

const ADMIN_ROLE = Role.team('admins')

// --- collection definitions ---------------------------------------------
// Each collection: id, name, permissions, documentSecurity flag, and its
// attributes/indexes. Relation fields (courseId, teacherId, userId, etc.)
// are plain strings, not native Appwrite relationship attributes — simpler
// and more portable for this project's scope.

const collections = [
  {
    id: 'profiles',
    name: 'Profiles',
    documentSecurity: true, // per-document owner permissions set by the app at creation time
    permissions: [Permission.create(Role.users())],
    attributes: [
      { kind: 'string', key: 'userId', size: 64, required: true },
      { kind: 'string', key: 'name', size: 128, required: true },
      { kind: 'string', key: 'email', size: 255, required: true },
      { kind: 'enum', key: 'role', elements: ['learner', 'admin'], required: true, default: 'learner' },
      { kind: 'string', key: 'journey', size: 64, required: false },
      { kind: 'datetime', key: 'createdAt', required: true },
    ],
    indexes: [{ key: 'userId_idx', type: IndexType.Key, attributes: ['userId'] }],
  },
  {
    id: 'teachers',
    name: 'Teachers',
    documentSecurity: false,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'name', size: 128, required: true },
      { kind: 'string', key: 'bio', size: 1000, required: false },
      { kind: 'string', key: 'photoUrl', size: 500, required: false },
      { kind: 'string', key: 'specialty', size: 128, required: false },
    ],
    indexes: [],
  },
  {
    id: 'courses',
    name: 'Courses',
    documentSecurity: false,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'title', size: 128, required: true },
      { kind: 'string', key: 'slug', size: 128, required: true },
      { kind: 'string', key: 'description', size: 1000, required: false },
      { kind: 'string', key: 'journeyTag', size: 64, required: false },
      { kind: 'float', key: 'price', required: true, default: 0 },
      { kind: 'string', key: 'thumbnailUrl', size: 500, required: false },
      { kind: 'boolean', key: 'published', required: true, default: false },
    ],
    indexes: [{ key: 'slug_unique', type: IndexType.Unique, attributes: ['slug'] }],
  },
  {
    id: 'lessons',
    name: 'Lessons',
    documentSecurity: false,
    // Any logged-in user can read — real entitlement is enforced in
    // useCourseAccess (client-side; documented V2 limitation, see README).
    permissions: [
      Permission.read(Role.users()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'courseId', size: 64, required: true },
      { kind: 'string', key: 'title', size: 128, required: true },
      { kind: 'integer', key: 'order', required: true, default: 0 },
      { kind: 'string', key: 'videoUrl', size: 500, required: true },
      { kind: 'integer', key: 'durationMinutes', required: false },
    ],
    indexes: [{ key: 'courseId_idx', type: IndexType.Key, attributes: ['courseId'] }],
  },
  {
    id: 'liveClasses',
    name: 'Live Classes',
    documentSecurity: false,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'title', size: 128, required: true },
      { kind: 'string', key: 'teacherId', size: 64, required: false },
      { kind: 'datetime', key: 'dateTime', required: true },
      { kind: 'integer', key: 'capacity', required: true, default: 10 },
      { kind: 'integer', key: 'spotsBooked', required: false, default: 0 },
      { kind: 'float', key: 'price', required: true, default: 0 },
      { kind: 'string', key: 'videoRoomUrl', size: 500, required: false },
      { kind: 'boolean', key: 'published', required: true, default: false },
    ],
    indexes: [{ key: 'dateTime_idx', type: IndexType.Key, attributes: ['dateTime'] }],
  },
  {
    id: 'events',
    name: 'Events',
    documentSecurity: false,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'title', size: 128, required: true },
      { kind: 'string', key: 'description', size: 1000, required: false },
      { kind: 'string', key: 'location', size: 255, required: true },
      { kind: 'datetime', key: 'dateTime', required: true },
      { kind: 'integer', key: 'capacity', required: true, default: 20 },
      { kind: 'integer', key: 'spotsBooked', required: false, default: 0 },
      { kind: 'boolean', key: 'published', required: true, default: false },
    ],
    indexes: [{ key: 'dateTime_idx', type: IndexType.Key, attributes: ['dateTime'] }],
  },
  {
    id: 'bundles',
    name: 'Bundles',
    documentSecurity: false,
    permissions: [
      Permission.read(Role.any()),
      Permission.create(ADMIN_ROLE),
      Permission.update(ADMIN_ROLE),
      Permission.delete(ADMIN_ROLE),
    ],
    attributes: [
      { kind: 'string', key: 'title', size: 128, required: true },
      { kind: 'string', key: 'description', size: 1000, required: false },
      { kind: 'float', key: 'price', required: true, default: 0 },
      { kind: 'string', key: 'courseId', size: 64, required: false },
      { kind: 'string', key: 'liveClassId', size: 64, required: false },
      { kind: 'string', key: 'eventId', size: 64, required: false },
      { kind: 'boolean', key: 'published', required: true, default: false },
    ],
    indexes: [],
  },
  {
    id: 'orders',
    name: 'Orders',
    documentSecurity: true, // owner read/update set per-document by the app; admin read is collection-level below
    permissions: [Permission.create(Role.users()), Permission.read(ADMIN_ROLE)],
    attributes: [
      { kind: 'string', key: 'userId', size: 64, required: true },
      { kind: 'enum', key: 'itemType', elements: ['course', 'liveClass', 'event', 'bundle'], required: true },
      { kind: 'string', key: 'itemId', size: 64, required: true },
      { kind: 'float', key: 'amount', required: true, default: 0 },
      { kind: 'enum', key: 'status', elements: ['confirmed', 'cancelled'], required: true, default: 'confirmed' },
      { kind: 'datetime', key: 'createdAt', required: true },
    ],
    indexes: [
      { key: 'userId_idx', type: IndexType.Key, attributes: ['userId'] },
      { key: 'item_idx', type: IndexType.Key, attributes: ['itemType', 'itemId'] },
    ],
  },
]

// --- attribute creation dispatch ----------------------------------------

async function createAttribute(collectionId, attr) {
  const label = `${collectionId}.${attr.key} (${attr.kind})`
  // Appwrite rejects a default value on a required attribute — required
  // means the app always supplies it, so a default is contradictory.
  const xdefault = attr.required ? undefined : attr.default

  switch (attr.kind) {
    case 'string':
      return ignoreExists(
        databases.createStringAttribute(DB_ID, collectionId, attr.key, attr.size, attr.required, xdefault, false),
        label
      )
    case 'integer':
      return ignoreExists(
        databases.createIntegerAttribute(DB_ID, collectionId, attr.key, attr.required, undefined, undefined, xdefault, false),
        label
      )
    case 'float':
      return ignoreExists(
        databases.createFloatAttribute(DB_ID, collectionId, attr.key, attr.required, undefined, undefined, xdefault, false),
        label
      )
    case 'boolean':
      return ignoreExists(
        databases.createBooleanAttribute(DB_ID, collectionId, attr.key, attr.required, xdefault, false),
        label
      )
    case 'datetime':
      return ignoreExists(
        databases.createDatetimeAttribute(DB_ID, collectionId, attr.key, attr.required, xdefault, false),
        label
      )
    case 'enum':
      return ignoreExists(
        databases.createEnumAttribute(DB_ID, collectionId, attr.key, attr.elements, attr.required, xdefault, false),
        label
      )
  }
}

// --- main ----------------------------------------------------------------

async function run() {
  await ensureAdminTeam()

  for (const col of collections) {
    console.log(`\nCollection: ${col.id}`)
    await ignoreExists(
      databases.createCollection(DB_ID, col.id, col.name, col.permissions, col.documentSecurity),
      `Collection "${col.id}" created`
    )

    for (const attr of col.attributes) {
      await createAttribute(col.id, attr)
    }

    // Appwrite processes attribute creation async — give it a moment
    // before creating indexes that depend on those attributes existing.
    if (col.indexes.length) {
      await sleep(2000)
      for (const idx of col.indexes) {
        await ignoreExists(
          databases.createIndex(DB_ID, col.id, idx.key, idx.type, idx.attributes),
          `Index ${col.id}.${idx.key}`
        )
      }
    }
  }

  console.log('\nDone. Check the Appwrite console (Databases → your database) to confirm.')
  console.log('Note: the console UI now labels these "Tables" — same underlying data, just renamed.')
}

run().catch((err) => {
  console.error('\nProvisioning failed:', err)
  process.exit(1)
})
