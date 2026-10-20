<script setup>
// One course as a radio row, for packages with "one course of your choice".
defineProps({
  course: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})
defineEmits(['select'])
</script>

<template>
  <label
    class="flex cursor-pointer items-center gap-4 rounded-ds px-4 py-3 ring-inset"
    :class="selected ? 'bg-sky-soft ring-2 ring-ink' : 'bg-white ring-1 ring-line hover:ring-ink-muted'"
  >
    <input type="radio" name="course" :checked="selected" class="h-[18px] w-[18px] flex-none accent-ink" @change="$emit('select')" />
    <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" alt="" class="h-[54px] w-[72px] flex-none rounded-xl object-cover" />
    <span v-else aria-hidden="true" class="h-[54px] w-[72px] flex-none rounded-xl bg-sky" />
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="font-semibold">{{ course.title }}</span>
      <span class="text-sm text-ink-muted">{{ course.level || 'All levels' }}</span>
    </span>
    <span v-if="selected" class="hidden rounded-ds bg-success-soft px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-success sm:inline">Included</span>
  </label>
</template>