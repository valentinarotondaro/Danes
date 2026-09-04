<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="block">
    <span class="text-sm text-neutral-700">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1.5 w-full rounded-md border px-3 py-2 text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-offset-1"
      :class="error
        ? 'border-red-600 focus:border-red-600 focus:ring-red-200'
        : 'border-neutral-300 focus:border-[#C8102E] focus:ring-[#C8102E]/20'"
    />
    <span v-if="error" class="mt-1 block text-sm text-red-600">{{ error }}</span>
  </label>
</template>
