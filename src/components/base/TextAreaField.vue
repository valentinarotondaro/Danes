<script setup>
import { computed, useId } from 'vue'

// A labelled <textarea>. With `max`, the hint counts the characters: "102 / 160".
const props = defineProps({
  label: { type: String, required: true },
  rows: { type: Number, default: 4 },
  max: { type: Number, default: 0 },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  id: { type: String, default: '' },
})
const model = defineModel({ type: String, default: '' })

const areaId = props.id || useId()
const message = computed(() => {
  if (props.error) return props.error
  const count = props.max ? `${model.value.length} / ${props.max} characters.` : ''
  return [props.hint, count].filter(Boolean).join(' ')
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="areaId" class="text-sm font-semibold text-ink">{{ label }}</label>
    <textarea
      :id="areaId"
      v-model="model"
      :rows="rows"
      :maxlength="max || undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="message ? `${areaId}-msg` : undefined"
      class="w-full rounded-ds border bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
      :class="error ? 'border-red' : 'border-line hover:border-ink-muted'"
    />
    <span v-if="message" :id="`${areaId}-msg`" class="text-sm" :class="error ? 'text-red' : 'text-ink-muted'">{{ message }}</span>
  </div>
</template>
