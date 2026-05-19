import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps { className?: string; }

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={clsx('animate-pulse bg-slate-200 rounded', className)} />
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => (
  <div className="card overflow-hidden">
    <div className="h-14 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4">
      <Skeleton className="h-8 w-48" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-100">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="px-4 py-3">
              <Skeleton className="h-3 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r} className="border-b border-slate-50">
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} className="px-4 py-3.5">
                <Skeleton className={clsx('h-3', c === 0 ? 'w-32' : c === cols - 1 ? 'w-16' : 'w-24')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="card p-6 animate-pulse space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  </div>
);
