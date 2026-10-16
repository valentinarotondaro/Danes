<script setup>
import { VALUES } from './homeContent'
import logo from '@/assets/img/danes-logo.png'
import CoverPhoto from '@/components/base/CoverPhoto.vue'
import valuesImg from '@/assets/img/friends-sky.jpg'
</script>

<template>
  <section id="values" class="flex flex-col gap-6 rounded-ds bg-red p-6 text-white sm:p-10 lg:flex-row">
    <div class="flex flex-col justify-center gap-6 lg:min-w-0 lg:flex-1 lg:basis-0">
      <span class="text-xs font-semibold uppercase tracking-wide">Our values</span>
      <h2 class="max-w-[520px] text-[40px] font-semibold leading-[1.1] sm:text-[56px]">
        At
        <!-- brightness-0 invert turns the red logo white -->
        <img :src="logo" alt="DANES" class="mx-1 inline-block h-10 w-auto align-[-6px] brightness-0 invert sm:h-[52px]" />
        we help you build your life in Denmark.
      </h2>
      <ul class="flex max-w-[440px] flex-wrap gap-2">
        <li v-for="value in VALUES" :key="value" class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          {{ value }}
        </li>
      </ul>
    </div>
    <CoverPhoto :src="valuesImg" alt="Friends looking down into the camera against a blue sky" />
  </section>
</template>
