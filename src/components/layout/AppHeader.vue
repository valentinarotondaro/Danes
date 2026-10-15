<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import danesLogo from '@/assets/img/danes-logo.png'

const { isLoggedIn, role, logout } = useAuth()
</script>

<template>
  <header class="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
    <RouterLink to="/">
      <img :src="danesLogo" alt="DANES" class="h-7 w-auto" />
    </RouterLink>

    <nav class="hidden items-center gap-8 text-base font-medium text-ink md:flex">
      <RouterLink to="/courses" class="hover:opacity-70" active-class="font-semibold">Courses</RouterLink>
      <RouterLink to="/events" class="hover:opacity-70" active-class="font-semibold">Events</RouterLink>
      <RouterLink to="/live-classes" class="hover:opacity-70" active-class="font-semibold">Speaking club</RouterLink>
      <RouterLink to="/#about" class="hover:opacity-70">About us</RouterLink>
    </nav>

    <div class="flex items-center gap-3 text-sm">
      <template v-if="isLoggedIn">
        <RouterLink to="/account" class="hidden text-black/60 hover:text-ink sm:inline" active-class="text-ink font-medium">My Account</RouterLink>
        <RouterLink v-if="role === 'admin'" to="/admin" class="hidden text-black/60 hover:text-ink sm:inline" active-class="text-ink font-medium">
          Admin
        </RouterLink>
        <button @click="logout" class="text-black/60 hover:text-ink">
          Log out
        </button>
      </template>
      <template v-else>
        <RouterLink
          to="/signup"
          class="rounded-full bg-red px-4 py-2 font-medium text-white transition hover:opacity-90"
        >
          Sign up
        </RouterLink>
        <RouterLink to="/login" class="hidden text-black/60 hover:text-ink sm:inline">
          Log in
        </RouterLink>
      </template>
    </div>
  </header>
</template>