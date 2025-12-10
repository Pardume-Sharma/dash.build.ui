'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FunnelChartRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function FunnelChartRenderer({ data, config, name }: FunnelChartRendererProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => d.data);
  const maxValue = Math.max(...chartData.map(d => d.count));

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chartData.map((item, index) => {
            const percentage = (item.count / maxValue) * 100;
            const conversionRate = index > 0 ? ((item.count / chartData[index - 1].count) * 100).toFixed(1) : 100;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item.stage}</span>
                  <div className="flex items-center gap-2">
                    {config?.showValues && (
                      <span className="text-white font-medium">{item.count.toLocaleString()}</span>
                    )}
                    {config?.showPercentages && index > 0 && (
                      <span className="text-cyan-400 text-xs">({conversionRate}%)</span>
                    )}
                  </div>
                </div>
                <div className="relative h-10 bg-white/5 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
