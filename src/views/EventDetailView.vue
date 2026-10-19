<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEvent } from '@/composables/useEvents'
import { useTeachers } from '@/composables/useTeachers'
import { parsePipeList } from '@/utils/pipeList'
import EventDetailHero from '@/components/event/EventDetailHero.vue'
import EventSignupPanel from '@/components/event/EventSignupPanel.vue'
import EventAgenda from '@/components/event/EventAgenda.vue'
import EventWords from '@/components/event/EventWords.vue'
import EventPractical from '@/components/event/EventPractical.vue'
import MoreEvents from '@/components/event/MoreEvents.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EventGoing from '@/components/event/EventGoing.vue'

const route = useRoute()
const { event, loading, error, fetchEvent } = useEvent(route.params.id)
const { teacher: host, fetchTeacher } = useTeachers()

// "09:30 | Meet | Note" lines → objects (see utils/pipeList.js)
const agenda = computed(() => parsePipeList(event.value?.agenda, ['time', 'what', 'note']))
const words = computed(() => parsePipeList(event.value?.words, ['da', 'en']))

onMounted(async () => {
  await fetchEvent()
  fetchTeacher(event.value?.teacherId) // no await: the page doesn't wait for the host
})
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:gap-[120px] sm:px-10 sm:py-16">
    <LoadingState v-if="loading" label="Loading event…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchEvent" />

    <template v-else-if="event">
      <EventDetailHero :event="event" />

      <div class="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div class="flex min-w-0 flex-col gap-[72px] lg:flex-1">
          <EventAgenda v-if="agenda.length" :items="agenda" />
          <EventWords v-if="words.length" :words="words" />
          <EventPractical :event="event" :host="host" />
          <EventGoing :event="event" />
        </div>
        <div class="lg:w-[380px]">
          <EventSignupPanel :event="event" />
        </div>
      </div>

      <MoreEvents :current="event" />
    </template>
  </div>
</template>