import { describe, it, expect, beforeEach } from 'vitest'
import {
  useGlobalState,
  getTheme,
  setTheme,
  getLastBuildingId,
  setLastBuildingId,
  clearLastBuildingId,
} from './GlobalState.js'

describe('GlobalState', () => {
  beforeEach(() => {
    localStorage.clear()
    setTheme(false)
    clearLastBuildingId(1)
    clearLastBuildingId(2)
  })

  describe('useGlobalState', () => {
    it('returns globalState, initialGlobalState and storageKey', () => {
      const { globalState, initialGlobalState, storageKey } = useGlobalState()
      expect(globalState).toBeDefined()
      expect(initialGlobalState).toEqual({
        theme: 'light',
        language: 'en-US',
        lastBuildingId: [],
      })
      expect(storageKey.value).toBe('global-storage-for-user')
    })
  })

  describe('getTheme / setTheme', () => {
    it('returns light by default', () => {
      expect(getTheme()).toBe('light')
    })

    it('sets dark when truthy, light when falsy', () => {
      setTheme(true)
      expect(getTheme()).toBe('dark')
      setTheme(false)
      expect(getTheme()).toBe('light')
    })
  })

  describe('getLastBuildingId / setLastBuildingId / clearLastBuildingId', () => {
    it('returns null when no cityId or not found', () => {
      expect(getLastBuildingId(null)).toBeNull()
      expect(getLastBuildingId(1)).toBeNull()
    })

    it('stores and retrieves last building by city', () => {
      setLastBuildingId(1, 10)
      expect(getLastBuildingId(1)).toBe(10)
      setLastBuildingId(2, 20)
      expect(getLastBuildingId(2)).toBe(20)
    })

    it('updates existing city building', () => {
      setLastBuildingId(1, 10)
      setLastBuildingId(1, 15)
      expect(getLastBuildingId(1)).toBe(15)
    })

    it('clearLastBuildingId removes city entry', () => {
      setLastBuildingId(1, 10)
      clearLastBuildingId(1)
      expect(getLastBuildingId(1)).toBeNull()
    })

    it('setLastBuildingId does nothing with invalid args', () => {
      setLastBuildingId(null, 10)
      setLastBuildingId(1, null)
      expect(getLastBuildingId(1)).toBeNull()
    })
  })
})
