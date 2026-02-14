import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCreateCamera, useUpdateCamera, useDeleteCamera } from './useGetCamerasInfo.js'

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

describe('useGetCamerasInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateCamera', () => {
    it('calls postResponse with correct URL and body', async () => {
      const mockResult = { id: 3 }
      postResponse.mockResolvedValue(mockResult)

      const { createCamera, error } = useCreateCamera()
      const body = { mac: 'AA:BB:CC:DD:EE:FF' }

      const result = await createCamera(body)

      expect(postResponse).toHaveBeenCalledWith('/v1/cameras', body)
      expect(result).toEqual(mockResult)
      expect(error.value).toBeNull()
    })

    it('sets error and rethrows on failure', async () => {
      const err = new Error('Conflict')
      postResponse.mockRejectedValue(err)

      const { createCamera, error } = useCreateCamera()

      await expect(createCamera({ mac: '00:00:00:00:00:00' })).rejects.toThrow('Conflict')
      expect(error.value).toBe(err)
    })
  })

  describe('useUpdateCamera', () => {
    it('calls putResponse with correct URL and body', async () => {
      const mockResult = { id: 3 }
      putResponse.mockResolvedValue(mockResult)

      const { updateCamera } = useUpdateCamera()
      const body = { mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.1.1' }

      const result = await updateCamera(3, body)

      expect(putResponse).toHaveBeenCalledWith('/v1/cameras/3', body)
      expect(result).toEqual(mockResult)
    })
  })

  describe('useDeleteCamera', () => {
    it('calls deleteResponse with correct URL including confirm param', async () => {
      deleteResponse.mockResolvedValue({})

      const { deleteCamera } = useDeleteCamera()

      await deleteCamera(3)

      expect(deleteResponse).toHaveBeenCalledWith('/v1/cameras/3?confirm=true')
    })
  })
})
