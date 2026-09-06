<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-md px-6 py-24 text-center">
    <p class="font-serif text-4xl text-neutral-900">404</p>
    <p class="mt-3 text-neutral-500">This page doesn't exist — or it moved.</p>
    <RouterLink to="/" class="mt-6 inline-block text-sm text-[#C8102E] hover:underline">
      Back to home
    </RouterLink>
  </section>
</template>
