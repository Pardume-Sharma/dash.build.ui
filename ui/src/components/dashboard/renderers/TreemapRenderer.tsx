'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TreemapRendererProps {
  data: any[];
  config: any;
  name: string;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function TreemapRenderer({ data, config, name }: TreemapRendererProps) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((d, index) => ({
    name: d.data.name || d.data.category || `Item ${index + 1}`,
    size: d.data.value || d.data.size || 0,
    fill: COLORS[index % COLORS.length],
  }));

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, size } = props;
    
    // Return null if dimensions are too small or data is missing
    if (!x || !y || !width || !height || width < 50 || height < 30) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.fill,
            stroke: '#0a0a0a',
            strokeWidth: 2,
          }}
        />
        {width > 80 && height > 40 && name && (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
              fontWeight="bold"
            >
              {name}
            </text>
            {size !== undefined && size !== null && (
              <text
                x={x + width / 2}
                y={y + height / 2 + 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
              >
                {Number(size).toLocaleString()}
              </text>
            )}
          </>
        )}
      </g>
    );
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={chartData}
            dataKey="size"
            stroke="#0a0a0a"
            fill="#06b6d4"
            content={<CustomContent />}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
