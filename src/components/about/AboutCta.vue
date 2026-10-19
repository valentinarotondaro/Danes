<script setup>
import ctaImg from '../../assets/img/friends-street.jpg'
</script>

<template>
  <section class="flex flex-col gap-4 rounded-ds bg-sky p-6 lg:flex-row lg:gap-10 lg:p-10">
    <!-- order-last: on a phone the photo goes under the buttons, like the design -->
    <div class="relative order-last h-[220px] overflow-hidden rounded-ds lg:order-first lg:h-auto lg:max-h-[400px] lg:min-h-[340px] lg:min-w-0 lg:flex-1 lg:basis-0">
      <img :src="ctaImg" alt="Five friends laughing and hugging on a colourful street" class="absolute inset-0 size-full object-cover" />
    </div>

    <div class="flex flex-col justify-center gap-4 lg:min-w-0 lg:flex-1 lg:basis-0 lg:p-4">
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">Come across the bridge.</h2>
      <p class="max-w-[440px]">Start with the free level test, or say hej at the next event in your city.</p>
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <RouterLink
          to="/level-test"
          class="inline-flex h-14 items-center justify-center rounded-ds bg-red px-8 font-semibold text-white transition-colors hover:bg-red-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Start the level test
        </RouterLink>
        <RouterLink
          to="/events"
          class="inline-flex h-14 items-center justify-center rounded-ds border-2 border-ink bg-white px-8 font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          See upcoming events
        </RouterLink>
      </div>
    </div>
  </section>
</template>