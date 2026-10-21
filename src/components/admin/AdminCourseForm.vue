<script setup>
import { computed, onMounted } from 'vue'
import { useAdminForm } from '@/composables/useAdminForm'
import { useTeachers } from '@/composables/useTeachers'
import { required, price, optionalUrl, youtubeUrl, slugify } from '@/utils/adminForm'
import { LEVEL_OPTIONS } from '@/components/admin/adminOptions'
import AdminFormShell from '@/components/admin/AdminFormShell.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminVisibility from '@/components/admin/AdminVisibility.vue'
import AdminDeleteSection from '@/components/admin/AdminDeleteSection.vue'
import AdminLessonManager from '@/components/admin/AdminLessonManager.vue'
import LessonVideo from '@/components/lesson/LessonVideo.vue'
import FormField from '@/components/base/FormField.vue'
import SelectField from '@/components/base/SelectField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })

const { teachers, fetchTeachers } = useTeachers()
const teacherOptions = computed(() => teachers.value.map((t) => ({ value: t.$id, label: t.city ? `${t.name} · ${t.city}` : t.name })))

const { isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove } = useAdminForm({
  collection: 'courses',
  id: props.id,
  editAfterCreate: true, // lessons can only be added once the course exists
  defaults: () => ({ title: '', slug: '', description: '', level: '', teacherId: '', price: 399, thumbnailUrl: '', introVideoUrl: '', published: false, journeyTag: '' }),
  fromDoc: (doc) => ({
    title: doc.title, slug: doc.slug, description: doc.description ?? '', level: doc.level ?? '', teacherId: doc.teacherId ?? '',
    price: doc.price, thumbnailUrl: doc.thumbnailUrl ?? '', introVideoUrl: doc.introVideoUrl ?? '', published: doc.published, journeyTag: doc.journeyTag ?? '',
  }),
  toPayload: (f) => ({
    ...f,
    title: f.title.trim(),
    slug: f.slug || slugify(f.title), // the web address, made from the title the first time
    price: Number(f.price),
    level: f.level || null, // '' is not a valid level for Appwrite
    teacherId: f.teacherId || null,
    introVideoUrl: f.introVideoUrl.trim() || null,
  }),
  validate: (f) => ({
    'course-title': required(f.title, 'Add a title.'),
    'course-price': price(f.price),
    'course-image': optionalUrl(f.thumbnailUrl),
    // Optional, but when there is one it has to be YouTube (the page embeds it)
    'course-intro': f.introVideoUrl.trim() ? youtubeUrl(f.introVideoUrl) : '',
  }),
})

onMounted(() => {
  fetchTeachers()
  load()
})
</script>

<template>
  <LoadingState v-if="loading" :rows="4" label="Loading the course" />
  <ErrorState v-else-if="loadError" :title="loadError" @retry="load" />

  <AdminFormShell
    v-else
    :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: 'Courses', to: { name: 'admin-list', params: { collection: 'courses' } } }, { label: isNew ? 'New course' : form.title }]"
    :title="isNew ? 'New course' : 'Edit course'"
    :status="isNew ? null : form.published ? { label: 'Published', tone: 'success' } : { label: 'Draft', tone: 'outline' }"
    :errors="errors"
    :save-error="saveError"
    :saving="saving"
    :save-label="isNew ? 'Create course' : 'Save changes'"
    :dirty="!isNew && isDirty"
    :cancel-to="{ name: 'admin-list', params: { collection: 'courses' } }"
    @save="save"
  >
    <template #main>
      <AdminSection title="Details">
        <FormField id="course-title" v-model="form.title" label="Title" :error="errors['course-title']" />
        <TextAreaField v-model="form.description" label="Short description" :max="160" hint="Shown on the course card." />
        <div class="grid gap-4 sm:grid-cols-2">
          <SelectField v-model="form.level" label="Level" :options="LEVEL_OPTIONS" placeholder="All levels" />
          <SelectField v-model="form.teacherId" label="Teacher" :options="teacherOptions" placeholder="No teacher yet" />
        </div>
      </AdminSection>

      <AdminSection title="Intro video" description="The teacher presents the course: what learners will do and where they’ll be at the end. Shown on the course page, before buying.">
        <LessonVideo v-if="form.introVideoUrl && !errors['course-intro'] && !youtubeUrl(form.introVideoUrl)" :url="form.introVideoUrl" title="Intro video preview" />
        <FormField id="course-intro" v-model="form.introVideoUrl" label="YouTube link" placeholder="https://youtube.com/watch?v=…" :error="errors['course-intro']" hint="Optional. 1–3 minutes works best." />
      </AdminSection>

      <AdminSection v-if="!isNew" title="Lessons" description="Recorded YouTube lessons, in the order learners watch them.">
        <AdminLessonManager :course-id="id" />
      </AdminSection>
      <p v-else class="rounded-ds bg-sky-soft p-4 text-sm">Create the course first. Then you can add its lessons here.</p>
    </template>

    <template #side>
      <AdminVisibility v-model="form.published" noun="the course" />

      <AdminSection title="Price">
        <FormField id="course-price" v-model="form.price" label="Price per month (kr)" inputmode="numeric" :error="errors['course-price']" hint="Also included in the Starter and Complete packages." />
      </AdminSection>

      <AdminSection title="Cover image">
        <img v-if="form.thumbnailUrl && !errors['course-image']" :src="form.thumbnailUrl" alt="Cover preview" class="aspect-[4/3] w-full rounded-ds object-cover" />
        <FormField id="course-image" v-model="form.thumbnailUrl" label="Image link" placeholder="https://…" :error="errors['course-image']" hint="Landscape photo. Paste a link to the image." />
      </AdminSection>

      <AdminDeleteSection
        v-if="!isNew"
        noun="course"
        :name="form.title"
        message="The course and its lessons disappear from the site. Learners who bought it keep their order history."
        :busy="deleting"
        @confirm="remove"
      />
    </template>
  </AdminFormShell>
</template>
