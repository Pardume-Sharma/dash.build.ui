'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useApi } from '@/hooks/useApi';
import { 
  Search, 
  LayoutDashboard, 
  Calendar,
  Tag,
  Eye,
  Lock,
  Globe,
  Loader2,
  Plus,
  Sparkles
} from 'lucide-react';

interface Template {
  templateId: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  downloads: number;
  createdBy: string;
  createdAt: string;
}

function TemplatesPageContent() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const api = useApi();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      // Fetch actual templates
      const response = await api.get<{ success: boolean; data: Template[] }>('/api/v1/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Globe className="w-4 h-4 text-green-400" />;
      case 'private':
        return <Lock className="w-4 h-4 text-red-400" />;
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
              Dashboard Templates
            </h1>
            <p className="text-gray-400 text-lg">
              Start with professionally designed templates
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboards">
              <Button size="lg" variant="outline" className="shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                My Dashboards
              </Button>
            </Link>
            <Link href="/dashboards/create">
              <Button size="lg" className="shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]">
                <Plus className="w-5 h-5 mr-2" />
                Create from Scratch
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
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
        {!loading && templates.length === 0 && (
          <Card className="max-w-2xl mx-auto text-center py-16 bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent>
              <Sparkles className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-2xl font-semibold mb-2 text-white">No templates available</h3>
              <p className="text-gray-400 mb-6">
                Templates are being prepared for you
              </p>
              <Link href="/dashboards/create">
                <Button className="shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Templates Grid */}
        {!loading && filteredTemplates.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.templateId} className="hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:scale-[1.03] transition-all duration-500 cursor-pointer bg-white/10 backdrop-blur-xl border-white/20 hover:border-cyan-500/50 h-full overflow-hidden">
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 relative overflow-hidden">
                  <TemplateImage 
                    src={template.thumbnail} 
                    alt={template.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-cyan-500/20 backdrop-blur-xl rounded-full px-2 py-1">
                      <span className="text-cyan-400 text-xs font-medium">{template.category}</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-xl rounded-full px-2 py-1">
                      <span className="text-yellow-400 text-xs font-medium">★ {template.rating}</span>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-white transition-colors">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-400">
                    {template.description || 'Professional dashboard template'}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Category and Stats */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {template.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-500/20 bg-green-500/10"
                    >
                      {template.downloads} downloads
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/dashboards/create-from-template?template=${template.templateId}`} className="flex-1">
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </Link>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && searchQuery && filteredTemplates.length === 0 && (
          <Card className="max-w-2xl mx-auto text-center py-16 bg-white/10 backdrop-blur-xl border-white/20">
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

// Template Image component with fallback
function TemplateImage({ src, alt }: { src?: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  
  if (!src || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Sparkles className="w-16 h-16 text-cyan-400/30" />
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

export default function TemplatesPage() {
  return (
    <ProtectedRoute>
      <TemplatesPageContent />
    </ProtectedRoute>
  );
}