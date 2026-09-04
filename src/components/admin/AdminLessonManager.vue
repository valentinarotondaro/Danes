<script setup>
import { onMounted, reactive, ref } from 'vue'
import * as lessonService from '@/services/lessonService'
import AdminTable from '@/components/admin/AdminTable.vue'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const props = defineProps({
  courseId: { type: String, required: true },
})

const lessons = ref([])
const loading = ref(false)
const saving = ref(false)
const formError = ref('')

const editingId = ref(null) // null = "add new" mode, otherwise the lesson being edited
const showForm = ref(false)

const emptyForm = () => ({ title: '', order: 1, videoUrl: '', durationMinutes: null })
const form = reactive(emptyForm())
const errors = reactive({ title: '', videoUrl: '' })

async function load() {
  loading.value = true
  try {
    lessons.value = await lessonService.listLessonsByCourse(props.courseId)
  } finally {
    loading.value = false
  }
}

function openAddForm() {
  editingId.value = null
  Object.assign(form, emptyForm(), { order: lessons.value.length + 1 })
  errors.title = ''
  errors.videoUrl = ''
  showForm.value = true
}

function openEditForm(lesson) {
  editingId.value = lesson.$id
  Object.assign(form, {
    title: lesson.title,
    order: lesson.order,
    videoUrl: lesson.videoUrl,
    durationMinutes: lesson.durationMinutes ?? null,
  })
  errors.title = ''
  errors.videoUrl = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
}

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.videoUrl = form.videoUrl.trim() ? '' : 'Video URL is required.'
  return !errors.title && !errors.videoUrl
}

async function onSubmit() {
  formError.value = ''
  if (!validate()) return

  saving.value = true
  try {
    const payload = {
      title: form.title,
      order: Number(form.order),
      videoUrl: form.videoUrl,
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
    }
    if (editingId.value) {
      await lessonService.updateLesson(editingId.value, payload)
    } else {
      await lessonService.createLesson({ ...payload, courseId: props.courseId })
    }
    showForm.value = false
    await load()
  } catch {
    formError.value = 'Could not save the lesson. Please try again.'
  } finally {
    saving.value = false
  }
}

async function onDelete(row) {
  if (!confirm(`Delete lesson "${row.title}"?`)) return
  await lessonService.deleteLesson(row.$id)
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="font-serif text-xl text-neutral-900">Lessons</h2>
      <BaseButton v-if="!showForm" @click="openAddForm" class="w-auto px-4">Add lesson</BaseButton>
    </div>

    <form v-if="showForm" @submit.prevent="onSubmit" class="mt-4 rounded-md border border-neutral-200 p-4">
      <div class="space-y-4">
        <FormField v-model="form.title" label="Title" :error="errors.title" />
        <FormField v-model.number="form.order" label="Order" type="number" />
        <FormField v-model="form.videoUrl" label="YouTube URL" :error="errors.videoUrl" />
        <FormField v-model.number="form.durationMinutes" label="Duration (minutes)" type="number" />
      </div>

      <p v-if="formError" class="mt-3 text-sm text-red-600">{{ formError }}</p>

      <div class="mt-4 flex gap-3">
        <BaseButton type="submit" :loading="saving" class="w-auto px-4">
          {{ editingId ? 'Save lesson' : 'Add lesson' }}
        </BaseButton>
        <button type="button" @click="cancelForm" class="text-sm text-neutral-500 hover:text-neutral-900">
          Cancel
        </button>
      </div>
    </form>

    <div class="mt-4">
      <LoadingState v-if="loading" />
      <EmptyState v-else-if="lessons.length === 0" title="No lessons yet" description="Add the first one above." />
      <AdminTable
        v-else
        :rows="lessons"
        :columns="[
          { key: 'order', label: 'Order' },
          { key: 'title', label: 'Title' },
          { key: 'durationMinutes', label: 'Minutes' },
        ]"
        @edit="openEditForm"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
