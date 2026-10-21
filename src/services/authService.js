// src/services/authService.js
//
// Data-access layer only: talks to Appwrite Account. No reactive state here —
// that lives in composables/useAuth.js. Keeping this split is what makes the
// "services = data access, composables = application logic" separation real.

import { ID } from 'appwrite'
import { account } from './appwriteClient'

export async function login(email, password) {
  return account.createEmailPasswordSession(email, password)
}

export async function signup(email, password, name) {
  await account.create(ID.unique(), email, password, name)
  return login(email, password)
}

export async function logout() {
  return account.deleteSession('current')
}

export async function getCurrentUser() {
  // Throws if there's no active session — callers should catch this
  // and treat it as "not logged in", not as an unexpected error.
  return account.get()
}

// The name on the Appwrite account (shown in the header and the admin)
export async function updateName(name) {
  return account.updateName(name)
}

// Appwrite asks for the old password too, so a stolen open laptop can't change it
export async function updatePassword(newPassword, oldPassword) {
  return account.updatePassword(newPassword, oldPassword)
}
