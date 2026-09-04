<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import * as bundleService from '@/services/bundleService'
import BundleCard from '@/components/bundle/BundleCard.vue'

const bundles = ref([])

onMounted(async () => {
  try {
    bundles.value = await bundleService.listPublishedBundles()
  } catch {
    bundles.value = []
  }
})

const pillars = [
  {
    name: 'Learn',
    to: { name: 'course-catalog' },
    description: 'Recorded courses organized by real-life situation — go at your own pace, from the beginning.',
    dot: '#1A6B3F',
  },
  {
    name: 'Practice',
    to: { name: 'live-class-list' },
    description: 'Live group classes with a native teacher. Small groups, real conversation, real Danish.',
    dot: '#1E5A96',
  },
  {
    name: 'Belong',
    to: { name: 'event-list' },
    description: "In-person community events — coffee mornings, walks, game nights. No video, just showing up.",
    dot: '#C8102E',
  },
]
</script>

<template>
  <div>
    <section class="border-b border-neutral-200 bg-[#1A1A1A] px-6 py-24 text-white">
      <div class="mx-auto max-w-2xl">
        <p class="font-serif text-4xl leading-tight md:text-6xl">
          You don't have to<br />learn Danish alone.
        </p>
        <p class="mt-6 max-w-md text-neutral-300">
          If something isn't understood, we explain it in Danish, and say it again.
          Here, we stay in Danish.
        </p>
        <div class="mt-8 flex gap-6 text-sm">
          <RouterLink to="/signup" class="rounded-md bg-[#C8102E] px-5 py-2.5 font-medium hover:opacity-90">
            Get started
          </RouterLink>
          <RouterLink to="/courses" class="flex items-center text-neutral-300 hover:text-white">
            Browse courses
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-6 py-16">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <RouterLink
          v-for="pillar in pillars"
          :key="pillar.name"
          :to="pillar.to"
          class="group block"
        >
          <span class="inline-block h-2 w-2 rounded-full" :style="{ backgroundColor: pillar.dot }" />
          <h2 class="mt-3 font-serif text-2xl text-neutral-900 group-hover:text-[#C8102E]">
            {{ pillar.name }}
          </h2>
          <p class="mt-2 text-sm text-neutral-500">{{ pillar.description }}</p>
        </RouterLink>
      </div>
    </section>

    <section v-if="bundles.length" class="mx-auto max-w-4xl border-t border-neutral-200 px-6 py-16">
      <h2 class="font-serif text-2xl text-neutral-900">Bundles</h2>
      <p class="mt-2 text-neutral-500">A course, a class, and an event — together, at a better price.</p>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BundleCard v-for="bundle in bundles" :key="bundle.$id" :bundle="bundle" />
      </div>
    </section>
  </div>
</template>
