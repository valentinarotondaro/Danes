<script setup>
defineProps({ teacher: { type: Object, required: true } })

// Deterministic placeholder color per teacher, until real photos exist.
const palette = ['bg-sage', 'bg-dusty-blue', 'bg-terracotta']
function colorFor(id) {
  const sum = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return palette[sum % palette.length]
}
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 bg-white p-5">
    <div class="flex items-center gap-4">
      <div v-if="teacher.photoUrl" class="h-14 w-14 shrink-0 overflow-hidden rounded-full">
        <img :src="teacher.photoUrl" :alt="teacher.name" class="h-full w-full object-cover" />
      </div>
      <div v-else class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg text-white" :class="colorFor(teacher.$id)">
        {{ teacher.name?.[0] }}
      </div>
      <div>
        <p class="text-lg text-neutral-900">{{ teacher.name }}</p>
        <span v-if="teacher.specialty" class="text-sm text-neutral-500">{{ teacher.specialty }}</span>
      </div>
    </div>
    <p v-if="teacher.bio" class="mt-3 line-clamp-3 text-sm text-neutral-600">{{ teacher.bio }}</p>
  </div>
</template>
