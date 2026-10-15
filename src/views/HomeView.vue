<script setup>
// The home page only puts the sections in order. Each section is its own
// component; the ones with real data (courses, events) load it themselves.
import HomeHero from '@/components/home/HomeHero.vue'
import HomeCourses from '@/components/home/HomeCourses.vue'
import HomeHowItWorks from '@/components/home/HomeHowItWorks.vue'
import HomeLevelTest from '@/components/home/HomeLevelTest.vue'
import HomeValues from '@/components/home/HomeValues.vue'
import HomeCityWalks from '@/components/home/HomeCityWalks.vue'
import HomeReviews from '@/components/home/HomeReviews.vue'
import HomeSpeakingClub from '@/components/home/HomeSpeakingClub.vue'
import FaqList from '@/components/base/FaqList.vue'
import { FAQ } from '@/components/home/homeContent'
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:gap-[120px] sm:px-10 sm:py-16">
    <HomeHero />
    <HomeCourses />
    <HomeHowItWorks />
    <HomeLevelTest />
    <HomeValues />
    <HomeCityWalks />
    <HomeReviews />
    <HomeSpeakingClub />

    <section id="faq" class="flex flex-col gap-6 lg:flex-row">
      <div class="flex flex-col gap-2 lg:w-1/3">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">FAQ</span>
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Got a question?</h2>
        <p class="text-ink-muted">Write to contact@danes.dk if you don’t find your answer here.</p>
      </div>
      <div class="lg:flex-1">
        <FaqList :items="FAQ" />
      </div>
    </section>
  </div>
</template>