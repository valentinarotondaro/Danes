<script setup>
const steps = [
  { n: 1, tone: 'sky', title: 'Pick an event', text: 'Filter by city and see the date, the place and how many are already going.' },
  { n: 2, tone: 'red', title: 'Save your spot', text: 'One click when you’re logged in. Full? Join the waitlist and we’ll email you if a spot opens.' },
  { n: 3, tone: 'sky', title: 'Show up and speak', text: 'Your host brings the words of the day. You bring the courage to try them.' },
]
</script>

<template>
  <section id="how" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">How events work</h2>
      <p class="text-ink-muted">Small groups, a DANES host, and Danish you can use on the spot.</p>
    </div>
    <ol class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <li
        v-for="step in steps"
        :key="step.n"
        class="flex min-h-[240px] flex-col justify-between gap-6 rounded-ds p-6"
        :class="step.tone === 'red' ? 'bg-red text-white' : 'bg-sky text-ink'"
      >
        <span
          class="self-start rounded-ds px-3 py-1 text-sm font-semibold"
          :class="step.tone === 'red' ? 'bg-white text-red' : 'bg-red text-white'"
        >Step {{ step.n }}</span>
        <div class="flex flex-col gap-2">
          <h3 class="text-2xl font-semibold leading-tight">{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>