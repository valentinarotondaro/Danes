<script setup>
import { STEPS } from './homeContent'
  import flagImg from '@/assets/img/danish-flag.jpg'
</script>

<template>
  <section id="how" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">How it works</h2>
      <p class="text-ink-muted">From your level test to your first real conversation in Danish, here’s the path.</p>
    </div>
    <!-- Bento grid: step 1, the flag across two columns, then steps 2–4 -->
    <ol class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <template v-for="(step, i) in STEPS" :key="step.n">
        <li
          class="flex min-h-[240px] flex-col justify-between gap-6 rounded-ds p-6"
          :class="step.tone === 'red' ? 'bg-red text-white' : 'bg-sky text-ink'"
        >
          <span
            class="self-start rounded-ds px-3 py-1 text-sm font-semibold"
            :class="step.tone === 'red' ? 'bg-white text-red' : 'bg-red text-white'"
          >Step {{ step.n }}</span>
          <div class="flex flex-col gap-2">
            <h3 class="text-2xl font-semibold leading-tight">{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
        <li v-if="i === 0" aria-hidden="true" class="md:col-span-2">
          <img :src="flagImg" alt="" class="h-full min-h-[240px] w-full rounded-ds object-cover md:min-h-[400px]" />
        </li>
      </template>
    </ol>
  </section>
</template>