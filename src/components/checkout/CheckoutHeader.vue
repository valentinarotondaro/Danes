<script setup>
import { RouterLink, useRouter } from 'vue-router'
import logo from '@/assets/img/danes-logo.png'

// A quiet header for the checkout (meta.focus hides the site header):
// fewer links means fewer ways to drop out of paying.
defineProps({ showBack: { type: Boolean, default: true } })
const router = useRouter()
</script>

<template>
  <header class="border-b border-line">
    <div class="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-4 sm:gap-6 sm:px-10 sm:py-5">
      <RouterLink :to="{ name: 'home' }" aria-label="DANES home">
        <img :src="logo" alt="DANES" class="h-7 w-auto sm:h-10" />
      </RouterLink>
      <span class="flex items-center gap-2 text-sm text-ink-muted">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        Checkout
      </span>
      <button v-if="showBack" type="button" class="ml-auto text-sm font-semibold text-ink hover:text-red" @click="router.back()">
        Back
      </button>
    </div>
  </header>
</template>