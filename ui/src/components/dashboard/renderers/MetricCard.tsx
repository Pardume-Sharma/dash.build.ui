'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, ShoppingCart } from 'lucide-react';

interface MetricCardProps {
  data: any[];
  config: any;
  name: string;
}

export default function MetricCard({ data, config, name }: MetricCardProps) {
  // Show placeholder if no data
  if (!data || data.length === 0) {
    return (
      <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:border-cyan-500/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm text-gray-400">{name}</div>
            {config?.showIcon && (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400">
                <span className="text-2xl">📊</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-600">--</div>
            <div className="text-xs text-gray-500">No data configured</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const metric = data[0].data;
  const value = metric.value;
  const trend = metric.trend;
  const period = metric.period || '';
  
  const formatValue = (val: number) => {
    if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('value') || name.toLowerCase().includes('order')) {
      return `$${val.toLocaleString()}`;
    }
    if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('roi')) {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  const getIcon = () => {
    const iconName = config?.icon || '';
    switch (iconName) {
      case 'dollar': return <DollarSign className="w-6 h-6" />;
      case 'users': return <Users className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'shopping-cart': return <ShoppingCart className="w-6 h-6" />;
      default: return <TrendingUp className="w-6 h-6" />;
    }
  };

  return (
    <Card className="h-full border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl hover:border-cyan-500/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-sm text-gray-400">{name}</div>
          {config?.showIcon && (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-400">
              {getIcon()}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">
            {formatValue(value)}
          </div>
          
          {config?.showTrend && trend !== undefined && (
            <div className="flex items-center gap-2">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(trend)}%
              </span>
              {period && (
                <span className="text-sm text-gray-500">{period}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
