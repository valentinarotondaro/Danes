// src/services/bundleService.js
import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listPublishedBundles() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.BUNDLES, [
    Query.equal('published', true),
  ])
  return res.documents
}

export async function listAllBundles() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.BUNDLES)
  return res.documents
}

export async function getBundleById(id) {
  return databases.getDocument(DB_ID, COLLECTIONS.BUNDLES, id)
}

export async function createBundle(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.BUNDLES, ID.unique(), data)
}

export async function updateBundle(id, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.BUNDLES, id, data)
}

export async function deleteBundle(id) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.BUNDLES, id)
}
