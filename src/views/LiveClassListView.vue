<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLiveClasses } from '@/composables/useLiveClasses'
import { useTeachers } from '@/composables/useTeachers'
import SpeakingHero from '@/components/speaking/SpeakingHero.vue'
import SessionRow from '@/components/speaking/SessionRow.vue'
import SpeakingSessionFlow from '@/components/speaking/SpeakingSessionFlow.vue'
import SpeakingGroup from '@/components/speaking/SpeakingGroup.vue'
import SpeakingHosts from '@/components/speaking/SpeakingHosts.vue'
import SpeakingReady from '@/components/speaking/SpeakingReady.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import PlanCards from '@/components/base/PlanCards.vue'
import FaqList from '@/components/base/FaqList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import { LEVEL_FILTERS, LEVELS_IN_FILTER, PLANS, FAQ } from '@/components/speaking/speakingContent'

// The Speaking Club sessions are the liveClasses collection
const { liveClasses, loading, error, fetchLiveClasses } = useLiveClasses()
const { teachers, fetchTeachers } = useTeachers()

const levelFilter = ref('all')

const visibleSessions = computed(() =>
  levelFilter.value === 'all'
    ? liveClasses.value
    : liveClasses.value.filter((s) => LEVELS_IN_FILTER[levelFilter.value].includes(s.level))
)

// teacherId → name, built once from the teachers list
const hostNames = computed(() =>
  Object.fromEntries(teachers.value.map((t) => [t.$id, t.name]))
)

onMounted(() => {
  fetchLiveClasses()
  fetchTeachers()
})
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:gap-[120px] sm:px-10 sm:py-16">
    <SpeakingHero />

    <section id="book" class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Book your Friday</h2>
        <p class="text-ink-muted">Groups are split by level, so everyone gets time to talk. Each week has a topic from the courses.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <FilterChips v-model="levelFilter" :options="LEVEL_FILTERS" label="Filter by level" />
        <p role="status" class="text-sm text-ink-muted sm:ml-auto">Showing {{ visibleSessions.length }} sessions</p>
      </div>

      <LoadingState v-if="loading" label="Loading sessions…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchLiveClasses" />
      <EmptyState
        v-else-if="visibleSessions.length === 0"
        title="No sessions here yet"
        description="Try another level, or check back on Monday for next Friday’s groups."
      />
      <ul v-else class="flex flex-col gap-3">
        <SessionRow
          v-for="session in visibleSessions"
          :key="session.$id"
          :session="session"
          :host-name="hostNames[session.teacherId] ?? ''"
        />
      </ul>
    </section>

    <SpeakingSessionFlow />
    <SpeakingGroup />
    <SpeakingHosts />
    <SpeakingReady />

    <section id="plans" class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Plans with the Speaking Club</h2>
        <p class="text-ink-muted">Every Friday, every level. Monthly, no binding.</p>
      </div>
      <PlanCards :plans="PLANS" />
    </section>

    <section id="faq" class="flex flex-col gap-6 lg:flex-row">
      <div class="flex flex-col gap-2 lg:w-1/3">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">FAQ</span>
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">About the club</h2>
        <p class="text-ink-muted">Write to contact@danes.dk if you don’t find your answer here.</p>
      </div>
      <div class="lg:flex-1">
        <FaqList :items="FAQ" />
      </div>
    </section>
  </div>
</template>