<script setup>
import { FLOW } from './speakingContent'
</script>

<template>
  <section id="how" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">How a session works</h2>
      <p class="text-ink-muted">Same rhythm every week, so you always know what’s coming.</p>
    </div>
    <ol class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="step in FLOW"
        :key="step.min"
        class="flex min-h-[280px] flex-col gap-3 rounded-ds p-6"
        :class="step.tone === 'red' ? 'bg-red text-white' : 'bg-sky text-ink'"
      >
        <span class="text-xs font-semibold uppercase tracking-wide">{{ step.min }}</span>
        <h3 class="text-2xl font-semibold leading-tight">{{ step.title }}</h3>
        <p>{{ step.text }}</p>
      </li>
    </ol>
  </section>
</template>