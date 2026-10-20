<script setup>
import { useId } from 'vue'

// A labelled <select> in the design-system style.
// options: ['Aarhus', …] or [{ value, label }]
const props = defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true },
  placeholder: { type: String, default: '' }, // first, empty option, e.g. "No teacher yet"
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  id: { type: String, default: '' },
})
const model = defineModel({ type: String, default: '' })

const selectId = props.id || useId()
const valueOf = (o) => (typeof o === 'string' ? o : o.value)
const labelOf = (o) => (typeof o === 'string' ? o : o.label)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="selectId" class="text-sm font-semibold text-ink">{{ label }}</label>
    <select
      :id="selectId"
      v-model="model"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint ? `${selectId}-msg` : undefined"
      class="h-12 w-full rounded-ds border bg-white px-4 text-ink outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
      :class="error ? 'border-red' : 'border-line hover:border-ink-muted'"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="valueOf(o)" :value="valueOf(o)">{{ labelOf(o) }}</option>
    </select>
    <span v-if="error" :id="`${selectId}-msg`" class="text-sm text-red">{{ error }}</span>
    <span v-else-if="hint" :id="`${selectId}-msg`" class="text-sm text-ink-muted">{{ hint }}</span>
  </div>
</template>
