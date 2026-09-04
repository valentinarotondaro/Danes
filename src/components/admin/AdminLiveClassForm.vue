<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as liveClassService from '@/services/liveClassService'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingState from '@/components/base/LoadingState.vue'

const props = defineProps({ id: { type: String, default: null } })
const isEditing = !!props.id
const router = useRouter()

const loading = ref(isEditing)
const saving = ref(false)
const submitError = ref('')
const successMessage = ref('')

const form = reactive({
  title: '', teacherId: '', dateTime: '', capacity: 10, price: 0, videoRoomUrl: '', published: false,
})
const errors = reactive({ title: '', dateTime: '', capacity: '' })

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.dateTime = form.dateTime ? '' : 'Date & time is required.'
  errors.capacity = form.capacity > 0 ? '' : 'Capacity must be at least 1.'
  return !errors.title && !errors.dateTime && !errors.capacity
}

async function onSubmit() {
  submitError.value = ''
  successMessage.value = ''
  if (!validate()) return
  saving.value = true
  try {
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      price: Number(form.price),
      dateTime: new Date(form.dateTime).toISOString(),
    }
    if (isEditing) {
      await liveClassService.updateLiveClass(props.id, payload)
      successMessage.value = 'Class updated.'
    } else {
      await liveClassService.createLiveClass(payload)
      router.push({ name: 'admin-dashboard' })
    }
  } catch {
    submitError.value = 'Could not save. Check the fields and try again.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEditing) {
    try {
      const lc = await liveClassService.getLiveClassById(props.id)
      Object.assign(form, lc, { dateTime: lc.dateTime?.slice(0, 16) })
    } catch {
      submitError.value = 'Could not load this class.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <LoadingState v-if="loading" />
  <form v-else @submit.prevent="onSubmit">
    <h1 class="font-serif text-2xl text-neutral-900">{{ isEditing ? 'Edit live class' : 'New live class' }}</h1>
    <div class="mt-6 space-y-4">
      <FormField v-model="form.title" label="Title" :error="errors.title" />
      <FormField v-model="form.teacherId" label="Teacher ID (optional)" />
      <label class="block">
        <span class="text-sm text-neutral-700">Date & time</span>
        <input
          v-model="form.dateTime"
          type="datetime-local"
          class="mt-1.5 w-full rounded-md border px-3 py-2 outline-none"
          :class="errors.dateTime ? 'border-red-600' : 'border-neutral-300 focus:border-[#C8102E]'"
        />
        <span v-if="errors.dateTime" class="mt-1 block text-sm text-red-600">{{ errors.dateTime }}</span>
      </label>
      <FormField v-model.number="form.capacity" label="Capacity" type="number" :error="errors.capacity" />
      <FormField v-model.number="form.price" label="Price (DKK)" type="number" />
      <label class="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" v-model="form.published" class="h-4 w-4 accent-[#C8102E]" />
        Published
      </label>
    </div>
    <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>
    <p v-if="successMessage" class="mt-4 text-sm text-green-700">{{ successMessage }}</p>
    <div class="mt-6">
      <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Save changes' : 'Create class' }}</BaseButton>
    </div>
  </form>
</template>
