<script setup>
import { useToast } from '@/composables/useToast'

// Feedback after an action. aria-live="polite": screen readers read it without interrupting.
const { toast, hideToast } = useToast()
</script>

<template>
  <div aria-live="polite" class="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-end sm:inset-x-auto sm:right-10 sm:bottom-10">
    <div
      v-if="toast"
      role="status"
      class="pointer-events-auto flex max-w-[440px] items-center gap-4 rounded-ds bg-ink py-4 pl-5 pr-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
    >
      <span aria-hidden="true" class="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-success-soft text-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
      </span>
      <p class="flex-1 text-sm"><strong>{{ toast.title }}</strong> {{ toast.text }}</p>
      <button type="button" aria-label="Dismiss" class="flex h-8 w-8 flex-none items-center justify-center rounded-ds text-white hover:bg-white/10" @click="hideToast">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </div>
  </div>
</template>
