<script setup>
// The answer buttons of one question: a radio group, so screen readers
// announce "1 of 4, selected". Works with v-model.
defineProps({
  options: { type: Array, required: true }, // [{ id, text, detail? }]
  label: { type: String, required: true },
  grid: { type: Boolean, default: false }, // 2 columns, for short Danish words
  lang: { type: String, default: undefined },
})
const selected = defineModel({ type: String, default: null })
</script>

<template>
  <div role="radiogroup" :aria-label="label" class="grid gap-3" :class="grid ? 'grid-cols-2' : 'grid-cols-1'">
    <button
      v-for="(option, i) in options"
      :key="option.id"
      type="button"
      role="radio"
      :lang="lang"
      :aria-checked="selected === option.id"
      class="flex min-h-[64px] w-full items-center gap-4 rounded-ds border-2 px-4 py-3 text-left text-ink transition-colors"
      :class="selected === option.id ? 'border-ink bg-sky' : 'border-line bg-white hover:border-ink'"
      @click="selected = option.id"
    >
      <span
        aria-hidden="true"
        class="hidden h-8 w-8 flex-none items-center justify-center rounded-full text-sm font-semibold sm:flex"
        :class="selected === option.id ? 'bg-ink text-white' : 'bg-surface-secondary text-ink'"
      >{{ i + 1 }}</span>
      <span class="flex flex-col">
        <span class="font-semibold" :class="grid ? 'text-[22px] leading-tight sm:text-2xl' : ''">{{ option.text }}</span>
        <span v-if="option.detail" class="text-sm">{{ option.detail }}</span>
      </span>
    </button>
  </div>
</template>