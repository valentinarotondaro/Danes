<script setup>
import { ref, watch } from 'vue'

// "Delete this?" A native <dialog> opened with showModal(): the browser keeps
// focus inside it, dims the page and closes it with Esc, for free.
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Delete' },
  cancelLabel: { type: String, default: 'Keep it' },
  busy: { type: Boolean, default: false },
  final: { type: Boolean, default: true }, // adds “This can’t be undone.”
})
const emit = defineEmits(['confirm', 'cancel'])

const dialog = ref(null)

watch(
  () => props.open,
  (open) => {
    const el = dialog.value
    if (!el?.showModal) return // very old browsers (and test runners) have no <dialog>
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }
)
</script>

<template>
  <dialog
    ref="dialog"
    role="alertdialog"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-desc"
    class="m-auto w-[calc(100%-32px)] max-w-[480px] rounded-ds p-0 text-ink backdrop:bg-black/40"
    @cancel.prevent="emit('cancel')"
  >
    <div class="flex flex-col gap-6 p-6 sm:p-8">
      <div class="flex items-start gap-4">
        <span aria-hidden="true" class="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-red-soft text-red">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
        </span>
        <div class="flex flex-col gap-2">
          <h2 id="confirm-title" class="text-2xl font-semibold leading-tight">{{ title }}</h2>
          <p id="confirm-desc" class="text-ink-muted">{{ message }}<template v-if="final"> This can’t be undone.</template></p>
        </div>
      </div>
      <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" class="h-12 rounded-ds border-2 border-ink px-6 font-semibold hover:bg-ink hover:text-white" @click="emit('cancel')">
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          :disabled="busy"
          class="h-12 rounded-ds bg-red px-6 font-semibold text-white hover:bg-red-hover disabled:opacity-50"
          @click="emit('confirm')"
        >
          {{ busy ? 'Please wait…' : confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>
