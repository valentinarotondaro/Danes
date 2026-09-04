<script setup>
import CourseCard from './CourseCard.vue'

defineProps({
  courses: { type: Array, required: true },
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <CourseCard v-for="course in courses" :key="course.$id" :course="course" />
  </div>
</template>
