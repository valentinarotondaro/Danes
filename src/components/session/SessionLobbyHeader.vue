<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  session: { type: Object, required: true },
  timing: { type: Object, required: true },
  label: { type: String, required: true },
})

const start = computed(() => new Date(props.session.dateTime))
const crumbDate = computed(() => start.value.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))
const hours = computed(() => {
  const time = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const end = new Date(start.value.getTime() + (props.session.durationMinutes ?? 45) * 60000)
  return `${time(start.value)}–${time(end)}`
})

// Full class names written out, so Tailwind finds them
const STATUS = {
  upcoming: { text: 'Opens 10 min before', classes: 'bg-sky-soft text-ink' },
  open: { text: 'Room open', classes: 'bg-success-soft text-success' },
  live: { text: 'Live now', classes: 'bg-red text-white' },
  ended: { text: 'Ended', classes: 'bg-surface-secondary text-ink-muted' },
}
const status = computed(() => STATUS[props.timing.state])
</script>

<template>
  <section class="flex flex-col gap-4">
    <nav aria-label="Breadcrumb">
      <ol class="flex flex-wrap gap-2 text-sm text-ink">
        <li><RouterLink to="/live-classes" class="text-ink">Speaking Club</RouterLink></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" class="font-semibold">{{ crumbDate }} · {{ session.title }}</li>
      </ol>
    </nav>

    <div class="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
      <div class="flex flex-col gap-3">
        <ul class="flex flex-wrap gap-2">
          <li :class="status.classes" class="rounded-ds px-3 py-1 text-xs font-semibold uppercase tracking-wide">{{ status.text }}</li>
          <li v-if="session.level" class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ session.level }}</li>
          <li class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ hours }}</li>
        </ul>
        <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">{{ session.title }}</h1>
      </div>
      <!-- role="status": screen readers hear it when it changes -->
      <p role="status" class="font-semibold text-ink">{{ label }}</p>
    </div>
  </section>
</template>