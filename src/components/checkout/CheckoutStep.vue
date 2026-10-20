<script setup>
// One numbered step of the checkout form ("1 Choose your package").
// A <fieldset> + <legend> so screen readers read the step name with each option.
defineProps({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  error: { type: String, default: '' },
})
</script>

<template>
  <fieldset class="flex flex-col gap-4">
    <legend class="flex items-center gap-3 pb-4 text-2xl font-semibold leading-tight">
      <span aria-hidden="true" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm text-white">{{ number }}</span>
      {{ title }}
    </legend>
    <slot />
    <p v-if="error" class="text-sm text-red">{{ error }}</p>
  </fieldset>
</template>