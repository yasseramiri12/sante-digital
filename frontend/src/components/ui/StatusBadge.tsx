import React from 'react';
import { clsx } from 'clsx';

type Color = 'green' | 'yellow' | 'blue' | 'gray' | 'red' | 'purple' | 'orange';

const COLOR_MAP: Record<Color, string> = {
  green:  'bg-emerald-100 text-emerald-700 ring-emerald-200',
  yellow: 'bg-amber-100   text-amber-700   ring-amber-200',
  blue:   'bg-blue-100    text-blue-700    ring-blue-200',
  gray:   'bg-slate-100   text-slate-600   ring-slate-200',
  red:    'bg-red-100     text-red-700     ring-red-200',
  purple: 'bg-purple-100  text-purple-700  ring-purple-200',
  orange: 'bg-orange-100  text-orange-700  ring-orange-200',
};

const DOT_MAP: Record<Color, string> = {
  green: 'bg-emerald-500', yellow: 'bg-amber-500', blue: 'bg-blue-500',
  gray: 'bg-slate-400', red: 'bg-red-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
};

interface Props {
  label: string;
  color: Color;
  dot?: boolean;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<Props> = ({ label, color, dot = true, size = 'md' }) => (
  <span className={clsx(
    'inline-flex items-center gap-1.5 font-medium rounded-full ring-1',
    COLOR_MAP[color],
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
  )}>
    {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', DOT_MAP[color])} />}
    {label}
  </span>
);

export default StatusBadge;
