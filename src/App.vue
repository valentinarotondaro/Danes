<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppSplash from '@/components/base/AppSplash.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

// Show the splash until the first navigation (including the auth guard) is done,
// so the header and footer never appear without page content.
const ready = ref(false)

// A new key makes Vue build the page again. Normal pages get a fresh copy on
// every URL (e.g. /events/1 → /events/2). Pages with tabs (My account, admin)
// keep their layout and its loaded data while you switch tabs.
const pageKey = computed(() => (route.matched.length > 1 ? route.matched[0].path : route.path))

// Logged out (any button, or the session ended) while on a private page: go home
watch(isLoggedIn, (loggedIn) => {
  if (!loggedIn && (route.meta.requiresAuth || route.meta.requiresAdmin)) {
    router.push({ name: 'home' })
  }
})

onMounted(async () => {
  await router.isReady() // the router guard runs initSession() first
  ready.value = true
})
</script>

<template>
  <AppSplash v-if="!ready" />

  <div v-else class="min-h-screen bg-white text-ink font-sans">
    <!-- Pages with meta.focus (the level test) show no header or footer -->
    <AppHeader v-if="!route.meta.focus" />
    <RouterView :key="pageKey" />
    <AppFooter v-if="!route.meta.focus" />
  </div>
</template>