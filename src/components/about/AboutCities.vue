<script setup>
import { CITIES } from './aboutContent.js'
</script>

<template>
  <section class="flex flex-col gap-6 lg:gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">Where to find us</h2>
      <p class="text-ink-muted">Courses and the Speaking Club are online. Events happen in four cities.</p>
    </div>

    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
      <article
        v-for="city in CITIES"
        :key="city.name"
        class="flex flex-col gap-1 rounded-ds bg-surface-secondary p-4 lg:gap-2 lg:p-6"
      >
        <h3 class="text-lg leading-[1.25] font-semibold lg:text-2xl">{{ city.name }}</h3>
        <p class="text-sm text-ink-muted">{{ city.what }}</p>
        <p class="mt-1 text-sm font-semibold break-words lg:mt-2 lg:text-base">{{ city.contact }}</p>
      </article>
    </div>
  </section>
</template>