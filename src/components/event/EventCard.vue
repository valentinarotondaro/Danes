<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRsvp } from '@/composables/useRsvp'
import { useAuth } from '@/composables/useAuth'
import RsvpButton from './RsvpButton.vue'

const props = defineProps({ event: { type: Object, required: true } })

const { isLoggedIn } = useAuth()
const { hasRsvpd, isWaitlisted, rsvping, error, checkRsvp, rsvp, joinWaitlist } = useRsvp()
const router = useRouter()

const spotsBooked = computed(() => props.event.spotsBooked ?? 0)
const isFull = computed(() => spotsBooked.value >= props.event.capacity)
const spotsLeft = computed(() => Math.max(props.event.capacity - spotsBooked.value, 0))

// Date tile ("OCT" / "18") and a readable line ("Sat 10:00")
const date = computed(() => new Date(props.event.dateTime))
const month = computed(() => date.value.toLocaleString('en-GB', { month: 'short' }))
const day = computed(() => date.value.getDate())
const when = computed(() =>
  date.value.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
)

function requireLogin() {
  if (isLoggedIn.value) return true
  router.push({ name: 'login', query: { redirect: '/events' } })
  return false
}

async function onRsvp() {
  if (!requireLogin()) return
  try {
    await rsvp(props.event)
    props.event.spotsBooked = spotsBooked.value + 1
  } catch {
    // the message is in `error` and shown under the card
  }
}

async function onWaitlist() {
  if (!requireLogin()) return
  try {
    await joinWaitlist(props.event)
  } catch {
    // shown via `error`
  }
}

onMounted(() => {
  if (isLoggedIn.value) checkRsvp(props.event.$id)
})
</script>

<template>
  <article class="flex flex-col gap-4">
    <div class="relative aspect-[4/3] overflow-hidden rounded-ds bg-sky-soft">
      <img
        v-if="event.imageUrl"
        :src="event.imageUrl"
        :alt="event.title"
        class="h-full w-full object-cover"
      />
      <span class="absolute left-3 top-3 flex h-16 w-16 flex-col items-center justify-center rounded-ds bg-white text-ink">
        <span class="text-xs font-semibold uppercase">{{ month }}</span>
        <span class="text-2xl font-semibold leading-none">{{ day }}</span>
      </span>
    </div>

    <span v-if="event.city" class="self-start rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
      {{ event.city }}
    </span>

    <h3 class="text-2xl font-semibold leading-tight text-ink">{{ event.title }}</h3>
    <p class="text-ink-muted">{{ when }} · {{ event.location }}</p>
    <p v-if="event.description" class="line-clamp-3 text-ink-muted">{{ event.description }}</p>

    <div class="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4">
      <span class="text-sm font-semibold" :class="isFull ? 'text-red' : 'text-ink'">
        {{ isFull ? 'Full' : `${spotsLeft} spots left` }}
      </span>
      <RsvpButton
        :has-rsvpd="hasRsvpd"
        :is-waitlisted="isWaitlisted"
        :loading="rsvping"
        :full="isFull"
        @rsvp="onRsvp"
        @waitlist="onWaitlist"
      />
    </div>
    <p v-if="error" role="alert" class="text-sm font-semibold text-red">{{ error }}</p>
  </article>
</template>