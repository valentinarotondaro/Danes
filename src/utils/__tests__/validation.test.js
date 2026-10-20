import { describe, it, expect } from 'vitest'
import { isEmail, validateSignup, validateLogin } from '../validation'

describe('isEmail', () => {
  it('needs a name, an @ and a domain', () => {
    expect(isEmail('sofia@mail.com')).toBe(true)
    expect(isEmail('sofia@example')).toBe(false)
    expect(isEmail('sofia mail.com')).toBe(false)
  })
})

describe('validateSignup', () => {
  it('returns no errors for a valid form', () => {
    expect(validateSignup({ name: 'Sofia', email: 'sofia@mail.com', password: 'hygge2026', agreed: true })).toEqual({})
  })

  it('flags every field that is wrong', () => {
    const errors = validateSignup({ name: ' ', email: 'sofia@', password: 'short', agreed: false })
    expect(Object.keys(errors)).toEqual(['name', 'email', 'password', 'agreed'])
  })
})

describe('validateLogin', () => {
  it('asks for a password', () => {
    expect(validateLogin({ email: 'sofia@mail.com', password: '' })).toEqual({ password: 'Add your password.' })
  })
})