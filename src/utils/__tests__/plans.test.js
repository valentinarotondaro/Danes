import { describe, it, expect } from 'vitest'
import { describePackage, separatePrice } from '../plans'

const packages = [
  { title: 'Events', price: 180, includesEvents: true },
  { title: 'Speaking Club', price: 250, includesSpeakingClub: true },
  { title: 'Course', price: 399, includesCourse: true },
  { title: 'Starter', price: 549, includesCourse: true, includesSpeakingClub: true },
  { title: 'Complete', price: 729, includesCourse: true, includesSpeakingClub: true, includesEvents: true },
]

describe('plans', () => {
  it('describes what a package includes', () => {
    expect(describePackage(packages[3])).toBe('One course + Speaking Club')
  })

  it('adds up the single plans a package replaces', () => {
    expect(separatePrice(packages[3], packages)).toBe(649) // 399 + 250
    expect(separatePrice(packages[4], packages)).toBe(829) // 399 + 250 + 180
  })

  it('gives a single plan its own price', () => {
    expect(separatePrice(packages[2], packages)).toBe(399)
  })
})