<script setup>
import { RouterLink } from 'vue-router'
defineProps({ bundle: { type: Object, required: true } })
</script>

<template>
  <RouterLink
    :to="{ name: 'bundle-detail', params: { id: bundle.$id } }"
    class="group block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
  >
    <h3 class="font-serif text-lg text-neutral-900 group-hover:text-[#C8102E]">{{ bundle.title }}</h3>
    <p class="mt-1 line-clamp-2 text-sm text-neutral-500">{{ bundle.description }}</p>
    <p class="mt-3 font-medium text-neutral-900">{{ bundle.price }} DKK</p>
  </RouterLink>
</template>
