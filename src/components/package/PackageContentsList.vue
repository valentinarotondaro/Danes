<script setup>
defineProps({ pkg: { type: Object, required: true } })
</script>

<template>
  <ul class="divide-y divide-black/10 border-y border-black/10">
    <li v-if="pkg.courseId" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-sky" />
      <p class="text-ink">Learn — any course, your choice</p>
    </li>
    <li v-if="pkg.liveClassId" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-sky" />
      <p class="text-ink">Practice — Speaking Club, every Friday</p>
    </li>
    <li v-if="pkg.eventId" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-red" />
      <p class="text-ink">Belong — any Events this month</p>
    </li>
  </ul>
</template>
