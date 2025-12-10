'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Circle } from 'lucide-react';

interface TimelineRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function TimelineRenderer({ data, config, name }: TimelineRendererProps) {
  if (!data || data.length === 0) return null;

  const events = data.map(d => d.data).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const orientation = config?.orientation || 'vertical';

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`relative ${orientation === 'vertical' ? 'space-y-6' : 'flex gap-6 overflow-x-auto'}`}>
          {events.map((event, index) => (
            <div key={index} className={`relative ${orientation === 'vertical' ? 'pl-8' : 'flex-shrink-0 w-64'}`}>
              {/* Timeline line */}
              {index < events.length - 1 && (
                <div className={`absolute ${
                  orientation === 'vertical' 
                    ? 'left-2 top-6 bottom-0 w-0.5' 
                    : 'top-2 left-full w-6 h-0.5'
                } bg-cyan-500/30`} />
              )}
              
              {/* Timeline dot */}
              <div className={`absolute ${
                orientation === 'vertical' ? 'left-0 top-1' : 'top-0 left-0'
              } w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-cyan-500/20`} />
              
              {/* Event content */}
              <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10">
                <div className="text-xs text-cyan-400 mb-1">
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="font-medium text-white mb-1">
                  {event.title || event.event}
                </div>
                {event.description && (
                  <div className="text-sm text-gray-400">
                    {event.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
