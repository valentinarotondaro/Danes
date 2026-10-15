<script setup>
import danesSmiles from '@/assets/img/danes-smiles.avif'
import heroCyclists from '@/assets/img/hero-cyclists.png'

// Photos from past events. Big one first, then four small ones.
const photos = [
  { src: danesSmiles, alt: 'Learners laughing together on a city street', caption: 'Hygge night · Esbjerg' },
  { src: '/img/aarhus-la-cabra.jpg', alt: 'Baristas at La Cabra coffee in Aarhus', caption: 'La Cabra · Aarhus' },
  { src: '/img/copenhagen-druk.avif', alt: 'Still from the film Druk', caption: 'Film night' },
  { src: '/img/billund-legohouse.jpg', alt: 'LEGO House in Billund seen from above', caption: 'LEGO House' },
  { src: heroCyclists, alt: 'Friends with bikes on a Danish street', caption: 'City walk' },
]
</script>

<template>
  <section class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">From our last events</h2>
      <p class="text-ink-muted">Real learners, real cities. Photos shared with permission.</p>
    </div>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-[240px_240px] md:gap-6">
      <figure
        v-for="(photo, i) in photos"
        :key="photo.caption"
        class="relative m-0"
        :class="i === 0 ? 'col-span-2 md:row-span-2' : 'aspect-square md:aspect-auto'"
      >
        <img :src="photo.src" :alt="photo.alt" class="h-full w-full rounded-ds object-cover" />
        <figcaption class="absolute bottom-3 left-3 rounded-ds bg-white px-3 py-2 text-sm font-semibold text-ink">
          {{ photo.caption }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>