<script setup>
import { useId } from 'vue'

// One labelled input from the design system. Shows `error` in red,
// otherwise the optional `hint` in grey under the field.
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  placeholder: { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const messageId = useId()
</script>

<template>
  <label class="flex flex-col gap-2">
    <span class="text-sm font-semibold text-ink">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error || hint ? messageId : undefined"
      class="h-12 w-full rounded-ds border bg-white px-4 text-ink outline-none transition-colors focus:ring-2 focus:ring-ink focus:ring-offset-2"
      :class="error ? 'border-red' : 'border-line hover:border-ink-muted'"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" :id="messageId" class="text-sm text-red">{{ error }}</span>
    <span v-else-if="hint" :id="messageId" class="text-sm text-ink-muted">{{ hint }}</span>
  </label>
</template>