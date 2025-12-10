'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { 
  Plus, 
  Settings, 
  Loader2,
  Grid3x3,
  Eye,
  Edit3,
  Trash2,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Dashboard, Component } from '@/types/dashboard';
import Link from 'next/link';
import ComponentCreationModal from '@/components/dashboard/ComponentCreationModal';
import ComponentGrid from '@/components/dashboard/ComponentGrid';
import ComponentSidebar from '@/components/dashboard/ComponentSidebar';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const api = useApi();
  
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  useEffect(() => {
    if (slug) {
      fetchDashboard();
    }
  }, [slug]);

  // Removed GSAP animation to prevent fading issues

  const fetchDashboard = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Dashboard }>(`/api/v1/dashboards/${slug}`);
      const dashboardData = response.data;
      setDashboard(dashboardData);
      
      // Check if password protection is needed
      if (dashboardData.visibility === 'password-protected' && !isAuthenticated) {
        setShowPasswordPrompt(true);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      alert('Dashboard not found');
      router.push('/dashboards');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!dashboard) return;
    
    if (!passwordInput) {
      setPasswordError('Please enter a password');
      return;
    }
    
    setIsVerifying(true);
    setPasswordError('');
    
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        `/api/v1/dashboards/${slug}/verify-password`,
        { password: passwordInput }
      );
      
      if (response.success) {
        setIsAuthenticated(true);
        setShowPasswordPrompt(false);
        setPasswordInput('');
      } else {
        setPasswordError('Incorrect password');
      }
    } catch (error: any) {
      // Never log the error as it might contain sensitive data
      // Only show a generic error message
      setPasswordError('Incorrect password');
      setPasswordInput(''); // Clear password input on error
    } finally {
      setIsVerifying(false);
    }
  };

  const handleComponentCreated = (component: Component) => {
    setDashboard(prev => prev ? {
      ...prev,
      components: [...(prev.components || []), component]
    } : null);
    setShowComponentModal(false);
  };

  const handleDeleteDashboard = async () => {
    if (!dashboard) return;
    
    setIsDeleting(true);
    try {
      const response = await api.delete<{ success: boolean }>(`/api/v1/dashboards/${dashboard.slug}`);
      if (response.success) {
        router.push('/dashboards');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      alert('Failed to delete dashboard');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleUpdateSettings = async (updates: Partial<Dashboard>) => {
    if (!dashboard) return;
    
    try {
      const response = await api.patch<{ success: boolean; data: Dashboard }>(`/api/v1/dashboards/${dashboard.slug}`, updates);
      if (response.success) {
        setDashboard(response.data);
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Failed to update dashboard:', error);
      alert('Failed to update dashboard settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  // Show password prompt if dashboard is password-protected and not authenticated
  if (showPasswordPrompt && dashboard.visibility === 'password-protected') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        {/* Background effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
        
        <Card className="relative max-w-md w-full border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Password Protected</h2>
              <p className="text-gray-400">
                This dashboard requires a password to view
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboard-password">Enter Password</Label>
                <Input
                  id="dashboard-password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  placeholder="Enter password"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboards')}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePasswordSubmit}
                  className="flex-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Unlock'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Header */}
      <div className="dashboard-header relative border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {dashboard.name}
                </h1>
                {dashboard.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {dashboard.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboards">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={() => setEditMode(!editMode)}
                className={editMode ? "shadow-[0_0_30px_rgba(6,182,212,0.3)]" : ""}
              >
                {editMode ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Mode
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-white/10"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-8">
        {/* Edit Mode Banner */}
        {editMode && (
          <div className="mb-6 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <div>
                <p className="text-cyan-400 font-medium">Edit Mode Active</p>
                <p className="text-sm text-gray-400">
                  Drag components to reposition, resize from bottom-right corner, or use the toolbar buttons to edit schema and data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!dashboard.components || dashboard.components.length === 0) && (
          <Card className="max-w-2xl mx-auto text-center py-20 border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <Grid3x3 className="w-10 h-10 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold mb-3 text-white">No components yet</h3>
                <p className="text-gray-400 text-lg mb-8">
                  Start building your dashboard by adding components
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => setShowComponentModal(true)}
                className="shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Component
              </Button>
            </div>
          </Card>
        )}

        {/* Component Grid */}
        {dashboard.components && dashboard.components.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {dashboard.components.length} component{dashboard.components.length !== 1 ? 's' : ''}
              </div>
              {editMode && (
                <Button 
                  onClick={() => setShowComponentModal(true)}
                  className="shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              )}
            </div>
            
            <ComponentGrid 
              components={dashboard.components}
              editMode={editMode}
              onUpdate={fetchDashboard}
              onComponentClick={(component) => setSelectedComponent(component)}
            />
          </div>
        )}

        {/* Floating Add Button (when components exist and in edit mode) */}
        {dashboard.components && dashboard.components.length > 0 && editMode && (
          <button
            onClick={() => setShowComponentModal(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_50px_rgba(6,182,212,0.5)] hover:shadow-[0_0_70px_rgba(6,182,212,0.7)] hover:scale-110 transition-all flex items-center justify-center z-50"
          >
            <Plus className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Component Creation Modal */}
      {showComponentModal && (
        <ComponentCreationModal
          dashboardSlug={slug}
          onClose={() => setShowComponentModal(false)}
          onComponentCreated={handleComponentCreated}
        />
      )}

      {/* Settings Modal */}
      {showSettings && dashboard && (
        <DashboardSettingsModal
          dashboard={dashboard}
          onClose={() => setShowSettings(false)}
          onSave={handleUpdateSettings}
        />
      )}

      {/* Component Sidebar */}
      {selectedComponent && !editMode && (
        <ComponentSidebar
          component={selectedComponent}
          onClose={() => setSelectedComponent(null)}
          onUpdate={fetchDashboard}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-500/20 bg-white/5 backdrop-blur-xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Dashboard</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-white">"{dashboard?.name}"</span>? 
                All components and data will be permanently removed.
              </p>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteDashboard}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Dashboard
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Dashboard Settings Modal Component
function DashboardSettingsModal({ 
  dashboard, 
  onClose, 
  onSave 
}: { 
  dashboard: Dashboard; 
  onClose: () => void; 
  onSave: (updates: Partial<Dashboard>) => void;
}) {
  const [name, setName] = useState(dashboard.name);
  const [description, setDescription] = useState(dashboard.description || '');
  const [thumbnail, setThumbnail] = useState(dashboard.thumbnail || '');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password-protected'>(dashboard.visibility || 'private');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    const updates: any = { name, description, thumbnail, visibility };
    if (visibility === 'password-protected' && password) {
      updates.password = password;
    }
    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white">Dashboard Settings</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="settings-name">Dashboard Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Dashboard"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="settings-description">Description</Label>
              <textarea
                id="settings-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dashboard..."
                className="flex min-h-[100px] w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent resize-none"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <Label htmlFor="settings-thumbnail">Thumbnail Image URL</Label>
              <Input
                id="settings-thumbnail"
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg (optional)"
              />
              <p className="text-xs text-gray-400">
                Optional image URL to display as dashboard thumbnail
              </p>
            </div>

            {/* Visibility */}
            <div className="space-y-2">
              <Label htmlFor="settings-visibility">Visibility</Label>
              <select
                id="settings-visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'private' | 'password-protected')}
                className="flex h-10 w-full rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent"
              >
                <option value="private" className="bg-slate-900">Private</option>
                <option value="public" className="bg-slate-900">Public</option>
                <option value="password-protected" className="bg-slate-900">Password Protected</option>
              </select>
              <p className="text-xs text-gray-400">
                {visibility === 'private' && 'Only you can view this dashboard'}
                {visibility === 'public' && 'Anyone with the link can view this dashboard'}
                {visibility === 'password-protected' && 'Requires a password to view'}
              </p>
            </div>

            {/* Password Field (shown only when password-protected is selected) */}
            {visibility === 'password-protected' && (
              <div className="space-y-2">
                <Label htmlFor="settings-password">Dashboard Password</Label>
                <Input
                  id="settings-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-400">
                  Set a password that users must enter to view this dashboard
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={visibility === 'password-protected' && !password}
              className="flex-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              Save Changes
            </Button>
          </div>
          {visibility === 'password-protected' && !password && (
            <p className="text-xs text-yellow-400 text-center -mt-2">
              Please enter a password for password-protected visibility
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
