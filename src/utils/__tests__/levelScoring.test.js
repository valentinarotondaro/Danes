import { describe, it, expect } from 'vitest'
import { calculateLevel, questionPoints } from '../levelScoring'
import { QUESTIONS } from '@/components/levelTest/levelTestContent'

// Helper: every question answered the same way
const allCorrect = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q.kind === 'self' ? q.options.at(-1).id : q.answer])
)
const allSkipped = Object.fromEntries(QUESTIONS.map((q) => [q.id, 'skip']))

describe('levelScoring', () => {
  it('gives 0 points for "I don’t know yet" and for a wrong answer', () => {
    const q = QUESTIONS.find((x) => x.id === 'q3')
    expect(questionPoints(q, 'skip')).toBe(0)
    expect(questionPoints(q, 'er')).toBe(0)
    expect(questionPoints(q, 'bor')).toBe(1)
  })

  it('places someone who skips everything at A1', () => {
    expect(calculateLevel(QUESTIONS, allSkipped)).toBe('A1')
  })

  it('places someone who gets everything right at B1', () => {
    expect(calculateLevel(QUESTIONS, allCorrect)).toBe('B1')
  })

  it('places a middle result at A2', () => {
    // Says "simple conversations", gets the A1 and A2 questions right, skips B1
    const answers = { ...allSkipped, q1: 'talk', q2: 'phone', q3: 'bor', q4: 'hedder', q5: 'var', q6: 'hjaelpe', q7: 'fordi', q9: 'tue930', q10: 'call' }
    expect(calculateLevel(QUESTIONS, answers)).toBe('A2')
  })
})