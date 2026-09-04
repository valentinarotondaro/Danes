<script setup>
import { onMounted } from 'vue'
import { useLiveClasses } from '@/composables/useLiveClasses'
import LiveClassSchedule from '@/components/liveClass/LiveClassSchedule.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { liveClasses, loading, error, fetchLiveClasses } = useLiveClasses()
onMounted(fetchLiveClasses)
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-12">
    <h1 class="font-serif text-3xl text-neutral-900">Practice</h1>
    <p class="mt-2 text-neutral-500">Live group classes with a native teacher — small groups, real conversation.</p>

    <div class="mt-8">
      <LoadingState v-if="loading" label="Loading classes…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchLiveClasses" />
      <EmptyState v-else-if="liveClasses.length === 0" title="No classes scheduled" description="Check back soon." />
      <LiveClassSchedule v-else :live-classes="liveClasses" />
    </div>
  </section>
</template>
