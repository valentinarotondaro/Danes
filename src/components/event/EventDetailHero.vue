<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CoverPhoto from '@/components/base/CoverPhoto.vue'

const props = defineProps({ event: { type: Object, required: true } })

const start = computed(() => new Date(props.event.dateTime))
const day = computed(() => start.value.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }))
const hours = computed(() => {
  const time = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (!props.event.durationMinutes) return time(start.value)
  const end = new Date(start.value.getTime() + props.event.durationMinutes * 60000)
  return `${time(start.value)}–${time(end)}`
})
const priceTag = computed(() => (props.event.price ? `${props.event.price} kr.` : 'Included in plans'))
</script>

<template>
  <section id="top" class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
    <div class="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:min-h-[480px] lg:min-w-0 lg:flex-1 lg:basis-0">
      <nav aria-label="Breadcrumb">
        <ol class="flex gap-2 text-sm text-ink">
          <li><RouterLink to="/events" class="text-ink">Events</RouterLink></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" class="font-semibold">{{ event.title }}</li>
        </ol>
      </nav>
      <div class="flex flex-col gap-4">
        <ul class="flex flex-wrap gap-2">
          <li v-if="event.city" class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ event.city }}</li>
          <li class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ priceTag }}</li>
        </ul>
        <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">{{ event.title }}</h1>
        <p v-if="event.description" class="max-w-[460px] text-ink">{{ event.description }}</p>
      </div>
      <dl class="grid grid-cols-1 gap-4 text-ink sm:grid-cols-3">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide">When</dt>
          <dd class="mt-1 font-semibold">{{ day }}<br />{{ hours }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide">Where</dt>
          <dd class="mt-1 font-semibold">{{ event.location }}<template v-if="event.city">,<br />{{ event.city }}</template></dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide">Group</dt>
          <dd class="mt-1 font-semibold">Up to {{ event.capacity }}<br />learners</dd>
        </div>
      </dl>
    </div>
    <CoverPhoto v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title" :rounded="false" />
    <div v-else class="h-[320px] bg-sky-soft lg:h-auto lg:flex-1 lg:basis-0" />
  </section>
</template>