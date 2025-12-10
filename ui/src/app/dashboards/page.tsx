'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
// Removed GSAP for better performance
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  Calendar,
  Tag,
  Eye,
  Lock,
  Globe,
  Loader2
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Dashboard } from '@/types/dashboard';

function DashboardsPageContent() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const cardsRef = useRef<HTMLDivElement>(null);
  const api = useApi();

  useEffect(() => {
    fetchDashboards();
  }, []);

  // Animations removed for better performance

  const fetchDashboards = async () => {
    try {
      const [userResponse, systemResponse] = await Promise.all([
        api.get<{ success: boolean; data: Dashboard[] }>('/api/v1/dashboards'),
        api.get<{ success: boolean; data: Dashboard[] }>('/api/v1/dashboards/system')
      ]);
      
      // Combine user dashboards and system dashboards
      const allDashboards = [
        ...userResponse.data,
        ...systemResponse.data.map(d => ({ ...d, isSystem: true }))
      ];
      
      setDashboards(allDashboards);
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDashboards = dashboards.filter(dashboard =>
    dashboard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dashboard.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-400" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-400" />;
      case 'password-protected':
        return <Lock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              My Dashboards
            </h1>
            <p className="text-gray-400 text-lg">
              Create, manage, and share your dashboards
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboards/create-from-template">
              <Button size="lg" variant="outline" className="shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                From Template
              </Button>
            </Link>
            {process.env.NEXT_PUBLIC_MY_WORK_URL && (
              <Button 
                size="lg" 
                variant="outline" 
                className="shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                onClick={() => window.open(process.env.NEXT_PUBLIC_MY_WORK_URL, '_blank')}
              >
                <Eye className="w-5 h-5 mr-2" />
                My Work
              </Button>
            )}
            <Link href="/dashboards/create">
              <Button size="lg" className="shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]">
                <Plus className="w-5 h-5 mr-2" />
                Create Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {/* Empty State */}
        {!loading && dashboards.length === 0 && (
          <Card className="max-w-2xl mx-auto text-center py-16 border-white/10">
            <CardContent>
              <LayoutDashboard className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">No dashboards yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first dashboard to get started
              </p>
              <Link href="/dashboards/create">
                <Button className="shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Dashboards Grid */}
        {!loading && filteredDashboards.length > 0 && (
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDashboards.map((dashboard) => (
              <Link key={dashboard._id} href={`/dashboard/${dashboard.slug}`} className="block isolate">
                <Card className="dashboard-card hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:scale-[1.03] transition-all duration-500 cursor-pointer border-white/10 hover:border-cyan-500/50 h-full overflow-hidden">
                  {/* Thumbnail */}
                  <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 relative overflow-hidden">
                    <DashboardImage 
                      src={dashboard.thumbnail} 
                      alt={dashboard.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {dashboard.isSystem && (
                        <div className="bg-cyan-500/20 backdrop-blur-xl rounded-full px-2 py-1">
                          <span className="text-cyan-400 text-xs font-medium">System</span>
                        </div>
                      )}
                      <div className="bg-black/50 backdrop-blur-xl rounded-full p-2">
                        {getVisibilityIcon(dashboard.visibility)}
                      </div>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl transition-colors">
                      {dashboard.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {dashboard.description || 'No description'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Tags */}
                    {dashboard.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dashboard.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {dashboard.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{dashboard.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(dashboard.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <LayoutDashboard className="w-4 h-4" />
                        {dashboard.components?.length || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searchQuery && filteredDashboards.length === 0 && (
          <Card className="max-w-2xl mx-auto text-center py-16 border-white/10">
            <CardContent>
              <Search className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search query
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Dashboard Image component with fallback
function DashboardImage({ src, alt }: { src?: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  
  if (!src || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LayoutDashboard className="w-16 h-16 text-cyan-400/30" />
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

export default function DashboardsPage() {
  return (
    <ProtectedRoute>
      <DashboardsPageContent />
    </ProtectedRoute>
  );
}
