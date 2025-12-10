'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextBlockRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function TextBlockRenderer({ data, config, name }: TextBlockRendererProps) {
  if (!data || data.length === 0) return null;

  const content = data[0].data.content || data[0].data.text || '';
  const title = data[0].data.title || name;

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-invert max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
    </Card>
  );
}
