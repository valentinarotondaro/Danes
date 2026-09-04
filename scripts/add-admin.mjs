// scripts/add-admin.mjs
//
// Adds an existing Appwrite Auth user to the "admins" Team using the server
// SDK. Server-initiated memberships are auto-confirmed — no invitation email
// involved, unlike adding a member from the Console UI.
//
// Usage: node scripts/add-admin.mjs <userId>
// Find your userId in the Appwrite console: Auth → Users → click your user → copy the User ID.

import 'dotenv/config'
import { Client, Teams } from 'node-appwrite'

const userId = process.argv[2]
if (!userId) {
  console.error('Usage: node scripts/add-admin.mjs <userId>')
  process.exit(1)
}

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)

const teams = new Teams(client)

try {
  const membership = await teams.createMembership('admins', ['admin'], undefined, userId)
  console.log('✓ Added to admins team, auto-confirmed:', membership.$id)
} catch (err) {
  console.error('✗ Failed:', err.message)
  process.exit(1)
}
