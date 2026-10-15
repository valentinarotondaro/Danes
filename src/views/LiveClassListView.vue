<script setup>
import { onMounted } from 'vue'
import { useLiveClasses } from '@/composables/useLiveClasses'
import { useTeachers } from '@/composables/useTeachers'
import LiveClassSchedule from '@/components/liveClass/LiveClassSchedule.vue'
import TeacherCard from '@/components/liveClass/TeacherCard.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { liveClasses, loading, error, fetchLiveClasses } = useLiveClasses()
const { teachers, fetchTeachers } = useTeachers()

onMounted(() => {
  fetchLiveClasses()
  fetchTeachers()
})
</script>

<template>
  <div class="bg-cream">
    <section class="mx-auto max-w-4xl px-6 py-12">
      <h1 class="text-3xl text-neutral-900">Practice</h1>
      <p class="mt-2 text-neutral-500">Live group classes with a native teacher — small groups, real conversation.</p>

      <div class="mt-8">
        <LoadingState v-if="loading" label="Loading classes…" />
        <ErrorState v-else-if="error" :message="error" @retry="fetchLiveClasses" />
        <EmptyState v-else-if="liveClasses.length === 0" title="No classes scheduled" description="Check back soon." />
        <LiveClassSchedule v-else :live-classes="liveClasses" />
      </div>

      <div v-if="teachers.length" class="mt-16 border-t border-neutral-200 pt-10">
        <h2 class="text-2xl text-neutral-900">Meet your teachers</h2>
        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TeacherCard v-for="teacher in teachers" :key="teacher.$id" :teacher="teacher" />
        </div>
      </div>
    </section>
  </div>
</template>
