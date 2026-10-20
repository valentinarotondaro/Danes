// src/utils/adminForm.js
//
// Small pure helpers the admin forms share: checks that return an error
// message (or '' when the value is fine) and converters between what an
// <input> holds and what Appwrite stores.

export const required = (value, message) => (String(value ?? '').trim() ? '' : message)

export function price(value) {
  if (value === '' || value === null) return 'Enter a price, for example 399.'
  return Number(value) >= 0 ? '' : 'The price can’t be negative.'
}

export function wholeNumber(value, min, message) {
  const n = Number(value)
  return Number.isInteger(n) && n >= min ? '' : message
}

export function futureDate(date, time, now = new Date()) {
  if (!date) return 'Pick a date.'
  return toIso(date, time) > now.toISOString() ? '' : 'Pick a date and time after now.'
}

export function youtubeUrl(value) {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(value.trim()) ? '' : 'Paste a YouTube link, like https://youtube.com/watch?v=…'
}

// Optional link: empty is fine, otherwise a full link (https://…) or a file of the site (/img/…)
export const optionalUrl = (value) => (!value.trim() || /^(https?:\/\/|\/)/.test(value.trim()) ? '' : 'Use a link (https://…) or a site path (/img/…)')

// Only the fields that have an error: { price: 'Enter a price…' }
export const onlyErrors = (errors) => Object.fromEntries(Object.entries(errors).filter(([, message]) => message))

// <input type="date"> + <input type="time"> (local time) → ISO string for Appwrite, and back
export function toIso(date, time = '00:00') {
  return new Date(`${date}T${time || '00:00'}`).toISOString()
}
export function fromIso(iso) {
  if (!iso) return { date: '', time: '' }
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }
}

// The same date and time, every week: for "Repeat every Friday".
// setDate(+7) keeps 18:00 at 18:00 even when summer time ends in between.
export function weeklyDates(date, time, weeks) {
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date(`${date}T${time || '00:00'}`)
    d.setDate(d.getDate() + i * 7)
    return d
  })
}

// Arrays like agenda or words are edited as one item per line
export const linesToList = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean)
export const listToLines = (list) => (list ?? []).join('\n')

export function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
