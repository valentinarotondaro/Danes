<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCourse, useLessons } from '@/composables/useCourses'
import { useCourseAccess } from '@/composables/useCourseAccess'
import { useOrders } from '@/composables/useOrders'
import { useAuth } from '@/composables/useAuth'
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

const purchaseError = ref('')
const justPurchased = ref(false)

onMounted(async () => {
  await fetchCourse()
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
  <section class="mx-auto max-w-3xl px-6 py-12">
    <LoadingState v-if="loading" label="Loading course…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchCourse" />

    <template v-else-if="course">
      <h1 class="text-3xl text-neutral-900">{{ course.title }}</h1>
      <p class="mt-3 text-neutral-600">{{ course.description }}</p>
      <p class="mt-4 text-lg font-medium text-neutral-900">{{ course.price }} DKK</p>

      <div class="mt-6">
        <template v-if="!isLoggedIn">
          <p class="text-sm text-neutral-500">
            <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-[#C8102E] hover:underline">
              Log in
            </RouterLink>
            to purchase this course.
          </p>
        </template>
        <template v-else-if="checking">
          <p class="text-sm text-neutral-500">Checking access…</p>
        </template>
        <template v-else-if="hasAccess">
          <p class="text-sm font-medium text-green-700">
            {{ justPurchased ? 'Purchased — you now have access.' : 'You have access to this course.' }}
          </p>
        </template>
        <template v-else>
          <BaseButton :loading="purchasing" @click="onPurchase" class="max-w-xs">
            Get access — {{ course.price }} DKK
          </BaseButton>
          <p v-if="purchaseError" class="mt-2 text-sm text-red-600">{{ purchaseError }}</p>
        </template>
      </div>

      <h2 class="mt-10 text-xl text-neutral-900">Lessons</h2>
      <ul class="mt-4 divide-y divide-neutral-200 border-t border-neutral-200">
        <li v-for="lesson in lessons" :key="lesson.$id" class="flex items-center justify-between py-3">
          <div>
            <RouterLink
              v-if="hasAccess"
              :to="{ name: 'lesson', params: { courseId, lessonId: lesson.$id } }"
              class="text-neutral-900 hover:text-[#C8102E]"
            >
              {{ lesson.title }}
            </RouterLink>
            <span v-else class="text-neutral-400">{{ lesson.title }}</span>
          </div>
          <span v-if="lesson.durationMinutes" class="text-sm text-neutral-400">
            {{ lesson.durationMinutes }} min
          </span>
        </li>
      </ul>
    </template>
  </section>
</template>
