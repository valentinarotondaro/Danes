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
    bg: 'bg-sage',
  },
  {
    name: 'Practice',
    to: { name: 'live-class-list' },
    description: 'Live group classes with a native teacher. Small groups, real conversation, real Danish.',
    bg: 'bg-dusty-blue',
  },
  {
    name: 'Belong',
    to: { name: 'event-list' },
    description: "In-person community events — coffee mornings, walks, game nights. No video, just showing up.",
    bg: 'bg-terracotta',
  },
]
</script>

<template>
  <div class="bg-cream">
    <!-- Hero -->
    <section class="border-b border-neutral-200 bg-plum px-6 py-20 text-white md:py-28">
      <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p class="font-serif text-4xl leading-tight md:text-6xl">
            You don't have to<br />learn Danish alone.
          </p>
          <p class="mt-6 max-w-md text-white/70">
            If something isn't understood, we explain it in Danish, and say it again.
            <span class="font-serif italic text-white">Here, we stay in Danish.</span>
          </p>
          <div class="mt-8 flex gap-6 text-sm">
            <RouterLink to="/signup" class="rounded-md bg-[#C8102E] px-5 py-2.5 font-medium hover:opacity-90">
              Get started
            </RouterLink>
            <RouterLink to="/courses" class="flex items-center text-white/70 hover:text-white">
              Browse courses
            </RouterLink>
          </div>
        </div>

        <!-- Photo collage placeholder — swap these divs for real <img> tags -->
        <div class="relative hidden h-64 md:block">
          <div class="absolute left-0 top-4 h-36 w-28 rotate-[-6deg] rounded-sm bg-sage/70 shadow-lg" />
          <div class="absolute left-24 top-0 h-40 w-32 rotate-[4deg] rounded-sm bg-terracotta/70 shadow-lg" />
          <div class="absolute left-14 top-28 h-32 w-28 rotate-[-3deg] rounded-sm bg-dusty-blue/70 shadow-lg" />
        </div>
      </div>
    </section>

    <!-- Pillars — warm pill selectors -->
    <section class="mx-auto max-w-4xl px-6 py-16">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <RouterLink
          v-for="pillar in pillars"
          :key="pillar.name"
          :to="pillar.to"
          class="group block rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white" :class="pillar.bg">
            {{ pillar.name }}
          </span>
          <p class="mt-4 text-sm text-neutral-600">{{ pillar.description }}</p>
          <span class="mt-4 inline-block text-sm text-[#C8102E] group-hover:underline">Explore →</span>
        </RouterLink>
      </div>
    </section>

    <!-- Bundles -->
    <section v-if="bundles.length" class="mx-auto max-w-4xl border-t border-neutral-200 px-6 py-16">
      <h2 class="font-serif text-2xl text-neutral-900">Bundles</h2>
      <p class="mt-2 text-neutral-500">A course, a class, and an event — together, at a better price.</p>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BundleCard v-for="bundle in bundles" :key="bundle.$id" :bundle="bundle" />
      </div>
    </section>

    <!-- Signup CTA -->
    <section class="bg-terracotta/15">
      <div class="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div class="order-2 md:order-1">
          <p class="font-serif text-3xl text-neutral-900">Your first lesson is on us.</p>
          <p class="mt-3 text-neutral-600">
            Create a free account and start with a beginner lesson — no card, no pressure.
          </p>
          <RouterLink
            to="/signup"
            class="mt-6 inline-block rounded-md bg-[#C8102E] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Create free account
          </RouterLink>
        </div>
        <!-- Photo placeholder — swap for a real portrait/lifestyle photo -->
        <div class="order-1 aspect-square rounded-2xl bg-terracotta/40 md:order-2" />
      </div>
    </section>
  </div>
</template>
