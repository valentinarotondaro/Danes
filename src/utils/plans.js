// Small pure helpers for packages (the `bundles` collection).
// A package says what it includes with three booleans:
// includesCourse, includesSpeakingClub, includesEvents.

const PARTS = [
  { key: 'includesCourse', label: 'One course' },
  { key: 'includesSpeakingClub', label: 'Speaking Club' },
  { key: 'includesEvents', label: 'Events' },
]

// The parts a package includes, e.g. ['includesCourse', 'includesSpeakingClub']
export function partsOf(pkg) {
  return PARTS.filter((part) => pkg[part.key]).map((part) => part.key)
}

// "One course + Speaking Club"
export function describePackage(pkg) {
  return PARTS.filter((part) => pkg[part.key]).map((part) => part.label).join(' + ')
}

// What the same things cost bought one by one: the sum of the single plans
// (the packages that include only one part). Starter = Course + Speaking Club.
export function separatePrice(pkg, packages) {
  return partsOf(pkg).reduce((sum, key) => {
    const single = packages.find((p) => partsOf(p).length === 1 && p[key])
    return sum + (single ? single.price : 0)
  }, 0)
}

// The same day next month, as "20 November"
export function nextPaymentDate(from = new Date()) {
  const next = new Date(from)
  next.setMonth(next.getMonth() + 1)
  return next.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}