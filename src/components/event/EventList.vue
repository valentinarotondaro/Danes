<script setup>
import EventCard from './EventCard.vue'

defineProps({ events: { type: Array, required: true } })
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <EventCard v-for="event in events" :key="event.$id" :event="event" />
  </div>
</template>
