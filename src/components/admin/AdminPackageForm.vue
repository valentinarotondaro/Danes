<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as packageService from '@/services/packageService'
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
  title: '', description: '', price: 0, courseId: '', liveClassId: '', eventId: '', published: false,
})
const errors = reactive({ title: '', price: '' })

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.price = form.price >= 0 ? '' : 'Price must be 0 or more.'
  return !errors.title && !errors.price
}

async function onSubmit() {
  submitError.value = ''
  successMessage.value = ''
  if (!validate()) return
  saving.value = true
  try {
    const payload = { ...form, price: Number(form.price) }
    if (isEditing) {
      await packageService.updatePackage(props.id, payload)
      successMessage.value = 'Package updated.'
    } else {
      await packageService.createPackage(payload)
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
      Object.assign(form, await packageService.getPackageById(props.id))
    } catch {
      submitError.value = 'Could not load this package.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <LoadingState v-if="loading" />
  <form v-else @submit.prevent="onSubmit">
    <h1 class="text-2xl text-neutral-900">{{ isEditing ? 'Edit package' : 'New package' }}</h1>
    <p v-if="!isEditing" class="mt-2 text-sm text-neutral-500">
      Paste the IDs of an existing course/class/event — copy them from each item's Admin edit URL.
    </p>
    <div class="mt-6 space-y-4">
      <FormField v-model="form.title" label="Title" :error="errors.title" />
      <label class="block">
        <span class="text-sm text-neutral-700">Description</span>
        <textarea v-model="form.description" rows="3" class="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-[#C8102E]" />
      </label>
      <FormField v-model.number="form.price" label="Price (DKK)" type="number" :error="errors.price" />
      <FormField v-model="form.courseId" label="Course ID (optional)" />
      <FormField v-model="form.liveClassId" label="Live Class ID (optional)" />
      <FormField v-model="form.eventId" label="Event ID (optional)" />
      <label class="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" v-model="form.published" class="h-4 w-4 accent-[#C8102E]" />
        Published
      </label>
    </div>
    <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>
    <p v-if="successMessage" class="mt-4 text-sm text-green-700">{{ successMessage }}</p>
    <div class="mt-6">
      <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Save changes' : 'Create package' }}</BaseButton>
    </div>
  </form>
</template>
