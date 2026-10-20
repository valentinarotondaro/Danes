<script setup>
import { RouterLink } from 'vue-router'
import StatusTag from '@/components/admin/StatusTag.vue'

// Dumb table: shows rows and asks the parent to delete. Rows come from a
// collection's toRow(): title column first, `cells` in the middle, status last.
// On phones the same rows turn into stacked cards.
defineProps({
  columns: { type: Array, required: true }, // [{ label, align? }]
  rows: { type: Array, required: true }, // [{ id, title, subtitle, image, cells, status, editTo }]
})
defineEmits(['delete'])

const middle = (columns) => columns.slice(1, -1)
</script>

<template>
  <!-- Desktop: a table -->
  <div class="hidden overflow-x-auto rounded-ds border border-line md:block">
    <table class="w-full min-w-[760px] border-collapse text-left text-sm">
      <thead>
        <tr class="bg-surface-secondary">
          <th
            v-for="col in columns"
            :key="col.label"
            scope="col"
            class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted"
            :class="col.align === 'right' ? 'text-right' : ''"
          >
            {{ col.label }}
          </th>
          <th scope="col" class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" class="border-t border-line hover:bg-surface-secondary">
          <td class="px-4 py-3">
            <span class="flex items-center gap-4">
              <img v-if="row.image" :src="row.image" alt="" class="h-12 w-16 flex-none rounded-xl object-cover" />
              <span class="flex min-w-0 flex-col">
                <RouterLink :to="row.editTo" class="text-base font-semibold text-ink no-underline hover:text-red">{{ row.title }}</RouterLink>
                <span v-if="row.subtitle" class="text-ink-muted">{{ row.subtitle }}</span>
              </span>
            </span>
          </td>
          <td
            v-for="(cell, i) in row.cells"
            :key="i"
            class="whitespace-nowrap px-4 py-3"
            :class="middle(columns)[i]?.align === 'right' ? 'text-right' : ''"
          >
            <template v-if="cell && typeof cell === 'object'">
              <span class="flex flex-col gap-1.5">
                {{ cell.text }}
                <span aria-hidden="true" class="block h-1.5 w-24 overflow-hidden rounded-full bg-line">
                  <span class="block h-full rounded-full" :class="cell.bar >= 100 ? 'bg-red' : 'bg-sky-strong'" :style="{ width: `${cell.bar}%` }" />
                </span>
              </span>
            </template>
            <template v-else>{{ cell }}</template>
          </td>
          <td class="px-4 py-3"><StatusTag v-if="row.status" v-bind="row.status" /></td>
          <td class="px-4 py-3">
            <span class="flex justify-end gap-2">
              <RouterLink :to="row.editTo" :aria-label="`Edit ${row.title}`" class="flex h-10 w-10 items-center justify-center rounded-ds border-2 border-ink text-ink hover:bg-ink hover:text-white">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>
              </RouterLink>
              <button type="button" :aria-label="`Delete ${row.title}`" class="flex h-10 w-10 items-center justify-center rounded-ds bg-red-soft text-red hover:bg-red hover:text-white" @click="$emit('delete', row.id)">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
              </button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Phone: one card per row -->
  <ul class="flex flex-col gap-3 md:hidden">
    <li v-for="row in rows" :key="row.id" class="flex flex-col gap-3 rounded-ds border border-line p-4">
      <div class="flex items-start gap-3">
        <img v-if="row.image" :src="row.image" alt="" class="h-[72px] w-[72px] flex-none rounded-ds object-cover" />
        <span class="flex min-w-0 flex-1 flex-col items-start gap-1">
          <StatusTag v-if="row.status" v-bind="row.status" />
          <RouterLink :to="row.editTo" class="text-lg font-semibold text-ink no-underline">{{ row.title }}</RouterLink>
          <span v-if="row.subtitle" class="text-sm text-ink-muted">{{ row.subtitle }}</span>
        </span>
      </div>
      <p class="flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-sm">
        <span v-for="(cell, i) in row.cells" :key="i">{{ cell && typeof cell === 'object' ? cell.text : cell }}</span>
      </p>
      <div class="flex gap-2">
        <RouterLink :to="row.editTo" class="flex h-10 flex-1 items-center justify-center rounded-ds border-2 border-ink font-semibold text-ink no-underline">Edit</RouterLink>
        <button type="button" :aria-label="`Delete ${row.title}`" class="flex h-10 w-12 items-center justify-center rounded-ds bg-red-soft text-red" @click="$emit('delete', row.id)">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
        </button>
      </div>
    </li>
  </ul>
</template>
