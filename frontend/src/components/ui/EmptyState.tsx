import React from 'react';
import { clsx } from 'clsx';
import { SearchX, Plus } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

const EmptyState: React.FC<Props> = ({ icon, title, description, action, className }) => (
  <div className={clsx('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
      {icon ?? <SearchX size={24} />}
    </div>
    <p className="text-base font-semibold text-slate-700 mb-1">{title}</p>
    {description && <p className="text-sm text-slate-400 max-w-xs mb-5">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="btn-primary">
        <Plus size={14} />
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
