<script setup>
import { RouterLink } from 'vue-router'

// The top of every admin page: breadcrumb, title, one line of context and the actions.
// crumbs: [{ label, to? }]; the last one is the current page.
defineProps({
  crumbs: { type: Array, default: () => [] },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <nav v-if="crumbs.length" aria-label="Breadcrumb" class="text-sm text-ink-muted">
      <template v-for="(crumb, i) in crumbs" :key="crumb.label">
        <span v-if="i > 0" aria-hidden="true"> / </span>
        <RouterLink v-if="crumb.to" :to="crumb.to" class="text-ink-muted no-underline hover:text-red">{{ crumb.label }}</RouterLink>
        <span v-else aria-current="page" class="font-semibold text-ink">{{ crumb.label }}</span>
      </template>
    </nav>
    <div class="flex flex-wrap items-end gap-4">
      <div class="flex min-w-0 flex-[1_1_360px] flex-col gap-1">
        <h1 class="text-[32px] font-semibold leading-tight">{{ title }}</h1>
        <p v-if="description" class="text-ink-muted">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap gap-3"><slot name="actions" /></div>
    </div>
  </div>
</template>
