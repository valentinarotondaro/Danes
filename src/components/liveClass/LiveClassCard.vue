<script setup>
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
    class="group block rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
  >
    <span class="inline-block rounded-full bg-dusty-blue/15 px-2.5 py-0.5 text-xs font-medium text-dusty-blue">
      Practice
    </span>
    <h3 class="mt-2 font-serif text-lg text-neutral-900 group-hover:text-[#C8102E]">{{ liveClass.title }}</h3>
    <p class="mt-1 text-sm text-neutral-500">{{ formatDate(liveClass.dateTime) }}</p>

    <div class="mt-4 flex items-end justify-between border-t border-neutral-100 pt-4">
      <div>
        <span class="font-serif text-2xl text-neutral-900">{{ liveClass.price }}</span>
        <span class="ml-1 text-sm text-neutral-500">DKK</span>
      </div>
      <span
        class="rounded-full px-3 py-1 text-sm font-medium"
        :class="spotsLeft() === 0 ? 'bg-red-50 text-red-600' : 'bg-dusty-blue/15 text-dusty-blue'"
      >
        {{ spotsLeft() === 0 ? 'Full' : `${spotsLeft()} spots left` }}
      </span>
    </div>
  </RouterLink>
</template>
