import { Card, CardContent } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  name: string;
  icon?: string;
  message?: string;
}

export default function EmptyState({ name, icon = '📊', message = 'No data configured' }: EmptyStateProps) {
  return (
    <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl">
      <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-4xl mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-400 mb-4">{message}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Database className="w-4 h-4" />
          <span>Add data to display content</span>
        </div>
      </CardContent>
    </Card>
  );
}
