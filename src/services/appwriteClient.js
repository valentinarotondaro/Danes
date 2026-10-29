// The one Appwrite connection. Every service imports from here.

import { Client, Account, Databases, Teams, Functions } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const teams = new Teams(client)
export const functions = new Functions(client)

// IDs in one place, so no magic strings in the services
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
  LESSON_PROGRESS: 'lessonProgress',
}
// Appwrite Functions (server code). The ID is the one you typed when creating it.
export const FUNCTIONS = {
  RESERVE_SPOT: 'reserve-spot',
}
export default client