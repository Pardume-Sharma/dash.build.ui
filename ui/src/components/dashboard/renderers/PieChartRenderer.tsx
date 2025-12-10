'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartRendererProps {
  data: any[];
  config: any;
  name: string;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

import EmptyState from './EmptyState';

export default function PieChartRenderer({ data, config, name }: PieChartRendererProps) {
  if (!data || data.length === 0) return <EmptyState name={name} icon="🥧" message="Add data segments to display pie chart" />;

  const chartData = data.map(d => {
    const item = d.data;
    const nameKey = item.region || item.channel || item.category || item.name;
    const valueKey = item.revenue || item.spend || item.value || item.count;
    return {
      name: nameKey,
      value: valueKey
    };
  });

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={config?.showLabels}
              label={config?.showLabels ? ({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%` : false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            {config?.showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
