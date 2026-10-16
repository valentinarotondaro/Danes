<script setup>
import { INCLUDED } from './coursesContent'
</script>

<template>
  <section id="included" class="flex flex-col gap-6 lg:flex-row">
    <div class="flex flex-col gap-4 lg:w-1/3">
      <span class="text-xs font-semibold uppercase tracking-wide text-red">In every course</span>
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Built around your week, not a classroom.</h2>
    </div>
    <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex-1">
      <li v-for="item in INCLUDED" :key="item.n" class="flex flex-col gap-2 rounded-ds bg-surface-secondary p-6">
        <span class="text-xs font-semibold text-red">{{ item.n }}</span>
        <h3 class="text-2xl font-semibold leading-tight text-ink">{{ item.title }}</h3>
        <p class="text-ink-muted">{{ item.text }}</p>
      </li>
    </ul>
  </section>
</template>