<script setup>
import AdminSection from '@/components/admin/AdminSection.vue'

// Published or draft, as two clear options instead of one small checkbox.
// v-model is the document's `published` boolean.
const published = defineModel({ type: Boolean, default: false })
defineProps({ noun: { type: String, default: 'it' } })
</script>

<template>
  <AdminSection title="Visibility">
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-1 text-sm font-semibold">Who can see {{ noun }}</legend>
      <label
        v-for="option in [{ value: true, title: 'Published', text: 'Visible on the site.' }, { value: false, title: 'Draft', text: 'Only admins can see it.' }]"
        :key="option.title"
        class="flex cursor-pointer items-start gap-3 rounded-ds p-4 ring-inset"
        :class="published === option.value ? 'bg-sky-soft ring-2 ring-ink' : 'ring-1 ring-line'"
      >
        <input type="radio" :checked="published === option.value" name="published" class="mt-1 h-[18px] w-[18px] accent-ink" @change="published = option.value" />
        <span class="flex flex-col">
          <span class="font-semibold">{{ option.title }}</span>
          <span class="text-sm text-ink-muted">{{ option.text }}</span>
        </span>
      </label>
    </fieldset>
  </AdminSection>
</template>
