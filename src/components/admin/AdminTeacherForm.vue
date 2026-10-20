<script setup>
import { onMounted } from 'vue'
import { useAdminForm } from '@/composables/useAdminForm'
import { required, optionalUrl } from '@/utils/adminForm'
import { CITIES } from '@/components/admin/adminOptions'
import AdminFormShell from '@/components/admin/AdminFormShell.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminDeleteSection from '@/components/admin/AdminDeleteSection.vue'
import FormField from '@/components/base/FormField.vue'
import SelectField from '@/components/base/SelectField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })

const { isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove } = useAdminForm({
  collection: 'teachers',
  id: props.id,
  defaults: () => ({ name: '', city: 'Copenhagen', specialty: '', bio: '', photoUrl: '' }),
  fromDoc: (doc) => ({ name: doc.name, city: doc.city ?? '', specialty: doc.specialty ?? '', bio: doc.bio ?? '', photoUrl: doc.photoUrl ?? '' }),
  toPayload: (f) => ({ ...f, name: f.name.trim() }),
  validate: (f) => ({
    'teacher-name': required(f.name, 'Add a name.'),
    'teacher-photo': optionalUrl(f.photoUrl),
  }),
})

onMounted(load)
</script>

<template>
  <LoadingState v-if="loading" :rows="3" label="Loading the teacher" />
  <ErrorState v-else-if="loadError" :title="loadError" @retry="load" />

  <AdminFormShell
    v-else
    :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: 'Teachers', to: { name: 'admin-list', params: { collection: 'teachers' } } }, { label: isNew ? 'New teacher' : form.name }]"
    :title="isNew ? 'New teacher' : 'Edit teacher'"
    :errors="errors"
    :save-error="saveError"
    :saving="saving"
    :save-label="isNew ? 'Add teacher' : 'Save changes'"
    :dirty="!isNew && isDirty"
    :cancel-to="{ name: 'admin-list', params: { collection: 'teachers' } }"
    @save="save"
  >
    <template #main>
      <AdminSection title="About">
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField id="teacher-name" v-model="form.name" label="Name" :error="errors['teacher-name']" />
          <SelectField v-model="form.city" label="City" :options="CITIES" />
        </div>
        <FormField v-model="form.specialty" label="What they teach" placeholder="Danish for work · Friday A2 group" />
        <TextAreaField v-model="form.bio" label="Short bio" :max="160" hint="Shown on the About page." />
      </AdminSection>
    </template>

    <template #side>
      <AdminSection title="Photo">
        <img v-if="form.photoUrl && !errors['teacher-photo']" :src="form.photoUrl" :alt="`Photo of ${form.name}`" class="mx-auto h-40 w-40 rounded-full object-cover" />
        <FormField id="teacher-photo" v-model="form.photoUrl" label="Photo link" placeholder="https://…" :error="errors['teacher-photo']" hint="Square photo works best." />
      </AdminSection>

      <AdminDeleteSection
        v-if="!isNew"
        noun="teacher"
        :name="form.name"
        message="Courses, classes and events that use this teacher will show no teacher until you pick another one."
        :busy="deleting"
        @confirm="remove"
      />
    </template>
  </AdminFormShell>
</template>
