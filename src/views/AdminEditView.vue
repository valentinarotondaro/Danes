<script setup>
import { useRoute } from 'vue-router'
import AdminCourseForm from '@/components/admin/AdminCourseForm.vue'
import AdminLiveClassForm from '@/components/admin/AdminLiveClassForm.vue'
import AdminEventForm from '@/components/admin/AdminEventForm.vue'
import AdminPackageForm from '@/components/admin/AdminPackageForm.vue'
import AdminTeacherForm from '@/components/admin/AdminTeacherForm.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const route = useRoute()
const { collection, id } = route.params

const forms = {
  courses: AdminCourseForm,
  liveClasses: AdminLiveClassForm,
  events: AdminEventForm,
  packages: AdminPackageForm,
  teachers: AdminTeacherForm,
}
</script>

<template>
  <section class="mx-auto max-w-xl px-6 py-12">
    <component :is="forms[collection]" v-if="forms[collection]" :id="id ?? null" />
    <EmptyState
      v-else
      title="Not built yet"
      :description="`Admin management for '${collection}' comes in a later phase.`"
    />
  </section>
</template>
