// Pure helpers for My Account: they get documents and "now" and return what
// the page shows. No Vue and no Appwrite here, so every rule is easy to test.

import { partsOf } from '@/utils/plans'
import { sortLessons } from '@/utils/lessonPlan'
import { parsePipeList } from '@/utils/pipeList'

const isActive = (o) => o.status === 'confirmed'

// What the learner pays every month: their packages, plus courses bought on their own.
// Items that came free with a package (amount 0) are not part of the price.
export function planFromOrders(orders, packagesById, coursesById) {
  const items = []
  for (const o of orders.filter(isActive)) {
    if (o.itemType === 'bundle' && packagesById[o.itemId]) {
      items.push({ order: o, title: packagesById[o.itemId].title, price: o.amount, pkg: packagesById[o.itemId] })
    }
    if (o.itemType === 'course' && o.amount > 0) {
      items.push({ order: o, title: coursesById[o.itemId]?.title ?? 'Course', price: o.amount, pkg: { includesCourse: true } })
    }
  }
  return { items, total: items.reduce((sum, i) => sum + i.price, 0) }
}

// A plan renews every month on the day it was bought: the next of those dates after now
export function nextRenewal(boughtIso, now = new Date()) {
  const next = new Date(boughtIso)
  while (next <= now) next.setMonth(next.getMonth() + 1)
  return next
}

// If one package covers everything the learner pays for, for less money, suggest it
export function cheaperPackage(plan, packages) {
  if (plan.items.length < 2) return null
  const all = plan.items.flatMap((i) => partsOf(i.pkg))
  const parts = new Set(all)
  // A package includes ONE course: two courses can't become one package
  if (parts.size !== all.length) return null
  const match = packages
    .filter((p) => p.published && partsOf(p).length === parts.size && partsOf(p).every((k) => parts.has(k)))
    .find((p) => p.price < plan.total)
  return match ? { pkg: match, saving: plan.total - match.price } : null
}

// Progress in one course: how far, and which lesson comes next
export function courseProgress(lessons, doneIds) {
  const ordered = sortLessons(lessons)
  const done = ordered.filter((l) => doneIds.has(l.$id)).length
  const next = ordered.find((l) => !doneIds.has(l.$id)) ?? null
  return {
    total: ordered.length,
    done,
    percent: ordered.length ? Math.round((done / ordered.length) * 100) : 0,
    next,
    nextNumber: next ? ordered.indexOf(next) + 1 : null,
    finished: ordered.length > 0 && done === ordered.length,
  }
}

// Every word from the lessons the learner finished: [{ da, en }], newest lesson last
export function wordsLearned(lessons, doneIds) {
  return sortLessons(lessons.filter((l) => doneIds.has(l.$id))).flatMap((l) => parsePipeList(l.words, ['da', 'en']))
}

// Upcoming (soonest first) and past (latest first). Something counts as
// upcoming until it ENDS, so a session that's happening now stays on top.
const endsAt = (i) => new Date(i.dateTime).getTime() + (i.durationMinutes ?? 60) * 60000

export function splitByTime(items, now = new Date()) {
  const upcoming = items.filter((i) => endsAt(i) > now.getTime()).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  const past = items.filter((i) => endsAt(i) <= now.getTime()).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  return { upcoming, past }
}

// "Hej, Ahmed" + one line about the week ahead
export function weekSummary({ lessonsLeft, nextFriday, nextEvent }) {
  const parts = []
  if (lessonsLeft) parts.push(lessonsLeft === 1 ? 'one lesson to finish' : `${lessonsLeft} lessons to finish`)
  if (nextFriday) parts.push('a Friday group')
  if (nextEvent) parts.push(`${nextEvent.title} on ${new Date(nextEvent.dateTime).toLocaleDateString('en-GB', { weekday: 'long' })}`)
  if (!parts.length) return 'Pick a course, book a Friday or join an event to get started.'
  const last = parts.pop()
  return `Here’s what’s next: ${parts.length ? `${parts.join(', ')} and ${last}` : last}.`
}
