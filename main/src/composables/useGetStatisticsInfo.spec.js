import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useStatisticsByDay } from './useGetStatisticsInfo.js'

vi.mock('./useFetch.js', () => ({
  loadFromUrl: vi.fn(),
}))

import { loadFromUrl } from './useFetch.js'

describe('useGetStatisticsInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useStatisticsByDay', () => {
    it('builds correct URL for type 1 (day) and loads data', async () => {
      const mockData = [{ hour: 9, avg_person_count: 5, min_person_count: 2, max_person_count: 10 }]
      loadFromUrl.mockResolvedValue(mockData)

      const requestParams = ref({
        cityId: 1,
        buildingId: 2,
        auditoryId: 3,
        date: '2026/02/07',
        type: 1,
        statisticsType: 'hourly',
      })

      const { statisticsByDay, refetch } = useStatisticsByDay(requestParams, {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(loadFromUrl).toHaveBeenCalledWith(
        expect.stringContaining('/v1/cities/1/buildings/2/auditories/3/statistics/hourly?'),
        { loading: false, notify: false },
      )
      expect(loadFromUrl.mock.calls[0][0]).toMatch(/type=1&day=2026-02-07/)
      expect(statisticsByDay.value).toHaveLength(1)
      expect(statisticsByDay.value[0]).toMatchObject({
        time: '9:00 - 10:00',
        average: 5,
        min: 2,
        max: 10,
      })
    })

    it('builds URL with detail=true when detail param set', async () => {
      loadFromUrl.mockResolvedValue([])

      const requestParams = ref({
        cityId: 1,
        buildingId: 2,
        auditoryId: 3,
        date: '2026/02/07',
        type: 1,
        statisticsType: 'hourly',
        detail: true,
      })

      const { refetch } = useStatisticsByDay(requestParams, {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(loadFromUrl).toHaveBeenCalledWith(expect.stringMatching(/detail=true/), {
        loading: false,
        notify: false,
      })
    })

    it('maps detail format with days array correctly', async () => {
      const mockData = [
        {
          hour: 10,
          days: [
            {
              day: '2026-02-07T00:00:00Z',
              avg_person_count: 3,
              min_person_count: 1,
              max_person_count: 5,
            },
          ],
        },
      ]
      loadFromUrl.mockResolvedValue(mockData)

      const requestParams = ref({
        cityId: 1,
        buildingId: 2,
        auditoryId: 3,
        date: '2026/02/07',
        type: 1,
        statisticsType: 'hourly',
      })

      const { statisticsByDay, refetch } = useStatisticsByDay(requestParams, {
        loading: false,
        notify: false,
      })

      await refetch()

      expect(statisticsByDay.value[0].time).toBe('10:00 - 11:00')
      expect(statisticsByDay.value[0].days).toHaveLength(1)
      expect(statisticsByDay.value[0].days[0]).toMatchObject({
        average: 3,
        min: 1,
        max: 5,
        dayLabel: '07-02-2026',
      })
    })
  })
})
