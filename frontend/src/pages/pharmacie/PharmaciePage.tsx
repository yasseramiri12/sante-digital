import React, { useState } from 'react';
import { Building2, Package } from 'lucide-react';
import { clsx } from 'clsx';
import PharmacieListPage from './PharmacieListPage';
import DispensationListPage from './DispensationListPage';

type Tab = 'pharmacies' | 'dispensations';

const PharmaciePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('pharmacies');

  return (
    <div className="space-y-0">
      <div className="flex gap-1 mb-6 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('pharmacies')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            tab === 'pharmacies'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Building2 size={14} /> Pharmacies
        </button>
        <button
          onClick={() => setTab('dispensations')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            tab === 'dispensations'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          )}
        >
          <Package size={14} /> Dispensations
        </button>
      </div>

      {tab === 'pharmacies' ? <PharmacieListPage /> : <DispensationListPage />}
    </div>
  );
};

export default PharmaciePage;
