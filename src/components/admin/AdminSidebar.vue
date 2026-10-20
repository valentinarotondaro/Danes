<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import logo from '@/assets/img/danes-logo.png'

const route = useRoute()
const router = useRouter()
const { currentUser, logout } = useAuth()

// Icons are stroke paths, drawn with currentColor so they follow the link colour
const CONTENT = [
  { collection: 'courses', label: 'Courses', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  { collection: 'liveClasses', label: 'Live classes', icon: 'M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM22 8l-6 4 6 4V8z' },
  { collection: 'events', label: 'Events', icon: 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18' },
  { collection: 'packages', label: 'Packages', icon: 'M21 8 12 3 3 8v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8' },
  { collection: 'teachers', label: 'Teachers', icon: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0' },
]

const firstName = computed(() => currentUser.value?.name?.split(' ')[0] || 'Admin')
const isActive = (collection) => route.params.collection === collection

async function onLogout() {
  await logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <aside aria-label="Admin" class="flex h-full w-[264px] flex-none flex-col gap-8 border-r border-line bg-white px-4 py-6">
    <RouterLink :to="{ name: 'admin-dashboard' }" class="flex items-center gap-3 px-3 no-underline">
      <img :src="logo" alt="DANES" class="h-8 w-auto" />
      <span class="rounded-ds bg-sky px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink">Admin</span>
    </RouterLink>

    <nav aria-label="Admin sections" class="flex flex-col gap-6">
      <RouterLink
        :to="{ name: 'admin-dashboard' }"
        :aria-current="route.name === 'admin-dashboard' ? 'page' : undefined"
        class="flex min-h-11 items-center gap-3 rounded-ds px-3 text-ink no-underline hover:bg-surface-secondary"
        :class="route.name === 'admin-dashboard' ? 'bg-sky-soft font-semibold' : ''"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM16 3h3a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM16 12h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zM5 16h3a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2z" /></svg>
        Dashboard
      </RouterLink>

      <div class="flex flex-col gap-1">
        <span class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">Content</span>
        <RouterLink
          v-for="item in CONTENT"
          :key="item.collection"
          :to="{ name: 'admin-list', params: { collection: item.collection } }"
          :aria-current="isActive(item.collection) ? 'page' : undefined"
          class="flex min-h-11 items-center gap-3 rounded-ds px-3 text-ink no-underline hover:bg-surface-secondary"
          :class="isActive(item.collection) ? 'bg-sky-soft font-semibold' : ''"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path :d="item.icon" /></svg>
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>

    <div class="mt-auto flex flex-col gap-4 border-t border-line pt-6">
      <RouterLink :to="{ name: 'home' }" class="flex min-h-11 items-center gap-3 rounded-ds px-3 text-ink no-underline hover:bg-surface-secondary">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" /></svg>
        View public site
      </RouterLink>
      <div class="flex items-center gap-3 px-3">
        <span aria-hidden="true" class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red font-semibold text-white">{{ firstName[0] }}</span>
        <span class="flex min-w-0 flex-col">
          <span class="truncate text-sm font-semibold">{{ firstName }}</span>
          <span class="text-xs text-ink-muted">Admin</span>
        </span>
        <button
          type="button"
          aria-label="Log out"
          class="ml-auto flex h-10 w-10 items-center justify-center rounded-ds border-2 border-ink text-ink hover:bg-ink hover:text-white"
          @click="onLogout"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
        </button>
      </div>
    </div>
  </aside>
</template>
