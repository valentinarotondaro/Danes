<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useLiveClass } from '@/composables/useLiveClasses'
import { useOrders } from '@/composables/useOrders'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import VideoRoomEmbed from '@/components/liveClass/VideoRoomEmbed.vue'

const route = useRoute()
const id = route.params.id

const { liveClass, loading, error, fetchLiveClass } = useLiveClass(id)
const { purchasing, bookLiveClass } = useOrders()
const { currentUser, isLoggedIn } = useAuth()

const hasBooked = ref(false)
const checkingBooking = ref(false)
const bookingError = ref('')
const showRoom = ref(false)

const spotsLeft = computed(() =>
  liveClass.value ? Math.max(liveClass.value.capacity - (liveClass.value.spotsBooked ?? 0), 0) : 0
)

async function checkBooking() {
  if (!isLoggedIn.value) return
  checkingBooking.value = true
  try {
    hasBooked.value = await orderService.hasConfirmedOrder(currentUser.value.$id, 'liveClass', id)
  } finally {
    checkingBooking.value = false
  }
}

async function onBook() {
  bookingError.value = ''
  try {
    await bookLiveClass(liveClass.value)
    hasBooked.value = true
    liveClass.value.spotsBooked = (liveClass.value.spotsBooked ?? 0) + 1
  } catch (err) {
    bookingError.value = err.message || 'Could not complete the booking.'
  }
}

onMounted(async () => {
  await fetchLiveClass()
  await checkBooking()
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-12">
    <LoadingState v-if="loading" label="Loading class…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchLiveClass" />

    <template v-else-if="liveClass">
      <h1 class="text-3xl text-neutral-900">{{ liveClass.title }}</h1>
      <p class="mt-2 text-neutral-500">
        {{ new Date(liveClass.dateTime).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) }}
      </p>
      <p class="mt-4 text-lg font-medium text-neutral-900">{{ liveClass.price }} DKK</p>

      <div class="mt-6">
        <template v-if="!isLoggedIn">
          <p class="text-sm text-neutral-500">
            <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-[#C8102E] hover:underline">
              Log in
            </RouterLink>
            to book this class.
          </p>
        </template>
        <template v-else-if="checkingBooking">
          <p class="text-sm text-neutral-500">Checking your booking…</p>
        </template>
        <template v-else-if="hasBooked">
          <p class="text-sm font-medium text-green-700">You're booked in.</p>
          <BaseButton v-if="!showRoom" @click="showRoom = true" class="mt-3 max-w-xs">
            Join video call
          </BaseButton>
        </template>
        <template v-else>
          <BaseButton :loading="purchasing" :disabled="spotsLeft === 0" @click="onBook" class="max-w-xs">
            {{ spotsLeft === 0 ? 'Fully booked' : `Book — ${liveClass.price} DKK` }}
          </BaseButton>
          <p v-if="bookingError" class="mt-2 text-sm text-red-600">{{ bookingError }}</p>
        </template>
      </div>

      <div v-if="showRoom" class="mt-8">
        <VideoRoomEmbed :live-class-id="id" />
      </div>
    </template>
  </section>
</template>
