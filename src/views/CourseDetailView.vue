<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCourse, useLessons } from '@/composables/useCourses'
import { useCourseAccess } from '@/composables/useCourseAccess'
import { useOrders } from '@/composables/useOrders'
import { useAuth } from '@/composables/useAuth'
import { useTeachers } from '@/composables/useTeachers'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const courseId = route.params.id

const { course, loading, error, fetchCourse } = useCourse(courseId)
const { lessons, fetchLessons } = useLessons(courseId)
const { hasAccess, checking, checkAccess } = useCourseAccess()
const { purchasing, purchaseCourse } = useOrders()
const { isLoggedIn } = useAuth()
const { teacher, fetchTeacher } = useTeachers()

const purchaseError = ref('')
const justPurchased = ref(false)

// Groups lessons by module: [{ number: 1, title: 'Starting at work', lessons: [...] }, ...]
const modules = computed(() => {
  const groups = {}
  for (const lesson of lessons.value) {
    const n = lesson.module ?? 1
    groups[n] ??= { number: n, title: lesson.moduleTitle || `Module ${n}`, lessons: [] }
    groups[n].lessons.push(lesson)
  }
  return Object.values(groups)
})

// Adds up every lesson's minutes (lessons without a duration count as 0)
const totalMinutes = computed(() =>
  lessons.value.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0)
)

const tag = computed(() => (course.value?.level ? `${course.value.level} · Course` : 'Course'))

onMounted(async () => {
  await fetchCourse()
  fetchTeacher(course.value?.teacherId) // no await: the page doesn't wait for the teacher
  await fetchLessons()
  if (isLoggedIn.value) await checkAccess(courseId)
})

async function onPurchase() {
  purchaseError.value = ''
  try {
    await purchaseCourse(courseId, course.value.price)
    justPurchased.value = true
    await checkAccess(courseId)
  } catch {
    purchaseError.value = 'Could not complete the purchase. Please try again.'
  }
}
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-4 py-12 sm:px-10 sm:py-20">
    <LoadingState v-if="loading" label="Loading course…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchCourse" />

    <template v-else-if="course">
      <RouterLink :to="{ name: 'course-catalog' }" class="text-sm font-semibold text-ink no-underline hover:text-red">
        ‹ All courses
      </RouterLink>

      <div class="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start">
        <!-- Left: course info -->
        <div class="flex min-w-0 flex-1 flex-col gap-6">
          <span class="self-start rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            {{ tag }}
          </span>
          <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">{{ course.title }}</h1>
          <p class="max-w-2xl text-lg text-ink-muted">{{ course.description }}</p>

          <ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
            <li><span class="font-semibold">{{ modules.length }}</span> modules</li>
            <li><span class="font-semibold">{{ lessons.length }}</span> lessons</li>
            <li v-if="totalMinutes"><span class="font-semibold">{{ totalMinutes }}</span> min of video</li>
          </ul>

          <div v-if="teacher" class="flex items-center gap-4 rounded-ds bg-surface-secondary p-4">
            <img
              v-if="teacher.photoUrl"
              :src="teacher.photoUrl"
              :alt="teacher.name"
              class="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p class="font-semibold text-ink">Taught by {{ teacher.name }}</p>
              <p class="text-sm text-ink-muted">{{ teacher.city || teacher.specialty }}</p>
            </div>
          </div>
        </div>

        <!-- Right: purchase card -->
        <aside class="w-full rounded-ds bg-sky p-6 lg:sticky lg:top-24 lg:w-[380px]">
          <div v-if="course.thumbnailUrl" class="mb-6 aspect-[4/3] overflow-hidden rounded-ds">
            <img :src="course.thumbnailUrl" :alt="course.title" class="h-full w-full object-cover" />
          </div>
          <p class="text-[32px] font-semibold leading-tight text-ink">
            {{ course.price }} kr.<span class="text-base font-normal">/month</span>
          </p>

          <div class="mt-6">
            <template v-if="!isLoggedIn">
              <RouterLink
                :to="{ name: 'login', query: { redirect: route.fullPath } }"
                class="block rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover"
              >
                Log in to start
              </RouterLink>
            </template>
            <template v-else-if="checking">
              <p class="text-sm text-ink">Checking access…</p>
            </template>
            <template v-else-if="hasAccess">
              <p class="rounded-ds bg-success-soft p-4 text-sm font-semibold text-success">
                {{ justPurchased ? 'You’re in! The lessons below are open.' : 'You have access to this course.' }}
              </p>
            </template>
            <template v-else>
              <BaseButton :loading="purchasing" @click="onPurchase">
                Get access · {{ course.price }} kr./month
              </BaseButton>
              <p v-if="purchaseError" role="alert" class="mt-2 text-sm font-semibold text-red">{{ purchaseError }}</p>
            </template>
          </div>

          <p class="mt-4 text-sm text-ink">Cancel any time. Also included in the Starter and Complete packages.</p>
        </aside>
      </div>

      <!-- Course content: modules as accordions -->
      <section class="mt-20" aria-labelledby="content-title">
        <h2 id="content-title" class="text-[32px] font-semibold leading-tight text-ink sm:text-[40px]">Course content</h2>

        <p v-if="lessons.length === 0" class="mt-6 text-ink-muted">Lessons are coming soon.</p>

        <div v-else class="mt-8 flex flex-col gap-3">
          <details
            v-for="(mod, i) in modules"
            :key="mod.number"
            :open="i === 0"
            class="group rounded-ds bg-surface-secondary"
          >
            <summary class="flex cursor-pointer list-none items-center gap-4 p-5">
              <span class="flex-1">
                <span class="block font-semibold text-ink">{{ mod.number }} · {{ mod.title }}</span>
                <span class="text-sm text-ink-muted">{{ mod.lessons.length }} lessons</span>
              </span>
              <span
                aria-hidden="true"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-sky text-ink transition-transform group-open:rotate-90"
              >›</span>
            </summary>

            <ol class="px-5 pb-4">
              <li
                v-for="lesson in mod.lessons"
                :key="lesson.$id"
                class="flex items-center justify-between gap-4 border-t border-line py-3"
              >
                <RouterLink
                  v-if="hasAccess"
                  :to="{ name: 'lesson', params: { courseId, lessonId: lesson.$id } }"
                  class="text-ink no-underline hover:text-red"
                >
                  {{ lesson.title }}
                </RouterLink>
                <span v-else class="flex items-center gap-2 text-ink-muted">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                  {{ lesson.title }}
                  <span class="sr-only">(locked)</span>
                </span>
                <span v-if="lesson.durationMinutes" class="shrink-0 text-sm text-ink-muted">
                  {{ lesson.durationMinutes }} min
                </span>
              </li>
            </ol>
          </details>
        </div>
      </section>
    </template>
  </section>
</template>