<script setup>
import { useRoute } from 'vue-router'
import AdminCourseForm from '@/components/admin/AdminCourseForm.vue'
import AdminLiveClassForm from '@/components/admin/AdminLiveClassForm.vue'
import AdminEventForm from '@/components/admin/AdminEventForm.vue'
import AdminPackageForm from '@/components/admin/AdminPackageForm.vue'
import AdminTeacherForm from '@/components/admin/AdminTeacherForm.vue'
import EmptyState from '@/components/base/EmptyState.vue'

// /admin/:collection/:id → the right form. id is 'new' when creating.
const route = useRoute()
const { collection, id } = route.params

const FORMS = {
  courses: AdminCourseForm,
  liveClasses: AdminLiveClassForm,
  events: AdminEventForm,
  packages: AdminPackageForm,
  teachers: AdminTeacherForm,
}
</script>

<template>
  <component :is="FORMS[collection]" v-if="FORMS[collection]" :id="id" />
  <EmptyState v-else title="This section doesn’t exist" description="Pick one from the menu on the left." />
</template>
