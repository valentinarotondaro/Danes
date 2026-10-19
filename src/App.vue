<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuth } from '@/composables/useAuth'

const { initSession } = useAuth()
const route = useRoute()

onMounted(() => {
  initSession()
})
</script>

<template>
  <div class="min-h-screen bg-white text-ink font-sans">
    <!-- Pages with meta.focus (the level test) show no header or footer -->
    <AppHeader v-if="!route.meta.focus" />
        <RouterView :key="route.path" />
    <AppFooter v-if="!route.meta.focus" />
  </div>
</template>