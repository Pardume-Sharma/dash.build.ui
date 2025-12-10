'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';

interface CustomHTMLRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function CustomHTMLRenderer({ data, config, name }: CustomHTMLRendererProps) {
  if (!data || data.length === 0) return null;

  const htmlContent = data[0].data.html || data[0].data.content || '';
  const sandboxed = config?.sandboxed !== false;

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sandboxed ? (
          <iframe
            srcDoc={htmlContent}
            className="w-full h-96 border-0 rounded-lg bg-white"
            sandbox="allow-scripts"
            title={name}
          />
        ) : (
          <div 
            className="w-full min-h-[200px] rounded-lg p-4 bg-white/5"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </CardContent>
    </Card>
  );
}
