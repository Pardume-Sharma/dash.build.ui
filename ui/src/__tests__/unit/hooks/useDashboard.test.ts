import { renderHook, act, waitFor } from '@testing-library/react'
import { api } from '@/lib/api'

// Mock the API
const mockApi = api as jest.Mocked<typeof api>

// Mock dashboard hook (this would be your actual hook)
const useDashboard = (slug: string) => {
  const [dashboard, setDashboard] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const fetchDashboard = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/api/v1/dashboards/${slug}`)
      setDashboard(response.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  const updateDashboard = React.useCallback(async (updates: any) => {
    try {
      const response = await api.patch(`/api/v1/dashboards/${slug}`, updates)
      setDashboard(response.data)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    }
  }, [slug])

  const deleteDashboard = React.useCallback(async () => {
    try {
      await api.delete(`/api/v1/dashboards/${slug}`)
      setDashboard(null)
    } catch (err) {
      setError(err)
      throw err
    }
  }, [slug])

  React.useEffect(() => {
    if (slug) {
      fetchDashboard()
    }
  }, [slug, fetchDashboard])

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
    updateDashboard,
    deleteDashboard
  }
}

describe('useDashboard Hook', () => {
  const mockDashboard = {
    _id: 'dashboard-1',
    slug: 'test-dashboard',
    name: 'Test Dashboard',
    description: 'A test dashboard',
    visibility: 'private',
    createdBy: 'user-1',
    components: []
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch dashboard on mount', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    const { result } = renderHook(() => useDashboard('test-dashboard'))

    expect(result.current.loading).toBe(true)
    expect(result.current.dashboard).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApi.get).toHaveBeenCalledWith('/api/v1/dashboards/test-dashboard')
    expect(result.current.dashboard).toEqual(mockDashboard)
    expect(result.current.error).toBe(null)
  })

  it('should handle fetch errors', async () => {
    const error = new Error('Dashboard not found')
    mockApi.get.mockRejectedValue(error)

    const { result } = renderHook(() => useDashboard('nonexistent'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dashboard).toBe(null)
    expect(result.current.error).toBe(error)
  })

  it('should update dashboard', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    const updatedDashboard = {
      ...mockDashboard,
      name: 'Updated Dashboard'
    }

    mockApi.patch.mockResolvedValue({
      success: true,
      data: updatedDashboard
    })

    const { result } = renderHook(() => useDashboard('test-dashboard'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.updateDashboard({ name: 'Updated Dashboard' })
    })

    expect(mockApi.patch).toHaveBeenCalledWith(
      '/api/v1/dashboards/test-dashboard',
      { name: 'Updated Dashboard' }
    )
    expect(result.current.dashboard).toEqual(updatedDashboard)
  })

  it('should handle update errors', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    const error = new Error('Update failed')
    mockApi.patch.mockRejectedValue(error)

    const { result } = renderHook(() => useDashboard('test-dashboard'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.updateDashboard({ name: 'Failed Update' })
      })
    ).rejects.toThrow('Update failed')

    expect(result.current.error).toBe(error)
  })

  it('should delete dashboard', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    mockApi.delete.mockResolvedValue({
      success: true,
      message: 'Dashboard deleted'
    })

    const { result } = renderHook(() => useDashboard('test-dashboard'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteDashboard()
    })

    expect(mockApi.delete).toHaveBeenCalledWith('/api/v1/dashboards/test-dashboard')
    expect(result.current.dashboard).toBe(null)
  })

  it('should refetch dashboard', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    const { result } = renderHook(() => useDashboard('test-dashboard'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApi.get).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockApi.get).toHaveBeenCalledTimes(2)
  })

  it('should not fetch when slug is empty', () => {
    const { result } = renderHook(() => useDashboard(''))

    expect(result.current.loading).toBe(true)
    expect(mockApi.get).not.toHaveBeenCalled()
  })

  it('should refetch when slug changes', async () => {
    mockApi.get.mockResolvedValue({
      success: true,
      data: mockDashboard
    })

    const { result, rerender } = renderHook(
      ({ slug }) => useDashboard(slug),
      { initialProps: { slug: 'dashboard-1' } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockApi.get).toHaveBeenCalledWith('/api/v1/dashboards/dashboard-1')

    // Change slug
    rerender({ slug: 'dashboard-2' })

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/dashboards/dashboard-2')
    })

    expect(mockApi.get).toHaveBeenCalledTimes(2)
  })
})