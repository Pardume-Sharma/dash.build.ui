'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GaugeRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function GaugeRenderer({ data, config, name }: GaugeRendererProps) {
  if (!data || data.length === 0) return null;

  const value = data[0].data.value || 0;
  const min = config?.min || 0;
  const max = config?.max || 100;
  const unit = config?.unit || '%';
  
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (percentage < 33) return '#ef4444';
    if (percentage < 66) return '#f59e0b';
    return '#10b981';
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-48 h-24">
            {/* Gauge background */}
            <svg viewBox="0 0 200 100" className="w-full h-full">
              <path
                d="M 20 90 A 80 80 0 0 1 180 90"
                fill="none"
                stroke="#ffffff20"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 90 A 80 80 0 0 1 180 90"
                fill="none"
                stroke={getColor()}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
              />
              {/* Needle */}
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="30"
                stroke={getColor()}
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${rotation} 100 90)`}
              />
              <circle cx="100" cy="90" r="6" fill={getColor()} />
            </svg>
          </div>
          
          <div className="text-center mt-4">
            <div className="text-4xl font-bold text-white">
              {value}{unit}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Range: {min} - {max}{unit}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
