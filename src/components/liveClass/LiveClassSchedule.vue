<script setup>
import LiveClassCard from './LiveClassCard.vue'

defineProps({ liveClasses: { type: Array, required: true } })
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <LiveClassCard v-for="lc in liveClasses" :key="lc.$id" :live-class="lc" />
  </div>
</template>
