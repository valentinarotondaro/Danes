<script setup>
// The photo half of a "text + photo" block. It always takes exactly half the
// width on desktop and fills the block's full height, whatever the photo's
// own size. The image is "absolute" inside its box, so it never makes the
// block taller or wider than the text needs.
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  rounded: { type: Boolean, default: true },
  position: { type: String, default: 'object-center' }, // e.g. 'object-[62%_40%]'
})
</script>

<template>
  <div class="relative h-[320px] sm:h-[420px] lg:h-auto lg:min-h-[360px] lg:min-w-0 lg:flex-1 lg:basis-0">
    <img
      :src="src"
      :alt="alt"
      class="absolute inset-0 h-full w-full object-cover"
      :class="[position, { 'rounded-ds': rounded }]"
    />
  </div>
</template>