<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as teacherService from '@/services/teacherService'
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

const form = reactive({ name: '', bio: '', photoUrl: '', specialty: '' })
const errors = reactive({ name: '' })

function validate() {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  return !errors.name
}

async function onSubmit() {
  submitError.value = ''
  successMessage.value = ''
  if (!validate()) return
  saving.value = true
  try {
    if (isEditing) {
      await teacherService.updateTeacher(props.id, form)
      successMessage.value = 'Teacher updated.'
    } else {
      await teacherService.createTeacher(form)
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
      Object.assign(form, await teacherService.getTeacherById(props.id))
    } catch {
      submitError.value = 'Could not load this teacher.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <LoadingState v-if="loading" />
  <form v-else @submit.prevent="onSubmit">
    <h1 class="font-serif text-2xl text-neutral-900">{{ isEditing ? 'Edit teacher' : 'New teacher' }}</h1>
    <div class="mt-6 space-y-4">
      <FormField v-model="form.name" label="Name" :error="errors.name" />
      <label class="block">
        <span class="text-sm text-neutral-700">Bio</span>
        <textarea v-model="form.bio" rows="3" class="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-[#C8102E]" />
      </label>
      <FormField v-model="form.specialty" label="Specialty" />
      <FormField v-model="form.photoUrl" label="Photo URL (optional)" />
    </div>
    <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>
    <p v-if="successMessage" class="mt-4 text-sm text-green-700">{{ successMessage }}</p>
    <div class="mt-6">
      <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Save changes' : 'Create teacher' }}</BaseButton>
    </div>
  </form>
</template>
