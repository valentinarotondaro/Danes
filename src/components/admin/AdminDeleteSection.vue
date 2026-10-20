<script setup>
import { ref } from 'vue'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog.vue'

// The "Delete course" box at the bottom of an edit form, with its confirm dialog.
defineProps({
  noun: { type: String, required: true }, // "course"
  name: { type: String, default: '' },
  message: { type: String, required: true },
  busy: { type: Boolean, default: false },
})
defineEmits(['confirm'])

const open = ref(false)
</script>

<template>
  <section class="flex flex-col gap-3 rounded-ds border border-red-soft p-6">
    <h2 class="text-2xl font-semibold leading-tight">Delete {{ noun }}</h2>
    <p class="text-sm text-ink-muted">{{ message }} This can’t be undone.</p>
    <button type="button" class="h-10 self-start rounded-ds bg-red-soft px-4 text-sm font-semibold text-red hover:bg-red hover:text-white" @click="open = true">
      Delete {{ noun }}
    </button>
    <AdminConfirmDialog
      :open="open"
      :title="`Delete “${name}”?`"
      :message="message"
      :confirm-label="`Delete ${noun}`"
      :cancel-label="`Keep ${noun}`"
      :busy="busy"
      @confirm="$emit('confirm')"
      @cancel="open = false"
    />
  </section>
</template>
