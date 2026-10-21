<script setup>
import { computed, inject } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { weekSummary } from '@/utils/learner'
import CourseProgressCard from '@/components/account/CourseProgressCard.vue'
import PlanSummary from '@/components/account/PlanSummary.vue'
import DateTile from '@/components/account/DateTile.vue'
import StatusTag from '@/components/admin/StatusTag.vue'
import CourseCard from '@/components/course/CourseCard.vue'

const { currentUser } = useAuth()
const { inProgress, myCourses, words, myClasses, myEvents, plan, planUpgrade, renewsOn, hasEvents, notMine, profile, doneIds } = inject('learner')

const firstName = computed(() => currentUser.value?.name?.split(' ')[0] ?? '')
const current = computed(() => inProgress.value[0] ?? null)
const nextFriday = computed(() => myClasses.value.upcoming.find((c) => c.status === 'confirmed') ?? null)
const comingUp = computed(() => [...myEvents.value.upcoming, ...myClasses.value.upcoming.filter((c) => c !== nextFriday.value)]
  .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)).slice(0, 3))

const summary = computed(() => weekSummary({
  lessonsLeft: current.value ? current.value.progress.total - current.value.progress.done : 0,
  nextFriday: nextFriday.value,
  nextEvent: myEvents.value.upcoming.find((e) => e.status === 'confirmed'),
}))

const stats = computed(() => [
  { label: 'Lessons done', value: doneIds.value.size, note: myCourses.value.length ? `In ${myCourses.value.length} ${myCourses.value.length === 1 ? 'course' : 'courses'}` : 'Start a course to count them' },
  { label: 'Words learned', value: words.value.length, note: words.value.length ? `Latest: ${words.value.at(-1).da}, ${words.value.at(-1).en}` : 'From the lessons you finish' },
  { label: 'Friday sessions', value: myClasses.value.past.filter((c) => c.status === 'confirmed').length + myClasses.value.upcoming.filter((c) => c.status === 'confirmed').length, note: nextFriday.value ? 'Keep it going this Friday.' : 'Book one to practise out loud.' },
])

// Courses at the learner's level first
const suggestions = computed(() => [...notMine.value].sort((a, b) => (b.level === profile.value?.level) - (a.level === profile.value?.level)).slice(0, hasEvents.value ? 3 : 2))

const when = (iso) => {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-2">
      <h1 class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">Hej{{ firstName ? `, ${firstName}` : '' }}</h1>
      <p class="text-lg text-ink-muted">{{ summary }}</p>
    </div>

    <div class="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <div class="min-w-0 lg:flex-[2]">
        <CourseProgressCard v-if="current" :course="current.course" :teacher="current.teacher" :progress="current.progress" big class="h-full" />
        <section v-else class="flex h-full flex-col justify-center gap-4 rounded-ds bg-surface-secondary p-8">
          <h2 class="text-[32px] font-semibold leading-tight">{{ myCourses.length ? 'You finished your courses' : 'Start your first course' }}</h2>
          <p class="text-ink-muted">Not sure which one? The free level test tells you where to start.</p>
          <div class="flex flex-wrap gap-3">
            <RouterLink :to="{ name: 'course-catalog' }" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">See the courses</RouterLink>
            <RouterLink :to="{ name: 'level-test' }" class="inline-flex h-12 items-center rounded-ds border-2 border-ink bg-white px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white">Take the level test</RouterLink>
          </div>
        </section>
      </div>

      <section aria-labelledby="fri-title" class="flex min-w-0 flex-col gap-4 rounded-ds bg-sky p-8 lg:flex-1">
        <template v-if="nextFriday">
          <StatusTag label="Next Friday" tone="red" class="self-start" />
          <div class="flex flex-col gap-1">
            <h2 id="fri-title" class="text-[28px] font-semibold leading-tight">{{ nextFriday.title }}</h2>
            <span>Speaking Club{{ nextFriday.level ? ` · ${nextFriday.level}` : '' }} · {{ when(nextFriday.dateTime) }}</span>
          </div>
          <div v-if="nextFriday.host" class="flex items-center gap-3">
            <img v-if="nextFriday.host.photoUrl" :src="nextFriday.host.photoUrl" alt="" class="h-12 w-12 rounded-full object-cover" />
            <span class="font-semibold">Hosted by {{ nextFriday.host.name }}</span>
          </div>
          <span class="flex items-center gap-2 text-sm font-semibold">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
            You’re booked
          </span>
          <div class="mt-auto flex flex-col gap-2">
            <RouterLink :to="{ name: 'live-class-detail', params: { id: nextFriday.$id } }" class="inline-flex h-12 items-center justify-center rounded-ds bg-white px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white">Open my session</RouterLink>
            <p class="text-sm">The video room opens 10 minutes before.</p>
          </div>
        </template>
        <template v-else>
          <StatusTag label="Speaking Club" tone="red" class="self-start" />
          <h2 id="fri-title" class="text-[28px] font-semibold leading-tight">No Friday booked yet</h2>
          <p>One hour on video, a small group at your level. Say out loud what you learned this week.</p>
          <RouterLink :to="{ name: 'live-class-list' }" class="mt-auto inline-flex h-12 items-center justify-center rounded-ds bg-white px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white">Book a Friday</RouterLink>
        </template>
      </section>
    </div>

    <section aria-labelledby="stats-title" class="flex flex-col gap-4">
      <h2 id="stats-title" class="text-2xl font-semibold">Your Danish so far</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div v-for="s in stats" :key="s.label" class="flex flex-col gap-2 rounded-ds border border-line p-6">
          <span class="text-sm text-ink-muted">{{ s.label }}</span>
          <span class="text-[32px] font-semibold leading-tight">{{ s.value }}</span>
          <span class="text-sm">{{ s.note }}</span>
        </div>
      </div>
    </section>

    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <section aria-labelledby="up-title" class="flex min-w-0 flex-col gap-4 lg:flex-[2]">
        <div class="flex items-center">
          <h2 id="up-title" class="text-2xl font-semibold">Coming up</h2>
          <RouterLink :to="{ name: 'account-events' }" class="ml-auto text-sm font-semibold text-ink">My events</RouterLink>
        </div>
        <p v-if="!comingUp.length" class="rounded-ds bg-surface-secondary p-6 text-ink-muted">Nothing booked yet. <RouterLink :to="{ name: 'event-list' }" class="font-semibold text-ink">Find an event in your city</RouterLink>.</p>
        <RouterLink
          v-for="item in comingUp"
          :key="item.$id"
          :to="item.kind === 'event' ? { name: 'event-detail', params: { id: item.$id } } : { name: 'live-class-detail', params: { id: item.$id } }"
          class="flex items-center gap-4 rounded-ds border border-line p-4 text-ink no-underline hover:border-ink"
        >
          <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="h-[72px] w-24 flex-none rounded-ds object-cover" />
          <DateTile v-else :date="item.dateTime" tone="sky" />
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="text-sm text-ink-muted">{{ when(item.dateTime) }}</span>
            <span class="text-lg font-semibold leading-tight">{{ item.title }}</span>
            <span class="text-sm text-ink-muted">{{ item.kind === 'event' ? item.city : 'Speaking Club' }}</span>
          </span>
          <StatusTag :label="item.status === 'confirmed' ? 'Going' : 'Waitlist'" :tone="item.status === 'confirmed' ? 'success' : 'sky'" />
        </RouterLink>
      </section>

      <PlanSummary :plan="plan" :upgrade="planUpgrade" :renews-on="renewsOn" class="min-w-0 lg:flex-1" />
    </div>

    <section v-if="suggestions.length || !hasEvents" aria-labelledby="next-title" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 id="next-title" class="text-2xl font-semibold">Your next step</h2>
        <p class="text-ink-muted">{{ profile?.level ? `Picked for your level, ${profile.level}.` : 'Picked for you.' }}</p>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard v-for="c in suggestions" :key="c.$id" :course="c" />
        <article v-if="!hasEvents" class="flex flex-col gap-4 rounded-ds bg-red p-8 text-white">
          <span class="text-sm font-semibold uppercase tracking-wide">Complete package</span>
          <h3 class="text-[28px] font-semibold leading-tight">Courses, Fridays and every event.</h3>
          <p>Join walks and hygge nights in any city without paying each time.</p>
          <RouterLink :to="{ name: 'checkout', query: { plan: 'Complete' } }" class="mt-auto inline-flex h-12 items-center self-start rounded-ds bg-white px-6 font-semibold text-ink no-underline hover:bg-sky">See Complete</RouterLink>
        </article>
      </div>
    </section>
  </div>
</template>
