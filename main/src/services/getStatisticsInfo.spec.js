import { describe, it, expect } from 'vitest'
import { getReportTypes, getStatisticsTypes } from './getStatisticsInfo.js'

describe('getStatisticsInfo', () => {
  describe('getReportTypes', () => {
    it('returns 4 report types with correct structure', () => {
      const result = getReportTypes()
      expect(result).toHaveLength(4)
      expect(result).toEqual([
        { labelName: 'statisticsFilters.day', value: 1 },
        { labelName: 'statisticsFilters.month', value: 3 },
        { labelName: 'statisticsFilters.year', value: 4 },
        { labelName: 'statisticsFilters.period', value: 2 },
      ])
    })
  })

  describe('getStatisticsTypes', () => {
    it('returns 2 statistics types with correct structure', () => {
      const result = getStatisticsTypes()
      expect(result).toHaveLength(2)
      expect(result).toEqual([
        { labelName: 'statisticsFilters.hourly', value: 'hourly' },
        { labelName: 'statisticsFilters.pairs', value: 'pairs' },
      ])
    })
  })
})
