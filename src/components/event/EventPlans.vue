<script setup>
import PlanCards from '@/components/base/PlanCards.vue'

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
    <PlanCards :plans="plans" />
  </section>
</template>