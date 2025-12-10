'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeatmapRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function HeatmapRenderer({ data, config, name }: HeatmapRendererProps) {
  if (!data || data.length === 0) return null;

  const heatmapData = data.map(d => d.data);
  
  // Get unique days and hours
  const days = [...new Set(heatmapData.map(d => d.day))];
  const hours = [...new Set(heatmapData.map(d => d.hour))].sort((a, b) => a - b);
  
  const maxActivity = Math.max(...heatmapData.map(d => d.activity));

  const getColor = (activity: number) => {
    const intensity = activity / maxActivity;
    if (intensity > 0.75) return 'bg-cyan-500';
    if (intensity > 0.5) return 'bg-cyan-600';
    if (intensity > 0.25) return 'bg-cyan-700';
    return 'bg-cyan-900';
  };

  const getValue = (day: string, hour: number) => {
    const item = heatmapData.find(d => d.day === day && d.hour === hour);
    return item?.activity || 0;
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${hours.length}, 1fr)` }}>
              {/* Header row */}
              <div className="text-xs text-gray-400"></div>
              {hours.map(hour => (
                <div key={hour} className="text-xs text-gray-400 text-center p-1">
                  {hour}h
                </div>
              ))}
              
              {/* Data rows */}
              {days.map(day => (
                <React.Fragment key={day}>
                  <div className="text-xs text-gray-400 flex items-center pr-2">
                    {day}
                  </div>
                  {hours.map(hour => {
                    const value = getValue(day, hour);
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`aspect-square rounded ${getColor(value)} hover:ring-2 hover:ring-cyan-400 cursor-pointer`}
                        title={`${day} ${hour}:00 - ${value} activities`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-cyan-900"></div>
            <div className="w-4 h-4 rounded bg-cyan-700"></div>
            <div className="w-4 h-4 rounded bg-cyan-600"></div>
            <div className="w-4 h-4 rounded bg-cyan-500"></div>
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
