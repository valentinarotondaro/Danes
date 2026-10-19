<script setup>
import { computed } from 'vue'

// Host and meeting point, side by side. The host card only shows if the event has one.
const props = defineProps({
  event: { type: Object, required: true },
  host: { type: Object, default: null }, // a teachers document
})

const place = computed(() => `${props.event.location} ${props.event.city ?? ''}`.trim())

// Google Maps embed: free and needs no API key
const embedUrl = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(place.value)}&output=embed`)
const mapsUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.value)}`)

// "DANES teacher in Aarhus", like the design; falls back to the specialty
const hostLine = computed(() => {
  if (!props.host) return ''
  return props.host.city ? `DANES teacher in ${props.host.city}` : props.host.specialty ?? ''
})
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <section v-if="host" aria-label="Your host" class="flex flex-[1_1_280px] flex-col gap-4 rounded-ds bg-surface-secondary p-6 text-ink">
      <span class="text-xs font-semibold uppercase tracking-wide">Your host</span>
      <div class="flex items-center gap-4">
        <img v-if="host.photoUrl" :src="host.photoUrl" :alt="host.name" class="h-16 w-16 flex-none rounded-full object-cover" />
        <span v-else aria-hidden="true" class="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-red text-2xl font-semibold text-white">{{ host.name[0] }}</span>
        <span class="flex flex-col">
          <span class="text-2xl font-semibold leading-tight">{{ host.name }}</span>
          <span v-if="hostLine" class="text-sm text-ink-muted">{{ hostLine }}</span>
        </span>
      </div>
      <!-- The teacher's bio, shown as a quote -->
      <p v-if="host.bio">“{{ host.bio }}”</p>
    </section>

    <section aria-label="Meeting point" class="flex flex-[1_1_280px] flex-col gap-4 rounded-ds bg-surface-secondary p-6 text-ink">
      <span class="text-xs font-semibold uppercase tracking-wide">Meeting point</span>
      <iframe
        :src="embedUrl"
        :title="`Map: ${place}`"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="h-[160px] w-full rounded-ds border-0 bg-line"
      />
      <p>
        <strong>{{ event.location }}<template v-if="event.city">, {{ event.city }}</template>.</strong>
        {{ event.meetingPoint }}
      </p>
      <a :href="mapsUrl" target="_blank" rel="noopener" class="self-start font-semibold text-ink">Open in Maps</a>
    </section>
  </div>
</template>