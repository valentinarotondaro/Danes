<script setup>
import heroImg from '../../assets/img/friends-sky.jpg'
</script>

<template>
  <section class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
    <div class="flex flex-col justify-center gap-4 p-6 lg:min-h-[480px] lg:min-w-0 lg:flex-1 lg:basis-0 lg:p-10">
      <span class="text-xs font-semibold tracking-[0.02em] uppercase">About us</span>
      <h1 class="max-w-[540px] text-[40px] leading-[1.1] font-semibold lg:text-[56px]">
        We build bridges into Danish life.
      </h1>
      <p class="max-w-[440px]">
        DANES is a school and a community for people who moved to Denmark and want more than grammar:
        the words, the friends and the confidence to feel at home.
      </p>
    </div>

    <!-- Phone: rounded photo inside the blue box. Desktop: right half, edge to edge. -->
    <div class="relative mx-6 mb-6 h-60 overflow-hidden rounded-ds lg:m-0 lg:h-auto lg:max-h-[540px] lg:min-w-0 lg:flex-1 lg:basis-0 lg:rounded-none">
      <img :src="heroImg" alt="Friends looking down into the camera against a blue sky" class="absolute inset-0 size-full object-cover" />
    </div>
  </section>
</template>