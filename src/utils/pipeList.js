// Appwrite has no "list of objects" field, so a list like the event's agenda
// is saved as strings with | between the parts:
//   ['09:30 | Meet at Store Torv | Name tags and hellos', ...]
// parsePipeList(list, ['time', 'what', 'note']) turns that into
//   [{ time: '09:30', what: 'Meet at Store Torv', note: 'Name tags and hellos' }, ...]

export function parsePipeList(list, keys) {
  return (list ?? [])
    .filter((line) => line && line.trim())
    .map((line) => {
      const parts = line.split('|').map((part) => part.trim())
      return Object.fromEntries(keys.map((key, i) => [key, parts[i] ?? '']))
    })
}