<script setup>
import { onMounted } from 'vue'
import { useEvents } from '@/composables/useEvents'
import EventList from '@/components/event/EventList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { events, loading, error, fetchEvents } = useEvents()
onMounted(fetchEvents)
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-12">
    <h1 class="font-serif text-3xl text-neutral-900">Belong</h1>
    <p class="mt-2 text-neutral-500">In-person community and cultural events — no video, just showing up.</p>

    <div class="mt-8">
      <LoadingState v-if="loading" label="Loading events…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchEvents" />
      <EmptyState v-else-if="events.length === 0" title="No events scheduled" description="Check back soon." />
      <EventList v-else :events="events" />
    </div>
  </section>
</template>
