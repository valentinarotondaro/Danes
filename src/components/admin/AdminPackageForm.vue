<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminForm } from '@/composables/useAdminForm'
import * as packageService from '@/services/packageService'
import { required, price } from '@/utils/adminForm'
import { separatePrice, partsOf } from '@/utils/plans'
import AdminFormShell from '@/components/admin/AdminFormShell.vue'
import AdminSection from '@/components/admin/AdminSection.vue'
import AdminVisibility from '@/components/admin/AdminVisibility.vue'
import AdminDeleteSection from '@/components/admin/AdminDeleteSection.vue'
import FormField from '@/components/base/FormField.vue'
import TextAreaField from '@/components/base/TextAreaField.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const props = defineProps({ id: { type: String, required: true } })

// What a package can include. The checkout reads these three booleans.
const PARTS = [
  { key: 'includesCourse', label: 'One course', text: 'The learner picks which one at checkout.' },
  { key: 'includesSpeakingClub', label: 'Speaking Club', text: 'Every Friday group of their level.' },
  { key: 'includesEvents', label: 'Events', text: 'Any event in any city that month.' },
]

const { isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove } = useAdminForm({
  collection: 'packages',
  id: props.id,
  defaults: () => ({ title: '', description: '', price: '', includesCourse: false, includesSpeakingClub: false, includesEvents: false, published: false }),
  fromDoc: (doc) => ({
    title: doc.title, description: doc.description ?? '', price: doc.price,
    includesCourse: Boolean(doc.includesCourse), includesSpeakingClub: Boolean(doc.includesSpeakingClub), includesEvents: Boolean(doc.includesEvents),
    published: doc.published,
  }),
  toPayload: (f) => ({ ...f, title: f.title.trim(), price: Number(f.price) }),
  validate: (f) => ({
    'package-title': required(f.title, 'Add a name.'),
    'package-parts': partsOf(f).length ? '' : 'Pick at least one thing the plan includes.',
    'package-price': price(f.price),
  }),
})

// "Bought separately: 649 kr. Learners save 100 kr." (compares with the single plans)
const allPackages = ref([])
const priceHint = computed(() => {
  if (partsOf(form).length < 2) return 'A single plan: learners pay this price for one part.'
  const separate = separatePrice(form, allPackages.value)
  if (!separate) return ''
  const saving = separate - Number(form.price || 0)
  return saving > 0 ? `Bought separately: ${separate} kr. Learners save ${saving} kr.` : `Bought separately: ${separate} kr. This price saves nothing yet.`
})

onMounted(async () => {
  load()
  allPackages.value = await packageService.listAllPackages().catch(() => [])
})
</script>

<template>
  <LoadingState v-if="loading" :rows="3" label="Loading the package" />
  <ErrorState v-else-if="loadError" :title="loadError" @retry="load" />

  <AdminFormShell
    v-else
    :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: 'Packages', to: { name: 'admin-list', params: { collection: 'packages' } } }, { label: isNew ? 'New package' : form.title }]"
    :title="isNew ? 'New package' : 'Edit package'"
    :status="isNew ? null : form.published ? { label: 'Live', tone: 'success' } : { label: 'Draft', tone: 'outline' }"
    :errors="errors"
    :save-error="saveError"
    :saving="saving"
    :save-label="isNew ? 'Create package' : 'Save package'"
    :dirty="!isNew && isDirty"
    :cancel-to="{ name: 'admin-list', params: { collection: 'packages' } }"
    @save="save"
  >
    <template #main>
      <AdminSection title="Package">
        <FormField id="package-title" v-model="form.title" label="Name" :error="errors['package-title']" hint="The checkout finds a plan by this name, like “Starter”." />
        <TextAreaField v-model="form.description" label="Description" :max="200" />
      </AdminSection>

      <AdminSection title="What’s included">
        <fieldset id="package-parts" class="flex flex-col gap-3">
          <legend class="sr-only">What’s included</legend>
          <label
            v-for="part in PARTS"
            :key="part.key"
            class="flex cursor-pointer items-start gap-3 rounded-ds p-4 ring-inset"
            :class="form[part.key] ? 'bg-sky-soft ring-2 ring-ink' : 'ring-1 ring-line'"
          >
            <input v-model="form[part.key]" type="checkbox" class="mt-1 h-[18px] w-[18px] accent-ink" />
            <span class="flex flex-col">
              <span class="font-semibold">{{ part.label }}</span>
              <span class="text-sm text-ink-muted">{{ part.text }}</span>
            </span>
          </label>
          <p v-if="errors['package-parts']" class="text-sm text-red">{{ errors['package-parts'] }}</p>
        </fieldset>
      </AdminSection>
    </template>

    <template #side>
      <AdminVisibility v-model="form.published" noun="the plan" />

      <AdminSection title="Price">
        <FormField id="package-price" v-model="form.price" label="Price per month (kr)" inputmode="numeric" :error="errors['package-price']" :hint="priceHint" />
        <p class="rounded-ds bg-sky-soft p-4 text-sm">A new price applies to new buyers. People who already bought it keep their order.</p>
      </AdminSection>

      <AdminDeleteSection
        v-if="!isNew"
        noun="package"
        :name="form.title"
        message="The plan disappears from the site and the checkout. Learners who bought it keep their order history."
        :busy="deleting"
        @confirm="remove"
      />
    </template>
  </AdminFormShell>
</template>
