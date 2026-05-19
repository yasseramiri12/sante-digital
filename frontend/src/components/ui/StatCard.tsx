import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: { value: number; label: string };
  loading?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<Props> = ({ title, value, icon, iconBg = 'bg-brand-100', trend, loading, onClick }) => {
  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-20" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={clsx('card p-5 transition-all duration-150', onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5')}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      {trend && (
        <div className="flex items-center gap-1">
          {trend.value > 0
            ? <TrendingUp size={12} className="text-emerald-500" />
            : trend.value < 0
              ? <TrendingDown size={12} className="text-red-500" />
              : <Minus size={12} className="text-slate-400" />
          }
          <span className={clsx(
            'text-xs font-medium',
            trend.value > 0 ? 'text-emerald-600' : trend.value < 0 ? 'text-red-600' : 'text-slate-400'
          )}>
            {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
