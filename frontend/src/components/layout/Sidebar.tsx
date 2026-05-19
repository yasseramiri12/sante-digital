import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, ClipboardList,
  Pill, FlaskConical, Building2, ChevronLeft, ChevronRight,
  Heart, ShieldPlus, Activity,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  module: string;
  badge?: number;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de bord', icon: <LayoutDashboard size={18} />, to: '/dashboard',     module: 'dashboard' },
  { label: 'Patients',        icon: <Users size={18} />,           to: '/patients',      module: 'patients' },
  { label: 'Médecins',        icon: <Stethoscope size={18} />,     to: '/medecins',      module: 'medecins' },
  { label: 'Consultations',   icon: <ClipboardList size={18} />,   to: '/consultations', module: 'consultations' },
  { label: 'Ordonnances',     icon: <Pill size={18} />,            to: '/ordonnances',   module: 'ordonnances' },
  { label: 'Laboratoire',     icon: <FlaskConical size={18} />,    to: '/laboratoire',   module: 'laboratoire' },
  { label: 'Pharmacies',      icon: <Building2 size={18} />,       to: '/pharmacie',     module: 'pharmacie' },
];

const ROLE_NAV_MAP: Record<string, string[]> = {
  ADMIN:      ['dashboard', 'patients', 'medecins', 'consultations', 'ordonnances', 'laboratoire', 'pharmacie'],
  MEDECIN:    ['dashboard', 'patients', 'consultations', 'ordonnances', 'laboratoire'],
  PATIENT:    ['dashboard', 'consultations', 'ordonnances', 'laboratoire'],
  PHARMACIEN: ['dashboard', 'ordonnances', 'pharmacie'],
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-500', MEDECIN: 'bg-blue-500',
  PATIENT: 'bg-green-500', PHARMACIEN: 'bg-orange-500',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur', MEDECIN: 'Médecin',
  PATIENT: 'Patient', PHARMACIEN: 'Pharmacien',
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const allowedModules = user ? (ROLE_NAV_MAP[user.role] ?? []) : [];
  const navItems = ALL_NAV_ITEMS.filter(item => allowedModules.includes(item.module));

  return (
    <aside
      className={clsx(
        'flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">SanteDigital</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Système de Santé</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Heart size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className={clsx(
            'p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* User card */}
      {user && !collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', ROLE_COLORS[user.role])}>
              {user.prenom[0]}{user.nom[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.prenom} {user.nom}</p>
              <p className="text-xs text-slate-400">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Navigation
          </p>
        )}
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800',
                collapsed && 'justify-center'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldPlus size={12} />
            <span>v0.1.0 — Prototype</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
            <Activity size={12} />
            <span>API: Mock (local)</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
