<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuth } from '@/composables/useAuth'

const { initSession } = useAuth()
const route = useRoute()

// A new key makes Vue build the page again. Normal pages get a fresh copy on
// every URL (e.g. /events/1 → /events/2). Pages with tabs (My account, admin)
// keep their layout and its loaded data while you switch tabs.
const pageKey = computed(() => (route.matched.length > 1 ? route.matched[0].path : route.path))

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="min-h-screen bg-white text-ink font-sans">
    <!-- Pages with meta.focus (the level test) show no header or footer -->
    <AppHeader v-if="!route.meta.focus" />
    <RouterView :key="pageKey" />
    <AppFooter v-if="!route.meta.focus" />
  </div>
</template>