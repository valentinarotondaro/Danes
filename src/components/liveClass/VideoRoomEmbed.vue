<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useVideoRoom, roomNameForLiveClass } from '@/composables/useVideoRoom'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  liveClassId: { type: String, required: true },
})

const { embed } = useVideoRoom()
const { currentUser } = useAuth()
const container = ref(null)
let api = null
const loadError = ref('')

onMounted(async () => {
  try {
    api = await embed(container.value, roomNameForLiveClass(props.liveClassId), currentUser.value?.name || 'Guest')
  } catch (err) {
    loadError.value = err.message
  }
})

onUnmounted(() => {
  api?.dispose()
})
</script>

<template>
  <div v-if="loadError" class="rounded-md bg-red-50 p-4 text-sm text-red-600">{{ loadError }}</div>
  <div v-else ref="container" class="h-[70vh] w-full overflow-hidden rounded-lg bg-black" />
</template>
