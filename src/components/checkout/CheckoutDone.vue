<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { nextPaymentDate } from '@/utils/plans'

// The "You're on Starter" screen after a successful payment.
const props = defineProps({
  pkg: { type: Object, required: true },
  course: { type: Object, default: null },
  order: { type: Object, required: true },
  firstName: { type: String, default: '' },
})

const orderNumber = computed(() => `#${props.order.$id.slice(-6).toUpperCase()}`)
const nextPayment = nextPaymentDate()

// Only the next steps that this package really includes
const nextSteps = computed(() => {
  const steps = []
  if (props.course) {
    steps.push({ to: { name: 'course-detail', params: { id: props.course.$id } }, title: `Start ${props.course.title}`, text: 'Your lessons are open now', tone: 'grey' })
  }
  if (props.pkg.includesSpeakingClub) {
    steps.push({ to: { name: 'live-class-list' }, title: 'Book your first Friday', text: 'Pick a Speaking Club session for your level', tone: 'sky' })
  }
  if (props.pkg.includesEvents) {
    steps.push({ to: { name: 'event-list' }, title: 'Find an event in your city', text: 'Copenhagen, Aarhus, Esbjerg and Odense', tone: 'sky' })
  }
  steps.push({ to: { name: 'my-account' }, title: 'See your plan and orders', text: 'In your account', tone: 'line' })
  return steps
})

const toneClass = { grey: 'bg-surface-secondary', sky: 'bg-sky', line: 'border border-line' }
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 pb-24 pt-10 sm:px-10 sm:pt-[72px] lg:flex-row">
    <section role="status" aria-labelledby="done-title" class="flex min-w-0 flex-col gap-6 rounded-ds bg-red p-8 text-white sm:p-12 lg:flex-[3]">
      <span aria-hidden="true" class="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-red">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
      </span>
      <div class="flex flex-col gap-3">
        <h1 id="done-title" class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">
          You’re on {{ pkg.title }}<template v-if="firstName">, {{ firstName }}</template>.
        </h1>
        <p class="max-w-[520px] text-lg">
          <template v-if="course">{{ course.title }} is in your plan. </template>You now pay {{ pkg.price }} kr a month.
        </p>
      </div>
      <dl class="grid max-w-[420px] grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt class="opacity-85">Order</dt><dd class="font-semibold">{{ orderNumber }}</dd>
        <dt class="opacity-85">Paid today</dt><dd class="font-semibold">{{ pkg.price }} kr</dd>
        <dt class="opacity-85">Next payment</dt><dd class="font-semibold">{{ nextPayment }}</dd>
      </dl>
      <RouterLink :to="{ name: 'my-account' }" class="mt-auto inline-flex h-12 w-fit items-center rounded-ds bg-white px-6 font-semibold text-ink no-underline hover:bg-sky">
        Go to My account
      </RouterLink>
    </section>

    <section aria-labelledby="next-title" class="flex min-w-0 flex-col gap-4 lg:flex-[2]">
      <h2 id="next-title" class="text-[32px] font-semibold leading-tight">What’s next</h2>
      <RouterLink
        v-for="step in nextSteps"
        :key="step.title"
        :to="step.to"
        class="flex items-center gap-4 rounded-ds p-5 text-ink no-underline hover:text-ink"
        :class="toneClass[step.tone]"
      >
        <span class="flex flex-1 flex-col">
          <span class="font-semibold">{{ step.title }}</span>
          <span class="text-sm" :class="step.tone === 'sky' ? '' : 'text-ink-muted'">{{ step.text }}</span>
        </span>
        <span aria-hidden="true" class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </span>
      </RouterLink>
    </section>
  </div>
</template>