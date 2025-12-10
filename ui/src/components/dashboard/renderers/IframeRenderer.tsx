'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IframeRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function IframeRenderer({ data, config, name }: IframeRendererProps) {
  if (!data || data.length === 0) return null;

  const url = data[0].data.url || '';
  const allowFullscreen = config?.allowFullscreen !== false;

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-white/5">
          {url ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              allowFullScreen={allowFullscreen}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🌐</div>
                <div className="text-sm">No URL provided</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
