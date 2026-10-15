<script setup>
import { computed, onMounted, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'
import EventList from '@/components/event/EventList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { events, loading, error, fetchEvents } = useEvents()

const CITIES = ['All cities', 'Copenhagen', 'Aarhus', 'Esbjerg', 'Odense']
const selectedCity = ref('All cities')

// Same pattern as the course level filter: filter what we already loaded
const visibleEvents = computed(() =>
  selectedCity.value === 'All cities'
    ? events.value
    : events.value.filter((e) => e.city === selectedCity.value)
)

onMounted(fetchEvents)
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-4 py-16 sm:px-10 sm:py-20">
    <header class="flex flex-col gap-4">
      <span class="text-sm font-semibold uppercase tracking-wide text-red">Live it</span>
      <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Events</h1>
      <p class="max-w-xl text-lg text-ink-muted">
        Walks, food and hygge in your city. Come alone, leave with people to say hej to.
      </p>
    </header>

    <div role="group" aria-label="Filter by city" class="mt-10 flex flex-wrap gap-2">
      <button
        v-for="city in CITIES"
        :key="city"
        type="button"
        :aria-pressed="selectedCity === city"
        class="rounded-ds border px-4 py-2 text-sm font-semibold transition-colors"
        :class="selectedCity === city
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink hover:border-ink'"
        @click="selectedCity = city"
      >
        {{ city }}
      </button>
    </div>

    <div class="mt-10">
      <LoadingState v-if="loading" label="Loading events…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchEvents" />
      <EmptyState
        v-else-if="visibleEvents.length === 0"
        title="No events here yet"
        description="Try another city, or check back soon."
      />
      <EventList v-else :events="visibleEvents" />
    </div>
  </section>
</template>