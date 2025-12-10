'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartRendererProps {
  data: any[];
  config: any;
  name: string;
}

import EmptyState from './EmptyState';

export default function LineChartRenderer({ data, config, name }: LineChartRendererProps) {
  if (!data || data.length === 0) return <EmptyState name={name} icon="📈" message="Add data points to display line chart" />;

  const chartData = data.map(d => d.data);
  const keys = Object.keys(chartData[0] || {}).filter(k => k !== 'month' && k !== 'date' && k !== 'period');

  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            {config?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />}
            <XAxis 
              dataKey={chartData[0]?.month ? 'month' : chartData[0]?.date ? 'date' : 'period'} 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
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
              <Line
                key={key}
                type={config?.smooth ? 'monotone' : 'linear'}
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={config?.showDots}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
