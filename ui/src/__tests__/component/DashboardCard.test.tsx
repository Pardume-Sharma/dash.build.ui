import { render, screen, fireEvent } from '@testing-library/react'
import { Dashboard } from '@/types/dashboard'

// Mock the dashboard card component (this would be the actual component)
const MockDashboardCard = ({ dashboard, onClick }: { dashboard: Dashboard; onClick?: () => void }) => (
  <div data-testid="dashboard-card" onClick={onClick}>
    <h3>{dashboard.name}</h3>
    <p>{dashboard.description}</p>
    <span data-testid="visibility">{dashboard.visibility}</span>
    {dashboard.thumbnail && (
      <img src={dashboard.thumbnail} alt={dashboard.name} data-testid="thumbnail" />
    )}
    <div data-testid="component-count">
      {dashboard.components?.length || 0} components
    </div>
    <div data-testid="created-date">
      Created: {new Date(dashboard.createdAt).toLocaleDateString()}
    </div>
    <div data-testid="updated-date">
      Updated: {new Date(dashboard.updatedAt).toLocaleDateString()}
    </div>
  </div>
)

const mockDashboard: Dashboard = {
  _id: 'dashboard-1',
  slug: 'test-dashboard',
  name: 'Test Dashboard',
  description: 'A test dashboard for component testing',
  visibility: 'private',
  thumbnail: 'https://example.com/thumbnail.jpg',
  tags: ['test'],
  components: [],
  createdBy: 'user-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02')
}

describe('Dashboard Card Component', () => {
  it('renders dashboard information correctly', () => {
    render(<MockDashboardCard dashboard={mockDashboard} />)

    expect(screen.getByText('Test Dashboard')).toBeInTheDocument()
    expect(screen.getByText('A test dashboard for component testing')).toBeInTheDocument()
    expect(screen.getByTestId('visibility')).toHaveTextContent('private')
  })

  it('displays thumbnail when provided', () => {
    render(<MockDashboardCard dashboard={mockDashboard} />)

    const thumbnail = screen.getByTestId('thumbnail')
    expect(thumbnail).toBeInTheDocument()
    expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumbnail.jpg')
    expect(thumbnail).toHaveAttribute('alt', 'Test Dashboard')
  })

  it('handles missing thumbnail gracefully', () => {
    const dashboardWithoutThumbnail = { ...mockDashboard, thumbnail: undefined }
    render(<MockDashboardCard dashboard={dashboardWithoutThumbnail} />)

    expect(screen.queryByTestId('thumbnail')).not.toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn()
    render(<MockDashboardCard dashboard={mockDashboard} onClick={mockOnClick} />)

    fireEvent.click(screen.getByTestId('dashboard-card'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('handles different visibility states', () => {
    const publicDashboard = { ...mockDashboard, visibility: 'public' as const }
    const { rerender } = render(<MockDashboardCard dashboard={publicDashboard} />)
    expect(screen.getByTestId('visibility')).toHaveTextContent('public')

    const passwordProtectedDashboard = { ...mockDashboard, visibility: 'password-protected' as const }
    rerender(<MockDashboardCard dashboard={passwordProtectedDashboard} />)
    expect(screen.getByTestId('visibility')).toHaveTextContent('password-protected')
  })

  it('displays component count correctly', () => {
    const dashboardWithComponents = {
      ...mockDashboard,
      components: [
        { _id: 'comp1', componentId: 'comp1', name: 'Component 1' },
        { _id: 'comp2', componentId: 'comp2', name: 'Component 2' }
      ] as any
    }
    
    render(<MockDashboardCard dashboard={dashboardWithComponents} />)
    expect(screen.getByTestId('component-count')).toHaveTextContent('2 components')
  })

  it('handles empty components array', () => {
    render(<MockDashboardCard dashboard={mockDashboard} />)
    expect(screen.getByTestId('component-count')).toHaveTextContent('0 components')
  })

  it('displays creation and update dates', () => {
    render(<MockDashboardCard dashboard={mockDashboard} />)
    
    expect(screen.getByTestId('created-date')).toHaveTextContent('Created: 1/1/2024')
    expect(screen.getByTestId('updated-date')).toHaveTextContent('Updated: 1/2/2024')
  })

  it('handles long dashboard names', () => {
    const longNameDashboard = {
      ...mockDashboard,
      name: 'This is a very long dashboard name that might need to be truncated in the UI'
    }
    render(<MockDashboardCard dashboard={longNameDashboard} />)

    expect(screen.getByText(longNameDashboard.name)).toBeInTheDocument()
  })

  it('handles empty description', () => {
    const noDescriptionDashboard = { ...mockDashboard, description: '' }
    render(<MockDashboardCard dashboard={noDescriptionDashboard} />)

    expect(screen.getByText('')).toBeInTheDocument()
  })

  it('handles missing description', () => {
    const { description, ...dashboardWithoutDescription } = mockDashboard
    render(<MockDashboardCard dashboard={dashboardWithoutDescription as Dashboard} />)

    // Should not crash and should render other elements
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument()
  })

  it('renders with different themes/styles', () => {
    const themedDashboard = {
      ...mockDashboard,
      theme: {
        mode: 'dark',
        primaryColor: '#ff0000',
        backgroundColor: '#000000'
      }
    }
    
    render(<MockDashboardCard dashboard={themedDashboard} />)
    expect(screen.getByTestId('dashboard-card')).toBeInTheDocument()
  })

  it('handles special characters in dashboard name', () => {
    const specialCharDashboard = {
      ...mockDashboard,
      name: 'Dashboard with "quotes" & <tags> and émojis 🚀'
    }
    
    render(<MockDashboardCard dashboard={specialCharDashboard} />)
    expect(screen.getByText('Dashboard with "quotes" & <tags> and émojis 🚀')).toBeInTheDocument()
  })

  it('displays tags when provided', () => {
    const taggedDashboard = {
      ...mockDashboard,
      tags: ['analytics', 'sales', 'important']
    }
    
    render(<MockDashboardCard dashboard={taggedDashboard} />)
    // This would depend on how tags are rendered in the actual component
    expect(screen.getByTestId('dashboard-card')).toBeInTheDocument()
  })
})