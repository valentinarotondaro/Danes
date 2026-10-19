<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import danesLogo from '@/assets/img/danes-logo.png'

const { isLoggedIn, role, logout } = useAuth()
const route = useRoute()

const LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/events', label: 'Events' },
  { to: '/live-classes', label: 'Speaking club' },
  { to: '/about', label: 'About us' },
]

// Phone menu: open/closed. It closes by itself when you move to another page.
const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

// The current section gets the underline, also on /events/123 and similar
const isActive = (to) => route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <header class="bg-white">
    <div class="mx-auto flex max-w-[1200px] items-center gap-6 px-4 pt-4 sm:px-10 sm:pt-8">
      <RouterLink to="/" aria-label="DANES home" class="flex-none">
        <img :src="danesLogo" alt="DANES" class="h-8 w-auto sm:h-10" />
      </RouterLink>

      <!-- Desktop -->
      <nav aria-label="Main" class="ml-auto hidden items-center gap-6 md:flex">
        <RouterLink
          v-for="link in LINKS"
          :key="link.to"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          class="text-ink no-underline hover:text-red"
          :class="isActive(link.to) ? 'font-semibold underline decoration-2 underline-offset-8' : ''"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="hidden items-center gap-4 md:flex">
        <template v-if="isLoggedIn">
          <RouterLink v-if="role === 'admin'" to="/admin" class="font-semibold text-ink no-underline hover:text-red">Admin</RouterLink>
          <RouterLink to="/account" class="rounded-ds bg-red px-6 py-3 font-semibold text-white no-underline hover:bg-red-hover">My account</RouterLink>
          <button type="button" class="font-semibold text-ink hover:text-red" @click="logout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/signup" class="rounded-ds bg-red px-6 py-3 font-semibold text-white no-underline hover:bg-red-hover">Sign up</RouterLink>
          <RouterLink to="/login" class="font-semibold text-ink no-underline hover:text-red">Log in</RouterLink>
        </template>
      </div>

      <!-- Phone -->
      <button
        type="button"
        class="ml-auto flex h-12 w-12 items-center justify-center rounded-ds bg-sky md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="phone-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="19" y2="1" /><line x1="1" y1="7" x2="19" y2="7" /><line x1="1" y1="13" x2="19" y2="13" /></g></svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="2" y1="2" x2="14" y2="14" /><line x1="14" y1="2" x2="2" y2="14" /></g></svg>
      </button>
    </div>

    <nav v-if="menuOpen" id="phone-menu" aria-label="Main" class="mx-4 mt-4 flex flex-col gap-2 rounded-ds bg-sky p-4 md:hidden">
      <RouterLink
        v-for="link in LINKS"
        :key="link.to"
        :to="link.to"
        :aria-current="isActive(link.to) ? 'page' : undefined"
        class="flex min-h-12 items-center rounded-ds px-4 text-ink no-underline"
        :class="isActive(link.to) ? 'bg-white font-semibold' : 'hover:bg-sky-strong'"
      >
        {{ link.label }}
      </RouterLink>
      <div class="mt-2 flex flex-col gap-2 border-t border-ink pt-4">
        <template v-if="isLoggedIn">
          <RouterLink to="/account" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline">My account</RouterLink>
          <RouterLink v-if="role === 'admin'" to="/admin" class="flex min-h-12 items-center justify-center font-semibold text-ink no-underline">Admin</RouterLink>
          <button type="button" class="min-h-12 font-semibold text-ink" @click="logout">Log out</button>
        </template>
        <template v-else>
          <RouterLink to="/signup" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline">Sign up</RouterLink>
          <RouterLink to="/login" class="flex min-h-12 items-center justify-center font-semibold text-ink no-underline">Log in</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>