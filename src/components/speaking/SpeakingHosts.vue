<script setup>
import { computed, onMounted } from 'vue'
import { useTeachers } from '@/composables/useTeachers'

// Hosts are the teachers in Appwrite, so an admin can add one without touching code
const { teachers, fetchTeachers } = useTeachers()
onMounted(fetchTeachers)

// The grid has as many columns as hosts (max 3), so 2 hosts never leave a gap
const gridCols = computed(() =>
  ['md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3'][Math.min(teachers.value.length, 3) - 1]
)
</script>

<template>
  <!-- No teachers yet (or they failed to load): hide the whole section -->
  <section v-if="teachers.length" id="hosts" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Meet your hosts</h2>
      <p class="text-ink-muted">Native speakers who keep the talk going, slow down when you need it and never put you on the spot.</p>
    </div>
    <div class="grid grid-cols-1 gap-6" :class="gridCols">
      <article v-for="(teacher, i) in teachers" :key="teacher.$id" class="flex flex-col gap-4 rounded-ds bg-surface-secondary p-6">
        <div class="flex items-center gap-4">
          <img v-if="teacher.photoUrl" :src="teacher.photoUrl" :alt="teacher.name" class="h-16 w-16 flex-none rounded-full object-cover" />
          <span
            v-else
            aria-hidden="true"
            class="flex h-16 w-16 flex-none items-center justify-center rounded-full text-2xl font-semibold"
            :class="i % 2 === 0 ? 'bg-red text-white' : 'bg-sky text-ink'"
          >{{ teacher.name[0] }}</span>
          <span class="flex flex-col">
            <span class="text-2xl font-semibold leading-tight text-ink">{{ teacher.name }}</span>
            <span v-if="teacher.specialty || teacher.city" class="text-sm text-ink-muted">{{ teacher.specialty || teacher.city }}</span>
          </span>
        </div>
        <p v-if="teacher.bio" class="text-ink">{{ teacher.bio }}</p>
      </article>
    </div>
  </section>
</template>