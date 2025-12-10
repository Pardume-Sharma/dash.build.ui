'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressBarRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function ProgressBarRenderer({ data, config, name }: ProgressBarRendererProps) {
  if (!data || data.length === 0) return null;

  const progress = data[0].data.progress || 0;
  const label = data[0].data.label || '';

  const getColor = () => {
    if (progress < 33) return 'from-red-500 to-red-600';
    if (progress < 66) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColor()} rounded-full flex items-center justify-center`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            >
              {config?.showLabel && progress > 10 && (
                <span className="text-white text-sm font-medium px-2">
                  {progress}%
                </span>
              )}
            </div>
          </div>
          
          {label && (
            <div className="text-center text-gray-400 text-sm">
              {label}
            </div>
          )}
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
