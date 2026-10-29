// Data access only (Appwrite Account). The reactive state lives in useAuth.

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
  // Throws when there is no session: callers treat that as "not logged in"
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
