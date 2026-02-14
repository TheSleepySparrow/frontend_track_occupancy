import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  useCreateBuilding,
  useUpdateBuilding,
  useDeleteBuilding,
  getBuildingAuditories,
} from './useGetBuildingsInfo.js'

vi.mock('src/services/api.js', () => ({
  postResponse: vi.fn(),
  putResponse: vi.fn(),
  deleteResponse: vi.fn(),
}))

vi.mock('./useFetch.js', () => ({
  useFetchList: vi.fn(() => ({
    data: { value: [] },
    error: { value: null },
    refetch: vi.fn(),
  })),
  loadFromUrl: vi.fn(),
}))

import { postResponse, putResponse, deleteResponse } from 'src/services/api.js'
import { loadFromUrl } from './useFetch.js'

describe('useGetBuildingsInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateBuilding', () => {
    it('calls postResponse with correct URL and body', async () => {
      const mockResult = { id: 7 }
      postResponse.mockResolvedValue(mockResult)

      const { createBuilding, error } = useCreateBuilding()
      const body = { address_ru: 'ул. Ленина 1', address_en: 'Lenina St 1', floor_count: 3 }

      const result = await createBuilding(5, body)

      expect(postResponse).toHaveBeenCalledWith('/v1/cities/5/buildings', body)
      expect(result).toEqual(mockResult)
      expect(error.value).toBeNull()
    })

    it('sets error and rethrows on failure', async () => {
      const err = new Error('Conflict')
      postResponse.mockRejectedValue(err)

      const { createBuilding, error } = useCreateBuilding()

      await expect(createBuilding(5, {})).rejects.toThrow('Conflict')
      expect(error.value).toBe(err)
    })
  })

  describe('useUpdateBuilding', () => {
    it('calls putResponse with correct URL and body', async () => {
      const mockResult = { id: 7 }
      putResponse.mockResolvedValue(mockResult)

      const { updateBuilding } = useUpdateBuilding()
      const body = { address_ru: 'ул. Ленина 2', address_en: 'Lenina St 2', floor_count: 4 }

      const result = await updateBuilding(5, 7, body)

      expect(putResponse).toHaveBeenCalledWith('/v1/cities/5/buildings/7', body)
      expect(result).toEqual(mockResult)
    })
  })

  describe('useDeleteBuilding', () => {
    it('calls deleteResponse with correct URL', async () => {
      deleteResponse.mockResolvedValue({})

      const { deleteBuilding } = useDeleteBuilding()

      await deleteBuilding(5, 7)

      expect(deleteResponse).toHaveBeenCalledWith('/v1/cities/5/buildings/7')
    })
  })

  describe('getBuildingAuditories', () => {
    it('calls loadFromUrl with correct URL and returns array', async () => {
      const mockAuditories = [{ id: 1 }, { id: 2 }]
      loadFromUrl.mockResolvedValue(mockAuditories)

      const result = await getBuildingAuditories(5, 7)

      expect(loadFromUrl).toHaveBeenCalledWith('/v1/cities/5/buildings/7/auditories/', {
        loading: false,
        notify: false,
      })
      expect(result).toEqual(mockAuditories)
    })

    it('returns empty array on error', async () => {
      loadFromUrl.mockRejectedValue(new Error('Network error'))

      const result = await getBuildingAuditories(5, 7)

      expect(result).toEqual([])
    })
  })
})
