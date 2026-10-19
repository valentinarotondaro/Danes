// src/router/index.js
//
// Route table matches the 13 wireframe screens 1:1 (Step 5/7).
// Guards check useAuth() state — this is the "navigation-level protection"
// layer. Content-level gating (e.g. can this Learner watch THIS lesson)
// happens inside the view itself via useCourseAccess, not here.

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },

  // LEARN
  { path: '/courses', name: 'course-catalog', component: () => import('@/views/CourseCatalogView.vue') },
  { path: '/courses/:id', name: 'course-detail', component: () => import('@/views/CourseDetailView.vue') },
  { path: '/courses/:courseId/lessons/:lessonId', name: 'lesson', component: () => import('@/views/LessonView.vue'), meta: { requiresAuth: true } },

  // Level test: full screen, without the site header and footer (meta.focus)
  { path: '/level-test', name: 'level-test', component: () => import('@/views/LevelTestView.vue'), meta: { focus: true } },

  // PRACTICE
  { path: '/live-classes', name: 'live-class-list', component: () => import('@/views/LiveClassListView.vue') },
  { path: '/live-classes/:id', name: 'live-class-detail', component: () => import('@/views/LiveClassDetailView.vue') },

  // BELONG
  { path: '/events', name: 'event-list', component: () => import('@/views/EventListView.vue') },
  { path: '/events/:id', name: 'event-detail', component: () => import('@/views/EventDetailView.vue') }, // NEW

  // ABOUT
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },

  // Packages / commerce (Appwrite collection ID is still "bundles" — see appwriteClient.js)
  { path: '/packages/:id', name: 'package-detail', component: () => import('@/views/PackageDetailView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true } },
  { path: '/account', name: 'my-account', component: () => import('@/views/MyAccountView.vue'), meta: { requiresAuth: true } },

  // Auth
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/signup', name: 'signup', component: () => import('@/views/SignupView.vue'), meta: { guestOnly: true } },

  // Admin
  { path: '/admin', name: 'admin-dashboard', component: () => import('@/views/AdminDashboardView.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/:collection/:id?', name: 'admin-edit', component: () => import('@/views/AdminEditView.vue'), meta: { requiresAdmin: true } },

  // Catch-all — must stay last. Without this, an unmatched URL just renders
  // a blank page instead of giving the user any feedback.
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  // NEW: a new page starts at the top; a #hash scrolls to that section
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { isLoggedIn, isInitializing, role, initSession } = useAuth()

  if (isInitializing.value) {
    await initSession()
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && role.value !== 'admin') {
    return { name: 'home' }
  }

  if (to.meta.guestOnly && isLoggedIn.value) {
    return { name: 'home' }
  }

  return true
})

export default router