<script setup>
import { REVIEWS } from './homeContent'
import logo from '@/assets/img/danes-logo.png'
</script>

<template>
  <section id="reviews" class="flex flex-col gap-8">
    <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">
      Transform your life in Denmark with
      <img :src="logo" alt="DANES" class="ml-2 inline-block h-10 w-auto align-[-6px] sm:h-[52px]" />
    </h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <figure v-for="review in REVIEWS" :key="review.name" class="m-0 flex flex-col gap-4 rounded-ds bg-sky-soft p-6">
        <p class="text-lg leading-none text-red" role="img" aria-label="5 out of 5 stars">★★★★★</p>
        <blockquote class="m-0 text-ink">“{{ review.quote }}”</blockquote>
        <figcaption class="mt-auto flex items-center gap-3">
          <span aria-hidden="true" class="flex h-12 w-12 items-center justify-center rounded-full bg-sky-strong font-semibold text-ink">
            {{ review.name[0] }}
          </span>
          <span class="flex flex-col">
            <span class="text-sm font-semibold text-ink">{{ review.name }}</span>
            <span class="text-sm text-ink-muted">{{ review.from }}</span>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>