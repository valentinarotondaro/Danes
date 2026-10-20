<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
})
</script>

<template>
  <!-- role="alert": screen readers read it out as soon as it appears -->
  <div role="alert" class="flex items-start gap-3 rounded-ds bg-red-soft p-4 text-red">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.5" />
    </svg>
    <p class="text-sm"><strong>{{ title }}</strong> {{ message }}</p>
  </div>
</template>