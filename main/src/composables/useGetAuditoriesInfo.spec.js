import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCreateAuditory, useUpdateAuditory, useDeleteAuditory } from './useGetAuditoriesInfo.js'

vi.mock('src/services/api.js', () => ({
  postResponse: vi.fn(),
  putResponse: vi.fn(),
  deleteResponse: vi.fn(),
}))

import { postResponse, putResponse, deleteResponse } from 'src/services/api.js'

describe('useGetAuditoriesInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useCreateAuditory', () => {
    it('calls postResponse with correct URL and body', async () => {
      const mockResult = { id: 10 }
      postResponse.mockResolvedValue(mockResult)

      const { createAuditory, error } = useCreateAuditory()
      const body = { auditorium_number: '101', type: 'lecture_hall' }

      const result = await createAuditory(1, 2, body)

      expect(postResponse).toHaveBeenCalledWith('/v1/cities/1/buildings/2/auditories', body)
      expect(result).toEqual(mockResult)
      expect(error.value).toBeNull()
    })

    it('sets error and rethrows on failure', async () => {
      const err = new Error('Conflict')
      postResponse.mockRejectedValue(err)

      const { createAuditory, error } = useCreateAuditory()

      await expect(createAuditory(1, 2, {})).rejects.toThrow('Conflict')
      expect(error.value).toBe(err)
    })
  })

  describe('useUpdateAuditory', () => {
    it('calls putResponse with correct URL and body', async () => {
      const mockResult = { id: 10 }
      putResponse.mockResolvedValue(mockResult)

      const { updateAuditory } = useUpdateAuditory()
      const body = { auditorium_number: '102' }

      const result = await updateAuditory(1, 2, 10, body)

      expect(putResponse).toHaveBeenCalledWith('/v1/cities/1/buildings/2/auditories/10', body)
      expect(result).toEqual(mockResult)
    })
  })

  describe('useDeleteAuditory', () => {
    it('calls deleteResponse with correct URL', async () => {
      deleteResponse.mockResolvedValue({})

      const { deleteAuditory } = useDeleteAuditory()

      await deleteAuditory(1, 2, 10)

      expect(deleteResponse).toHaveBeenCalledWith('/v1/cities/1/buildings/2/auditories/10')
    })
  })
})
