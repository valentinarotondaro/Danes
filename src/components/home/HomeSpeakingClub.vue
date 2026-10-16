<script setup>
import { RouterLink } from 'vue-router'
import AvatarGroup from '@/components/base/AvatarGroup.vue'
import { LEARNERS } from './homeContent'
import CoverPhoto from '@/components/base/CoverPhoto.vue'
import speakingImg from '@/assets/img/speaking-hero.jpg'
</script>

<template>
  <section id="speaking" class="flex flex-col gap-6 rounded-ds bg-red p-6 text-white sm:p-10 lg:flex-row">
    <div class="flex flex-col justify-center gap-6 lg:min-w-0 lg:flex-1 lg:basis-0">
      <span class="text-xs font-semibold uppercase tracking-wide">Speaking Club · 45-minute sessions</span>
      <h2 class="max-w-[440px] text-[40px] font-semibold leading-[1.1] sm:text-[56px]">Every Friday, we get together on video.</h2>
      <p class="max-w-[440px]">Practise out loud in small groups with a native speaker. No pressure, just conversation.</p>
      <AvatarGroup :people="LEARNERS" :more="40" />
      <RouterLink to="/live-classes" class="self-start rounded-ds bg-sky px-6 py-3 font-semibold text-ink no-underline hover:bg-white">
        Join the Speaking Club
      </RouterLink>
    </div>
    <CoverPhoto :src="speakingImg" alt="A learner smiling at her laptop during an online session" />
  </section>
</template>