<script setup>
// Host and how many are booked. No names: orders stay private.
defineProps({
  host: { type: Object, default: null }, // a teachers document
  taken: { type: Number, required: true },
  capacity: { type: Number, required: true },
})
</script>

<template>
  <section aria-labelledby="group-title" class="flex flex-col gap-4 rounded-ds bg-sky p-5 text-ink sm:p-6">
    <div class="flex items-center justify-between gap-3">
      <h2 id="group-title" class="text-[22px] font-semibold leading-[1.25] sm:text-2xl">Your group</h2>
      <span class="text-sm font-semibold">{{ taken }} of {{ capacity }}</span>
    </div>

    <div v-if="host" class="flex items-center gap-3 rounded-ds bg-white p-3">
      <img v-if="host.photoUrl" :src="host.photoUrl" :alt="host.name" class="size-10 flex-none rounded-full object-cover" />
      <span v-else aria-hidden="true" class="flex size-10 flex-none items-center justify-center rounded-full bg-red font-semibold text-white">
        {{ host.name[0] }}
      </span>
      <span class="flex flex-col">
        <span class="font-semibold">{{ host.name }}</span>
        <span class="text-sm text-ink-muted">Your host</span>
      </span>
    </div>

    <p class="text-sm">
      {{ taken === 1 ? '1 learner has' : `${taken} learners have` }} a seat. Small groups, so everyone gets to speak.
    </p>
  </section>
</template>