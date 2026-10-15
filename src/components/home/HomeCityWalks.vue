<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useEvents } from '@/composables/useEvents'
import EventCard from '@/components/event/EventCard.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import LoadingState from '@/components/base/LoadingState.vue'

const { events, loading, error, fetchEvents } = useEvents()

const CITIES = ['All', 'Aarhus', 'Copenhagen', 'Odense', 'Esbjerg']
const city = ref('All')

// The next 3 events in the chosen city (the service already sorts by date)
const shownEvents = computed(() =>
  (city.value === 'All' ? events.value : events.value.filter((e) => e.city === city.value)).slice(0, 3)
)

onMounted(fetchEvents)
</script>

<template>
  <section id="walks" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Join us on our city walks</h2>
      <p class="text-ink-muted">Walks, coffee and culture with learners who are just like you.</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <FilterChips v-model="city" :options="CITIES" label="Filter by city" />
      <RouterLink to="/events" class="rounded-ds bg-red px-6 py-2.5 font-semibold text-white no-underline hover:bg-red-hover sm:ml-auto">
        See all events
      </RouterLink>
    </div>

    <LoadingState v-if="loading" label="Loading events…" />
    <p v-else-if="error || shownEvents.length === 0" class="text-ink-muted">
      No walks planned here yet.
      <RouterLink to="/events" class="font-semibold text-red">See all events</RouterLink>
    </p>
    <!-- Same card as the Events page, so "Save your spot" works right here -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <EventCard v-for="event in shownEvents" :key="event.$id" :event="event" />
    </div>
  </section>
</template>