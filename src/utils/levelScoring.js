// Pure function: answers in, level out. No Vue, no Appwrite, so it is easy
// to test and to explain.
//
// answers: { q1: 'talk', q3: 'bor', q4: 'skip', ... }

export function questionPoints(question, answerId) {
  if (!answerId || answerId === 'skip') return 0
  if (question.kind === 'self') {
    return question.options.find((o) => o.id === answerId)?.points ?? 0
  }
  return answerId === question.answer ? question.weight : 0
}

export function maxPoints(question) {
  if (question.kind === 'self') return Math.max(...question.options.map((o) => o.points))
  return question.weight
}

// Below 35% of the possible points → A1, below 70% → A2, otherwise B1
export function calculateLevel(questions, answers) {
  const earned = questions.reduce((sum, q) => sum + questionPoints(q, answers[q.id]), 0)
  const possible = questions.reduce((sum, q) => sum + maxPoints(q), 0)
  const share = possible ? earned / possible : 0
  if (share < 0.35) return 'A1'
  if (share < 0.7) return 'A2'
  return 'B1'
}