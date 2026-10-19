<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLiveClass } from '@/composables/useLiveClasses'
import { useTeachers } from '@/composables/useTeachers'
import { parsePipeList } from '@/utils/pipeList'
import SessionLobby from '@/components/session/SessionLobby.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const route = useRoute()
const { liveClass, loading, error, fetchLiveClass } = useLiveClass(route.params.id)
const { teacher: host, fetchTeacher } = useTeachers()

const topics = computed(() => liveClass.value?.topics ?? [])
// "en recept | a prescription" → { da, en } (see utils/pipeList.js)
const words = computed(() => parsePipeList(liveClass.value?.words, ['da', 'en']))

onMounted(async () => {
  await fetchLiveClass()
  fetchTeacher(liveClass.value?.teacherId) // no await: the page doesn't wait for the host
})
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-10 sm:gap-[72px] sm:px-10 sm:py-16">
    <LoadingState v-if="loading" label="Loading session…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchLiveClass" />
    <SessionLobby v-else-if="liveClass" :session="liveClass" :host="host" :topics="topics" :words="words" />
  </div>
</template>