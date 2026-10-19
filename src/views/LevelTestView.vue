<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useLevelTest } from '@/composables/useLevelTest'
import LevelTestIntro from '@/components/levelTest/LevelTestIntro.vue'
import LevelTestBar from '@/components/levelTest/LevelTestBar.vue'
import LevelTestQuestion from '@/components/levelTest/LevelTestQuestion.vue'
import LevelTestResult from '@/components/levelTest/LevelTestResult.vue'
import logo from '@/assets/img/danes-logo.png'

const route = useRoute()
const {
  step, index, total, question, letter, selected, partLabel, isLast,
  level, saving, saved, saveError, isLoggedIn,
  start, choose, next, back, startAsBeginner, resume,
} = useLevelTest()

// Keys 1–4 pick an answer, Enter continues (only while answering)
function onKey(e) {
  if (step.value !== 'question' || e.target.closest?.('input, textarea')) return
  const option = question.value.options[Number(e.key) - 1]
  if (option) choose(option.id)
  if (e.key === 'Enter' && selected.value && e.target.tagName !== 'BUTTON') next()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (route.query.level) resume(route.query.level)
})
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- While answering: progress bar. Intro and result: just the logo. -->
    <LevelTestBar
      v-if="step === 'question'"
      :part-label="partLabel"
      :number="index + 1"
      :total="total"
      @exit="step = 'intro'"
    />
    <header v-else class="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-4 pt-8 sm:px-10">
      <RouterLink to="/"><img :src="logo" alt="DANES home" class="h-10 w-auto" /></RouterLink>
      <RouterLink to="/" class="font-semibold text-ink no-underline hover:text-red">Back to DANES</RouterLink>
    </header>

    <main class="flex-1">
      <LevelTestIntro v-if="step === 'intro'" @start="start" @beginner="startAsBeginner" />
      <LevelTestQuestion
        v-else-if="step === 'question'"
        :key="question.id"
        :question="question"
        :letter="letter"
        :model-value="selected"
        @update:model-value="choose"
      />
      <LevelTestResult
        v-else
        :level="level"
        :is-logged-in="isLoggedIn"
        :saving="saving"
        :saved="saved"
        :save-error="saveError"
        @retake="start"
      />
    </main>

    <footer v-if="step === 'question'" class="sticky bottom-0 border-t border-line bg-white">
      <div class="mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-10 sm:py-6" :class="letter ? 'max-w-[1200px]' : 'max-w-[760px]'">
        <button type="button" class="min-h-12 font-semibold text-ink hover:text-red" @click="back">Back</button>
        <span class="hidden text-sm text-ink-muted md:inline">Tip: press 1–4 to choose</span>
        <button
          type="button"
          :disabled="!selected"
          class="rounded-ds bg-red px-6 py-3 font-semibold text-white hover:bg-red-hover disabled:bg-surface-secondary disabled:text-ink-muted sm:w-60"
          @click="next"
        >
          {{ isLast ? 'See my result' : 'Continue' }}
        </button>
      </div>
    </footer>
  </div>
</template>