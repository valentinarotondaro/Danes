// The dashboard numbers, as pure functions: they get the documents and
// "now" and return a value. Nothing is stored, so a number can never be
// out of date, and every function is easy to test.

const PAID = 'confirmed'

const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const sameDay = (a, b) => sameMonth(a, b) && a.getDate() === b.getDate()

// The four key numbers at the top of the dashboard
export function keyNumbers({ orders, liveClasses }, now = new Date()) {
  const paid = orders.filter((o) => o.status === PAID)
  const thisMonth = paid.filter((o) => sameMonth(new Date(o.createdAt), now))
  const today = paid.filter((o) => sameDay(new Date(o.createdAt), now))

  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const thisWeek = liveClasses.filter((c) => new Date(c.dateTime) >= now && new Date(c.dateTime) < weekEnd)

  return {
    payingLearners: new Set(paid.map((o) => o.userId)).size,
    revenue: thisMonth.reduce((sum, o) => sum + o.amount, 0),
    ordersThisMonth: thisMonth.length,
    ordersToday: today.length,
    seatsBooked: thisWeek.reduce((sum, c) => sum + (c.spotsBooked ?? 0), 0),
    seatsTotal: thisWeek.reduce((sum, c) => sum + c.capacity, 0),
    groupsThisWeek: thisWeek.length,
  }
}

// How many people wait for each item: { itemId: count }
export function waitlistCounts(orders) {
  return orders
    .filter((o) => o.status === 'waitlist')
    .reduce((counts, o) => ({ ...counts, [o.itemId]: (counts[o.itemId] ?? 0) + 1 }), {})
}

// Things an admin should look at: full events and sessions, and drafts.
// (No check for video rooms: the Jitsi room is made from the session id.)
export function needsAttention({ courses, events, liveClasses, orders }, now = new Date()) {
  const waiting = waitlistCounts(orders)
  const upcoming = (doc) => new Date(doc.dateTime) >= now
  const full = (doc) => (doc.spotsBooked ?? 0) >= doc.capacity
  const items = []

  for (const e of events.filter((e) => e.published && upcoming(e) && full(e))) {
    const extra = waiting[e.$id] ? ` · ${waiting[e.$id]} on the waitlist` : ''
    items.push({ tone: 'red', title: `${e.title} is full`, meta: `${e.city ?? 'Event'}${extra}`, action: 'Open event', to: { collection: 'events', id: e.$id } })
  }
  for (const c of liveClasses.filter((c) => c.published && upcoming(c) && full(c))) {
    const extra = waiting[c.$id] ? ` · ${waiting[c.$id]} on the waitlist` : ''
    items.push({ tone: 'red', title: `${c.title} is full`, meta: `Speaking Club${extra}`, action: 'Open class', to: { collection: 'liveClasses', id: c.$id } })
  }
  for (const c of courses.filter((c) => !c.published)) {
    items.push({ tone: 'sky', title: `${c.title} is still a draft`, meta: 'Course · not on the site yet', action: 'Finish course', to: { collection: 'courses', id: c.$id } })
  }
  return items
}

// The next sessions and events, mixed and sorted by date
export function comingUp({ events, liveClasses }, now = new Date(), limit = 4) {
  return [
    ...events.map((doc) => ({ ...doc, kind: 'event' })),
    ...liveClasses.map((doc) => ({ ...doc, kind: 'liveClass' })),
  ]
    .filter((doc) => doc.published && new Date(doc.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, limit)
}
