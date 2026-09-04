// src/services/appwriteClient.js
//
// Single source of truth for the Appwrite connection.
// Every other file in services/ imports { client, account, databases } from here
// instead of creating its own Client instance.

import { Client, Account, Databases, Teams } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const teams = new Teams(client)

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
  BUNDLES: 'bundles',
  ORDERS: 'orders',
}

export default client
