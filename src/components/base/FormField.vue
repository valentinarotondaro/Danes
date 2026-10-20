<script setup>
import { useId } from 'vue'

// One labelled input from the design system. Shows `error` in red,
// otherwise the optional `hint` in grey under the field.
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  placeholder: { type: String, default: '' },
  id: { type: String, default: '' }, // optional: lets an error summary link to the field
})
defineEmits(['update:modelValue'])

const inputId = props.id || useId()
const messageId = `${inputId}-msg`
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="inputId" class="text-sm font-semibold text-ink">{{ label }}</label>
    <input
      :id="inputId"
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
  </div>
</template>
