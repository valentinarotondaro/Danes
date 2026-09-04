<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  liveClass: { type: Object, required: true },
})

const spotsLeft = () => Math.max(props.liveClass.capacity - (props.liveClass.spotsBooked ?? 0), 0)

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<template>
  <RouterLink
    :to="{ name: 'live-class-detail', params: { id: liveClass.$id } }"
    class="group block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400"
  >
    <h3 class="font-serif text-lg text-neutral-900 group-hover:text-[#C8102E]">{{ liveClass.title }}</h3>
    <p class="mt-1 text-sm text-neutral-500">{{ formatDate(liveClass.dateTime) }}</p>
    <div class="mt-3 flex items-center justify-between">
      <span class="text-sm font-medium text-neutral-900">{{ liveClass.price }} DKK</span>
      <span class="text-sm" :class="spotsLeft() === 0 ? 'text-red-600' : 'text-neutral-500'">
        {{ spotsLeft() === 0 ? 'Full' : `${spotsLeft()} spots left` }}
      </span>
    </div>
  </RouterLink>
</template>
