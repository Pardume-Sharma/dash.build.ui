'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';

const DEFAULT_TEMPLATE = `{
  "name": "Complete Analytics Dashboard",
  "slug": "complete-analytics-dashboard",
  "description": "A comprehensive dashboard with all 20 component types",
  "components": {
    "Total Revenue": {
      "type": "metric-card",
      "position": { "x": 0, "y": 0, "w": 3, "h": 2 },
      "config": { "icon": "💰", "showTrend": true, "showIcon": true },
      "data": [{ "value": 125000, "label": "Revenue", "trend": "up", "trendValue": 12.5 }]
    },
    "Active Users": {
      "type": "metric-card",
      "position": { "x": 3, "y": 0, "w": 3, "h": 2 },
      "config": { "icon": "👥", "showTrend": true, "showIcon": true },
      "data": [{ "value": 45230, "label": "Users", "trend": "up", "trendValue": 8.3 }]
    },
    "Conversion Rate": {
      "type": "metric-card",
      "position": { "x": 6, "y": 0, "w": 3, "h": 2 },
      "config": { "icon": "📈", "showTrend": true, "showIcon": true },
      "data": [{ "value": 24.8, "label": "Rate", "suffix": "%", "trend": "up", "trendValue": 3.2 }]
    },
    "Avg Response Time": {
      "type": "metric-card",
      "position": { "x": 9, "y": 0, "w": 3, "h": 2 },
      "config": { "icon": "⚡", "showTrend": true, "showIcon": true },
      "data": [{ "value": 245, "label": "Time", "suffix": "ms", "trend": "down", "trendValue": 15.2 }]
    },
    "Revenue Trend": {
      "type": "line-chart",
      "position": { "x": 0, "y": 2, "w": 6, "h": 4 },
      "config": { "showGrid": true, "smooth": true, "showDots": true },
      "data": [
        { "month": "Jan", "revenue": 45000 },
        { "month": "Feb", "revenue": 52000 },
        { "month": "Mar", "revenue": 48000 },
        { "month": "Apr", "revenue": 61000 },
        { "month": "May", "revenue": 55000 },
        { "month": "Jun", "revenue": 67000 }
      ]
    },
    "Sales by Category": {
      "type": "bar-chart",
      "position": { "x": 6, "y": 2, "w": 6, "h": 4 },
      "config": { "orientation": "vertical" },
      "data": [
        { "category": "Electronics", "sales": 45000 },
        { "category": "Clothing", "sales": 32000 },
        { "category": "Food", "sales": 28000 },
        { "category": "Books", "sales": 15000 },
        { "category": "Sports", "sales": 22000 }
      ]
    },
    "Market Share": {
      "type": "pie-chart",
      "position": { "x": 0, "y": 6, "w": 4, "h": 4 },
      "config": { "showLabels": true, "showLegend": true },
      "data": [
        { "product": "Product A", "share": 35 },
        { "product": "Product B", "share": 25 },
        { "product": "Product C", "share": 20 },
        { "product": "Product D", "share": 15 },
        { "product": "Others", "share": 5 }
      ]
    },
    "Performance Score": {
      "type": "gauge",
      "position": { "x": 4, "y": 6, "w": 4, "h": 4 },
      "config": { "min": 0, "max": 100, "unit": "%" },
      "data": [{ "value": 82 }]
    },
    "Growth Area": {
      "type": "area-chart",
      "position": { "x": 8, "y": 6, "w": 4, "h": 4 },
      "config": { "stacked": false, "fillOpacity": 0.6 },
      "data": [
        { "quarter": "Q1", "growth": 12 },
        { "quarter": "Q2", "growth": 19 },
        { "quarter": "Q3", "growth": 15 },
        { "quarter": "Q4", "growth": 25 }
      ]
    },
    "Top Opportunities": {
      "type": "table",
      "position": { "x": 0, "y": 10, "w": 8, "h": 4 },
      "config": { "sortable": true, "pagination": true, "pageSize": 5 },
      "data": [
        { "name": "Acme Corp Deal", "amount": 125000, "stage": "Negotiation", "probability": 75 },
        { "name": "TechStart Partnership", "amount": 85000, "stage": "Proposal", "probability": 60 },
        { "name": "Global Solutions", "amount": 200000, "stage": "Closed Won", "probability": 100 },
        { "name": "Innovation Labs", "amount": 45000, "stage": "Qualification", "probability": 40 },
        { "name": "Enterprise Plus", "amount": 150000, "stage": "Negotiation", "probability": 80 }
      ]
    },
    "Project Completion": {
      "type": "progress-bar",
      "position": { "x": 8, "y": 10, "w": 4, "h": 4 },
      "config": { "showLabel": true, "color": "cyan" },
      "data": [{ "value": 68 }]
    },
    "Sales Funnel": {
      "type": "funnel-chart",
      "position": { "x": 0, "y": 14, "w": 4, "h": 4 },
      "config": { "showValues": true, "showPercentages": true },
      "data": [
        { "stage": "Visitors", "count": 10000 },
        { "stage": "Leads", "count": 5000 },
        { "stage": "Qualified", "count": 2500 },
        { "stage": "Proposals", "count": 1000 },
        { "stage": "Closed", "count": 400 }
      ]
    },
    "Activity Heatmap": {
      "type": "heatmap",
      "position": { "x": 4, "y": 14, "w": 4, "h": 4 },
      "config": {},
      "data": [
        { "day": "Mon", "hour": "9AM", "activity": 45 },
        { "day": "Mon", "hour": "12PM", "activity": 78 },
        { "day": "Mon", "hour": "3PM", "activity": 62 },
        { "day": "Tue", "hour": "9AM", "activity": 52 },
        { "day": "Tue", "hour": "12PM", "activity": 85 },
        { "day": "Tue", "hour": "3PM", "activity": 71 }
      ]
    },
    "Revenue Distribution": {
      "type": "treemap",
      "position": { "x": 8, "y": 14, "w": 4, "h": 4 },
      "config": {},
      "data": [
        { "name": "North America", "value": 450000 },
        { "name": "Europe", "value": 320000 },
        { "name": "Asia Pacific", "value": 280000 },
        { "name": "Latin America", "value": 150000 },
        { "name": "Middle East", "value": 100000 }
      ]
    },
    "Project Timeline": {
      "type": "timeline",
      "position": { "x": 0, "y": 18, "w": 6, "h": 4 },
      "config": { "orientation": "vertical" },
      "data": [
        { "title": "Project Kickoff", "date": "2024-01-15", "description": "Initial planning" },
        { "title": "Design Phase", "date": "2024-02-01", "description": "UI/UX design" },
        { "title": "Development", "date": "2024-02-15", "description": "Begin coding" },
        { "title": "Beta Release", "date": "2024-03-30", "description": "Testing" },
        { "title": "Launch", "date": "2024-04-15", "description": "Public release" }
      ]
    },
    "Task Board": {
      "type": "kanban",
      "position": { "x": 6, "y": 18, "w": 6, "h": 4 },
      "config": { "columns": ["To Do", "In Progress", "Done"] },
      "data": [
        { "id": "1", "title": "Design Homepage", "status": "todo", "priority": "high" },
        { "id": "2", "title": "API Integration", "status": "in-progress", "priority": "high" },
        { "id": "3", "title": "Write Tests", "status": "in-progress", "priority": "medium" },
        { "id": "4", "title": "Deploy to Staging", "status": "done", "priority": "high" },
        { "id": "5", "title": "Documentation", "status": "todo", "priority": "low" }
      ]
    },
    "Welcome Message": {
      "type": "text-block",
      "position": { "x": 0, "y": 22, "w": 4, "h": 3 },
      "config": { "fontSize": "medium", "alignment": "left" },
      "data": [{ 
        "content": "# Welcome!\\n\\nThis dashboard showcases all 20 component types with sample data." 
      }]
    },
    "Company Logo": {
      "type": "image",
      "position": { "x": 4, "y": 22, "w": 4, "h": 3 },
      "config": { "fit": "contain" },
      "data": [{ 
        "url": "https://via.placeholder.com/400x200/06b6d4/ffffff?text=Logo",
        "alt": "Company Logo"
      }]
    },
    "Event Calendar": {
      "type": "calendar",
      "position": { "x": 8, "y": 22, "w": 4, "h": 3 },
      "config": {},
      "data": [
        { "date": "2024-12-15", "title": "Team Meeting", "type": "meeting" },
        { "date": "2024-12-20", "title": "Product Launch", "type": "event" }
      ]
    },
    "Scatter Analysis": {
      "type": "scatter-plot",
      "position": { "x": 0, "y": 25, "w": 4, "h": 4 },
      "config": {},
      "data": [
        { "spend": 1000, "revenue": 3500, "name": "Campaign A" },
        { "spend": 2000, "revenue": 7200, "name": "Campaign B" },
        { "spend": 1500, "revenue": 5100, "name": "Campaign C" }
      ]
    },
    "Office Locations": {
      "type": "map",
      "position": { "x": 4, "y": 25, "w": 4, "h": 4 },
      "config": { "center": { "lat": 40.7128, "lng": -74.0060 }, "zoom": 4 },
      "data": [
        { "lat": 40.7128, "lng": -74.0060, "name": "New York", "description": "HQ" },
        { "lat": 34.0522, "lng": -118.2437, "name": "Los Angeles", "description": "West" }
      ]
    },
    "Analytics Dashboard": {
      "type": "iframe",
      "position": { "x": 8, "y": 25, "w": 4, "h": 4 },
      "config": { "allowFullscreen": true },
      "data": [{ "url": "https://www.example.com/analytics" }]
    },
    "Custom Widget": {
      "type": "custom-html",
      "position": { "x": 0, "y": 29, "w": 12, "h": 3 },
      "config": { "sandboxed": true },
      "data": [{ 
        "html": "<div style='padding:20px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;color:white;text-align:center'><h2>Custom HTML</h2><p>Full flexibility!</p></div>"
      }]
    }
  }
}`;

export default function CreateFromTemplatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template');
  
  const [templateJson, setTemplateJson] = useState(DEFAULT_TEMPLATE);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardSlug, setDashboardSlug] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState('');
  const [hasInstalled, setHasInstalled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const installationRef = useRef(false);
  const api = useApi();

  // Reset installation state when templateId changes
  useEffect(() => {
    if (templateId) {
      setHasInstalled(false);
      setShowSuccess(false);
      setIsCreating(false);
      setError('');
      installationRef.current = false;
    }
  }, [templateId]);



  useEffect(() => {
    if (!templateId || hasInstalled) return;
    
    const installTemplate = async () => {
      // Double-check to prevent duplicate calls
      if (installationRef.current || hasInstalled) {
        console.log('Installation already in progress or completed');
        return;
      }
      
      console.log('Starting template installation...');
      installationRef.current = true;
      setHasInstalled(true);
      setIsCreating(true);
      setError('');
      
      try {
        const timestamp = Date.now();
        const slug = `${templateId}-${timestamp}`;
        
        console.log('Making API call to install template...');
        const response = await api.post<{ success: boolean; data: any }>(`/api/v1/templates/${templateId}/install`, {
          slug: slug
        });
        
        console.log('Template installation response:', response);
        
        if (response.success) {
          console.log('Template installed successfully, updating UI...');
          
          // Update UI to show success
          setIsCreating(false);
          setShowSuccess(true);
          
          console.log('UI updated, scheduling redirect...');
          
          // Redirect after a short delay
          setTimeout(() => {
            console.log('Executing redirect...');
            try {
              router.push('/dashboards');
            } catch (redirectError) {
              console.error('Router redirect failed:', redirectError);
              window.location.href = '/dashboards';
            }
          }, 1500);
          
        } else {
          console.error('Template installation failed:', response);
          setError('Failed to install template');
          setIsCreating(false);
          setHasInstalled(false);
          installationRef.current = false;
        }
      } catch (err) {
        console.error('Template installation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to install template');
        setIsCreating(false);
        setHasInstalled(false);
        installationRef.current = false;
      }
    };

    // Small delay to prevent React Strict Mode double execution
    const timeoutId = setTimeout(installTemplate, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [templateId, hasInstalled, router, api]);

  const handlePreview = async () => {
    setIsPreviewing(true);
    setError('');
    
    try {
      const response = await api.get<{ success: boolean; data: any }>('/api/v1/templates/preview');
      if (response.success) {
        setPreview(response.data);
      }
    } catch (err) {
      setError('Failed to load template preview');
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    setError('');
    
    try {
      // Parse the JSON
      const templateData = JSON.parse(templateJson);
      
      // Create dashboard from template
      const response = await api.post<{ success: boolean; data: any }>('/api/v1/templates/create-from-template', templateData);
      
      if (response.success) {
        // Redirect to the new dashboard
        router.push(`/dashboard/${response.data.dashboard.slug}`);
      } else {
        setError('Failed to create dashboard');
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your template configuration.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create dashboard');
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Show loading or success state when installing template
  if (templateId && (isCreating || showSuccess)) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          {showSuccess ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 text-green-400 text-6xl">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">Template Installed Successfully!</h2>
              <p className="text-gray-400 mb-4">Redirecting to your dashboards...</p>
              <Button 
                onClick={() => {
                  console.log('Manual redirect button clicked');
                  router.push('/dashboards');
                }}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Go to Dashboards Now
              </Button>
            </>
          ) : (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Installing Template</h2>
              <p className="text-gray-400">Creating your dashboard...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Show error state if template installation failed
  if (templateId && error && hasInstalled) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Installation Failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => router.push('/templates')} variant="outline">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a] opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.7),rgba(0,0,0,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboards">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboards
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Create from Template
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Generate a complete dashboard with all component types and sample data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Configuration */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Template Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your dashboard template settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-json">Template JSON</Label>
                <textarea
                  id="template-json"
                  className="flex min-h-[400px] w-full rounded-lg border border-white/20 bg-black/50 backdrop-blur-xl px-4 py-3 text-sm text-white font-mono placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-transparent resize-none"
                  placeholder={DEFAULT_TEMPLATE}
                  value={templateJson}
                  onChange={(e) => setTemplateJson(e.target.value)}
                />
                <p className="text-xs text-gray-400">
                  Edit the JSON to customize dashboard name and slug
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Separator />

              <div className="flex gap-3">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  disabled={isPreviewing}
                  className="flex-1"
                >
                  {isPreviewing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Template
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Dashboard
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Preview */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Template Preview</CardTitle>
              <CardDescription className="text-gray-400">
                What will be created
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!preview ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Eye className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">Click "Preview Template" to see what will be created</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {preview.template.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {preview.template.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-white">Components</h4>
                      <Badge variant="secondary">{preview.componentCount} total</Badge>
                    </div>
                    
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {preview.template.components.map((comp: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{comp.name}</p>
                            <p className="text-xs text-gray-400">{comp.type}</p>
                          </div>
                          <Badge variant="default" className="text-xs">
                            {comp.data?.length || 0} data points
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Component Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {preview.componentTypes.map((type: string) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Template Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">📊 Included Components</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 4 Metric Cards</li>
                  <li>• 6 Chart Types (Line, Bar, Pie, Area, Gauge, Funnel)</li>
                  <li>• Data Table with Pagination</li>
                  <li>• Progress Bars</li>
                  <li>• Advanced Visualizations (Heatmap, Treemap)</li>
                  <li>• Timeline & Kanban Board</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">✨ Features</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Pre-populated with sample data</li>
                  <li>• Responsive grid layout</li>
                  <li>• Real-time updates ready</li>
                  <li>• Fully customizable</li>
                  <li>• Production-ready components</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">🚀 Quick Start</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>1. Customize the JSON (optional)</li>
                  <li>2. Click "Create Dashboard"</li>
                  <li>3. Dashboard is instantly ready</li>
                  <li>4. Edit components as needed</li>
                  <li>5. Connect to your data sources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
