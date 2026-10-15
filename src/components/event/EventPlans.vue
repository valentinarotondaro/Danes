<script setup>
import { RouterLink } from 'vue-router'

const plans = [
  { name: 'Events', what: 'Every event in every city', price: 180 },
  { name: 'Social', what: 'Events + weekly Speaking Club', price: 329 },
  { name: 'Complete', what: 'A course, Speaking Club and events', price: 729 },
]
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Events are included in</h2>
      <p class="text-ink-muted">Every event in every city, as many as you like. Monthly, no binding.</p>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <article v-for="plan in plans" :key="plan.name" class="flex flex-col gap-4 rounded-ds bg-surface-secondary p-6">
        <div>
          <h3 class="text-2xl font-semibold text-ink">{{ plan.name }}</h3>
          <p class="text-sm text-ink-muted">{{ plan.what }}</p>
        </div>
        <p class="text-[40px] font-semibold leading-[1.1] text-ink">
          {{ plan.price }} <span class="text-base font-normal">kr./month</span>
        </p>
        <RouterLink
          to="/checkout"
          class="mt-auto rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover"
        >
          Choose {{ plan.name }}
        </RouterLink>
      </article>
    </div>
  </section>
</template>