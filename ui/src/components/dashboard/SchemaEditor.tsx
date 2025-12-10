'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Lock, AlertCircle } from 'lucide-react';

interface Field {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

interface SchemaEditorProps {
  componentId: string;
  initialSchema: Field[];
  isLocked: boolean;
  onSave: (schema: Field[]) => Promise<void>;
}

export default function SchemaEditor({ 
  componentId, 
  initialSchema, 
  isLocked, 
  onSave 
}: SchemaEditorProps) {
  const [fields, setFields] = useState<Field[]>(initialSchema.length > 0 ? initialSchema : []);
  const [saving, setSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { name: '', type: 'string', required: false }]);
  };

  const removeField = (index: number) => {
    if (isLocked && index < initialSchema.length) {
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

  const isFieldLocked = (index: number) => {
    return isLocked && index < initialSchema.length;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(fields);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Field Schema Configuration</CardTitle>
          {isLocked && (
            <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">
              <Lock className="w-4 h-4" />
              Schema Locked
            </div>
          )}
        </div>
        {isLocked && (
          <p className="text-sm text-gray-400 mt-2">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Existing fields cannot be modified or removed because data exists. You can only add new fields.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="mb-4">No fields defined yet</p>
            <Button onClick={addField} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add First Field
            </Button>
          </div>
        )}

        {fields.map((field, index) => (
          <div key={index} className="flex gap-3 items-end p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex-1">
              <Label className="text-gray-300">Field Name</Label>
              <Input
                value={field.name}
                onChange={(e) => updateField(index, { name: e.target.value })}
                placeholder="field_name"
                disabled={isFieldLocked(index)}
                className={isFieldLocked(index) ? 'opacity-60' : ''}
              />
            </div>

            <div className="w-40">
              <Label className="text-gray-300">Type</Label>
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value })}
                disabled={isFieldLocked(index)}
                className={`flex h-10 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isFieldLocked(index) ? 'opacity-60' : ''}`}
              >
                <option value="string" className="bg-slate-900">String</option>
                <option value="number" className="bg-slate-900">Number</option>
                <option value="boolean" className="bg-slate-900">Boolean</option>
                <option value="date" className="bg-slate-900">Date</option>
                <option value="datetime" className="bg-slate-900">DateTime</option>
                <option value="email" className="bg-slate-900">Email</option>
                <option value="url" className="bg-slate-900">URL</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
                className="w-4 h-4"
                id={`required-${index}`}
              />
              <Label htmlFor={`required-${index}`} className="text-gray-300 text-sm">Required</Label>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => removeField(index)}
              disabled={isFieldLocked(index)}
              className={isFieldLocked(index) ? 'opacity-40' : ''}
            >
              {isFieldLocked(index) ? <Lock className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        ))}

        {fields.length > 0 && (
          <div className="flex gap-3 pt-4">
            <Button onClick={addField} variant="outline" className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              {saving ? 'Saving...' : 'Save Schema'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
