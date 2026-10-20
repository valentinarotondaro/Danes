<script setup>
import { RouterLink } from 'vue-router'
import StatusTag from '@/components/admin/StatusTag.vue'

// The frame of every admin form: a sticky bar with Cancel / Save (always in
// reach, even at the bottom of a long form), the error summary,
// and two columns (main fields on the left, settings on the right).
// The fields themselves come in through the `main` and `side` slots.
const props = defineProps({
  crumbs: { type: Array, required: true },
  title: { type: String, required: true },
  status: { type: Object, default: null }, // { label, tone }
  errors: { type: Object, default: () => ({}) }, // { fieldId: 'message' }
  saveError: { type: String, default: '' },
  saving: { type: Boolean, default: false },
  saveLabel: { type: String, default: 'Save changes' },
  dirty: { type: Boolean, default: false },
  cancelTo: { type: Object, required: true },
})
defineEmits(['save'])

const count = () => Object.keys(props.errors).length
</script>

<template>
  <form novalidate class="flex flex-col gap-6" @submit.prevent="$emit('save')">
    <!-- Sticky action bar: breadcrumb on the left, actions on the right, one line -->
    <div class="sticky top-0 z-20 -mx-4 -mt-6 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:-mx-10 sm:-mt-8 sm:px-10">
      <nav aria-label="Breadcrumb" class="hidden min-w-0 truncate text-sm text-ink-muted sm:block">
        <template v-for="(crumb, i) in crumbs" :key="crumb.label">
          <span v-if="i > 0" aria-hidden="true"> / </span>
          <RouterLink v-if="crumb.to" :to="crumb.to" class="text-ink-muted no-underline hover:text-red">{{ crumb.label }}</RouterLink>
          <span v-else aria-current="page" class="font-semibold text-ink">{{ crumb.label }}</span>
        </template>
      </nav>
      <div class="ml-auto flex flex-none items-center gap-3">
        <span v-if="dirty" class="hidden items-center gap-2 text-sm text-ink-muted md:flex">
          <span aria-hidden="true" class="h-2 w-2 rounded-full bg-red" />Unsaved changes
        </span>
        <RouterLink :to="cancelTo" class="inline-flex h-10 items-center whitespace-nowrap rounded-ds border-2 border-ink px-4 text-sm font-semibold text-ink no-underline hover:bg-ink hover:text-white">
          Cancel
        </RouterLink>
        <button
          type="submit"
          :disabled="saving"
          :aria-busy="saving ? 'true' : undefined"
          class="inline-flex h-10 items-center whitespace-nowrap rounded-ds bg-red px-5 text-sm font-semibold text-white hover:bg-red-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50"
        >
          {{ saving ? 'Saving…' : saveLabel }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <h1 class="text-[32px] font-semibold leading-tight">{{ title }}</h1>
      <StatusTag v-if="status" v-bind="status" />
    </div>

    <!-- One box that lists every problem, each a link that jumps to its field -->
    <div v-if="count()" role="alert" class="flex items-start gap-4 rounded-ds bg-red-soft px-5 py-4">
      <svg aria-hidden="true" class="mt-0.5 flex-none text-red" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
      <div class="flex flex-col gap-1">
        <p class="font-semibold text-red">{{ count() === 1 ? '1 field needs' : `${count()} fields need` }} fixing before you can save</p>
        <ul class="flex flex-col gap-1 text-sm">
          <li v-for="(message, field) in errors" :key="field"><a :href="`#${field}`" class="text-ink">{{ message }}</a></li>
        </ul>
      </div>
    </div>
    <p v-if="saveError" role="alert" class="rounded-ds bg-red-soft px-5 py-4 text-red">{{ saveError }}</p>

    <div class="flex flex-wrap items-start gap-6">
      <div class="flex min-w-0 flex-[2_1_520px] flex-col gap-6"><slot name="main" /></div>
      <div class="flex min-w-0 flex-[1_1_300px] flex-col gap-6"><slot name="side" /></div>
    </div>
  </form>
</template>
