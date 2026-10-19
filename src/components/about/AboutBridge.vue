<script setup>
import logoImg from '../../assets/img/danes-logo.png'
</script>

<template>
  <section class="flex flex-col items-center gap-4 rounded-ds bg-red p-6 text-white lg:flex-row lg:gap-10 lg:p-10">
    <div class="flex h-45 w-full items-center justify-center lg:min-h-[280px] lg:min-w-0 lg:flex-1 lg:basis-0">
      <!-- brightness-0 + invert turns the red logo white -->
      <img :src="logoImg" alt="DANES" class="h-20 w-auto brightness-0 invert lg:h-[120px]" />
    </div>

    <div class="flex flex-col gap-4 lg:min-w-0 lg:flex-1 lg:basis-0">
      <span class="text-xs font-semibold tracking-[0.02em] uppercase">The story in our name</span>
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">The A is a bridge.</h2>
      <p class="max-w-[460px]">
        Look closely at the A in our logo. It’s drawn as a bridge, because that’s what Danish is: the way
        across to your neighbours, your colleagues and the society you now live in.
      </p>
    </div>
  </section>
</template>