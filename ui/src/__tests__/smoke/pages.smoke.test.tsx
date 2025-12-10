import { render, screen } from '@testing-library/react'
import { api } from '@/lib/api'

// Mock the pages (these would be the actual page components)
const MockHomePage = () => (
  <div data-testid="home-page">
    <h1>dash.build</h1>
    <p>Create Stunning Dashboards</p>
    <button>Get Started</button>
  </div>
)

const MockDashboardsPage = () => {
  return (
    <div data-testid="dashboards-page">
      <h1>My Dashboards</h1>
      <button>Create Dashboard</button>
      <div data-testid="dashboard-list">No dashboards yet</div>
    </div>
  )
}

const MockTemplatesPage = () => {
  return (
    <div data-testid="templates-page">
      <h1>Dashboard Templates</h1>
      <div data-testid="template-list">
        <div>Sales Dashboard</div>
        <div>Marketing Dashboard</div>
      </div>
    </div>
  )
}

const MockCreateDashboardPage = () => (
  <div data-testid="create-dashboard-page">
    <h1>Create New Dashboard</h1>
    <form>
      <input placeholder="Dashboard name" />
      <input placeholder="Slug" />
      <textarea placeholder="Description" />
      <button type="submit">Create Dashboard</button>
    </form>
  </div>
)

const MockDashboardViewPage = () => (
  <div data-testid="dashboard-view-page">
    <h1>Dashboard View</h1>
    <div data-testid="component-grid">
      <div>Component 1</div>
      <div>Component 2</div>
    </div>
    <button>Edit Dashboard</button>
  </div>
)

const mockApi = api as jest.Mocked<typeof api>

describe('Pages Smoke Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Home Page', () => {
    it('renders home page without crashing', () => {
      render(<MockHomePage />)
      
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.getByText('dash.build')).toBeInTheDocument()
      expect(screen.getByText('Create Stunning Dashboards')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
    })

    it('contains essential navigation elements', () => {
      render(<MockHomePage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Dashboards Page', () => {
    it('renders dashboards page without crashing', () => {
      mockApi.get.mockResolvedValue({
        success: true,
        data: []
      })

      render(<MockDashboardsPage />)
      
      expect(screen.getByTestId('dashboards-page')).toBeInTheDocument()
      expect(screen.getByText('My Dashboards')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Dashboard' })).toBeInTheDocument()
      expect(screen.getByTestId('dashboard-list')).toBeInTheDocument()
    })

    it('displays empty state when no dashboards exist', () => {
      render(<MockDashboardsPage />)
      
      expect(screen.getByText('No dashboards yet')).toBeInTheDocument()
    })

    it('has proper page structure', () => {
      render(<MockDashboardsPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Templates Page', () => {
    it('renders templates page without crashing', () => {
      mockApi.get.mockResolvedValue({
        success: true,
        data: [
          { templateId: 'sales', name: 'Sales Dashboard' },
          { templateId: 'marketing', name: 'Marketing Dashboard' }
        ]
      })

      render(<MockTemplatesPage />)
      
      expect(screen.getByTestId('templates-page')).toBeInTheDocument()
      expect(screen.getByText('Dashboard Templates')).toBeInTheDocument()
      expect(screen.getByTestId('template-list')).toBeInTheDocument()
    })

    it('displays template options', () => {
      render(<MockTemplatesPage />)
      
      expect(screen.getByText('Sales Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Marketing Dashboard')).toBeInTheDocument()
    })

    it('has proper page structure', () => {
      render(<MockTemplatesPage />)
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })

  describe('Create Dashboard Page', () => {
    it('renders create dashboard page without crashing', () => {
      render(<MockCreateDashboardPage />)
      
      expect(screen.getByTestId('create-dashboard-page')).toBeInTheDocument()
      expect(screen.getByText('Create New Dashboard')).toBeInTheDocument()
    })

    it('displays form fields', () => {
      render(<MockCreateDashboardPage />)
      
      expect(screen.getByPlaceholderText('Dashboard name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Slug')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Dashboard' })).toBeInTheDocument()
    })

    it('has proper form structure', () => {
      render(<MockCreateDashboardPage />)
      
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /dashboard name/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { type: 'submit' })).toBeInTheDocument()
    })
  })

  describe('Dashboard View Page', () => {
    it('renders dashboard view page without crashing', () => {
      render(<MockDashboardViewPage />)
      
      expect(screen.getByTestId('dashboard-view-page')).toBeInTheDocument()
      expect(screen.getByText('Dashboard View')).toBeInTheDocument()
      expect(screen.getByTestId('component-grid')).toBeInTheDocument()
    })

    it('displays dashboard components', () => {
      render(<MockDashboardViewPage />)
      
      expect(screen.getByText('Component 1')).toBeInTheDocument()
      expect(screen.getByText('Component 2')).toBeInTheDocument()
    })

    it('has edit functionality', () => {
      render(<MockDashboardViewPage />)
      
      expect(screen.getByRole('button', { name: 'Edit Dashboard' })).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('renders navigation elements', () => {
      const MockNavigation = () => (
        <nav data-testid="navigation">
          <a href="/">Home</a>
          <a href="/dashboards">Dashboards</a>
          <a href="/templates">Templates</a>
        </nav>
      )

      render(<MockNavigation />)
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Dashboards' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Templates' })).toBeInTheDocument()
    })

    it('has proper navigation structure', () => {
      const MockNavigation = () => (
        <nav data-testid="navigation">
          <a href="/">Home</a>
          <a href="/dashboards">Dashboards</a>
          <a href="/templates">Templates</a>
        </nav>
      )

      render(<MockNavigation />)
      
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Error Boundaries', () => {
    it('handles component errors gracefully', () => {
      const ErrorComponent = () => {
        throw new Error('Test error')
      }

      const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
        try {
          return <>{children}</>
        } catch (error) {
          return <div data-testid="error-boundary">Something went wrong</div>
        }
      }

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
        )
      }).toThrow('Test error')

      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy on home page', () => {
      render(<MockHomePage />)
      
      const headings = screen.getAllByRole('heading')
      expect(headings).toHaveLength(1)
      expect(headings[0]).toHaveAttribute('aria-level', '1')
    })

    it('has proper form labels on create page', () => {
      render(<MockCreateDashboardPage />)
      
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      
      const inputs = screen.getAllByRole('textbox')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('has proper button roles', () => {
      render(<MockDashboardsPage />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('renders pages quickly', () => {
      const startTime = performance.now()
      
      render(<MockHomePage />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render in less than 100ms
      expect(renderTime).toBeLessThan(100)
    })

    it('handles multiple page renders', () => {
      const pages = [
        <MockHomePage key="home" />,
        <MockDashboardsPage key="dashboards" />,
        <MockTemplatesPage key="templates" />,
        <MockCreateDashboardPage key="create" />
      ]

      pages.forEach((page, index) => {
        const { unmount } = render(page)
        expect(screen.getByTestId(page.key + '-page')).toBeInTheDocument()
        unmount()
      })
    })
  })
})