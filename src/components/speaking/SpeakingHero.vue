<script setup>
import AvatarGroup from '@/components/base/AvatarGroup.vue'
import { LEARNERS } from './speakingContent'
import heroImg from '@/assets/img/speaking-hero.jpg'

const TAGS = ['45 min', 'Up to 8 per group', 'From 250 kr./month']
</script>

<template>
  <section id="top" class="flex flex-col overflow-hidden rounded-ds bg-red text-white lg:flex-row">
    <!-- basis-0 + flex-1 on both halves = exactly 50/50, whatever the photo's size -->
    <div class="flex flex-col justify-between gap-8 p-8 sm:p-10 lg:min-h-[480px] lg:min-w-0 lg:flex-1 lg:basis-0">
      <div class="flex flex-col gap-4">
        <span class="text-xs font-semibold uppercase tracking-wide">Speaking Club · every Friday</span>
        <h1 class="max-w-[520px] text-[40px] font-semibold leading-[1.1] sm:text-[56px]">Talk first. Perfect later.</h1>
        <p class="max-w-[440px]">
          45 minutes on video in a small group with a native host. Say the Danish you learned this week out loud,
          with people who know exactly how it feels.
        </p>
      </div>
      <ul class="flex flex-wrap gap-2">
        <li v-for="tag in TAGS" :key="tag" class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          {{ tag }}
        </li>
      </ul>
      <div class="flex items-center gap-3">
        <AvatarGroup :people="LEARNERS" :more="40" />
        <span class="text-sm">learners talk with us every week</span>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <a href="#book" class="rounded-ds bg-sky px-6 py-3 text-center font-semibold text-ink no-underline hover:bg-white sm:w-60">
          Book this Friday
        </a>
        <a href="#how" class="font-semibold text-white underline underline-offset-4 hover:text-sky">How a session works</a>
      </div>
    </div>
    <!-- The photo fills the red block's full height. It sits "absolute" inside its box,
         so it fills the box without making the block taller than the text. -->
    <div class="relative h-[320px] sm:h-[420px] lg:h-auto lg:min-w-0 lg:flex-1 lg:basis-0">
      <img
        :src="heroImg"
        alt="A learner smiling at her laptop on the sofa"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </section>
</template>