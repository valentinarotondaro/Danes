import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listPublishedPackages() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.PACKAGES, [
    Query.equal('published', true),
    Query.orderAsc('price'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function listAllPackages() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.PACKAGES, [
    Query.orderAsc('price'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function getPackageById(id) {
  return databases.getDocument(DB_ID, COLLECTIONS.PACKAGES, id)
}

export async function createPackage(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.PACKAGES, ID.unique(), data)
}

export async function updatePackage(id, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.PACKAGES, id, data)
}

export async function deletePackage(id) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.PACKAGES, id)
}