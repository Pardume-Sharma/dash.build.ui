'use client';

import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { useApi } from '@/hooks/useApi';
import { 
  User, 
  Key, 
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Edit
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface ApiToken {
  tokenId: string;
  name: string;
  permissions: string[];
  allowedDomains: string[];
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
}

function ProfilePageContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const api = useApi();
  
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const permissions = [
    { value: 'dashboards:read', label: 'Read Dashboards' },
    { value: 'dashboards:write', label: 'Create/Update Dashboards' },
    { value: 'dashboards:delete', label: 'Delete Dashboards' },
    { value: 'components:read', label: 'Read Components' },
    { value: 'components:write', label: 'Create/Update Components' },
    { value: '*', label: 'Full Access' }
  ];

  const fetchApiTokens = async () => {
    try {
      const response = await api.get('/api/v1/auth/api-tokens');
      setApiTokens(response.data || []);
    } catch (error) {
      console.error('Failed to fetch API tokens:', error);
      setApiTokens([]); // Set empty array on error
    }
  };

  const createApiToken = async () => {
    if (!newTokenName || selectedPermissions.length === 0) return;
    
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/api-tokens', {
        name: newTokenName,
        permissions: selectedPermissions,
        allowedDomains: [],
        expiresInDays: 30
      });
      
      setNewToken(response.token);
      setNewTokenName('');
      setSelectedPermissions([]);
      fetchApiTokens();
    } catch (error) {
      console.error('Failed to create API token:', error);
      alert('Failed to create API token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const revokeApiToken = async (tokenId: string) => {
    try {
      await api.delete(`/api/v1/auth/api-tokens/${tokenId}`);
      fetchApiTokens();
    } catch (error) {
      console.error('Failed to revoke API token:', error);
    }
  };

  const copyToken = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
    }
  };

  // Fetch API tokens when component mounts
  React.useEffect(() => {
    if (isLoaded && user) {
      fetchApiTokens();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4">⟳</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Profile & API Tokens</h1>
          <p className="text-gray-400">Manage your profile information and API access</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-xl border-white/20 grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/20 text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="api-tokens" className="data-[state=active]:bg-white/20 text-white">
              <Key className="w-4 h-4 mr-2" />
              API Tokens
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Your profile information is managed by Clerk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  {user?.imageUrl && (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                    <Badge variant="outline" className="mt-2">
                      Free Plan
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-white/20 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">User ID</Label>
                    <Input 
                      value={user?.id || ''} 
                      readOnly 
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Member Since</Label>
                    <Input 
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''} 
                      readOnly 
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => window.open('/user-profile', '_blank')}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => signOut()}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tokens Tab */}
          <TabsContent value="api-tokens">
            <div className="space-y-6">
              {/* Create New Token */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Create API Token</CardTitle>
                  <CardDescription className="text-gray-400">
                    Generate tokens for programmatic access to your dashboards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Token Name</Label>
                    <Input
                      placeholder="e.g., Production API, Mobile App"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {permissions.map((permission) => (
                        <label key={permission.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(permission.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, permission.value]);
                              } else {
                                setSelectedPermissions(selectedPermissions.filter(p => p !== permission.value));
                              }
                            }}
                            className="rounded border-white/20 bg-white/10 text-cyan-500"
                          />
                          <span className="text-gray-300 text-sm">{permission.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={createApiToken}
                    disabled={!newTokenName || selectedPermissions.length === 0 || loading}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    {loading ? 'Creating...' : 'Create Token'}
                  </Button>
                </CardContent>
              </Card>

              {/* New Token Display */}
              {newToken && (
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-400">Token Created Successfully</CardTitle>
                    <CardDescription className="text-gray-400">
                      Copy this token now - you won't be able to see it again
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={showToken ? newToken : '••••••••••••••••••••••••••••••••'}
                        readOnly
                        className="bg-white/10 border-white/20 text-white font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={copyToken}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Tokens */}
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Your API Tokens</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your existing API tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {apiTokens.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No API tokens created yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {apiTokens.map((token) => (
                        <div key={token.tokenId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">{token.name}</h4>
                            <p className="text-gray-400 text-sm">
                              Created {new Date(token.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-1 mt-2">
                              {token.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeApiToken(token.tokenId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}