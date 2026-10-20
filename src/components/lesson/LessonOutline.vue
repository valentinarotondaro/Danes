<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// "Course content": the modules as an accordion. The module of the current
// lesson starts open; done lessons get a green ✓.
const props = defineProps({
  courseId: { type: String, required: true },
  modules: { type: Array, required: true },
  currentId: { type: String, required: true },
  doneIds: { type: Set, required: true },
})

const openModules = ref(new Set(props.modules.filter((m) => m.lessons.some((l) => l.$id === props.currentId)).map((m) => m.number)))
function toggle(n) {
  const next = new Set(openModules.value)
  next.has(n) ? next.delete(n) : next.add(n)
  openModules.value = next
}
const total = () => props.modules.reduce((sum, m) => sum + m.lessons.length, 0)
</script>

<template>
  <section aria-labelledby="outline-title" class="overflow-hidden rounded-ds border border-line">
    <div class="flex flex-col gap-1 px-5 pb-4 pt-5">
      <h2 id="outline-title" class="text-2xl font-semibold leading-tight">Course content</h2>
      <span class="text-sm text-ink-muted">{{ modules.length }} {{ modules.length === 1 ? 'module' : 'modules' }} · {{ total() }} lessons · {{ doneIds.size }} done</span>
    </div>
    <div v-for="m in modules" :key="m.number" class="border-t border-line">
      <button
        type="button"
        :aria-expanded="openModules.has(m.number)"
        class="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-secondary"
        @click="toggle(m.number)"
      >
        <span class="flex flex-1 flex-col">
          <span class="font-semibold">{{ m.number }} · {{ m.title }}</span>
          <span class="text-sm text-ink-muted">{{ m.lessons.length }} lessons{{ m.minutes ? ` · ${m.minutes} min` : '' }}{{ m.done === m.lessons.length ? ' · done' : '' }}</span>
        </span>
        <span aria-hidden="true" class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sky transition-transform" :class="openModules.has(m.number) ? 'rotate-180' : ''">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </button>
      <ol v-if="openModules.has(m.number)" class="pb-2">
        <li v-for="(l, i) in m.lessons" :key="l.$id">
          <RouterLink
            :to="{ name: 'lesson', params: { courseId, lessonId: l.$id } }"
            :aria-current="l.$id === currentId ? 'step' : undefined"
            class="flex items-center gap-3 px-5 py-3 text-ink no-underline hover:bg-surface-secondary"
            :class="l.$id === currentId ? 'bg-sky-soft font-semibold shadow-[inset_3px_0_0_var(--color-red)]' : ''"
          >
            <span v-if="doneIds.has(l.$id)" class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-success-soft text-success">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
              <span class="sr-only">Done:</span>
            </span>
            <span
              v-else
              aria-hidden="true"
              class="flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold ring-2 ring-inset"
              :class="l.$id === currentId ? 'ring-red' : 'ring-line'"
            >{{ i + 1 }}</span>
            <span class="min-w-0 flex-1 text-sm">{{ l.title }}</span>
            <span v-if="l.durationMinutes" class="text-xs font-normal text-ink-muted">{{ l.durationMinutes }} min</span>
          </RouterLink>
        </li>
      </ol>
    </div>
  </section>
</template>
