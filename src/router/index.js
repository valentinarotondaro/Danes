// The guard below is navigation-level protection (UX). Lesson access is checked
// in the view with useCourseAccess, and the real security is Appwrite permissions.

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },

  // LEARN
  { path: '/courses', name: 'course-catalog', component: () => import('@/views/CourseCatalogView.vue') },
  { path: '/courses/:id', name: 'course-detail', component: () => import('@/views/CourseDetailView.vue') },
  { path: '/courses/:courseId/lessons/:lessonId', name: 'lesson', component: () => import('@/views/LessonView.vue'), meta: { requiresAuth: true, focus: true } },

  // Level test: full screen, without the site header and footer (meta.focus)
  { path: '/level-test', name: 'level-test', component: () => import('@/views/LevelTestView.vue'), meta: { focus: true } },

  // PRACTICE
  { path: '/live-classes', name: 'live-class-list', component: () => import('@/views/LiveClassListView.vue') },
  { path: '/live-classes/:id', name: 'live-class-detail', component: () => import('@/views/LiveClassDetailView.vue') },

  // BELONG
  { path: '/events', name: 'event-list', component: () => import('@/views/EventListView.vue') },
  { path: '/events/:id', name: 'event-detail', component: () => import('@/views/EventDetailView.vue') },

  // ABOUT
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },

  // Packages / commerce (Appwrite collection ID is still "bundles" — see appwriteClient.js)
  { path: '/packages/:id', name: 'package-detail', component: () => import('@/views/PackageDetailView.vue') },
  { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true, focus: true } },
  // My account: one layout (tabs + data) and four tabs, each with its own URL
  {
    path: '/account',
    component: () => import('@/views/AccountLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'my-account', component: () => import('@/views/AccountOverviewView.vue') },
      { path: 'courses', name: 'account-courses', component: () => import('@/views/AccountCoursesView.vue') },
      { path: 'events', name: 'account-events', component: () => import('@/views/AccountEventsView.vue') },
      { path: 'profile', name: 'account-profile', component: () => import('@/views/AccountProfileView.vue') },
    ],
  },

  // Auth
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { guestOnly: true } },
  { path: '/signup', name: 'signup', component: () => import('@/views/SignupView.vue'), meta: { guestOnly: true } },

  // Admin: its own layout with a sidebar (meta.focus hides the site header and footer).
  // The children share the layout; requiresAdmin on the parent protects all of them.
  {
    path: '/admin',
    component: () => import('@/views/AdminLayout.vue'),
    meta: { requiresAdmin: true, focus: true },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/views/AdminDashboardView.vue') },
      { path: ':collection', name: 'admin-list', component: () => import('@/views/AdminListView.vue') },
      // id is 'new' when creating
      { path: ':collection/:id', name: 'admin-edit', component: () => import('@/views/AdminEditView.vue') },
    ],
  },

  // Catch-all: must stay last, so an unknown URL shows a 404 page instead of a blank one
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  // A new page starts at the top; a #hash scrolls to that section
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

  if ((to.meta.requiresAuth || to.meta.requiresAdmin) && !isLoggedIn.value) {
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