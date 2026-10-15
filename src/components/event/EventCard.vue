<script setup>
import { useRsvp } from '@/composables/useRsvp'
import { useAuth } from '@/composables/useAuth'
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import RsvpButton from './RsvpButton.vue'

const props = defineProps({ event: { type: Object, required: true } })

const { isLoggedIn } = useAuth()
const { hasRsvpd, rsvping, checkRsvp, rsvp } = useRsvp()
const router = useRouter()

const isFull = computed(() => (props.event.spotsBooked ?? 0) >= props.event.capacity)
const spotsLeft = computed(() => Math.max(props.event.capacity - (props.event.spotsBooked ?? 0), 0))

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
  <div class="rounded-2xl border border-neutral-200 bg-white p-5">
    <span class="inline-block rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-medium text-terracotta">
      Belong
    </span>
    <h3 class="mt-2 text-lg text-neutral-900">{{ event.title }}</h3>
    <p class="mt-1 text-sm text-neutral-500">{{ formatDate(event.dateTime) }} · {{ event.location }}</p>
    <p v-if="event.description" class="mt-2 text-sm text-neutral-600">{{ event.description }}</p>

    <div class="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
      <span
        class="rounded-full px-3 py-1 text-sm font-medium"
        :class="isFull ? 'bg-red-50 text-red-600' : 'bg-terracotta/15 text-terracotta'"
      >
        {{ isFull ? 'Full' : `${spotsLeft} spots left` }}
      </span>
      <RsvpButton :has-rsvpd="hasRsvpd" :loading="rsvping" :full="isFull" @rsvp="onRsvp" />
    </div>
  </div>
</template>
