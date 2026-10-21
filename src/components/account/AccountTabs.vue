<script setup>
import { RouterLink, useRoute } from 'vue-router'

// The four tabs of My account. They're links (each tab has its own URL),
// so the browser's back button and bookmarks work.
const route = useRoute()
const TABS = [
  { name: 'my-account', label: 'Overview' },
  { name: 'account-courses', label: 'My courses' },
  { name: 'account-events', label: 'My events' },
  { name: 'account-profile', label: 'Profile' },
]
</script>

<template>
  <nav aria-label="My account" class="border-b border-line">
    <div class="mx-auto flex max-w-[1200px] gap-6 overflow-x-auto px-4 sm:gap-8 sm:px-10">
      <RouterLink
        v-for="tab in TABS"
        :key="tab.name"
        :to="{ name: tab.name }"
        :aria-current="route.name === tab.name ? 'page' : undefined"
        class="whitespace-nowrap py-3 no-underline"
        :class="route.name === tab.name ? 'font-semibold text-ink shadow-[inset_0_-3px_0_var(--color-red)]' : 'text-ink-muted hover:text-ink'"
      >
        {{ tab.label }}
      </RouterLink>
    </div>
  </nav>
</template>
