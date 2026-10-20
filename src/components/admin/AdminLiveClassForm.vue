<script setup>
import { computed, onMounted } from 'vue'
import { useAdminForm } from '@/composables/useAdminForm'
import { useTeachers } from '@/composables/useTeachers'
import { required, price, wholeNumber, futureDate, toIso, fromIso, weeklyDates, linesToList, listToLines } from '@/utils/adminForm'
import { LEVEL_OPTIONS } from '@/components/admin/adminOptions'
import AdminFormShell from '@/components/admin/AdminFormShell.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminVisibility from '@/components/admin/AdminVisibility.vue'
import AdminDeleteSection from '@/components/admin/AdminDeleteSection.vue'
import FormField from '@/components/base/FormField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })
const { teachers, fetchTeachers } = useTeachers()

const { isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove } = useAdminForm({
  collection: 'liveClasses',
  id: props.id,
  defaults: () => ({
    level: 'A2', title: '', teacherId: '', date: '', time: '18:00', durationMinutes: 60, repeat: true, weeks: '4',
    capacity: 8, price: 250, topics: '', words: '', published: true, spotsBooked: 0,
  }),
  fromDoc: (doc) => ({
    level: doc.level ?? 'A2', title: doc.title, teacherId: doc.teacherId ?? '', ...fromIso(doc.dateTime),
    durationMinutes: doc.durationMinutes ?? 60, repeat: false, weeks: '1', capacity: doc.capacity, price: doc.price,
    topics: listToLines(doc.topics), words: listToLines(doc.words), published: doc.published, spotsBooked: doc.spotsBooked ?? 0,
  }),
  // A new class repeated every Friday becomes one document per week (an array),
  // so each Friday can be changed or cancelled on its own.
  toPayload: ({ date, time, repeat, weeks, topics, words, spotsBooked, ...f }) => {
    const base = {
      ...f,
      title: f.title.trim(),
      teacherId: f.teacherId || null,
      durationMinutes: Number(f.durationMinutes),
      capacity: Number(f.capacity),
      price: Number(f.price),
      topics: linesToList(topics),
      words: linesToList(words),
    }
    if (!isNew) return { ...base, dateTime: toIso(date, time) }
    return weeklyDates(date, time, repeat ? Number(weeks) : 1).map((d) => ({ ...base, dateTime: d.toISOString(), spotsBooked: 0 }))
  },
  validate: (f) => ({
    'class-title': required(f.title, 'Add the topic of the session.'),
    'class-date': isNew ? futureDate(f.date, f.time) : required(f.date, 'Pick a date.'),
    'class-seats': wholeNumber(f.capacity, Math.max(2, f.spotsBooked), `Seats must be at least ${Math.max(2, f.spotsBooked)}.`),
    'class-price': price(f.price),
  }),
})

// The summary on the right: which Fridays this form will create
const dates = computed(() => (form.date ? weeklyDates(form.date, form.time, isNew && form.repeat ? Number(form.weeks) : 1) : []))
const teacherName = computed(() => teachers.value.find((t) => t.$id === form.teacherId)?.name ?? 'No teacher')
const saveLabel = computed(() => {
  if (!isNew) return 'Save changes'
  return dates.value.length > 1 ? `Create ${dates.value.length} classes` : 'Create class'
})

onMounted(() => {
  fetchTeachers()
  load()
})
</script>

<template>
  <LoadingState v-if="loading" :rows="4" label="Loading the live class" />
  <ErrorState v-else-if="loadError" :title="loadError" @retry="load" />

  <AdminFormShell
    v-else
    :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: 'Live classes', to: { name: 'admin-list', params: { collection: 'liveClasses' } } }, { label: isNew ? 'New live class' : form.title }]"
    :title="isNew ? 'New live class' : 'Edit live class'"
    :status="isNew ? null : form.published ? { label: 'Published', tone: 'success' } : { label: 'Draft', tone: 'outline' }"
    :errors="errors"
    :save-error="saveError"
    :saving="saving"
    :save-label="saveLabel"
    :dirty="!isNew && isDirty"
    :cancel-to="{ name: 'admin-list', params: { collection: 'liveClasses' } }"
    @save="save"
  >
    <template #main>
      <AdminSection title="Group" description="A Speaking Club session: one hour on video, small group, one level.">
        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-sm font-semibold">Level</legend>
          <FilterChips v-model="form.level" :options="LEVEL_OPTIONS" label="Level" />
        </fieldset>
        <FormField id="class-title" v-model="form.title" label="Topic" placeholder="Talking about the weather" :error="errors['class-title']" :hint="`Learners see it on their booking: “${form.level} · ${form.title || 'Topic'}”.`" />
        <fieldset class="flex flex-col gap-3">
          <legend class="mb-1 text-sm font-semibold">Teacher</legend>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <label
              v-for="t in teachers"
              :key="t.$id"
              class="flex cursor-pointer items-center gap-3 rounded-ds p-3 ring-inset"
              :class="form.teacherId === t.$id ? 'bg-sky-soft ring-2 ring-ink' : 'ring-1 ring-line'"
            >
              <input v-model="form.teacherId" type="radio" name="teacher" :value="t.$id" class="h-[18px] w-[18px] flex-none accent-ink" />
              <img v-if="t.photoUrl" :src="t.photoUrl" alt="" class="h-10 w-10 flex-none rounded-full object-cover" />
              <span class="flex min-w-0 flex-col">
                <span class="font-semibold">{{ t.name }}</span>
                <span class="text-xs text-ink-muted">{{ t.city }}</span>
              </span>
            </label>
          </div>
        </fieldset>
      </AdminSection>

      <AdminSection title="When">
        <div class="grid gap-4 sm:grid-cols-3">
          <FormField id="class-date" v-model="form.date" :label="isNew ? 'First date' : 'Date'" type="date" :error="errors['class-date']" />
          <FormField v-model="form.time" label="Time" type="time" hint="Copenhagen time" />
          <FormField v-model="form.durationMinutes" label="Minutes" inputmode="numeric" />
        </div>
        <label v-if="isNew" class="flex cursor-pointer items-start gap-3 rounded-ds bg-sky-soft p-4">
          <input v-model="form.repeat" type="checkbox" class="mt-1 h-[18px] w-[18px] accent-ink" />
          <span class="flex flex-col gap-2">
            <span class="font-semibold">Repeat every week</span>
            <span class="flex flex-wrap items-center gap-2 text-sm">
              for
              <select v-model="form.weeks" aria-label="Number of weeks" :disabled="!form.repeat" class="h-9 rounded-xl border border-ink-muted bg-white px-2">
                <option v-for="n in ['2', '4', '8']" :key="n" :value="n">{{ n }} weeks</option>
              </select>
              Each week becomes its own class, so you can change one without touching the others.
            </span>
          </span>
        </label>
      </AdminSection>

      <AdminSection title="Seats and price">
        <div class="grid gap-4 sm:grid-cols-2">
          <FormField id="class-seats" v-model="form.capacity" label="Seats" inputmode="numeric" :error="errors['class-seats']" hint="Small groups talk more. 6–8 works best." />
          <FormField id="class-price" v-model="form.price" label="Single price (kr)" inputmode="numeric" :error="errors['class-price']" />
        </div>
        <p class="rounded-ds bg-surface-secondary p-4 text-sm">The video room is made automatically on Jitsi for each class. Learners can join 10 minutes before the start.</p>
      </AdminSection>

      <AdminSection title="In the session lobby" description="Optional. Shown to learners before they join.">
        <TextAreaField v-model="form.topics" label="Questions to talk about" :rows="3" hint="One per line." />
        <TextAreaField v-model="form.words" label="Words to practise" :rows="3" hint="One per line: Danish | English, like “en recept | a prescription”." />
      </AdminSection>
    </template>

    <template #side>
      <section v-if="isNew" class="flex flex-col gap-4 rounded-ds bg-surface-secondary p-6">
        <h2 class="text-2xl font-semibold leading-tight">{{ dates.length > 1 ? `This creates ${dates.length} classes` : 'This creates 1 class' }}</h2>
        <p v-if="!dates.length" class="text-sm text-ink-muted">Pick the first date to see them here.</p>
        <ul class="flex flex-col gap-2">
          <li v-for="d in dates" :key="d.toISOString()" class="flex items-center gap-3 rounded-ds bg-white p-3">
            <span class="flex h-12 w-12 flex-none flex-col items-center justify-center rounded-xl bg-sky">
              <span class="text-[11px] font-semibold uppercase">{{ d.toLocaleDateString('en-GB', { month: 'short' }) }}</span>
              <span class="text-lg font-semibold leading-none">{{ d.getDate() }}</span>
            </span>
            <span class="flex flex-col">
              <span class="text-sm font-semibold">{{ d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) }} · {{ form.time }}</span>
              <span class="text-xs text-ink-muted">{{ form.level }} · {{ teacherName }} · {{ form.capacity }} seats</span>
            </span>
          </li>
        </ul>
      </section>

      <AdminVisibility v-model="form.published" noun="the class" />

      <AdminDeleteSection
        v-if="!isNew"
        noun="live class"
        :name="form.title"
        :message="form.spotsBooked ? `${form.spotsBooked} people have a seat. The class disappears from the site and their seat with it.` : 'Nobody has booked yet. The class disappears from the site.'"
        :busy="deleting"
        @confirm="remove"
      />
    </template>
  </AdminFormShell>
</template>
