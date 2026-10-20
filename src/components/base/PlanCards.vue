<script setup>
import { RouterLink } from 'vue-router'

// Reusable price cards. The plan with `featured: true` is shown in red.
// Optional per plan: `tag` (small pill next to the name) and `features` (checklist).
defineProps({
  plans: { type: Array, required: true }, // [{ name, what, price, featured?, tag?, features? }]
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2" :class="plans.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'">
    <article
      v-for="plan in plans"
      :key="plan.name"
      class="flex flex-col gap-4 rounded-ds p-6"
      :class="plan.featured ? 'bg-red text-white' : 'bg-sky text-ink'"
    >
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-2xl font-semibold">{{ plan.name }}</h3>
          <span v-if="plan.tag" class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ plan.tag }}</span>
        </div>
        <p class="text-sm">{{ plan.what }}</p>
      </div>
      <p class="text-[40px] font-semibold leading-[1.1]">
        {{ plan.price }} <span class="text-base font-normal">kr./month</span>
      </p>
      <ul v-if="plan.features" class="flex flex-col gap-3">
        <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          {{ feature }}
        </li>
      </ul>
      <RouterLink
        :to="{ name: 'checkout', query: { plan: plan.name } }"
        class="mt-auto rounded-ds px-6 py-3 text-center font-semibold no-underline"
        :class="plan.featured ? 'bg-sky text-ink hover:bg-white' : 'bg-red text-white hover:bg-red-hover'"
      >
        Choose {{ plan.name }}
      </RouterLink>
    </article>
  </div>
</template>