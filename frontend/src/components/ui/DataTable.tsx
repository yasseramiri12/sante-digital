import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import EmptyState from './EmptyState';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  toolbar?: React.ReactNode;
  caption?: string;
}

function DataTable<T>({
  data, columns, rowKey, searchable, searchKeys = [],
  searchPlaceholder = 'Rechercher…', onRowClick,
  emptyTitle = 'Aucun résultat', emptyDescription,
  emptyAction, toolbar, caption,
}: Props<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    if (!search.trim() || searchKeys.length === 0) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      searchKeys.some(k => String((row as Record<string, unknown>)[k as string] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String((a as Record<string, unknown>)[sortKey] ?? '');
      const bv = String((b as Record<string, unknown>)[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      {(searchable || toolbar) && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="input pl-8 pr-8 py-1.5 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={12} />
                </button>
              )}
            </div>
          )}
          {toolbar}
          {searchable && search && (
            <p className="text-xs text-slate-500 shrink-0">
              {sorted.length} résultat{sorted.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Caption */}
      {caption && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
          <p className="text-xs text-slate-500">{caption}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map(col => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide select-none',
                    col.sortable && 'cursor-pointer hover:text-slate-700',
                  )}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp size={12} className="text-brand-500" />
                        : <ChevronDown size={12} className="text-brand-500" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={clsx('table-row-hover', onRowClick && 'cursor-pointer')}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3.5 text-slate-700">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {sorted.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400">
            {sorted.length} enregistrement{sorted.length !== 1 ? 's' : ''}
            {search && ` sur ${data.length}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DataTable;
