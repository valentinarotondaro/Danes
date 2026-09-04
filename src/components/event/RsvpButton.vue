<script setup>
import BaseButton from '@/components/base/BaseButton.vue'
import RsvpStatusBadge from './RsvpStatusBadge.vue'

defineProps({
  hasRsvpd: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
  full: { type: Boolean, default: false },
})
defineEmits(['rsvp'])
</script>

<template>
  <RsvpStatusBadge v-if="hasRsvpd" />
  <BaseButton v-else :disabled="full" :loading="loading" @click="$emit('rsvp')" class="w-auto px-4">
    {{ full ? 'Fully booked' : 'RSVP' }}
  </BaseButton>
</template>
