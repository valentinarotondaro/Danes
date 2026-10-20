<script setup>
// The "Words" tab. The speaker button reads the Danish word aloud with the
// browser's own voice (speechSynthesis): no extra service needed.
defineProps({
  words: { type: Array, required: true }, // [{ da, en }]
})

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

function say(text) {
  const voice = new SpeechSynthesisUtterance(text)
  voice.lang = 'da-DK'
  voice.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(voice)
}
</script>

<template>
  <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <li v-for="w in words" :key="w.da" class="flex items-center gap-4 rounded-ds bg-surface-secondary p-4">
      <button
        v-if="canSpeak"
        type="button"
        :aria-label="`Hear ${w.da}`"
        class="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white hover:bg-sky"
        @click="say(w.da)"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /></svg>
      </button>
      <span lang="da" class="min-w-0 flex-1 text-lg font-semibold leading-tight">{{ w.da }}</span>
      <span class="text-right text-sm text-ink-muted">{{ w.en }}</span>
    </li>
  </ul>
</template>
