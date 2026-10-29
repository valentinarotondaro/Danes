import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listPublishedLiveClasses() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.LIVE_CLASSES, [
    Query.equal('published', true),
    Query.orderAsc('dateTime'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function listAllLiveClasses() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.LIVE_CLASSES, [
    Query.orderAsc('dateTime'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function getLiveClassById(id) {
  return databases.getDocument(DB_ID, COLLECTIONS.LIVE_CLASSES, id)
}

export async function createLiveClass(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.LIVE_CLASSES, ID.unique(), data)
}

export async function updateLiveClass(id, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.LIVE_CLASSES, id, data)
}

export async function deleteLiveClass(id) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.LIVE_CLASSES, id)
}
