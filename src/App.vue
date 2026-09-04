<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'

const { initSession } = useAuth()

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="min-h-screen bg-white text-neutral-900">
    <AppHeader />
    <RouterView />
  </div>
</template>
