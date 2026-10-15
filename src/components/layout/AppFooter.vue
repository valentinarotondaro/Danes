<script setup>
import { RouterLink } from 'vue-router'
import danesLogo from '@/assets/img/danes-logo.png'
</script>

<template>
  <footer class="rounded-t-[32px] bg-sky px-6 py-14 md:rounded-t-[58px] md:py-16">
    <div class="mx-auto max-w-5xl">
      <div class="flex flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <img :src="danesLogo" alt="DANES" class="h-14 w-auto md:h-16" />
          <a href="mailto:contact@danes.dk" class="mt-6 flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-full bg-red text-lg text-white">↗</span>
            <span class="text-lg font-semibold text-ink">contact@danes.dk</span>
          </a>
        </div>

        <div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-ink">About</p>
            <ul class="mt-4 space-y-2 text-sm text-ink/80">
              <li><RouterLink to="/" class="hover:text-ink">Home</RouterLink></li>
              <li><RouterLink to="/#about" class="hover:text-ink">About</RouterLink></li>
              <li><RouterLink to="/courses" class="hover:text-ink">Courses</RouterLink></li>
              <li><RouterLink to="/live-classes" class="hover:text-ink">Speaking Club</RouterLink></li>
              <li><RouterLink to="/events" class="hover:text-ink">Events</RouterLink></li>
              <li><RouterLink to="/signup" class="hover:text-ink">Level Test</RouterLink></li>
            </ul>
          </div>
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-ink">Follow us</p>
            <ul class="mt-4 space-y-2 text-sm text-ink/80">
              <li><a href="#" class="hover:text-ink">Instagram</a></li>
              <li><a href="#" class="hover:text-ink">Facebook</a></li>
              <li><a href="#" class="hover:text-ink">Linkedin</a></li>
              <li><a href="#" class="hover:text-ink">Threads</a></li>
            </ul>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <p class="text-sm font-semibold uppercase tracking-wide text-ink">Contact</p>
            <ul class="mt-4 space-y-2 text-sm text-ink/80">
              <li><a href="mailto:contact@danes.dk" class="hover:text-ink">contact@danes.dk</a></li>
              <li>CPH &nbsp;(45) 5515-8465</li>
              <li>AAR &nbsp;(45) 5515-7854</li>
              <li>BLL &nbsp;&nbsp;(45) 5515-2145</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
