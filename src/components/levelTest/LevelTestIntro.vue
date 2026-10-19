<script setup>
import CoverPhoto from '@/components/base/CoverPhoto.vue'
import introImg from '@/assets/img/woman-sweater.jpg'

defineEmits(['start', 'beginner'])

const PARTS = [
  { n: 1, title: 'About you', text: '2 questions on how you use Danish today' },
  { n: 2, title: 'Words and grammar', text: '6 questions: pick the word that fits' },
  { n: 3, title: 'Reading', text: '4 short texts, like a brev from the kommune' },
]
const PROMISES = [
  { title: 'No score while you go', text: 'We don’t mark answers right or wrong on the way. You see the result at the end.' },
  { title: 'Not sure? Say so', text: 'Every question has “I don’t know yet”. It places you better than a guess.' },
  { title: 'Your level, saved', text: 'Log in and your level goes to your profile, so we suggest the right course and Friday group.' },
]
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:px-10">
    <section class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
      <div class="flex flex-col justify-between gap-8 p-6 sm:p-10 lg:min-h-[520px] lg:min-w-0 lg:flex-1 lg:basis-0">
        <div class="flex flex-col gap-4">
          <span class="text-xs font-semibold uppercase tracking-wide text-ink">Free level test · about 5 minutes</span>
          <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Find your Danish level.</h1>
          <p class="max-w-[440px] text-ink">
            12 short questions, no account needed. At the end you get your level and the course that fits you.
          </p>
        </div>
        <ol class="flex flex-col gap-3">
          <li v-for="part in PARTS" :key="part.n" class="flex items-center gap-4 rounded-ds bg-white px-4 py-3">
            <span aria-hidden="true" class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red font-semibold text-white">{{ part.n }}</span>
            <span class="flex flex-col">
              <span class="font-semibold leading-tight text-ink">{{ part.title }}</span>
              <span class="text-sm text-ink-muted">{{ part.text }}</span>
            </span>
          </li>
        </ol>
        <div class="flex flex-col gap-4 sm:flex-row">
          <button type="button" class="rounded-ds bg-red px-6 py-3 font-semibold text-white hover:bg-red-hover sm:w-60" @click="$emit('start')">
            Start the test
          </button>
          <button type="button" class="rounded-ds border-2 border-ink bg-white px-6 py-3 font-semibold text-ink hover:bg-sky-soft sm:w-60" @click="$emit('beginner')">
            I’m a total beginner
          </button>
        </div>
      </div>
      <CoverPhoto :src="introImg" alt="A smiling woman in a beige sweater" position="object-[62%_40%]" :rounded="false" />
    </section>

    <ul class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <li v-for="promise in PROMISES" :key="promise.title" class="flex flex-col gap-2 rounded-ds bg-surface-secondary p-6">
        <h2 class="text-2xl font-semibold leading-tight text-ink">{{ promise.title }}</h2>
        <p class="text-ink-muted">{{ promise.text }}</p>
      </li>
    </ul>
  </div>
</template>