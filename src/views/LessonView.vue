<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLessonPlayer } from '@/composables/useLessonPlayer'
import { parsePipeList } from '@/utils/pipeList'
import LessonHeader from '@/components/lesson/LessonHeader.vue'
import LessonVideo from '@/components/lesson/LessonVideo.vue'
import LessonWords from '@/components/lesson/LessonWords.vue'
import LessonOutline from '@/components/lesson/LessonOutline.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

// Smart view: useLessonPlayer brings the data, the components show it.
const route = useRoute()
const router = useRouter()
const { courseId, lessonId } = route.params

const { course, lesson, teacher, hasAccess, loading, error, modules, nav, percent, isDone, doneIds, saving, saveError, load, setDone } =
  useLessonPlayer(courseId, lessonId)

// "et møde | a meeting" → { da: 'et møde', en: 'a meeting' }
const words = computed(() => parsePipeList(lesson.value?.words, ['da', 'en']))
const tab = ref('') // '' until the lesson loads, then Words if there are any
const activeTab = computed(() => tab.value || (words.value.length ? 'words' : 'overview'))

const meta = computed(() => {
  const l = lesson.value
  if (!l) return ''
  const mod = modules.value.find((m) => m.lessons.some((x) => x.$id === l.$id))
  return [mod && `Module ${mod.number} · ${mod.title}`, `Lesson ${nav.value.index + 1}`, l.durationMinutes && `${l.durationMinutes} min`].filter(Boolean).join(' · ')
})

const toLesson = (l) => ({ name: 'lesson', params: { courseId, lessonId: l.$id } })

async function doneAndContinue() {
  if (!isDone.value && !(await setDone(true))) return
  router.push(nav.value.next ? toLesson(nav.value.next) : { name: 'course-detail', params: { id: courseId } })
}

onMounted(load)
</script>

<template>
  <div class="min-h-screen">
    <LessonHeader :course-id="courseId" :course-title="course?.title ?? ''" :done-count="doneIds.size" :total="nav.total" :percent="percent" />

    <div class="mx-auto max-w-[1360px] pb-24 sm:px-10 sm:pt-8">
      <LoadingState v-if="loading" label="Loading the lesson…" />
      <ErrorState v-else-if="error" :title="error" @retry="load" />

      <div v-else-if="!hasAccess" class="px-4 pt-8 sm:px-0">
        <EmptyState title="This lesson is part of the course" description="Get the course, or a plan that includes it, to watch every lesson.">
          <RouterLink :to="{ name: 'course-detail', params: { id: courseId } }" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">See the course</RouterLink>
        </EmptyState>
      </div>

      <EmptyState v-else-if="!lesson" title="We couldn’t find this lesson" description="It may have been moved. Pick one from the course." class="mx-4 mt-8 sm:mx-0" />

      <div v-else class="flex flex-col gap-10 lg:flex-row lg:items-start">
        <main class="flex min-w-0 flex-col gap-8 lg:flex-[999_1_640px]">
          <LessonVideo :url="lesson.videoUrl" :title="lesson.title" />

          <div class="flex flex-col gap-8 px-4 sm:px-0">
            <div class="flex flex-wrap items-start gap-4">
              <div class="flex min-w-0 flex-[1_1_360px] flex-col gap-2">
                <span class="text-sm text-ink-muted">{{ meta }}</span>
                <h1 class="text-[32px] font-semibold leading-[1.1] sm:text-[40px]">{{ lesson.title }}</h1>
              </div>
              <div v-if="teacher" class="flex items-center gap-3">
                <img v-if="teacher.photoUrl" :src="teacher.photoUrl" alt="" class="h-12 w-12 rounded-full object-cover" />
                <span class="flex flex-col">
                  <span class="font-semibold">{{ teacher.name }}</span>
                  <span class="text-sm text-ink-muted">Teacher{{ teacher.city ? ` · ${teacher.city}` : '' }}</span>
                </span>
              </div>
            </div>

            <!-- Tabs: Overview and Words -->
            <div role="tablist" aria-label="Lesson content" class="flex gap-8 border-b border-line">
              <button
                v-for="t in [{ key: 'overview', label: 'Overview' }, ...(words.length ? [{ key: 'words', label: `Words · ${words.length}` }] : [])]"
                :key="t.key"
                type="button"
                role="tab"
                :aria-selected="activeTab === t.key"
                class="py-3"
                :class="activeTab === t.key ? 'font-semibold shadow-[inset_0_-3px_0_var(--color-red)]' : 'text-ink-muted hover:text-ink'"
                @click="tab = t.key"
              >
                {{ t.label }}
              </button>
            </div>

            <section v-if="activeTab === 'words'" role="tabpanel" aria-label="Words from this lesson">
              <LessonWords :words="words" />
            </section>
            <section v-else role="tabpanel" aria-label="About this lesson" class="flex flex-col gap-3">
              <p class="max-w-[640px] text-ink">{{ course.description }}</p>
              <p class="text-sm text-ink-muted">Watch the video, then mark the lesson as done to keep track of your progress.</p>
            </section>

            <section class="flex flex-wrap items-center gap-6 rounded-ds bg-sky p-6 sm:p-8">
              <div class="flex flex-[1_1_320px] flex-col gap-1">
                <h2 class="text-2xl font-semibold leading-tight">Say it out loud on Friday</h2>
                <p>Bring the words from this lesson to the Speaking Club and use them in a real conversation.</p>
              </div>
              <RouterLink :to="{ name: 'live-class-list' }" class="inline-flex h-12 items-center rounded-ds bg-white px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white">See Friday sessions</RouterLink>
            </section>

            <p v-if="saveError" role="alert" class="rounded-ds bg-red-soft p-4 text-sm text-red">{{ saveError }}</p>

            <nav aria-label="Lesson navigation" class="flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <RouterLink
                v-if="nav.prev"
                :to="toLesson(nav.prev)"
                :aria-label="`Previous lesson: ${nav.prev.title}`"
                class="inline-flex h-12 items-center gap-2 rounded-ds border-2 border-ink px-5 font-semibold text-ink no-underline hover:bg-ink hover:text-white"
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
                <span class="hidden sm:inline">{{ nav.prev.title }}</span>
              </RouterLink>
              <button
                v-if="isDone"
                type="button"
                class="text-sm font-semibold text-ink-muted underline hover:text-red"
                :disabled="saving"
                @click="setDone(false)"
              >
                Mark as not done
              </button>
              <button
                type="button"
                :disabled="saving"
                class="ml-auto inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white hover:bg-red-hover disabled:opacity-50"
                @click="doneAndContinue"
              >
                {{ saving ? 'Saving…' : isDone ? (nav.next ? 'Next lesson' : 'Back to the course') : nav.next ? 'Mark as done and continue' : 'Mark as done and finish' }}
              </button>
            </nav>
          </div>
        </main>

        <aside class="flex min-w-0 flex-col gap-6 px-4 sm:px-0 lg:max-w-[420px] lg:flex-[1_1_340px]">
          <LessonOutline :course-id="courseId" :modules="modules" :current-id="lessonId" :done-ids="doneIds" />
        </aside>
      </div>
    </div>
  </div>
</template>
