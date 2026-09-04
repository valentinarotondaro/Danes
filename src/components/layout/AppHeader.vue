<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn, role, logout } = useAuth()
</script>

<template>
  <header class="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
    <RouterLink to="/" class="font-bold text-lg tracking-tight">DANES</RouterLink>

    <nav class="flex items-center gap-6 text-sm">
      <RouterLink to="/courses">Learn</RouterLink>
      <RouterLink to="/live-classes">Practice</RouterLink>
      <RouterLink to="/events">Belong</RouterLink>

      <template v-if="isLoggedIn">
        <RouterLink to="/account">My Account</RouterLink>
        <RouterLink v-if="role === 'admin'" to="/admin">Admin</RouterLink>
        <button @click="logout" class="text-neutral-500 hover:text-neutral-900">
          Log out
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login">Log in</RouterLink>
      </template>
    </nav>
  </header>
</template>
