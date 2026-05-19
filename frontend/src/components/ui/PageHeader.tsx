import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
  extra?: React.ReactNode;
}

const PageHeader: React.FC<Props> = ({ title, subtitle, action, extra }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-3">
      {extra}
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.icon ?? <Plus size={16} />}
          {action.label}
        </button>
      )}
    </div>
  </div>
);

export default PageHeader;
