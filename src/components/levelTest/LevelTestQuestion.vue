<script setup>
import { computed } from 'vue'
import AnswerOptions from './AnswerOptions.vue'
import LetterCard from './LetterCard.vue'
import { PARTS } from './levelTestContent'

const props = defineProps({
  question: { type: Object, required: true },
  letter: { type: Object, default: null },
})
const selected = defineModel({ type: String, default: null })

// The sentence "Jeg ___ i Aarhus." split around the gap, so the chosen word shows in it
const sentenceParts = computed(() => props.question.sentence?.split('___') ?? null)
const chosenWord = computed(() =>
  props.question.options.find((o) => o.id === selected.value)?.text ?? '\u00a0'
)
const eyebrow = computed(() =>
  props.question.kind === 'choice' ? 'Choose the word that fits'
    : props.question.kind === 'reading' ? 'Read the text'
    : PARTS[props.question.part]
)
</script>

<template>
  <div
    class="mx-auto flex w-full flex-col gap-8 px-4 py-10 sm:px-10 sm:py-[72px]"
    :class="letter ? 'max-w-[1200px] lg:flex-row lg:items-start' : 'max-w-[760px]'"
  >
    <LetterCard v-if="letter" :letter="letter" class="lg:flex-1" />

    <div class="flex flex-col gap-6 sm:gap-8" :class="letter ? 'lg:flex-1' : ''">
      <div class="flex flex-col gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">{{ eyebrow }}</span>
        <h1 v-if="question.kind !== 'choice'" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">
          {{ question.prompt }}
        </h1>
        <p v-else class="text-ink-muted">{{ question.prompt }}</p>
        <p v-if="question.hint" class="text-ink-muted">{{ question.hint }}</p>
      </div>

      <div v-if="sentenceParts" class="flex justify-center rounded-ds bg-sky px-4 py-6 sm:p-10">
        <h1 lang="da" class="text-center text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">
          {{ sentenceParts[0] }}<span class="inline-block min-w-20 border-b-[3px] border-ink text-red sm:min-w-[120px]">{{ chosenWord }}</span>{{ sentenceParts[1] }}
        </h1>
      </div>

      <AnswerOptions
        v-model="selected"
        :options="question.options"
        :label="question.sentence ?? question.prompt"
        :grid="question.kind === 'choice'"
        :lang="question.kind === 'choice' ? 'da' : undefined"
      />

      <!-- "About you" questions have no wrong answer, so no skip there -->
      <button
        v-if="question.kind !== 'self'"
        type="button"
        :aria-pressed="selected === 'skip'"
        class="min-h-12 self-center rounded-ds border-2 px-4 font-semibold text-ink"
        :class="selected === 'skip' ? 'border-ink bg-sky' : 'border-transparent underline underline-offset-4 hover:text-red'"
        @click="selected = 'skip'"
      >
        I don’t know yet
      </button>
    </div>
  </div>
</template>