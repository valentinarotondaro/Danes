// src/services/profileService.js
import { ID, Permission, Role, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function createProfile(userId, name, email) {
  return databases.createDocument(
    DB_ID,
    COLLECTIONS.PROFILES,
    ID.unique(),
    {
      userId,
      name,
      email,
      role: 'learner',
      createdAt: new Date().toISOString(),
    },
    [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
  )
}

// The profile document of one user, or null if they don't have one yet
export async function getProfileByUserId(userId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.PROFILES, [
    Query.equal('userId', userId),
    Query.limit(1),
  ])
  return res.documents[0] ?? null
}

// Saves the level test result. Older accounts may have no profile yet: create it.
export async function saveLevel(user, level) {
  const profile = await getProfileByUserId(user.$id)
  if (profile) {
    return databases.updateDocument(DB_ID, COLLECTIONS.PROFILES, profile.$id, { level })
  }
  const created = await createProfile(user.$id, user.name || user.email, user.email)
  return databases.updateDocument(DB_ID, COLLECTIONS.PROFILES, created.$id, { level })
}