import { describe, it, expect } from 'vitest'
import { parsePipeList } from '../pipeList'

describe('parsePipeList', () => {
  it('splits each line into named parts and trims spaces', () => {
    expect(parsePipeList(['09:30 | Meet | Say hej'], ['time', 'what', 'note'])).toEqual([
      { time: '09:30', what: 'Meet', note: 'Say hej' },
    ])
  })

  it('fills missing parts with an empty string and skips empty lines', () => {
    expect(parsePipeList(['tak', ''], ['da', 'en'])).toEqual([{ da: 'tak', en: '' }])
  })

  it('returns an empty list when the field is missing', () => {
    expect(parsePipeList(undefined, ['da', 'en'])).toEqual([])
  })
})