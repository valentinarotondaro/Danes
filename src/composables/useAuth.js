// src/composables/useAuth.js
//
// State declared OUTSIDE the function = shared across every component that
// calls useAuth(). This is the module-level-composable pattern instead of Pinia.
// Do not move these refs inside useAuth() — that would silently give every
// component its own private copy and break session sharing app-wide.

import { ref, computed } from 'vue'
import * as authService from '@/services/authService'
import { createProfile } from '@/services/profileService'
import { teams } from '@/services/appwriteClient'

const currentUser = ref(null)     // Appwrite user object, or null if logged out
const isInitializing = ref(true)  // true until the initial session check resolves
const authError = ref(null)
const role = ref('guest')         // 'guest' | 'learner' | 'admin' — see resolveRole below

const isLoggedIn = computed(() => currentUser.value !== null)

// The real permission model lives in Appwrite Team membership (the "admins"
// Team, referenced by Role.team('admins') on every admin-write collection).
// This mirrors that, rather than trusting a client-editable field, so the
// UI's notion of "am I admin" matches what the backend will actually allow.
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

async function signup(email, password, name) {
  authError.value = null
  try {
    await authService.signup(email, password, name)
    currentUser.value = await authService.getCurrentUser()
    await createProfile(currentUser.value.$id, name, email)
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

export function useAuth() {
  return {
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
