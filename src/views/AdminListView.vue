<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ADMIN_COLLECTIONS } from '@/components/admin/adminCollections'
import { useAdminList } from '@/composables/useAdminList'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminDataTable from '@/components/admin/AdminDataTable.vue'
import AdminCardGrid from '@/components/admin/AdminCardGrid.vue'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

// One view for every collection: /admin/courses, /admin/events…
// What changes between them lives in ADMIN_COLLECTIONS.
const route = useRoute()
const collection = route.params.collection
const config = ADMIN_COLLECTIONS[collection]

const { docs, loading, error, filterIndex, filterCounts, search, visible, deleting, load, remove } = config
  ? useAdminList(config)
  : {}

// FilterChips works with strings, so the chip value is the filter's index as text
const chipOptions = computed(() => filterCounts.value.map((f, i) => ({ value: String(i), label: `${f.label} · ${f.count}` })))
const chip = computed({
  get: () => String(filterIndex.value),
  set: (value) => (filterIndex.value = Number(value)),
})

const rows = computed(() =>
  visible.value.map((doc) => ({
    ...config.toRow(doc),
    id: doc.$id,
    editTo: { name: 'admin-edit', params: { collection, id: doc.$id } },
  }))
)
const newTo = { name: 'admin-edit', params: { collection, id: 'new' } }

// Delete flow: the bin button opens the dialog, the dialog confirms
const toDelete = ref(null)
function askDelete(id) {
  toDelete.value = docs.value.find((d) => d.$id === id)
}
async function confirmDelete() {
  if (await remove(toDelete.value)) toDelete.value = null
}

onMounted(() => config && load())
</script>

<template>
  <EmptyState v-if="!config" title="This section doesn’t exist" description="Pick one from the menu on the left." />

  <div v-else class="flex flex-col gap-6">
    <AdminPageHeader
      :crumbs="[{ label: 'Admin', to: { name: 'admin-dashboard' } }, { label: config.label }]"
      :title="config.label"
      :description="config.description"
    >
      <template #actions>
        <RouterLink :to="newTo" class="inline-flex h-12 items-center gap-2 rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
          New {{ config.singular }}
        </RouterLink>
      </template>
    </AdminPageHeader>

    <div v-if="!loading && !error && docs.length" class="flex flex-wrap items-center gap-3">
      <FilterChips v-if="chipOptions.length" v-model="chip" :options="chipOptions" :label="`Filter ${config.label.toLowerCase()}`" />
      <label class="flex h-11 min-w-0 flex-[0_1_320px] items-center gap-2 rounded-ds border-2 border-line px-4 text-ink-muted focus-within:border-ink sm:ml-auto">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input v-model="search" type="search" :aria-label="`Search ${config.label.toLowerCase()}`" :placeholder="`Search ${config.label.toLowerCase()}`" class="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" />
      </label>
    </div>

    <LoadingState v-if="loading" :rows="5" :label="`Loading ${config.label.toLowerCase()}`" />
    <ErrorState v-else-if="error" :title="error" message="Check your connection and try again. Nothing you saved was lost." @retry="load" />
    <EmptyState v-else-if="!docs.length" :title="`No ${config.label.toLowerCase()} yet`" :description="`Add the first ${config.singular} so learners can see it on the site.`">
      <RouterLink :to="newTo" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">New {{ config.singular }}</RouterLink>
    </EmptyState>
    <EmptyState v-else-if="!rows.length" title="Nothing matches" description="Try another filter or search word." />

    <template v-else>
      <AdminDataTable v-if="config.view === 'table'" :columns="config.columns" :rows="rows" @delete="askDelete" />
      <AdminCardGrid v-else :rows="rows" @delete="askDelete" />
      <p class="text-sm text-ink-muted">Showing {{ rows.length }} of {{ docs.length }}</p>
    </template>

    <AdminConfirmDialog
      :open="Boolean(toDelete)"
      :title="toDelete ? `Delete “${toDelete.title ?? toDelete.name}”?` : ''"
      :message="toDelete ? config.deleteMessage(toDelete) : ''"
      :confirm-label="`Delete ${config.singular}`"
      :cancel-label="`Keep ${config.singular}`"
      :busy="deleting"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
