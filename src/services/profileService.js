// src/services/profileService.js
import { ID, Permission, Role, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

// extra: optional fields, e.g. { journey: 'a-little' }
export async function createProfile(userId, name, email, extra = {}) {
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
      ...extra,
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
// The learner's own changes from the Profile tab (city, level, email choices…)
export async function updateProfile(profileId, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.PROFILES, profileId, data)
}
