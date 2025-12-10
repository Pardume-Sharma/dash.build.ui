'use client';

import { useState, useEffect } from 'react';
import { Component } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Settings, Database, Loader2, Plus, Trash2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComponentSidebarProps {
  component: Component;
  onClose: () => void;
  onUpdate: () => void;
}

interface Field {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

export default function ComponentSidebar({ component, onClose, onUpdate }: ComponentSidebarProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'data'>('schema');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Schema state
  const [fields, setFields] = useState<Field[]>([]);
  const [isSchemaLocked, setIsSchemaLocked] = useState(false);
  
  // Data state
  const [data, setData] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isAddingRow, setIsAddingRow] = useState(false);

  useEffect(() => {
    fetchComponentDetails();
  }, [component.componentId]);

  const fetchComponentDetails = async () => {
    setLoading(true);
    try {
      // Fetch schema
      const schemaResponse = await api.get<{ success: boolean; data: any }>(
        `/api/v1/components/${component.componentId}/schema`
      );
      setFields(schemaResponse.data.fieldSchema || []);
      setIsSchemaLocked(schemaResponse.data.isLocked || false);

      // Fetch data
      const dataResponse = await api.get<{ success: boolean; data: any }>(
        `/api/v1/components/${component.componentId}`
      );
      setData(dataResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch component details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Schema Management
  const addField = () => {
    setFields([...fields, { name: '', type: 'string', required: false }]);
  };

  const removeField = (index: number) => {
    if (isSchemaLocked && index < component.fieldSchema.length) {
      alert('Cannot remove existing fields - component has data');
      return;
    }
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const saveSchema = async () => {
    setSaving(true);
    try {
      await api.put(`/api/v1/components/${component.componentId}/schema`, {
        fieldSchema: fields
      });
      await fetchComponentDetails();
      onUpdate();
      alert('Schema saved successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to save schema');
    } finally {
      setSaving(false);
    }
  };

  // Data Management
  const startAddingRow = () => {
    const newRow: any = { _id: 'new', data: {} };
    fields.forEach(field => {
      newRow.data[field.name] = field.type === 'boolean' ? false : field.type === 'number' ? 0 : '';
    });
    setEditingRow(newRow);
    setIsAddingRow(true);
  };

  const startEditingRow = (row: any) => {
    setEditingRow({ ...row });
    setIsAddingRow(false);
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setIsAddingRow(false);
  };

  const saveRow = async () => {
    setSaving(true);
    try {
      if (isAddingRow) {
        await api.post(`/api/v1/components/${component.componentId}/data`, {
          data: editingRow.data
        });
      } else {
        await api.put(
          `/api/v1/components/${component.componentId}/data/${editingRow._id}`,
          { data: editingRow.data }
        );
      }
      await fetchComponentDetails();
      onUpdate();
      setEditingRow(null);
      setIsAddingRow(false);
    } catch (error: any) {
      alert(error.message || 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    setSaving(true);
    try {
      await api.delete(`/api/v1/components/${component.componentId}/data/${recordId}`);
      await fetchComponentDetails();
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to delete record');
    } finally {
      setSaving(false);
    }
  };

  const updateEditingRowField = (fieldName: string, value: any) => {
    setEditingRow({
      ...editingRow,
      data: {
        ...editingRow.data,
        [fieldName]: value
      }
    });
  };

  const renderFieldInput = (field: Field, value: any, onChange: (val: any) => void) => {
    switch (field.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="h-8"
          />
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      case 'datetime':
        return (
          <Input
            type="datetime-local"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{component.name}</h3>
          <p className="text-xs text-gray-400">{component.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'schema' | 'data')} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 bg-white/5 mx-4 mt-4">
          <TabsTrigger value="schema" className="data-[state=active]:bg-cyan-500/20">
            <Settings className="w-4 h-4 mr-2" />
            Schema
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-cyan-500/20">
            <Database className="w-4 h-4 mr-2" />
            Data ({data.length})
          </TabsTrigger>
        </TabsList>

        {/* Schema Tab */}
        <TabsContent value="schema" className="flex-1 overflow-auto p-4 space-y-4">
          {isSchemaLocked && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
              ⚠️ Schema is locked. You can only add new fields.
            </div>
          )}

          {fields.length === 0 ? (
            <Card className="bg-white/5 border-white/10 p-8 text-center">
              <p className="text-gray-400 mb-4">No fields defined</p>
              <Button onClick={addField} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add First Field
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card key={index} className="bg-white/5 border-white/10 p-3">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-gray-400">Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                          disabled={isSchemaLocked && index < component.fieldSchema.length}
                          className="h-8"
                          placeholder="field_name"
                        />
                      </div>
                      <div className="w-32">
                        <Label className="text-xs text-gray-400">Type</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value })}
                          disabled={isSchemaLocked && index < component.fieldSchema.length}
                          className="flex h-8 w-full rounded-md border border-white/20 bg-white/5 px-2 text-sm text-white"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="date">Date</option>
                          <option value="datetime">DateTime</option>
                          <option value="email">Email</option>
                          <option value="url">URL</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(index, { required: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Required
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(index)}
                        disabled={isSchemaLocked && index < component.fieldSchema.length}
                        className="h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button onClick={addField} variant="outline" className="flex-1" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
            <Button onClick={saveSchema} disabled={saving} className="flex-1" size="sm">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Schema
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="flex-1 overflow-auto p-4 space-y-4">
          {fields.length === 0 ? (
            <Card className="bg-white/5 border-white/10 p-8 text-center">
              <p className="text-gray-400 mb-2">Define schema first</p>
              <p className="text-xs text-gray-500">Switch to Schema tab to add fields</p>
            </Card>
          ) : (
            <>
              {/* Add/Edit Row Form */}
              {editingRow && (
                <Card className="bg-cyan-500/10 border-cyan-500/30 p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    {isAddingRow ? 'Add New Record' : 'Edit Record'}
                  </h4>
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div key={field.name}>
                        <Label className="text-xs text-gray-400">
                          {field.name}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </Label>
                        {renderFieldInput(
                          field,
                          editingRow.data[field.name],
                          (val) => updateEditingRowField(field.name, val)
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={saveRow} disabled={saving} size="sm" className="flex-1">
                      {saving ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3 h-3 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button onClick={cancelEditing} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </Card>
              )}

              {/* Data List */}
              {data.length === 0 ? (
                <Card className="bg-white/5 border-white/10 p-8 text-center">
                  <p className="text-gray-400 mb-4">No data yet</p>
                  <Button onClick={startAddingRow} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Record
                  </Button>
                </Card>
              ) : (
                <div className="space-y-2">
                  {data.map((record) => (
                    <Card key={record._id} className="bg-white/5 border-white/10 p-3">
                      <div className="space-y-2">
                        {fields.map((field) => (
                          <div key={field.name} className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">{field.name}:</span>
                            <span className="text-white font-medium">
                              {field.type === 'boolean'
                                ? record.data[field.name] ? '✓' : '✗'
                                : record.data[field.name]?.toString() || '-'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                        <Button
                          onClick={() => startEditingRow(record)}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => deleteRow(record._id)}
                          variant="ghost"
                          size="sm"
                          className="h-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {!editingRow && data.length > 0 && (
                <Button onClick={startAddingRow} variant="outline" className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </Button>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
