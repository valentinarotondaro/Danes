<script setup>
import { PATH } from './coursesContent'
</script>

<template>
  <section id="path" class="flex flex-col gap-8 rounded-ds bg-red p-6 text-white sm:p-10">
    <div class="flex flex-col gap-4">
      <span class="text-xs font-semibold uppercase tracking-wide">Your path</span>
      <h2 class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">From hej to Prøve i Dansk.</h2>
    </div>
    <ol class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <li v-for="step in PATH" :key="step.level" class="flex flex-col gap-4 border-t-2 border-white pt-6">
        <span class="self-start rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ step.level }}</span>
        <h3 class="text-2xl font-semibold leading-tight">{{ step.course }}</h3>
        <p>{{ step.can }}</p>
      </li>
    </ol>
  </section>
</template>