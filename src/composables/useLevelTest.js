// src/composables/useLevelTest.js
//
// The whole level test flow: which screen we are on, the answers, the
// result, and saving it to the learner's profile. The view only shows it.

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { saveLevel } from '@/services/profileService'
import { calculateLevel } from '@/utils/levelScoring'
import { QUESTIONS, PARTS, LETTERS } from '@/components/levelTest/levelTestContent'

export function useLevelTest() {
  const { currentUser, isLoggedIn } = useAuth()
  const LEVELS = ['A1', 'A2', 'B1']

  const step = ref('intro') // 'intro' | 'question' | 'result'
  const index = ref(0)
  const answers = ref({}) // { q1: 'talk', q3: 'bor', q4: 'skip' }
  const level = ref(null) // 'A1' | 'A2' | 'B1'
  const saving = ref(false)
  const saved = ref(false)
  const saveError = ref(null)

  const total = QUESTIONS.length
  const question = computed(() => QUESTIONS[index.value])
  const letter = computed(() => (question.value.letterId ? LETTERS[question.value.letterId] : null))
  const selected = computed(() => answers.value[question.value.id] ?? null)
  const partNumber = computed(() => Object.keys(PARTS).indexOf(question.value.part) + 1)
  const partLabel = computed(() => `Part ${partNumber.value} of 3 · ${PARTS[question.value.part]}`)
  const isLast = computed(() => index.value === total - 1)

  function start() {
    answers.value = {}
    index.value = 0
    saved.value = false
    step.value = 'question'
  }

  function choose(optionId) {
    // a new object, so Vue notices the change
    answers.value = { ...answers.value, [question.value.id]: optionId }
  }

  function next() {
    if (!selected.value) return
    if (isLast.value) finish(calculateLevel(QUESTIONS, answers.value))
    else index.value++
  }

  function back() {
    if (index.value > 0) index.value--
    else step.value = 'intro'
  }

  async function finish(result) {
    level.value = result
    step.value = 'result'
    window.scrollTo(0, 0)
    if (isLoggedIn.value) await save()
  }

  // "I'm a total beginner": skip the questions
  function startAsBeginner() {
    finish('A1')
  }

  // Back from signup/login with ?level=A2: show that result and save it
  function resume(savedLevel) {
    if (LEVELS.includes(savedLevel)) finish(savedLevel)
  }

  async function save() {
    saving.value = true
    saveError.value = null
    try {
      await saveLevel(currentUser.value, level.value)
      saved.value = true
    } catch {
      saveError.value = 'We couldn’t save your level. Your result is still shown below.'
    } finally {
      saving.value = false
    }
  }

  return {
    step, index, total, question, letter, selected, partLabel, isLast,
    level, saving, saved, saveError, isLoggedIn,
    start, choose, next, back, startAsBeginner, resume,
  }
}