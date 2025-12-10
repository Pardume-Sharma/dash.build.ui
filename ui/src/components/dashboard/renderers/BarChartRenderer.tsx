'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartRendererProps {
  data: any[];
  config: any;
  name: string;
}

import EmptyState from './EmptyState';

export default function BarChartRenderer({ data, config, name }: BarChartRendererProps) {
  if (!data || data.length === 0) return <EmptyState name={name} icon="📊" message="Add data to display bar chart" />;

  const chartData = data.map(d => d.data);
  const keys = Object.keys(chartData[0] || {}).filter(k => 
    k !== 'product' && k !== 'campaign' && k !== 'category' && k !== 'name'
  );

  const xKey = chartData[0]?.product ? 'product' : 
               chartData[0]?.campaign ? 'campaign' : 
               chartData[0]?.category ? 'category' : 'name';

  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6'];

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={chartData}
            layout={config?.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            {config?.orientation === 'horizontal' ? (
              <>
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis type="category" dataKey={xKey} stroke="#9ca3af" style={{ fontSize: '12px' }} width={120} />
              </>
            ) : (
              <>
                <XAxis dataKey={xKey} stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              </>
            )}
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
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
