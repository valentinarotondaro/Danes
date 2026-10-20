// src/utils/lessonPlan.js
//
// Pure helpers for the lesson player: order the lessons, group them into
// modules, find the previous and next lesson and count progress.

// Module first, then the lesson's own order
export function sortLessons(lessons) {
  return [...lessons].sort((a, b) => (a.module ?? 1) - (b.module ?? 1) || a.order - b.order)
}

// [{ number, title, lessons: [...], done, minutes }]
export function groupByModule(lessons, doneIds = new Set()) {
  const groups = new Map()
  for (const lesson of sortLessons(lessons)) {
    const n = lesson.module ?? 1
    if (!groups.has(n)) groups.set(n, { number: n, title: lesson.moduleTitle || `Module ${n}`, lessons: [], done: 0, minutes: 0 })
    const group = groups.get(n)
    group.lessons.push(lesson)
    group.minutes += lesson.durationMinutes ?? 0
    if (doneIds.has(lesson.$id)) group.done += 1
  }
  return [...groups.values()]
}

// The lessons before and after the current one, in watching order
export function neighbours(lessons, currentId) {
  const list = sortLessons(lessons)
  const i = list.findIndex((l) => l.$id === currentId)
  return { prev: list[i - 1] ?? null, next: i >= 0 ? list[i + 1] ?? null : null, index: i, total: list.length }
}

export function percentDone(lessons, doneIds) {
  if (!lessons.length) return 0
  return Math.round((lessons.filter((l) => doneIds.has(l.$id)).length / lessons.length) * 100)
}

// The 11-character id from any kind of YouTube link (watch?v=, youtu.be/, /embed/, /shorts/, /live/)
export function youtubeId(url = '') {
  const match = url.match(/(?:v=|\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)
  return match ? match[1] : url.trim()
}
