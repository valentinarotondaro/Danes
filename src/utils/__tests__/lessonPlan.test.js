import { describe, it, expect } from 'vitest'
import { groupByModule, neighbours, percentDone, youtubeId } from '../lessonPlan'

const lessons = [
  { $id: 'c', module: 2, moduleTitle: 'At the office', order: 1, durationMinutes: 9 },
  { $id: 'a', module: 1, moduleTitle: 'Starting', order: 1, durationMinutes: 5 },
  { $id: 'b', module: 1, moduleTitle: 'Starting', order: 2, durationMinutes: 7 },
]

describe('lessonPlan', () => {
  it('groups lessons into modules, in order, and counts what is done', () => {
    const modules = groupByModule(lessons, new Set(['a']))
    expect(modules.map((m) => m.title)).toEqual(['Starting', 'At the office'])
    expect(modules[0]).toMatchObject({ done: 1, minutes: 12 })
    expect(modules[0].lessons.map((l) => l.$id)).toEqual(['a', 'b'])
  })

  it('finds the previous and next lesson across modules', () => {
    const { prev, next, index } = neighbours(lessons, 'b')
    expect([prev.$id, next.$id, index]).toEqual(['a', 'c', 1])
    expect(neighbours(lessons, 'c').next).toBe(null)
  })

  it('turns done lessons into a percentage', () => {
    expect(percentDone(lessons, new Set(['a']))).toBe(33)
    expect(percentDone([], new Set())).toBe(0)
  })

  it('reads the video id from every kind of YouTube link', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://youtu.be/dQw4w9WgXcQ?si=x')).toBe('dQw4w9WgXcQ')
    expect(youtubeId('https://youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
})
