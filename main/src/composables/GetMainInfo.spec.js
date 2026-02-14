import { describe, it, expect } from 'vitest'
import { getRoomTypesInfo, getLocalizedTypeLabel } from './GetMainInfo.js'

describe('GetMainInfo', () => {
  describe('getRoomTypesInfo', () => {
    it('returns room types for ru-RU and en-US', () => {
      const result = getRoomTypesInfo()
      expect(result['ru-RU']).toHaveLength(3)
      expect(result['en-US']).toHaveLength(3)
      expect(result['ru-RU'][0]).toEqual({ label: 'Лекционная', value: 'lecture_hall' })
      expect(result['en-US'][0]).toEqual({ label: 'Lecture room', value: 'lecture_hall' })
    })
  })

  describe('getLocalizedTypeLabel', () => {
    it('returns label by value for en-US', () => {
      expect(getLocalizedTypeLabel('lecture_hall', 'en-US')).toBe('Lecture room')
      expect(getLocalizedTypeLabel('classroom', 'en-US')).toBe('Classroom')
      expect(getLocalizedTypeLabel('coworking', 'en-US')).toBe('Coworking')
    })

    it('returns label by value for ru-RU', () => {
      expect(getLocalizedTypeLabel('lecture_hall', 'ru-RU')).toBe('Лекционная')
      expect(getLocalizedTypeLabel('classroom', 'ru-RU')).toBe('Семинарская')
    })

    it('returns type as fallback for unknown type', () => {
      expect(getLocalizedTypeLabel('unknown_type', 'en-US')).toBe('unknown_type')
    })
  })
})
