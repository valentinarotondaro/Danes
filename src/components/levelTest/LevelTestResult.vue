<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useCourses } from '@/composables/useCourses'
import RecommendedCourseCard from './RecommendedCourseCard.vue'
import { LEVEL_INFO } from './levelTestContent'

const props = defineProps({
  level: { type: String, required: true }, // 'A1' | 'A2' | 'B1'
  isLoggedIn: { type: Boolean, required: true },
  saving: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  saveError: { type: String, default: null },
})
defineEmits(['retake'])

const { courses, fetchCourses } = useCourses()
onMounted(fetchCourses)

const info = computed(() => LEVEL_INFO[props.level])
const SCALE = ['A1', 'A2', 'B1']

// After signup/login the learner comes back here with ?level=A2, and it is saved then
const comeBack = computed(() => `/level-test?level=${props.level}`)

// The first course at the learner's level (the catalog is already sorted)
const course = computed(() => courses.value.find((c) => c.level === props.level) ?? null)
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:px-10">
    <section aria-labelledby="result-title" class="flex flex-col gap-6 rounded-ds bg-red p-6 text-white sm:p-10 lg:flex-row">
      <div class="flex flex-col justify-between gap-8 lg:flex-1">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-semibold uppercase tracking-wide">Your result</span>
          <h1 id="result-title" class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">You’re {{ info.name }}.</h1>
          <p class="max-w-[440px]">{{ info.summary }}</p>
        </div>
        <div class="flex flex-col gap-3">
          <span class="text-sm font-semibold">Where you are</span>
          <ol aria-label="Levels" class="grid grid-cols-3 gap-2">
            <li
              v-for="step in SCALE"
              :key="step"
              :aria-current="step === level ? 'step' : undefined"
              class="flex flex-col rounded-ds px-4 py-3"
              :class="step === level ? 'bg-white text-ink' : 'bg-red-hover'"
            >
              <span class="text-2xl font-semibold leading-tight">{{ step }}</span>
              <span class="text-sm">{{ LEVEL_INFO[step].name.split(' ')[1] }}<template v-if="step === level"> · you</template></span>
            </li>
          </ol>
        </div>
      </div>
      <div class="flex flex-col gap-6 rounded-ds bg-white p-6 text-ink lg:flex-1">
        <div class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold leading-tight">You can already</h2>
          <ul class="flex flex-col gap-3">
            <li v-for="item in info.can" :key="item" class="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none text-success"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="h-px bg-line" />
        <div class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold leading-tight">Next you’ll learn</h2>
          <ul class="flex flex-col gap-3">
            <li v-for="item in info.next" :key="item" class="flex items-start gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none text-red"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="course" aria-labelledby="rec-title" class="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <div class="flex flex-col gap-4 lg:flex-1">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">Recommended for you</span>
        <h2 id="rec-title" class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Start with {{ course.title }}.</h2>
        <p class="max-w-[440px] text-ink-muted">It picks up exactly where you are. Short lessons, at your own pace.</p>
        <RouterLink to="/courses" class="self-start font-semibold text-ink">See all courses</RouterLink>
      </div>
      <div class="lg:w-[420px]">
        <RecommendedCourseCard :course="course" />
      </div>
    </section>

    <!-- Logged in: saved automatically. Guest: invite to create an account. -->
    <p v-if="isLoggedIn && saving" role="status" class="rounded-ds bg-surface-secondary p-6 font-semibold text-ink">Saving your level…</p>
    <p v-else-if="isLoggedIn && saved" role="status" class="flex items-center gap-4 rounded-ds bg-success-soft p-6 font-semibold text-success">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      Saved to your profile. Your courses and Friday groups now show {{ level }} first.
    </p>
    <p v-else-if="isLoggedIn && saveError" role="alert" class="rounded-ds bg-red-soft p-6 font-semibold text-red">{{ saveError }}</p>
    <section v-else-if="!isLoggedIn" aria-labelledby="save-title" class="flex flex-col gap-6 rounded-ds bg-sky p-6 sm:p-10 lg:flex-row lg:items-center">
      <div class="flex flex-col gap-2 lg:flex-1">
        <h2 id="save-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">Keep your level.</h2>
        <p class="max-w-[520px] text-ink">
          Create a free account and we’ll save your {{ level }} result, suggest your Friday Speaking Club group and
          remember where you left off.
        </p>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
        <RouterLink :to="{ name: 'signup', query: { redirect: comeBack } }" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover sm:w-60">
          Create an account
        </RouterLink>
        <RouterLink :to="{ name: 'login', query: { redirect: comeBack } }" class="font-semibold text-ink">Log in</RouterLink>
      </div>
    </section>

    <button type="button" class="self-start font-semibold text-ink underline underline-offset-4 hover:text-red" @click="$emit('retake')">
      Retake the test
    </button>
  </div>
</template>