<script setup>
import { onMounted, reactive, ref } from 'vue'
import * as lessonService from '@/services/lessonService'
import { useToast } from '@/composables/useToast'
import { required, youtubeUrl, onlyErrors, linesToList, listToLines } from '@/utils/adminForm'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog.vue'
import FormField from '@/components/base/FormField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingState from '@/components/base/LoadingState.vue'

// The lessons inside one course: a numbered list, and one lesson at a time
// opens as a small form (add or edit). Saved to the `lessons` collection
// with the course's id in `courseId`.
const props = defineProps({ courseId: { type: String, required: true } })
const { showToast } = useToast()

const lessons = ref([])
const loading = ref(true)
const saving = ref(false)
const formError = ref('')
const editingId = ref(null) // null = adding a new lesson
const showForm = ref(false)
const toDelete = ref(null)

const emptyForm = () => ({ title: '', order: 1, videoUrl: '', durationMinutes: '', module: '', moduleTitle: '', words: '' })
const form = reactive(emptyForm())
const errors = ref({})

async function load() {
  loading.value = true
  try {
    lessons.value = await lessonService.listLessonsByCourse(props.courseId)
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editingId.value = null
  Object.assign(form, emptyForm(), { order: lessons.value.length + 1 })
  errors.value = {}
  showForm.value = true
}

function openEdit(lesson) {
  editingId.value = lesson.$id
  Object.assign(form, {
    title: lesson.title, order: lesson.order, videoUrl: lesson.videoUrl,
    durationMinutes: lesson.durationMinutes ?? '', module: lesson.module ?? '', moduleTitle: lesson.moduleTitle ?? '',
    words: listToLines(lesson.words),
  })
  errors.value = {}
  showForm.value = true
}

async function onSave() {
  formError.value = ''
  errors.value = onlyErrors({ title: required(form.title, 'Add a lesson title.'), videoUrl: youtubeUrl(form.videoUrl) })
  if (Object.keys(errors.value).length) return

  saving.value = true
  const numberOrNull = (v) => (v === '' || v === null ? null : Number(v))
  const payload = {
    title: form.title.trim(),
    order: Number(form.order),
    videoUrl: form.videoUrl.trim(),
    durationMinutes: numberOrNull(form.durationMinutes),
    module: numberOrNull(form.module),
    moduleTitle: form.moduleTitle.trim() || null,
    words: linesToList(form.words),
  }
  try {
    if (editingId.value) await lessonService.updateLesson(editingId.value, payload)
    else await lessonService.createLesson({ ...payload, courseId: props.courseId })
    showToast(`${payload.title} saved.`)
    showForm.value = false
    await load()
  } catch (err) {
    console.error(err)
    formError.value = 'We couldn’t save the lesson. Check your connection and try again.'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  await lessonService.deleteLesson(toDelete.value.$id)
  showToast(`${toDelete.value.title} deleted.`)
  toDelete.value = null
  await load()
}

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">
    <LoadingState v-if="loading" :rows="3" label="Loading lessons" />
    <p v-else-if="!lessons.length && !showForm" class="text-ink-muted">No lessons yet. Add the first one.</p>

    <ol v-else class="flex flex-col gap-2">
      <li v-for="lesson in lessons" :key="lesson.$id" class="flex items-center gap-3 rounded-ds border border-line p-3">
        <span class="flex h-10 w-10 flex-none items-center justify-center rounded-ds bg-surface-secondary text-sm font-semibold">{{ String(lesson.order).padStart(2, '0') }}</span>
        <span class="flex min-w-0 flex-1 flex-col">
          <span class="font-semibold">{{ lesson.title }}</span>
          <span class="truncate text-sm text-ink-muted">{{ lesson.moduleTitle ? `${lesson.moduleTitle} · ` : '' }}{{ lesson.videoUrl }}</span>
        </span>
        <button type="button" :aria-label="`Edit ${lesson.title}`" class="flex h-10 w-10 items-center justify-center rounded-ds border-2 border-ink hover:bg-ink hover:text-white" @click="openEdit(lesson)">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>
        </button>
        <button type="button" :aria-label="`Delete ${lesson.title}`" class="flex h-10 w-10 items-center justify-center rounded-ds bg-red-soft text-red hover:bg-red hover:text-white" @click="toDelete = lesson">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
        </button>
      </li>
    </ol>

    <!-- Not a <form>: it sits inside the course form, and forms can't be nested -->
    <div v-if="showForm" class="flex flex-col gap-4 rounded-ds bg-sky-soft p-5" @keydown.enter.prevent="onSave">
      <p class="font-semibold">{{ editingId ? 'Editing lesson' : 'New lesson' }}</p>
      <FormField v-model="form.title" label="Lesson title" :error="errors.title" />
      <FormField v-model="form.videoUrl" label="YouTube link" placeholder="https://youtube.com/watch?v=…" :error="errors.videoUrl" />
      <div class="grid gap-4 sm:grid-cols-3">
        <FormField v-model="form.order" label="Order" inputmode="numeric" />
        <FormField v-model="form.durationMinutes" label="Minutes" inputmode="numeric" />
        <FormField v-model="form.module" label="Module number" inputmode="numeric" />
      </div>
      <FormField v-model="form.moduleTitle" label="Module title" placeholder="Meetings" />
      <TextAreaField v-model="form.words" label="Words" :rows="3" hint="One per line: Danish | English, like “et møde | a meeting”." />
      <p v-if="formError" role="alert" class="text-sm text-red">{{ formError }}</p>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="h-12 rounded-ds border-2 border-ink bg-white px-6 font-semibold hover:bg-ink hover:text-white" @click="showForm = false">Cancel</button>
        <BaseButton :loading="saving" class="w-auto" @click="onSave">{{ editingId ? 'Save lesson' : 'Add lesson' }}</BaseButton>
      </div>
    </div>

    <button v-if="!showForm" type="button" class="h-12 self-start rounded-ds border-2 border-ink px-6 font-semibold hover:bg-ink hover:text-white" @click="openAdd">Add lesson</button>

    <AdminConfirmDialog
      :open="Boolean(toDelete)"
      :title="toDelete ? `Delete “${toDelete.title}”?` : ''"
      message="The lesson disappears from the course."
      confirm-label="Delete lesson"
      cancel-label="Keep lesson"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
