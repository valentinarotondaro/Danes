// State declared outside the function is shared by every component that calls
// useAuth() (module-level state instead of Pinia). Inside, each would get its own copy.

import { ref, computed } from 'vue'
import * as authService from '@/services/authService'
import { createProfile } from '@/services/profileService'
import { teams } from '@/services/appwriteClient'

const currentUser = ref(null)     // Appwrite user object, or null if logged out
const isInitializing = ref(true)  // true until the initial session check resolves
const authError = ref(null)
const role = ref('guest')         // 'guest' | 'learner' | 'admin' — see resolveRole below

const isLoggedIn = computed(() => currentUser.value !== null)

// Admin = member of the Appwrite team "admins", the same check the database
// permissions use. A profile field could be edited by the user, a team can't.
async function resolveRole() {
  if (!currentUser.value) {
    role.value = 'guest'
    return
  }
  try {
    const { teams: memberships } = await teams.list()
    role.value = memberships.some((t) => t.$id === 'admins') ? 'admin' : 'learner'
  } catch {
    role.value = 'learner'
  }
}

async function initSession() {
  isInitializing.value = true
  try {
    currentUser.value = await authService.getCurrentUser()
    await resolveRole()
  } catch {
    currentUser.value = null
    role.value = 'guest'
  } finally {
    isInitializing.value = false
  }
}

async function login(email, password) {
  authError.value = null
  try {
    await authService.login(email, password)
    currentUser.value = await authService.getCurrentUser()
    await resolveRole()
  } catch (err) {
    authError.value = err.message
    throw err
  }
}

async function signup(email, password, name, journey = '') {
  authError.value = null
  try {
    await authService.signup(email, password, name)
    currentUser.value = await authService.getCurrentUser()
    // journey = "How much Danish do you speak?" (only saved if they picked one)
    await createProfile(currentUser.value.$id, name, email, journey ? { journey } : {})
    await resolveRole()
  } catch (err) {
    authError.value = err.message
    throw err
  }
}

async function logout() {
  await authService.logout()
  currentUser.value = null
  role.value = 'guest'
}

// After the learner changes their name: reload the user so the header updates too
async function refreshUser() {
  currentUser.value = await authService.getCurrentUser()
}

export function useAuth() {
  return {
    refreshUser,
    currentUser,
    isLoggedIn,
    isInitializing,
    authError,
    role,
    initSession,
    login,
    signup,
    logout,
  }
}
