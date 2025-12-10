'use client';

import { useState } from 'react';
import { Component } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Database, Trash2, GripVertical, Loader2, X } from 'lucide-react';
import { api } from '@/lib/api';
import SchemaEditor from './SchemaEditor';
import DataEditor from './DataEditor';

interface ComponentWrapperProps {
  component: Component;
  editMode: boolean;
  onUpdate: () => void;
  onDataUpdate: () => void;
  children: React.ReactNode;
}

interface ComponentWrapperExtendedProps extends ComponentWrapperProps {
  onComponentClick?: (component: Component) => void;
}

export default function ComponentWrapper({
  component,
  editMode,
  onUpdate,
  onDataUpdate,
  onComponentClick,
  children,
}: ComponentWrapperExtendedProps) {
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);
  const [showDataEditor, setShowDataEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [schemaData, setSchemaData] = useState<any>(null);
  const [componentData, setComponentData] = useState<any[]>([]);

  const handleComponentClick = () => {
    if (!editMode && onComponentClick) {
      onComponentClick(component);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/v1/components/${component.componentId}`);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete component:', error);
      alert('Failed to delete component');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleOpenSchemaEditor = async () => {
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/api/v1/components/${component.componentId}/schema`);
      setSchemaData(response.data);
      setShowSchemaEditor(true);
    } catch (error) {
      console.error('Failed to fetch schema:', error);
      alert('Failed to load schema');
    }
  };

  const handleOpenDataEditor = async () => {
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/api/v1/components/${component.componentId}`);
      setComponentData(response.data.data || []);
      setShowDataEditor(true);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load data');
    }
  };

  const handleSaveSchema = async (schema: any[]) => {
    try {
      await api.put(`/api/v1/components/${component.componentId}/schema`, { fieldSchema: schema });
      setShowSchemaEditor(false);
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to save schema');
      throw error;
    }
  };

  return (
    <>
      <Card 
        className={`relative h-full border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group ${!editMode ? 'cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all' : ''}`}
        onClick={handleComponentClick}
      >
        {/* Edit Mode Overlay */}
        {editMode && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="drag-handle cursor-move p-1 hover:bg-white/10 rounded">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-xs text-gray-400 font-medium">{component.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenSchemaEditor}
                  className="h-7 px-2 hover:bg-cyan-500/20 hover:text-cyan-400"
                  title="Edit Schema"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenDataEditor}
                  className="h-7 px-2 hover:bg-blue-500/20 hover:text-blue-400"
                  title="Edit Data"
                >
                  <Database className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-7 px-2 hover:bg-red-500/20 hover:text-red-400"
                  title="Delete Component"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Component Content */}
        <div className="h-full overflow-auto">
          {children}
        </div>

        {/* Resize indicator when in edit mode */}
        {editMode && (
          <div className="absolute bottom-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-full h-full border-r-2 border-b-2 border-cyan-500/50" />
          </div>
        )}
      </Card>

      {/* Schema Editor Modal */}
      {showSchemaEditor && schemaData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setShowSchemaEditor(false)} className="bg-white/5">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SchemaEditor
              componentId={component.componentId}
              initialSchema={schemaData.fieldSchema || []}
              isLocked={schemaData.isLocked || false}
              onSave={handleSaveSchema}
            />
          </div>
        </div>
      )}

      {/* Data Editor Modal */}
      {showDataEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white">Edit Data - {component.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDataEditor(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <DataEditor
                componentId={component.componentId}
                schema={component.fieldSchema.map(f => ({
                  name: f.name,
                  type: f.type,
                  required: f.required || false
                }))}
                onDataChange={() => {
                  onDataUpdate();
                }}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-500/20 bg-white/5 backdrop-blur-xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Component</h3>
                  <p className="text-sm text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-white">"{component.name}"</span>? 
                All data will be permanently removed.
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
                  onClick={handleDelete}
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
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
