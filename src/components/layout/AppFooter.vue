<script setup>
import { RouterLink } from 'vue-router'
import danesLogo from '@/assets/img/danes-logo.png'

const ABOUT = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/live-classes', label: 'Speaking Club' },
  { to: '/events', label: 'Events' },
  { to: '/level-test', label: 'Level test' },
  { to: '/about', label: 'About us' },
]
const SOCIAL = ['Instagram', 'Facebook', 'LinkedIn', 'Threads']
const PHONES = [
  { city: 'CPH', number: '(45) 5515-8465' },
  { city: 'AAR', number: '(45) 5515-7854' },
  { city: 'EBJ', number: '(45) 5515-2145' },
]
</script>

<template>
  <footer class="mt-[72px] rounded-t-ds bg-sky sm:mt-[120px]">
    <div class="mx-auto flex max-w-[1200px] flex-wrap gap-8 px-4 py-10 sm:px-10">
      <div class="flex flex-[2_1_320px] flex-col gap-8">
        <img :src="danesLogo" alt="DANES" class="h-12 w-auto self-start sm:h-16" />
        <p class="max-w-[320px] text-[22px] font-semibold leading-tight text-ink sm:text-2xl">Your bridge into Danish life.</p>
        <a href="mailto:contact@danes.dk" class="inline-flex items-center gap-3 self-start font-semibold text-ink no-underline hover:text-red">
          <span aria-hidden="true" class="flex h-12 w-12 items-center justify-center rounded-full bg-red text-xl font-semibold text-white">
            <span class="-rotate-[25deg]">&gt;</span>
          </span>
          contact@danes.dk
        </a>
      </div>

      <nav aria-label="About" class="flex flex-[1_1_160px] flex-col gap-3">
        <span class="text-sm font-semibold uppercase text-ink">About</span>
        <RouterLink v-for="link in ABOUT" :key="link.to" :to="link.to" class="text-ink no-underline hover:text-red">{{ link.label }}</RouterLink>
      </nav>

      <div class="flex flex-[1_1_160px] flex-col gap-3">
        <span class="text-sm font-semibold uppercase text-ink">Follow us</span>
        <!-- No real profiles yet, so these are plain text, not dead links -->
        <span v-for="name in SOCIAL" :key="name" class="text-ink">{{ name }}</span>
      </div>

      <div class="flex flex-[1_1_200px] flex-col gap-3">
        <span class="text-sm font-semibold uppercase text-ink">Contact</span>
        <span v-for="phone in PHONES" :key="phone.city" class="text-ink">{{ phone.city }} {{ phone.number }}</span>
      </div>
    </div>
  </footer>
</template>