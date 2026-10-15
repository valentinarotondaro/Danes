<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import AdminLessonManager from '@/components/admin/AdminLessonManager.vue'
import { useTeachers } from '@/composables/useTeachers'

const props = defineProps({ id: { type: String, default: null } })
const isEditing = !!props.id
const router = useRouter()
const { teachers, fetchTeachers } = useTeachers()
const LEVELS = ['A1', 'A2', 'B1']

const loading = ref(isEditing)
const saving = ref(false)
const submitError = ref('')
const successMessage = ref('')

const form = reactive({
  title: '', slug: '', description: '', journeyTag: '', price: 0, thumbnailUrl: '', published: false,
  level: '', teacherId: '', // v3
})
const errors = reactive({ title: '', slug: '', price: '' })

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
function onTitleInput(value) {
  form.title = value
  if (!isEditing) form.slug = slugify(value)
}
function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.slug = form.slug.trim() ? '' : 'Slug is required.'
  errors.price = form.price >= 0 ? '' : 'Price must be 0 or more.'
  return !errors.title && !errors.slug && !errors.price
}
async function onSubmit() {
  submitError.value = ''
  successMessage.value = ''
  if (!validate()) return
  saving.value = true
  try {
    const payload = {
      ...form,
      price: Number(form.price),
      level: form.level || null,          // '' no es un nivel válido → null
      teacherId: form.teacherId || null,
    }
    if (isEditing) {
      await courseService.updateCourse(props.id, payload)
      successMessage.value = 'Course updated.'
    } else {
      await courseService.createCourse(payload)
      router.push({ name: 'admin-dashboard' })
    }
  } catch {
    submitError.value = 'Could not save. Check the fields and try again.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  fetchTeachers()

  if (isEditing) {
    try {
      const doc = await courseService.getCourseById(props.id)
      for (const key of Object.keys(form)) form[key] = doc[key] ?? form[key]
    } catch {
      submitError.value = 'Could not load this course.'
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <LoadingState v-if="loading" />
  <template v-else>
    <form @submit.prevent="onSubmit">
      <h1 class="text-2xl text-neutral-900">{{ isEditing ? 'Edit course' : 'New course' }}</h1>
      <div class="mt-6 space-y-4">
        <FormField :model-value="form.title" label="Title" :error="errors.title" @update:model-value="onTitleInput" />
        <FormField v-model="form.slug" label="Slug" :error="errors.slug" />
        <label class="block">
          <span class="text-sm text-neutral-700">Description</span>
          <textarea v-model="form.description" rows="3" class="mt-1.5 w-full rounded-ds border border-neutral-300 px-3 py-2 outline-none focus:border-red" />
        </label>
        <FormField v-model="form.journeyTag" label="Journey tag" />
        <div class="grid gap-4 sm:grid-cols-2">
  <label class="block">
    <span class="text-sm text-neutral-700">Level</span>
    <select v-model="form.level" class="mt-1.5 w-full rounded-ds border border-neutral-300 px-3 py-2 outline-none focus:border-red">
      <option value="">No level</option>
      <option v-for="lvl in LEVELS" :key="lvl" :value="lvl">{{ lvl }}</option>
    </select>
  </label>
  <label class="block">
    <span class="text-sm text-neutral-700">Teacher</span>
    <select v-model="form.teacherId" class="mt-1.5 w-full rounded-ds border border-neutral-300 px-3 py-2 outline-none focus:border-red">
      <option value="">No teacher yet</option>
      <option v-for="t in teachers" :key="t.$id" :value="t.$id">{{ t.name }}</option>
    </select>
  </label>
</div>
        <FormField v-model.number="form.price" label="Price (DKK)" type="number" :error="errors.price" />
        <FormField v-model="form.thumbnailUrl" label="Thumbnail URL" />
        <label class="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" v-model="form.published" class="h-4 w-4 accent-red" />
          Published
        </label>
      </div>
      <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>
      <p v-if="successMessage" class="mt-4 text-sm text-green-700">{{ successMessage }}</p>
      <div class="mt-6">
        <BaseButton type="submit" :loading="saving">{{ isEditing ? 'Save changes' : 'Create course' }}</BaseButton>
      </div>
    </form>

    <div v-if="isEditing" class="mt-12 border-t border-neutral-200 pt-8">
      <AdminLessonManager :course-id="id" />
    </div>
  </template>
</template>
