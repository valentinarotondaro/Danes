<script setup>
import { describePackage } from '@/utils/plans'

// One package as a radio card. Dumb component: it shows the package and
// tells the parent when it's picked, the parent decides what is selected.
defineProps({
  pkg: { type: Object, required: true },
  selected: { type: Boolean, default: false },
  savings: { type: Number, default: 0 }, // kr saved per month vs one by one
})
defineEmits(['select'])
</script>

<template>
  <label
    class="flex cursor-pointer flex-col gap-2 rounded-ds p-5 ring-inset"
    :class="selected ? 'bg-sky-soft ring-2 ring-ink' : 'bg-white ring-1 ring-line hover:ring-ink-muted'"
  >
    <span class="flex items-center gap-2">
      <input type="radio" name="plan" :checked="selected" class="h-[18px] w-[18px] accent-ink" @change="$emit('select')" />
      <span class="font-semibold">{{ pkg.title }}</span>
    </span>
    <span>
      <span class="text-2xl font-semibold leading-tight">{{ pkg.price }} kr</span>
      <span class="text-sm text-ink-muted"> / month</span>
    </span>
    <span class="text-sm text-ink-muted">{{ describePackage(pkg) }}</span>
    <span v-if="savings > 0" class="mt-auto text-sm font-semibold text-success">Save {{ savings }} kr / month</span>
  </label>
</template>