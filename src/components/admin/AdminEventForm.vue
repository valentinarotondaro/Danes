<script setup>
import { computed, onMounted } from 'vue'
import { useAdminForm } from '@/composables/useAdminForm'
import { useTeachers } from '@/composables/useTeachers'
import { required, price, wholeNumber, futureDate, optionalUrl, toIso, fromIso, linesToList, listToLines } from '@/utils/adminForm'
import { CITIES } from '@/components/admin/adminOptions'
import AdminFormShell from '@/components/admin/AdminFormShell.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminVisibility from '@/components/admin/AdminVisibility.vue'
import AdminDeleteSection from '@/components/admin/AdminDeleteSection.vue'
import FormField from '@/components/base/FormField.vue'
import SelectField from '@/components/base/SelectField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })

const { teachers, fetchTeachers } = useTeachers()
const teacherOptions = computed(() => teachers.value.map((t) => ({ value: t.$id, label: t.name })))

const { isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove } = useAdminForm({
  collection: 'events',
  id: props.id,
  defaults: () => ({
    title: '', description: '', city: 'Copenhagen', location: '', meetingPoint: '', date: '', time: '15:00', durationMinutes: 120,
    capacity: 15, price: 180, imageUrl: '', teacherId: '', agenda: '', words: '', published: false, spotsBooked: 0,
  }),
  fromDoc: (doc) => ({
    title: doc.title, description: doc.description ?? '', city: doc.city ?? 'Copenhagen', location: doc.location, meetingPoint: doc.meetingPoint ?? '',
    ...fromIso(doc.dateTime), durationMinutes: doc.durationMinutes ?? '', capacity: doc.capacity, price: doc.price ?? 0,
    imageUrl: doc.imageUrl ?? '', teacherId: doc.teacherId ?? '', agenda: listToLines(doc.agenda), words: listToLines(doc.words),
    published: doc.published, spotsBooked: doc.spotsBooked ?? 0,
  }),
  // spotsBooked is only set to 0 on a new event: after that only the reserve-spot function changes it
  toPayload: ({ date, time, agenda, words, spotsBooked, ...f }) => ({
    ...f,
    ...(isNew ? { spotsBooked: 0 } : {}),
    title: f.title.trim(),
    dateTime: toIso(date, time),
    durationMinutes: f.durationMinutes === '' ? null : Number(f.durationMinutes),
    capacity: Number(f.capacity),
    price: Number(f.price),
    teacherId: f.teacherId || null,
    agenda: linesToList(agenda),
    words: linesToList(words),
  }),
  validate: (f) => ({
    'event-title': required(f.title, 'Add a title.'),
    'event-location': required(f.location, 'Add where it happens.'),
    // An event that already happened can keep its date; a new one must be in the future
    'event-date': isNew ? futureDate(f.date, f.time) : required(f.date, 'Pick a date.'),
    'event-spots': wholeNumber(f.capacity, Math.max(1, f.spotsBooked), `Spots must be at least ${Math.max(1, f.spotsBooked)} (people already going).`),
    'event-price': price(f.price),
    'event-image': optionalUrl(f.imageUrl),
  }),
})

// The little preview card, like on the site
const preview = computed(() => {
  const d = form.date ? new Date(`${form.date}T${form.time || '00:00'}`) : null
  return {
    month: d ? d.toLocaleDateString('en-GB', { month: 'short' }) : '—',
    day: d ? d.getDate() : '',
    meta: [form.city, form.time, `${form.capacity} spots`].filter(Boolean).join(' · '),
  }
})

onMounted(() => {
  fetchTeachers()
  load()
})
</script>

<template>
  <LoadingState v-if="loading" :rows="4" label="Loading the event" />
  <ErrorState v-else-if="loadError" :title="loadError" @retry="load" />

  <AdminFormShell
    v-else
    :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: 'Events', to: { name: 'admin-list', params: { collection: 'events' } } }, { label: isNew ? 'New event' : form.title }]"
    :title="isNew ? 'New event' : 'Edit event'"
    :status="isNew ? null : form.published ? { label: 'Published', tone: 'success' } : { label: 'Draft', tone: 'outline' }"
    :errors="errors"
    :save-error="saveError"
    :saving="saving"
    :save-label="isNew ? 'Create event' : 'Save changes'"
    :dirty="!isNew && isDirty"
    :cancel-to="{ name: 'admin-list', params: { collection: 'events' } }"
    @save="save"
  >
    <template #main>
      <AdminSection title="What">
        <FormField id="event-title" v-model="form.title" label="Title" :error="errors['event-title']" />
        <TextAreaField v-model="form.description" label="Description" :max="300" />
      </AdminSection>

      <AdminSection title="When and where">
        <div class="grid gap-4 sm:grid-cols-2">
          <SelectField v-model="form.city" label="City" :options="CITIES" />
          <FormField id="event-location" v-model="form.location" label="Place" placeholder="Den Gamle By" :error="errors['event-location']" />
        </div>
        <FormField v-model="form.meetingPoint" label="Meeting point" placeholder="Main gate" hint="Optional. Where the group meets." />
        <div class="grid gap-4 sm:grid-cols-3">
          <FormField id="event-date" v-model="form.date" label="Date" type="date" :error="errors['event-date']" />
          <FormField v-model="form.time" label="Start time" type="time" />
          <FormField v-model="form.durationMinutes" label="Minutes" inputmode="numeric" />
        </div>
      </AdminSection>

      <AdminSection title="Spots and price">
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField id="event-spots" v-model="form.capacity" label="Spots" inputmode="numeric" :error="errors['event-spots']" :hint="`${form.spotsBooked} going now. When it fills up, people can join a waitlist.`" />
          <FormField id="event-price" v-model="form.price" label="Price (kr)" inputmode="numeric" :error="errors['event-price']" hint="Free for Social and Complete members." />
        </div>
      </AdminSection>

      <AdminSection title="On the event page" description="All optional. A section only shows on the site when it has something in it.">
        <SelectField v-model="form.teacherId" label="Host" :options="teacherOptions" placeholder="No host" />
        <TextAreaField v-model="form.agenda" label="Agenda" :rows="4" hint="One step per line: time | what | note, like “09:30 | Meet at the gate | Look for the red flag”." />
        <TextAreaField v-model="form.words" label="Words to practise" :rows="3" hint="One per line: Danish | English, like “et æbleskive | a pancake ball”." />
      </AdminSection>
    </template>

    <template #side>
      <AdminVisibility v-model="form.published" noun="the event" />

      <AdminSection title="Photo">
        <img v-if="form.imageUrl && !errors['event-image']" :src="form.imageUrl" alt="Photo preview" class="aspect-[4/3] w-full rounded-ds object-cover" />
        <FormField id="event-image" v-model="form.imageUrl" label="Photo link" placeholder="https://…" :error="errors['event-image']" hint="Optional. Without a photo the card shows the date." />
      </AdminSection>

      <section class="flex flex-col gap-3 rounded-ds bg-surface-secondary p-6">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-ink-muted">On the site</h2>
        <div class="flex items-center gap-4 rounded-ds bg-white p-4">
          <span class="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-ds bg-sky">
            <span class="text-xs font-semibold uppercase">{{ preview.month }}</span>
            <span class="text-xl font-semibold leading-none">{{ preview.day }}</span>
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="font-semibold">{{ form.title || 'Event title' }}</span>
            <span class="text-sm text-ink-muted">{{ preview.meta }}</span>
          </span>
        </div>
      </section>

      <AdminDeleteSection
        v-if="!isNew"
        noun="event"
        :name="form.title"
        :message="form.spotsBooked ? `${form.spotsBooked} people are going. The event disappears from the site and their spot with it.` : 'Nobody is going yet. The event disappears from the site.'"
        :busy="deleting"
        @confirm="remove"
      />
    </template>
  </AdminFormShell>
</template>
