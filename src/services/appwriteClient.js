// src/services/appwriteClient.js
//
// Single source of truth for the Appwrite connection.
// Every other file in services/ imports { client, account, databases } from here
// instead of creating its own Client instance.

import { Client, Account, Databases, Teams, Functions } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const teams = new Teams(client)
export const functions = new Functions(client)


// Central place to keep collection/database IDs so no magic strings
// are scattered across service files.
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID

export const COLLECTIONS = {
  PROFILES: 'profiles',
  TEACHERS: 'teachers',
  COURSES: 'courses',
  LESSONS: 'lessons',
  LIVE_CLASSES: 'liveClasses',
  EVENTS: 'events',
  PACKAGES: 'bundles', // Appwrite collection ID stayed "bundles" — only the display name changed to Packages
  ORDERS: 'orders',
}
// Appwrite Functions (server code). The ID is the one you typed when creating it.
export const FUNCTIONS = {
  RESERVE_SPOT: 'reserve-spot',
}
export default client