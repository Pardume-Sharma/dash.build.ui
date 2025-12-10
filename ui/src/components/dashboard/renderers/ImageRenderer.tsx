'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface ImageRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function ImageRenderer({ data, config, name }: ImageRendererProps) {
  if (!data || data.length === 0) return null;

  const imageUrl = data[0].data.url || data[0].data.src || '';
  const alt = data[0].data.alt || name;
  const caption = data[0].data.caption || '';
  const fit = config?.fit || 'cover';

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-white/5">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={alt}
                className={`w-full h-full ${fit === 'cover' ? 'object-cover' : fit === 'contain' ? 'object-contain' : 'object-fill'}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div className="text-sm">No image</div>
                </div>
              </div>
            )}
          </div>
          {caption && (
            <p className="text-sm text-gray-400 text-center">{caption}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
