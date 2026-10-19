<script setup>
import EventCard from './EventCard.vue'

defineProps({ events: { type: Array, required: true } })
</script>

<template>
  <div class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    <EventCard v-for="event in events" :key="event.$id" :event="event" />
  </div>
</template>