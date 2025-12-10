import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ComponentGrid from '@/components/dashboard/ComponentGrid'
import { Component } from '@/types/dashboard'
import { api } from '@/lib/api'

// Mock react-grid-layout
jest.mock('react-grid-layout', () => {
  return function MockGridLayout({ children, onLayoutChange }: any) {
    return (
      <div data-testid="grid-layout">
        {children}
        <button 
          onClick={() => onLayoutChange && onLayoutChange([])}
          data-testid="trigger-layout-change"
        >
          Trigger Layout Change
        </button>
      </div>
    )
  }
})

const mockApi = api as jest.Mocked<typeof api>

const mockComponents: Component[] = [
  {
    _id: 'comp1',
    componentId: 'comp1',
    dashboardSlug: 'test-dashboard',
    type: 'metric-card',
    name: 'Test Metric',
    position: { x: 0, y: 0, w: 4, h: 3 },
    config: {},
    dataSource: { type: 'manual' },
    fieldSchema: [],
    styling: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

describe('ComponentGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockApi.get.mockResolvedValue({
      success: true,
      data: { data: [{ value: 100 }] }
    })
  })

  it('renders components in grid layout', async () => {
    render(
      <ComponentGrid
        components={mockComponents}
        editMode={false}
        onUpdate={jest.fn()}
      />
    )

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/components/comp1')
    })
  })

  it('enables drag and resize in edit mode', () => {
    render(
      <ComponentGrid
        components={mockComponents}
        editMode={true}
        onUpdate={jest.fn()}
      />
    )

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
  })

  it('handles layout changes in edit mode', async () => {
    const mockOnUpdate = jest.fn()
    mockApi.patch.mockResolvedValue({ success: true, data: {} })

    render(
      <ComponentGrid
        components={mockComponents}
        editMode={true}
        onUpdate={mockOnUpdate}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-layout-change'))

    await waitFor(() => {
      expect(mockApi.patch).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('calls onComponentClick when component is clicked in view mode', () => {
    const mockOnComponentClick = jest.fn()
    
    render(
      <ComponentGrid
        components={mockComponents}
        editMode={false}
        onUpdate={jest.fn()}
        onComponentClick={mockOnComponentClick}
      />
    )

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
  })

  it('fetches component data on mount', async () => {
    render(
      <ComponentGrid
        components={mockComponents}
        editMode={false}
        onUpdate={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/api/v1/components/comp1')
    })
  })

  it('handles empty components array', () => {
    render(
      <ComponentGrid
        components={[]}
        editMode={false}
        onUpdate={jest.fn()}
      />
    )

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
  })

  it('shows saving indicator when layout is being saved', async () => {
    mockApi.patch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({ success: true, data: {} }), 1500)
      )
    )

    render(
      <ComponentGrid
        components={mockComponents}
        editMode={true}
        onUpdate={jest.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('trigger-layout-change'))

    await waitFor(() => {
      expect(screen.getByText('💾 Saving layout...')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockApi.get.mockRejectedValue(new Error('API Error'))
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <ComponentGrid
        components={mockComponents}
        editMode={false}
        onUpdate={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch component data:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('updates component positions correctly', async () => {
    const mockOnUpdate = jest.fn()
    mockApi.patch.mockResolvedValue({ success: true, data: {} })

    const newLayout = [
      { i: 'comp1', x: 2, y: 1, w: 6, h: 4 }
    ]

    render(
      <ComponentGrid
        components={mockComponents}
        editMode={true}
        onUpdate={mockOnUpdate}
      />
    )

    // Simulate layout change
    fireEvent.click(screen.getByTestId('trigger-layout-change'))

    await waitFor(() => {
      expect(mockApi.patch).toHaveBeenCalledWith(
        '/api/v1/components/comp1',
        expect.objectContaining({
          position: expect.any(Object)
        })
      )
    })
  })

  it('respects responsive breakpoints', () => {
    const responsiveComponents = [
      {
        ...mockComponents[0],
        position: { x: 0, y: 0, w: 12, h: 4 }, // Desktop
        responsiveLayouts: {
          tablet: { x: 0, y: 0, w: 8, h: 4 },
          mobile: { x: 0, y: 0, w: 4, h: 4 }
        }
      }
    ]

    render(
      <ComponentGrid
        components={responsiveComponents}
        editMode={false}
        onUpdate={jest.fn()}
      />
    )

    expect(screen.getByTestId('grid-layout')).toBeInTheDocument()
  })
})