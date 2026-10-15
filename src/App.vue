<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuth } from '@/composables/useAuth'

const { initSession } = useAuth()

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="min-h-screen bg-white text-ink font-sans">
    <AppHeader />
    <RouterView />
    <AppFooter />
  </div>
</template>