'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface MapRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function MapRenderer({ data, config, name }: MapRendererProps) {
  if (!data || data.length === 0) return null;

  const markers = data.map(d => d.data);

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
          {/* Placeholder map - in production, integrate with Google Maps, Mapbox, or Leaflet */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm">Map View</div>
              <div className="text-xs mt-1">{markers.length} locations</div>
            </div>
          </div>
          
          {/* Marker list overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-lg p-4 max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {markers.slice(0, 5).map((marker, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white truncate">
                    {marker.name || marker.location}
                  </span>
                  {marker.value && (
                    <span className="text-gray-400 ml-auto">
                      {marker.value}
                    </span>
                  )}
                </div>
              ))}
              {markers.length > 5 && (
                <div className="text-xs text-gray-500 text-center">
                  +{markers.length - 5} more locations
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
