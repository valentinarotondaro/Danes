<script setup>
import { computed } from 'vue'
import logo from '@/assets/img/danes-logo.png'

const props = defineProps({
  partLabel: { type: String, required: true },
  number: { type: Number, required: true }, // 1-based
  total: { type: Number, required: true },
})
defineEmits(['exit'])

const percent = computed(() => Math.round((props.number / props.total) * 100))
</script>

<template>
  <header class="border-b border-line">
    <div class="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-4 sm:gap-8 sm:px-10 sm:py-6">
      <img :src="logo" alt="DANES" class="hidden h-8 w-auto sm:block" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex justify-between gap-4 text-sm font-semibold">
          <span>{{ partLabel }}</span>
          <span class="font-normal text-ink-muted">Question {{ number }} of {{ total }}</span>
        </div>
        <div
          role="progressbar"
          aria-label="Test progress"
          aria-valuemin="0"
          :aria-valuemax="total"
          :aria-valuenow="number"
          class="h-2 overflow-hidden rounded-ds bg-line"
        >
          <div class="h-full rounded-ds bg-red transition-[width] duration-300" :style="{ width: `${percent}%` }" />
        </div>
      </div>
      <button type="button" class="min-h-12 font-semibold text-ink hover:text-red" @click="$emit('exit')">Exit</button>
    </div>
  </header>
</template>