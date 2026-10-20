<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminToast from '@/components/admin/AdminToast.vue'
import logo from '@/assets/img/danes-logo.png'

// The frame around every admin page: sidebar on the left, the page on the right.
// On phones the sidebar hides behind a menu button.
const route = useRoute()
const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))
</script>

<template>
  <div class="flex min-h-screen bg-white text-ink">
    <AdminSidebar class="sticky top-0 hidden h-screen lg:flex" />

    <!-- Phone: the sidebar slides in over the page -->
    <div v-if="menuOpen" class="fixed inset-0 z-40 flex lg:hidden">
      <AdminSidebar class="h-full overflow-y-auto" />
      <button type="button" aria-label="Close admin menu" class="flex-1 bg-black/40" @click="menuOpen = false" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex items-center gap-3 border-b border-line px-4 py-3 lg:hidden">
        <img :src="logo" alt="DANES" class="h-7 w-auto" />
        <span class="rounded-ds bg-sky px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">Admin</span>
        <button
          type="button"
          aria-label="Open admin menu"
          :aria-expanded="menuOpen"
          class="ml-auto flex h-12 w-12 items-center justify-center rounded-ds bg-surface-secondary"
          @click="menuOpen = true"
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </header>

      <main class="w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-10 sm:pt-8">
        <RouterView :key="route.fullPath" />
      </main>
    </div>

    <AdminToast />
  </div>
</template>
