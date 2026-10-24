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
  <div v-if="loadError" role="alert" class="rounded-ds bg-red-soft p-4 text-sm text-red">{{ loadError }}</div>
  <div v-else ref="container" class="h-[70vh] w-full overflow-hidden rounded-ds bg-black" />
</template>
