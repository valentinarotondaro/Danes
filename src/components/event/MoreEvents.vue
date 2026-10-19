<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import EventCard from './EventCard.vue'

const props = defineProps({ current: { type: Object, required: true } })

const { events, fetchEvents } = useEvents()
onMounted(fetchEvents)

// Up to 3 other events: same city first, then the rest (each list keeps date order)
const more = computed(() => {
  const others = events.value.filter((e) => e.$id !== props.current.$id)
  const sameCity = others.filter((e) => e.city === props.current.city)
  const rest = others.filter((e) => e.city !== props.current.city)
  return [...sameCity, ...rest].slice(0, 3)
})
</script>

<template>
  <section v-if="more.length" class="flex flex-col gap-8">
    <div class="flex flex-wrap items-end gap-6">
      <div class="flex flex-[1_1_520px] flex-col gap-2">
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">More events near you</h2>
        <p class="text-ink-muted">Keep the momentum going after this one.</p>
      </div>
      <RouterLink to="/events" class="rounded-ds border-2 border-ink bg-white px-6 py-3 font-semibold text-ink no-underline hover:bg-sky-soft">See all events</RouterLink>
    </div>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- :key on the id, so moving to another event builds fresh cards -->
      <EventCard v-for="event in more" :key="event.$id" :event="event" />
    </div>
  </section>
</template>