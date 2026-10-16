<script setup>
import friendsSky from '@/assets/img/friends-sky.jpg'
import bakery from '@/assets/img/bakery.jpg'
import cafeLetter from '@/assets/img/cafe-letter.jpg'
import selfie from '@/assets/img/speaking-group.jpg'
import friendsStreet from '@/assets/img/friends-street.jpg'

// Photos from past events. Big one first, then four small ones.
const photos = [
  { src: friendsSky, alt: 'Friends looking down into the camera against a blue sky', caption: 'Summer picnic · Aarhus' },
  { src: bakery, alt: 'A learner ordering pastries in a bakery', caption: 'Bageri morning' },
  { src: cafeLetter, alt: 'Two learners laughing over a letter in a café', caption: 'Café Danish' },
  { src: selfie, alt: 'Four friends taking a selfie outside a bageri', caption: 'Selfie stop' },
  { src: friendsStreet, alt: 'Friends hugging on a colourful street', caption: 'Hygge night' },
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