'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AreaChartRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function AreaChartRenderer({ data, config, name }: AreaChartRendererProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => d.data);
  const keys = Object.keys(chartData[0] || {}).filter(k => k !== 'date' && k !== 'week' && k !== 'month');

  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6'];

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey={chartData[0]?.date ? 'date' : chartData[0]?.week ? 'week' : 'month'} 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            {keys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId={config?.stacked ? "1" : undefined}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={config?.fillOpacity || 0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
