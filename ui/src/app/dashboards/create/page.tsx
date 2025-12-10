'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// Removed GSAP import to prevent animation issues
// import gsap from 'gsap';
import { 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  Globe,
  Lock,
  Shield
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import Link from 'next/link';

export default function CreateDashboardPage() {
  const router = useRouter();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    visibility: 'private' as 'public' | 'private' | 'password-protected',
    password: '',
    tags: '',
  });

  // Removed GSAP animation to prevent form fading issues
  // useEffect(() => {
  //   gsap.from('.form-card', {
  //     opacity: 0,
  //     y: 30,
  //     duration: 0.8,
  //     ease: 'power3.out',
  //   });
  // }, []);

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        thumbnail: formData.thumbnail || undefined,
        visibility: formData.visibility,
        password: formData.visibility === 'password-protected' ? formData.password : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };

      const response = await api.post<{ success: boolean; data: any }>('/api/v1/dashboards', payload);
      
      if (response.success) {
        router.push(`/dashboard/${response.data.slug}`);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create dashboard');
    } finally {
      setLoading(false);
    }
  };

  const visibilityOptions = [
    {
      value: 'private',
      icon: <Lock className="w-5 h-5" />,
      title: 'Private',
      description: 'Only you can access'
    },
    {
      value: 'public',
      icon: <Globe className="w-5 h-5" />,
      title: 'Public',
      description: 'Anyone with the link'
    },
    {
      value: 'password-protected',
      icon: <Shield className="w-5 h-5" />,
      title: 'Password Protected',
      description: 'Requires password'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Create New Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Set up your dashboard and start adding components
          </p>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <Card className="form-card border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Dashboard Details</CardTitle>
                  <CardDescription>
                    Fill in the basic information for your dashboard
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Dashboard Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="My Awesome Dashboard"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="text-lg"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    URL Slug *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">/dashboard/</span>
                    <Input
                      type="text"
                      placeholder="my-awesome-dashboard"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      pattern="[a-z0-9-]+"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Only lowercase letters, numbers, and hyphens
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Description
                  </label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl px-3 py-2 text-sm text-white transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent resize-none"
                    placeholder="Describe what this dashboard is for..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Thumbnail Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg (optional)"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    Optional image URL to display as dashboard thumbnail
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    Tags
                  </label>
                  <Input
                    type="text"
                    placeholder="sales, analytics, marketing (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    Separate tags with commas
                  </p>
                </div>

                {/* Visibility */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">
                    Visibility
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {visibilityOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, visibility: option.value as any }))}
                        className={`p-4 rounded-xl border-2 transition-all text-left isolate ${
                          formData.visibility === option.value
                            ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                            : 'border-white/10 hover:border-white/30 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2 text-white">
                          {option.icon}
                          <span className="font-medium">{option.title}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password (if password-protected) */}
                {formData.visibility === 'password-protected' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-white">
                      Password *
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum 6 characters
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-6 border-t border-white/10">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="flex-1 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create Dashboard
                      </>
                    )}
                  </Button>
                  <Link href="/dashboards">
                    <Button type="button" variant="outline" size="lg">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6 border-white/10 bg-cyan-500/5">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Pro Tips</h3>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• Use descriptive names to easily identify your dashboards</li>
                    <li>• Tags help organize and filter dashboards later</li>
                    <li>• You can change these settings anytime after creation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
