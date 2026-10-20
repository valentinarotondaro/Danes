<script setup>
import { RouterLink } from 'vue-router'
import StatusTag from '@/components/admin/StatusTag.vue'

// Dumb grid of cards, for collections with few items (packages, teachers).
defineProps({
  rows: { type: Array, required: true }, // [{ id, title, subtitle, image, text, checklist, status, editTo }]
})
defineEmits(['delete'])
</script>

<template>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <li v-for="row in rows" :key="row.id" class="flex flex-col gap-4 rounded-ds border border-line p-5">
      <div class="flex items-start gap-4">
        <img v-if="row.image" :src="row.image" alt="" class="h-16 w-16 flex-none rounded-full object-cover" />
        <span class="flex min-w-0 flex-1 flex-col items-start gap-1">
          <StatusTag v-if="row.status" v-bind="row.status" />
          <h2 class="text-xl font-semibold">{{ row.title }}</h2>
          <span v-if="row.subtitle" class="text-sm font-semibold text-ink-muted">{{ row.subtitle }}</span>
        </span>
      </div>

      <ul v-if="row.checklist" class="flex flex-col gap-2 text-sm">
        <li v-for="item in row.checklist" :key="item.label" class="flex items-center gap-2" :class="item.on ? 'text-ink' : 'text-ink-muted'">
          <svg v-if="item.on" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
          <svg v-else aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 12h12" /></svg>
          {{ item.label }}<span class="sr-only">{{ item.on ? ', included' : ', not included' }}</span>
        </li>
      </ul>
      <p v-else-if="row.text" class="text-sm text-ink-muted">{{ row.text }}</p>

      <div class="mt-auto flex gap-2 border-t border-line pt-4">
        <RouterLink :to="row.editTo" class="flex h-10 flex-1 items-center justify-center rounded-ds border-2 border-ink font-semibold text-ink no-underline hover:bg-ink hover:text-white">Edit</RouterLink>
        <button type="button" :aria-label="`Delete ${row.title}`" class="flex h-10 w-12 items-center justify-center rounded-ds bg-red-soft text-red hover:bg-red hover:text-white" @click="$emit('delete', row.id)">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
        </button>
      </div>
    </li>
  </ul>
</template>
