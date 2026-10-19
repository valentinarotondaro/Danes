<script setup>
import AboutHero from '../components/about/AboutHero.vue'
import AboutBridge from '../components/about/AboutBridge.vue'
import AboutWhy from '../components/about/AboutWhy.vue'
import AboutValues from '../components/about/AboutValues.vue'
import AboutPillars from '../components/about/AboutPillars.vue'
import AboutCities from '../components/about/AboutCities.vue'
import AboutTeam from '../components/about/AboutTeam.vue'
import AboutCta from '../components/about/AboutCta.vue'
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-18 px-4 pt-6 lg:gap-30 lg:px-10 lg:pt-12">
    <AboutHero />
    <AboutBridge />
    <AboutWhy />
    <AboutValues />
    <AboutPillars />
    <AboutCities />
    <AboutTeam />
    <AboutCta />
  </div>
</template>