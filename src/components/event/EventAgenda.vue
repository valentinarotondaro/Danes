<script setup>
defineProps({ items: { type: Array, required: true } }) // [{ time, what, note }]
</script>

<template>
  <section class="flex flex-col gap-8" aria-labelledby="agenda-title">
    <h2 id="agenda-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">What we’ll do</h2>
    <ol class="flex flex-col gap-3">
      <li v-for="item in items" :key="item.time + item.what" class="flex items-baseline gap-6 rounded-ds bg-surface-secondary px-6 py-5">
        <span class="w-16 flex-none font-semibold text-red">{{ item.time }}</span>
        <span class="flex flex-col gap-1">
          <span class="font-semibold text-ink">{{ item.what }}</span>
          <span v-if="item.note" class="text-sm text-ink-muted">{{ item.note }}</span>
        </span>
      </li>
    </ol>
  </section>
</template>