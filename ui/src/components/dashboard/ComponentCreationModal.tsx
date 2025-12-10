'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Loader2, Search } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { Component, ComponentType } from '@/types/dashboard';
import { COMPONENT_TYPES, getComponentsByCategory } from '@/lib/component-types';

interface ComponentCreationModalProps {
  dashboardSlug: string;
  onClose: () => void;
  onComponentCreated: (component: Component) => void;
}

export default function ComponentCreationModal({
  dashboardSlug,
  onClose,
  onComponentCreated,
}: ComponentCreationModalProps) {
  const api = useApi();
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedType, setSelectedType] = useState<ComponentType | null>(null);
  const [componentName, setComponentName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = COMPONENT_TYPES.filter(comp =>
    comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { id: 'chart', label: 'Charts', emoji: '📊' },
    { id: 'data', label: 'Data Display', emoji: '📋' },
    { id: 'content', label: 'Content', emoji: '📝' },
    { id: 'layout', label: 'Layout', emoji: '🎨' },
  ];

  const handleSelectType = (type: ComponentType) => {
    setSelectedType(type);
    const typeInfo = COMPONENT_TYPES.find(t => t.type === type);
    setComponentName(typeInfo?.label || '');
    setStep('configure');
  };

  const handleCreate = async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      const typeInfo = COMPONENT_TYPES.find(t => t.type === selectedType);
      
      const payload = {
        type: selectedType,
        name: componentName,
        position: typeInfo?.defaultPosition || { x: 0, y: 0, w: 4, h: 4 },
        config: typeInfo?.defaultConfig || {},
        dataSource: { type: 'manual' },
        fieldSchema: [],
        styling: {},
      };

      const response = await api.post<{ success: boolean; data: Component }>(
        `/api/v1/dashboards/${dashboardSlug}/components`,
        payload
      );

      if (response.success) {
        onComponentCreated(response.data);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {step === 'select' ? 'Choose Component Type' : 'Configure Component'}
              </CardTitle>
              <CardDescription>
                {step === 'select' 
                  ? 'Select the type of component you want to add'
                  : 'Set up your component details'
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {step === 'select' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              {categories.map(category => {
                const categoryComponents = getComponentsByCategory(category.id).filter(comp =>
                  filteredComponents.includes(comp)
                );

                if (categoryComponents.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span>{category.emoji}</span>
                      {category.label}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {categoryComponents.map((comp) => (
                        <button
                          key={comp.type}
                          onClick={() => handleSelectType(comp.type)}
                          className="p-4 rounded-lg border-2 border-white/20 hover:border-cyan-500/50 hover:shadow-lg transition-all text-left isolate"
                        >
                          <div className="text-3xl mb-2">{comp.icon}</div>
                          <div className="font-semibold mb-1 text-white transition-colors">
                            {comp.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {comp.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {step === 'configure' && selectedType && (
            <div className="space-y-6">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={() => {
                  setStep('select');
                  setSelectedType(null);
                }}
              >
                ← Back to selection
              </Button>

              {/* Component Preview */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">
                    {COMPONENT_TYPES.find(t => t.type === selectedType)?.icon}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {COMPONENT_TYPES.find(t => t.type === selectedType)?.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {COMPONENT_TYPES.find(t => t.type === selectedType)?.description}
                  </p>
                </CardContent>
              </Card>

              {/* Component Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Component Name</label>
                <Input
                  type="text"
                  placeholder="Enter component name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  required
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 You can configure data fields, styling, and more after creating the component.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCreate}
                  disabled={loading || !componentName}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Component'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
