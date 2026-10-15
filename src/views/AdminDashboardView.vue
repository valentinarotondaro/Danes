<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import * as courseService from '@/services/courseService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import * as packageService from '@/services/packageService'
import * as teacherService from '@/services/teacherService'
import AdminTable from '@/components/admin/AdminTable.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()

const tabs = [
  {
    key: 'courses',
    label: 'Courses',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'price', label: 'Price (DKK)' },
      { key: 'published', label: 'Published' },
    ],
    list: courseService.listAllCourses,
    remove: courseService.deleteCourse,
  },
  {
    key: 'liveClasses',
    label: 'Live Classes',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'dateTime', label: 'Date' },
      { key: 'capacity', label: 'Capacity' },
      { key: 'published', label: 'Published' },
    ],
    list: liveClassService.listAllLiveClasses,
    remove: liveClassService.deleteLiveClass,
  },
  {
    key: 'events',
    label: 'Events',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'location', label: 'Location' },
      { key: 'dateTime', label: 'Date' },
      { key: 'published', label: 'Published' },
    ],
    list: eventService.listAllEvents,
    remove: eventService.deleteEvent,
  },
  {
    key: 'packages',
    label: 'Packages',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'price', label: 'Price (DKK)' },
      { key: 'published', label: 'Published' },
    ],
    list: packageService.listAllPackages,
    remove: packageService.deletePackage,
  },
  {
    key: 'teachers',
    label: 'Teachers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'specialty', label: 'Specialty' },
    ],
    list: teacherService.listTeachers,
    remove: teacherService.deleteTeacher,
  },
]

const activeTabKey = ref('courses')
const activeTab = computed(() => tabs.find((t) => t.key === activeTabKey.value))

const rows = ref([])
const loading = ref(false)
const error = ref(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    rows.value = await activeTab.value.list()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function onDelete(row) {
  if (!confirm(`Delete "${row.title}"? This can't be undone.`)) return
  await activeTab.value.remove(row.$id)
  await load()
}

watch(activeTabKey, load)
onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-12">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl text-neutral-900">Admin</h1>
      <RouterLink :to="{ name: 'admin-edit', params: { collection: activeTabKey } }">
        <BaseButton class="w-auto px-4">New {{ activeTab.label.replace(/s$/, '') }}</BaseButton>
      </RouterLink>
    </div>

    <div class="mt-6 flex gap-1 border-b border-neutral-200">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTabKey = tab.key"
        class="px-4 py-2 text-sm"
        :class="activeTabKey === tab.key
          ? 'border-b-2 border-[#C8102E] font-medium text-neutral-900'
          : 'text-neutral-500 hover:text-neutral-900'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="mt-6">
      <LoadingState v-if="loading" />
      <ErrorState v-else-if="error" :message="error" @retry="load" />
      <EmptyState v-else-if="rows.length === 0" title="Nothing here yet" description="Create the first one." />
      <AdminTable
        v-else
        :rows="rows"
        :columns="activeTab.columns"
        @edit="(row) => router.push({ name: 'admin-edit', params: { collection: activeTabKey, id: row.$id } })"
        @delete="onDelete"
      />
    </div>
  </section>
</template>
