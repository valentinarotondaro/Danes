<script setup>
// Plain words and one way out ("Try again"). The technical error stays in the console.
defineProps({
  title: { type: String, default: 'Something went wrong' },
  message: { type: String, default: 'Check your connection and try again.' },
})
defineEmits(['retry'])
</script>

<template>
  <div role="alert" class="flex flex-col items-center gap-2 rounded-ds bg-red-soft px-6 py-12 text-center">
    <p class="text-xl font-semibold text-red">{{ title }}</p>
    <p class="max-w-[480px] text-ink">{{ message }}</p>
    <button
      type="button"
      class="mt-4 h-12 rounded-ds border-2 border-ink bg-white px-6 font-semibold text-ink hover:bg-ink hover:text-white"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
