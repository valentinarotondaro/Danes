// src/composables/useSessionTiming.js
//
// Wraps utils/sessionTiming.js in Vue: a clock that ticks every 30 seconds,
// so "Starts in 8 minutes" and the Join button update on their own.

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getSessionTiming, timingLabel } from '@/utils/sessionTiming'

export function useSessionTiming(session) {
  const now = ref(new Date())
  let timer = null

  onMounted(() => {
    timer = setInterval(() => (now.value = new Date()), 30000)
  })
  onUnmounted(() => clearInterval(timer)) // stop the clock when leaving the page

  const timing = computed(() =>
    getSessionTiming(session.value.dateTime, session.value.durationMinutes ?? 45, now.value)
  )
  const label = computed(() => timingLabel(timing.value))

  return { timing, label }
}