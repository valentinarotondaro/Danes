// Where a session is in time. Pure functions (no Vue), so they're easy to test.
//   upcoming → more than 10 min before start
//   open     → the room unlocks 10 min before start
//   live     → started, not finished
//   ended    → after start + duration

export const ROOM_OPENS_MINUTES = 10

export function getSessionTiming(startIso, durationMinutes = 45, now = new Date()) {
  const start = new Date(startIso).getTime()
  const end = start + durationMinutes * 60000
  const opens = start - ROOM_OPENS_MINUTES * 60000
  const t = now.getTime()

  let state = 'upcoming'
  if (t >= end) state = 'ended'
  else if (t >= start) state = 'live'
  else if (t >= opens) state = 'open'

  return {
    state,
    minutesToStart: Math.ceil((start - t) / 60000),
    canJoin: state === 'open' || state === 'live',
  }
}

// "Starts in 8 minutes", "Starts in 3 hours", "Happening now"…
export function timingLabel({ state, minutesToStart }) {
  if (state === 'ended') return 'This session has ended'
  if (state === 'live') return 'Happening now'
  if (minutesToStart <= 1) return 'Starts in 1 minute'
  if (minutesToStart < 60) return `Starts in ${minutesToStart} minutes`
  const hours = Math.floor(minutesToStart / 60)
  if (hours < 24) return hours === 1 ? 'Starts in 1 hour' : `Starts in ${hours} hours`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Starts tomorrow' : `Starts in ${days} days`
}