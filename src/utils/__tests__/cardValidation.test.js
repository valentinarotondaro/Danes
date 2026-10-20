import { describe, it, expect } from 'vitest'
import { validateCard } from '../cardValidation'

const today = new Date('2026-10-20')
const good = { name: 'Ahmed Karim', number: '4242 4242 4242 4242', expiry: '09 / 28', cvc: '123' }

describe('validateCard', () => {
  it('accepts a complete card', () => {
    expect(validateCard(good, today)).toEqual({})
  })

  it('asks for every empty field', () => {
    const errors = validateCard({ name: '', number: '', expiry: '', cvc: '' }, today)
    expect(Object.keys(errors)).toEqual(['name', 'number', 'expiry', 'cvc'])
  })

  it('refuses a card that expired last month', () => {
    const errors = validateCard({ ...good, expiry: '09 / 26' }, today)
    expect(errors.expiry).toContain('expired')
  })

  it('still accepts a card in its last month', () => {
    expect(validateCard({ ...good, expiry: '10/26' }, today)).toEqual({})
  })
})