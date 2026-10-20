<script setup>
// A single plan (Course, Speaking Club or Events) as a small one-line radio.
// Smaller than PackageOption on purpose: packages are the main choice.
defineProps({
  pkg: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-2.5 rounded-ds px-4 py-3.5 ring-inset"
    :class="selected ? 'bg-sky-soft ring-2 ring-ink' : 'bg-white ring-1 ring-line hover:ring-ink-muted'"
  >
    <input type="radio" name="plan" :checked="selected" class="h-[18px] w-[18px] flex-none accent-ink" @change="$emit('select')" />
    <span class="flex-1 font-semibold">{{ pkg.title }}</span>
    <span class="whitespace-nowrap text-sm text-ink-muted">{{ pkg.price }} kr</span>
  </label>
</template>