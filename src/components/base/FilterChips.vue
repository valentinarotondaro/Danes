<script setup>
// Reusable row of filter buttons. Works with v-model:
//   <FilterChips v-model="selectedCity" :options="cities" label="Filter by city" />
// options: ['All', 'Aarhus'] or [{ value: 'A1', label: 'A1 Beginner' }]
defineProps({
  options: { type: Array, required: true },
  label: { type: String, required: true }, // read by screen readers
})
const selected = defineModel({ type: String, required: true })

const valueOf = (option) => (typeof option === 'string' ? option : option.value)
const labelOf = (option) => (typeof option === 'string' ? option : option.label)
</script>

<template>
  <div role="group" :aria-label="label" class="flex flex-wrap gap-2">
    <button
      v-for="option in options"
      :key="valueOf(option)"
      type="button"
      :aria-pressed="selected === valueOf(option)"
      class="rounded-ds border px-4 py-2 text-sm font-semibold transition-colors"
      :class="selected === valueOf(option) ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'"
      @click="selected = valueOf(option)"
    >
      {{ labelOf(option) }}
    </button>
  </div>
</template>