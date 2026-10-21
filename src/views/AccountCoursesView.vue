<script setup>
import { inject } from 'vue'
import { RouterLink } from 'vue-router'
import CourseProgressCard from '@/components/account/CourseProgressCard.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const { inProgress, finished, notMine } = inject('learner')
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-2">
      <h1 class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">My courses</h1>
      <p class="text-lg text-ink-muted">Everything in your plan, and where you stopped.</p>
    </div>

    <section aria-labelledby="prog-title" class="flex flex-col gap-4">
      <h2 id="prog-title" class="text-2xl font-semibold">In progress</h2>
      <CourseProgressCard v-for="c in inProgress" :key="c.course.$id" :course="c.course" :teacher="c.teacher" :progress="c.progress" />
      <div v-if="!inProgress.length" class="flex flex-col items-start gap-3 rounded-ds bg-surface-secondary p-6">
        <p class="font-semibold">No course in progress</p>
        <p class="text-sm text-ink-muted">Courses you get with a plan show up here, with your progress.</p>
        <RouterLink :to="{ name: 'course-catalog' }" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">See the courses</RouterLink>
      </div>
    </section>

    <section aria-labelledby="done-title" class="flex flex-col gap-4">
      <h2 id="done-title" class="text-2xl font-semibold">Completed</h2>
      <CourseProgressCard v-for="c in finished" :key="c.course.$id" :course="c.course" :teacher="c.teacher" :progress="c.progress" />
      <div v-if="!finished.length" class="flex items-center gap-4 rounded-ds bg-surface-secondary p-6">
        <span aria-hidden="true" class="flex h-12 w-12 flex-none items-center justify-center rounded-ds bg-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" /></svg>
        </span>
        <span class="flex flex-col">
          <span class="font-semibold">Nothing finished yet</span>
          <span class="text-sm text-ink-muted">Finished courses land here.</span>
        </span>
      </div>
    </section>

    <section v-if="notMine.length" aria-labelledby="more-title" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 id="more-title" class="text-2xl font-semibold">Not in your plan yet</h2>
        <p class="text-ink-muted">Watch the teacher’s introduction on each course page, then add it to your plan.</p>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="c in notMine" :key="c.$id" :course="c" />
      </div>
    </section>
  </div>
</template>
