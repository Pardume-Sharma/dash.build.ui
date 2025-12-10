'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Removed heavy animation libraries for better performance
import { 
  LayoutDashboard, 
  Zap, 
  Users, 
  BarChart3, 
  Palette,
  Globe,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Database,
  Layers,
  GitBranch,
  Shield,
  Plus,
  LogIn
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Dashboard } from '@/types/dashboard';

// Animation libraries removed for performance

function ExistingDashboardsPreview() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Dashboard[] }>('/api/v1/dashboards?limit=6');
      setDashboards(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  
  if (dashboards.length === 0) {
    return (
      <div className="relative container mx-auto px-4 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">
            Your Dashboards
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get started by creating your first dashboard
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-16 text-center">
          <LayoutDashboard className="w-20 h-20 mx-auto text-cyan-400/50 mb-6" />
          <h3 className="text-2xl font-semibold text-white mb-4">
            No dashboards yet
          </h3>
          <p className="text-gray-400 mb-8 text-lg">
            Create your first dashboard to get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboards/create">
              <Button size="lg" className="shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <Plus className="w-5 h-5 mr-2" />
                Create Dashboard
              </Button>
            </Link>

          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative container mx-auto px-4 py-32">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-white mb-6">
          Your Dashboards
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Quick access to your recently updated dashboards
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
        {dashboards.map((dashboard) => (
          <Link key={dashboard._id} href={`/dashboard/${dashboard.slug}`} className="block isolate">
            <Card className="relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 cursor-pointer overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 relative overflow-hidden">
                {dashboard.thumbnail ? (
                  <img 
                    src={dashboard.thumbnail} 
                    alt={dashboard.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <LayoutDashboard className="w-16 h-16 text-cyan-400/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xl rounded-full px-3 py-1 flex items-center gap-1">
                  {dashboard.visibility === 'public' ? (
                    <Globe className="w-4 h-4 text-green-400" />
                  ) : dashboard.visibility === 'private' ? (
                    <Lock className="w-4 h-4 text-red-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                {dashboard.components && dashboard.components.length > 0 && (
                  <div className="absolute bottom-3 left-3 bg-cyan-500/20 backdrop-blur-xl rounded-full px-3 py-1 border border-cyan-500/30">
                    <span className="text-xs font-medium text-cyan-400">
                      {dashboard.components.length} component{dashboard.components.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {dashboard.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {dashboard.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Updated {new Date(dashboard.updatedAt).toLocaleDateString()}
                  </div>
                  <span className="text-cyan-400">
                    View →
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/dashboards">
          <Button size="lg" variant="outline">
            View All Dashboards
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}



export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    // All animations removed for better performance
  }, []);

  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: "Drag & Drop Builder",
      description: "Intuitive interface to create stunning dashboards in minutes"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "20+ Components",
      description: "Charts, tables, metrics, and more visualization types"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Custom Themes",
      description: "Fully customizable colors, fonts, and styling"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Multiple Data Sources",
      description: "Connect APIs, webhooks, CSV, or manual entry"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Control access with public, private, or password protection"
    }
  ];

  const useCases = [
    "Sales & Marketing Analytics",
    "Financial Reporting",
    "Operations Monitoring",
    "Project Management",
    "Customer Analytics",
    "Real-time Metrics"
  ];

  return (
    <div ref={heroRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Build Anything, Visualize Everything
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title text-7xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Dashboard Builder
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Create stunning, interactive dashboards with drag-and-drop simplicity. 
            Real-time collaboration, unlimited customization, zero complexity.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboards">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 px-8 py-6 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboards">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-8 py-6 text-lg"
              >
                View Dashboards
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                20+
              </div>
              <div className="text-sm text-gray-500 mt-2">Components</div>
            </div>
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                ∞
              </div>
              <div className="text-sm text-gray-500 mt-2">Possibilities</div>
            </div>
            <div className="text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-sm text-gray-500 mt-2">Customizable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="features-section relative container mx-auto px-4 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-400">
            Powerful features to build professional dashboards
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="feature-card relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer overflow-hidden hover:shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:scale-[1.02] isolate"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 hover:from-cyan-500/10 hover:to-blue-600/10 transition-all duration-500 pointer-events-none" />
              
              <div className="relative p-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mb-6 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Existing Dashboards Preview Section */}
      <ExistingDashboardsPreview />



      {/* Use Cases Section */}
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Perfect For Any Use Case
            </h2>
            <p className="text-xl text-gray-400">
              From simple metrics to complex analytics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer isolate"
              >
                <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <span className="text-white font-medium text-lg">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative container mx-auto px-4 py-32">
        <Card className="max-w-5xl mx-auto bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-indigo-600/10 backdrop-blur-xl border border-cyan-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent)]" />
          <div className="relative p-16 text-center space-y-8">
            <Zap className="w-20 h-20 mx-auto text-cyan-400" />
            <h2 className="text-5xl font-bold text-white">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create your first dashboard in minutes. No credit card required.
            </p>
            {!isLoaded ? (
              <Button 
                size="lg" 
                disabled
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 px-10 py-7 text-lg"
              >
                Loading...
              </Button>
            ) : isSignedIn ? (
              <Link href="/dashboards/create">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 px-10 py-7 text-lg"
                >
                  Create Your Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all duration-300 px-10 py-7 text-lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </SignInButton>
            )}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">
            © 2024 Dashboard Builder. Built with Next.js, TypeScript, and MongoDB 7.0+
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">API</a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
