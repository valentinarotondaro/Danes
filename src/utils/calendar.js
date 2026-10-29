// Builds a .ics file: the standard format every calendar app understands
// (Google Calendar, Outlook, Apple Calendar).

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '') // 20261024T150000Z
const escapeText = (s = '') => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')

export function buildIcs({ uid, title, start, durationMinutes = 45, description = '' }) {
  const begin = new Date(start)
  const end = new Date(begin.getTime() + durationMinutes * 60000)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DANES//Speaking Club//EN',
    'BEGIN:VEVENT',
    `UID:${uid}@danes.dk`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(begin)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeText(title)}`,
    description && `DESCRIPTION:${escapeText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

// Makes the browser download a text file (no server needed)
export function downloadFile(filename, text, type = 'text/calendar') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}