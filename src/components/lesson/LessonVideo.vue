<script setup>
import { computed } from 'vue'
import { youtubeId } from '@/utils/lessonPlan'

// The YouTube player, 16:9. youtube-nocookie.com: YouTube doesn't set
// tracking cookies until the learner presses play.
const props = defineProps({
  url: { type: String, required: true },
  title: { type: String, required: true },
})
const src = computed(() => `https://www.youtube-nocookie.com/embed/${youtubeId(props.url)}?rel=0`)
</script>

<template>
  <div class="aspect-video overflow-hidden bg-ink sm:rounded-ds">
    <iframe
      :src="src"
      :title="`Video: ${title}`"
      class="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
