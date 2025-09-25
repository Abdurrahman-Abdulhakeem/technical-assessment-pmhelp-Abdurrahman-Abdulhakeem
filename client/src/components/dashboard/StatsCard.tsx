import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'blue',
  className
}) => {
  const colors = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      icon: 'bg-blue-100 text-blue-600',
      trend: 'text-blue-600'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      icon: 'bg-green-100 text-green-600',
      trend: 'text-green-600'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      icon: 'bg-purple-100 text-purple-600',
      trend: 'text-purple-600'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      icon: 'bg-red-100 text-red-600',
      trend: 'text-red-600'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      icon: 'bg-yellow-100 text-yellow-600',
      trend: 'text-yellow-600'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={cn('absolute inset-0 bg-gradient-to-r opacity-5', colors[color].bg)} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              
              {trend && (
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'text-xs font-medium',
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </span>
                  <span className="text-xs text-slate-500">from last month</span>
                </div>
              )}
            </div>
            
            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors[color].icon)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { StatsCard };
