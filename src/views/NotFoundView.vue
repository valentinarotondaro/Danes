<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-24 text-center">
    <p class="text-6xl font-semibold text-red">404</p>
    <h1 class="mt-4 text-2xl font-semibold text-ink">This page doesn’t exist</h1>
    <p class="mt-2 text-ink-muted">It may have moved, or the link has a typo.</p>
    <RouterLink
      to="/"
      class="mt-8 inline-flex h-10 items-center rounded-ds bg-red px-5 text-sm font-semibold text-white transition-colors hover:bg-red-hover"
    >
      Back to home
    </RouterLink>
  </section>
</template>
