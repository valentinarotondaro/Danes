// src/services/eventService.js
import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listPublishedEvents() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.EVENTS, [
    Query.equal('published', true),
    Query.orderAsc('dateTime'),
  ])
  return res.documents
}

export async function listAllEvents() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.EVENTS, [
    Query.orderAsc('dateTime'),
  ])
  return res.documents
}

export async function getEventById(id) {
  return databases.getDocument(DB_ID, COLLECTIONS.EVENTS, id)
}

export async function createEvent(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.EVENTS, ID.unique(), data)
}

export async function updateEvent(id, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.EVENTS, id, data)
}

export async function deleteEvent(id) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.EVENTS, id)
}


