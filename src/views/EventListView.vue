<script setup>
import { computed, onMounted, ref } from 'vue'
import { useEvents } from '@/composables/useEvents'
import EventList from '@/components/event/EventList.vue'
import EventNextUp from '@/components/event/EventNextUp.vue'
import EventHowItWorks from '@/components/event/EventHowItWorks.vue'
import EventGallery from '@/components/event/EventGallery.vue'
import EventInviteFriend from '@/components/event/EventInviteFriend.vue'
import EventPlans from '@/components/event/EventPlans.vue'
import FaqList from '@/components/base/FaqList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import heroImg from '@/assets/img/friends-street.jpg'
const { events, loading, error, fetchEvents } = useEvents()

// Events come sorted by date from the service, so the first one is the next one
const nextEvent = computed(() => events.value[0] ?? null)
const goingThisMonth = computed(() => events.value.reduce((sum, e) => sum + (e.spotsBooked ?? 0), 0))

const CITIES = ['All cities', 'Copenhagen', 'Aarhus', 'Esbjerg', 'Odense']
const selectedCity = ref('All cities')

// Filter what we already loaded: no new request to Appwrite
const visibleEvents = computed(() =>
  selectedCity.value === 'All cities'
    ? events.value
    : events.value.filter((e) => e.city === selectedCity.value)
)

const faq = [
  { q: 'Do I need to speak Danish to join?', a: 'No. Beginners are welcome at every event. Your host helps with the words.' },
  { q: 'What happens if an event is full?', a: 'Join the waitlist. If someone cancels, we email you and the spot is yours if you confirm.' },
  { q: 'Can I bring a friend?', a: 'Yes. Send them your invite link: their first event is free.' },
  { q: 'What if I can’t make it?', a: 'Cancel your spot from My Account so someone on the waitlist can come.' },
]

onMounted(fetchEvents)
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:gap-[120px] sm:px-10 sm:py-16">
    <!-- Hero -->
    <section class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
      <div class="flex flex-1 flex-col justify-between gap-8 p-8 sm:p-10">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-semibold uppercase tracking-wide text-ink">Events · new every month</span>
          <h1 class="max-w-xl text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">
            Learn Danish where it’s actually spoken.
          </h1>
          <p class="max-w-md text-ink">
            City walks, bakery mornings and hygge nights with other learners. Use what you studied this week,
            make friends, and feel at home in your city.
          </p>
        </div>
        <p v-if="goingThisMonth" class="text-sm text-ink">
          <span class="font-semibold">{{ goingThisMonth }} learners</span> going to upcoming events
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <a href="#all" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover sm:w-60">See upcoming events</a>
          <a href="#how" class="rounded-ds bg-white px-6 py-3 text-center font-semibold text-ink no-underline hover:bg-sky-soft sm:w-60">How events work</a>
        </div>
      </div>
      <img :src="heroImg" alt="Friends laughing and hugging on a colourful street" class="max-h-[540px] min-h-[320px] w-full flex-1 object-cover lg:w-auto" />
    </section>

    <!-- Next up: the first upcoming event -->
    <EventNextUp v-if="nextEvent" :event="nextEvent" />

    <!-- All events -->
    <section id="all" class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Upcoming events</h2>
        <p class="text-ink-muted">Pick your city, save your spot and see how many are coming.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filter by city" class="flex flex-wrap gap-2">
          <button
            v-for="city in CITIES"
            :key="city"
            type="button"
            :aria-pressed="selectedCity === city"
            class="rounded-ds border px-4 py-2 text-sm font-semibold transition-colors"
            :class="selectedCity === city ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'"
            @click="selectedCity = city"
          >
            {{ city }}
          </button>
        </div>
        <p role="status" class="ml-auto text-sm text-ink-muted">Showing {{ visibleEvents.length }} events</p>
      </div>

      <LoadingState v-if="loading" label="Loading events…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchEvents" />
      <EmptyState
        v-else-if="visibleEvents.length === 0"
        title="No events here yet"
        description="Try another city, or check back soon."
      />
      <EventList v-else :events="visibleEvents" />
    </section>

    <EventHowItWorks />
    <EventGallery />
    <EventInviteFriend />
    <EventPlans />

    <!-- FAQ -->
    <section class="flex flex-col gap-6 lg:flex-row">
      <div class="flex flex-col gap-2 lg:w-1/3">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">FAQ</span>
        <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">About events</h2>
        <p class="text-ink-muted">Write to contact@danes.dk if you don’t find your answer here.</p>
      </div>
      <div class="lg:flex-1">
        <FaqList :items="faq" />
      </div>
    </section>
  </div>
</template>