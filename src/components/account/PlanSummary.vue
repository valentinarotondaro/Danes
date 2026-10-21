<script setup>
import { RouterLink } from 'vue-router'

// "Your plan": what the learner pays each month and, if a package covers the
// same for less, the suggestion to switch.
defineProps({
  plan: { type: Object, required: true }, // { items, total }
  upgrade: { type: Object, default: null }, // { pkg, saving }
  renewsOn: { type: Date, default: null },
})
</script>

<template>
  <section aria-labelledby="plan-title" class="flex flex-col gap-4 rounded-ds border border-line p-6">
    <h2 id="plan-title" class="text-2xl font-semibold leading-tight">Your plan</h2>

    <template v-if="plan.items.length">
      <ul class="flex flex-col gap-2 text-sm">
        <li v-for="item in plan.items" :key="item.order.$id" class="flex"><span>{{ item.title }}</span><span class="ml-auto">{{ item.price }} kr</span></li>
        <li class="flex border-t border-line pt-2 font-semibold"><span>Per month</span><span class="ml-auto">{{ plan.total }} kr</span></li>
      </ul>
      <div v-if="upgrade" class="flex flex-col gap-2 rounded-ds bg-sky-soft p-4">
        <span class="font-semibold">Save {{ upgrade.saving }} kr a month</span>
        <span class="text-sm">The {{ upgrade.pkg.title }} package has the same for {{ upgrade.pkg.price }} kr.</span>
        <RouterLink :to="{ name: 'checkout', query: { plan: upgrade.pkg.title } }" class="text-sm font-semibold text-ink">Switch to {{ upgrade.pkg.title }}</RouterLink>
      </div>
      <span v-if="renewsOn" class="text-sm text-ink-muted">Renews {{ renewsOn.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) }}</span>
    </template>

    <template v-else>
      <p class="text-sm text-ink-muted">You don’t have a plan yet. Pick one to get a course, the Friday Speaking Club or events.</p>
      <RouterLink :to="{ name: 'course-catalog', hash: '#plans' }" class="inline-flex h-12 items-center self-start rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">See the plans</RouterLink>
    </template>
  </section>
</template>
