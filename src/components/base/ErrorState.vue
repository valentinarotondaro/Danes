<script setup>
defineProps({
  message: { type: String, default: 'Something went wrong. Please try again.' },
})
defineEmits(['retry'])
</script>

<template>
  <div class="py-16 text-center">
    <p class="text-red-600">{{ message }}</p>
    <button @click="$emit('retry')" class="mt-3 text-sm text-[#C8102E] hover:underline">
      Try again
    </button>
  </div>
</template>
