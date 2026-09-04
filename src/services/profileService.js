// src/services/profileService.js
import { ID, Permission, Role } from 'appwrite'
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
