'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Save, X, Database } from 'lucide-react';
import { api } from '@/lib/api';

interface Field {
  name: string;
  type: string;
  required: boolean;
}

interface DataEditorProps {
  componentId: string;
  schema: Field[];
  onDataChange?: () => void;
}

export default function DataEditor({ componentId, schema, onDataChange }: DataEditorProps) {
  const [data, setData] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [componentId]);

  const fetchData = async () => {
    try {
      const response = await api.get<any>(`/api/v1/components/${componentId}/data`);
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newRow: any = { _id: 'new' };
    schema.forEach(field => {
      newRow[field.name] = field.type === 'boolean' ? false : field.type === 'number' ? 0 : '';
    });
    setEditingRow(newRow);
    setIsAdding(true);
  };

  const handleSave = async () => {
    try {
      const rowData: any = {};
      schema.forEach(field => {
        rowData[field.name] = editingRow[field.name];
      });

      if (isAdding) {
        await api.post(`/api/v1/components/${componentId}/data`, { data: rowData });
      } else {
        await api.put(`/api/v1/components/${componentId}/data/${editingRow._id}`, { data: rowData });
      }
      
      setEditingRow(null);
      setIsAdding(false);
      fetchData();
      onDataChange?.();
    } catch (error) {
      alert('Failed to save data');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this record?')) {
      try {
        await api.delete(`/api/v1/components/${componentId}/data/${id}`);
        fetchData();
        onDataChange?.();
      } catch (error) {
        alert('Failed to delete record');
      }
    }
  };

  const renderInput = (field: Field, value: any, onChange: (val: any) => void) => {
    switch (field.type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-8"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
    }
  };

  if (schema.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-12 text-center">
          <Database className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Schema Defined</h3>
          <p className="text-gray-400 mb-4">
            Please configure the field schema first before adding data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Component Data</CardTitle>
          <Button onClick={handleAdd} size="sm" className="shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {schema.map(field => (
                    <th key={field.name} className="text-left p-3 text-sm font-medium text-gray-300">
                      {field.name}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                      <div className="text-xs text-gray-500 font-normal">{field.type}</div>
                    </th>
                  ))}
                  <th className="text-right p-3 text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isAdding && editingRow && (
                  <tr className="border-b border-cyan-500/30 bg-cyan-500/10">
                    {schema.map(field => (
                      <td key={field.name} className="p-3">
                        {renderInput(field, editingRow[field.name], (val) => {
                          setEditingRow({ ...editingRow, [field.name]: val });
                        })}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditingRow(null); setIsAdding(false); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
                
                {data.map((row, index) => (
                  <tr key={row._id || index} className="border-b border-white/5 hover:bg-white/5">
                    {schema.map(field => (
                      <td key={field.name} className="p-3 text-sm text-gray-300">
                        {editingRow?._id === row._id ? (
                          renderInput(field, editingRow[field.name], (val) => {
                            setEditingRow({ ...editingRow, [field.name]: val });
                          })
                        ) : (
                          <span>{String(row.data?.[field.name] ?? row[field.name] ?? '')}</span>
                        )}
                      </td>
                    ))}
                    <td className="p-3 text-right">
                      {editingRow?._id === row._id ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingRow(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setEditingRow(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(row._id)}>
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {data.length === 0 && !isAdding && (
                  <tr>
                    <td colSpan={schema.length + 1} className="p-8 text-center text-gray-400">
                      No data yet. Click "Add Row" to insert your first record.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
