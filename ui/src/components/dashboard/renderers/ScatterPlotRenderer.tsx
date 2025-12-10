'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScatterPlotRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function ScatterPlotRenderer({ data, config, name }: ScatterPlotRendererProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => d.data);

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              type="number" 
              dataKey="value" 
              name="Value"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              type="number" 
              dataKey="frequency" 
              name="Frequency"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Scatter 
              name="Data Points" 
              data={chartData} 
              fill="#06b6d4"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
