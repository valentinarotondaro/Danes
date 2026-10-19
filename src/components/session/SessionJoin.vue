<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import VideoRoomEmbed from '@/components/liveClass/VideoRoomEmbed.vue'

defineProps({
  session: { type: Object, required: true },
  isBooked: { type: Boolean, default: false },
  isWaitlisted: { type: Boolean, default: false },
  isFull: { type: Boolean, default: false },
  canJoin: { type: Boolean, default: false },
  ended: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
})
defineEmits(['book', 'waitlist'])

const { currentUser } = useAuth()
const initial = computed(() => currentUser.value?.name?.[0]?.toUpperCase() ?? '?')
const showRoom = ref(false)

const redButton =
  'inline-flex h-14 items-center justify-center rounded-ds bg-red px-8 font-semibold text-white transition-colors hover:bg-red-hover disabled:cursor-not-allowed disabled:opacity-50'
</script>

<template>
  <section aria-label="Join the session" class="flex flex-col gap-4">
    <!-- The real video room replaces the preview once you join -->
    <VideoRoomEmbed v-if="showRoom" :live-class-id="session.$id" />
    <div
      v-else
      class="flex aspect-[4/3] flex-col items-center justify-center gap-4 rounded-ds bg-[#171717] px-6 text-center text-white sm:aspect-video"
    >
      <span aria-hidden="true" class="flex size-[88px] items-center justify-center rounded-full bg-sky text-4xl font-semibold text-ink sm:size-28">
        {{ initial }}
      </span>
      <span class="text-sm sm:text-base">You choose camera and mic inside the room. Camera off is fine.</span>
    </div>

    <div v-if="!showRoom" class="flex flex-wrap items-center gap-3">
      <p v-if="ended" class="font-semibold text-ink">This session has ended.</p>

      <template v-else-if="isBooked">
        <span class="rounded-ds bg-success-soft px-3 py-1 text-sm font-semibold text-success">You have a seat</span>
        <button type="button" :disabled="!canJoin" :class="redButton" class="w-full sm:ml-auto sm:w-auto" @click="showRoom = true">
          Join the session
        </button>
      </template>

      <p v-else-if="isWaitlisted" class="rounded-ds bg-surface-secondary px-4 py-3 font-semibold text-ink">You’re on the waitlist</p>

      <button
        v-else-if="isFull"
        type="button"
        :disabled="loading"
        class="inline-flex h-14 w-full items-center justify-center rounded-ds border-2 border-ink bg-white px-8 font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-50 sm:w-auto"
        @click="$emit('waitlist')"
      >
        {{ loading ? 'Please wait…' : 'Join the waitlist' }}
      </button>

      <button v-else type="button" :disabled="loading" :class="redButton" class="w-full sm:w-auto" @click="$emit('book')">
        {{ loading ? 'Booking…' : 'Book your seat' }}
      </button>
    </div>

    <p v-if="error" role="alert" class="text-sm font-semibold text-red">{{ error }}</p>
    <p v-if="isBooked && !ended && !showRoom" class="text-sm text-ink-muted">
      Opens in your browser. The room unlocks 10 minutes before start.
    </p>
  </section>
</template>