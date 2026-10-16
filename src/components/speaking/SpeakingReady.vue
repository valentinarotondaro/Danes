<script setup>
import { READY } from './speakingContent'
</script>

<template>
  <section id="ready" class="flex flex-col gap-6 lg:flex-row">
    <div class="flex flex-col gap-4 lg:w-1/3">
      <span class="text-xs font-semibold uppercase tracking-wide text-red">Your first session</span>
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">All you need is a browser.</h2>
    </div>
    <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex-1">
      <li v-for="tip in READY" :key="tip.title" class="flex flex-col gap-2 rounded-ds bg-sky p-6 text-ink">
        <h3 class="text-2xl font-semibold leading-tight">{{ tip.title }}</h3>
        <p>{{ tip.text }}</p>
      </li>
    </ul>
  </section>
</template>