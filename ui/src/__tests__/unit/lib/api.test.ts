import { api } from '@/lib/api'

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('API Library', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 1, name: 'Test' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      const result = await api.get('/test-endpoint')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' }
      })
    })

    it('should handle GET request errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({
          success: false,
          error: { message: 'Not found' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      await expect(api.get('/nonexistent')).rejects.toThrow('Not found')
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          success: true,
          data: { id: 1, name: 'Created' }
        })
      }
      mockFetch.mockResolvedValue(mockResponse as any)

      const payload = { name: 'Test Item' }
      const result = await api.post('/test-endpoint', payload)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(payload)
        })
      )
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Created' }
      })
    })
  })
})