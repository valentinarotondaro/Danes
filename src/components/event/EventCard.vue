<script setup>
import { useRsvp } from '@/composables/useRsvp'
import { useAuth } from '@/composables/useAuth'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import RsvpButton from './RsvpButton.vue'
import SpotsRemainingLabel from './SpotsRemainingLabel.vue'

const props = defineProps({ event: { type: Object, required: true } })

const { isLoggedIn } = useAuth()
const { hasRsvpd, rsvping, checkRsvp, rsvp } = useRsvp()
const router = useRouter()

const isFull = computed(() => (props.event.spotsBooked ?? 0) >= props.event.capacity)

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

async function onRsvp() {
  if (!isLoggedIn.value) {
    router.push({ name: 'login' })
    return
  }
  try {
    await rsvp(props.event)
    props.event.spotsBooked = (props.event.spotsBooked ?? 0) + 1
  } catch {
    // error surfaced via the composable's error ref if a parent wants to show it
  }
}

onMounted(() => {
  if (isLoggedIn.value) checkRsvp(props.event.$id)
})
</script>

<template>
  <div class="rounded-lg border border-neutral-200 p-4">
    <h3 class="font-serif text-lg text-neutral-900">{{ event.title }}</h3>
    <p class="mt-1 text-sm text-neutral-500">{{ formatDate(event.dateTime) }} · {{ event.location }}</p>
    <p v-if="event.description" class="mt-2 text-sm text-neutral-600">{{ event.description }}</p>

    <div class="mt-3 flex items-center justify-between">
      <SpotsRemainingLabel :capacity="event.capacity" :spots-booked="event.spotsBooked" />
      <RsvpButton :has-rsvpd="hasRsvpd" :loading="rsvping" :full="isFull" @rsvp="onRsvp" />
    </div>
  </div>
</template>
