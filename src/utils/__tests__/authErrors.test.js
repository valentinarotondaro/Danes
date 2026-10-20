import { describe, it, expect } from 'vitest'
import { loginErrorMessage, signupErrorMessage } from '../authErrors'

describe('loginErrorMessage', () => {
  it('explains wrong credentials and rate limits', () => {
    expect(loginErrorMessage({ code: 401 })).toMatch(/email and password/)
    expect(loginErrorMessage({ code: 429 })).toMatch(/Too many tries/)
  })
})

describe('signupErrorMessage', () => {
  it('marks the email field when the account exists', () => {
    expect(signupErrorMessage({ code: 409 }).field).toBe('email')
  })

  it('falls back to the banner for unknown errors', () => {
    expect(signupErrorMessage(new Error('offline')).field).toBe(null)
  })
})