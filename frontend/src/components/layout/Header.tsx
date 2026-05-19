import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, ChevronDown, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard':    'Tableau de bord',
  '/patients':     'Patients',
  '/medecins':     'Médecins',
  '/consultations':'Consultations',
  '/ordonnances':  'Ordonnances',
  '/laboratoire':  'Laboratoire',
  '/pharmacie':    'Pharmacies',
};

const ROLE_BADGE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  MEDECIN: 'bg-blue-100 text-blue-700',
  PATIENT: 'bg-green-100 text-green-700',
  PHARMACIEN: 'bg-orange-100 text-orange-700',
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin', MEDECIN: 'Médecin', PATIENT: 'Patient', PHARMACIEN: 'Pharmacien',
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumb = BREADCRUMB_MAP['/' + pathSegments[0]] ?? pathSegments[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: 'Alerte critique: SAIDI Khadija — NFS', type: 'critical', time: 'il y a 5 min' },
    { id: 2, text: 'Nouvelle consultation créée', type: 'info', time: 'il y a 12 min' },
    { id: 3, text: 'Ordonnance #5 expire dans 7 jours', type: 'warning', time: 'il y a 1h' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">SanteDigital</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">{breadcrumb}</span>
        {pathSegments[1] && (
          <>
            <span className="text-slate-300">/</span>
            <span className="font-medium text-slate-600 capitalize">{pathSegments[1]}</span>
          </>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search (decorative placeholder) */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
          <Search size={14} />
          <span>Recherche rapide…</span>
          <kbd className="ml-2 text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setDropdownOpen(false); }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notifications</p>
                <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{notifications.length}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={clsx(
                        'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                        n.type === 'critical' ? 'bg-red-100' : n.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                      )}>
                        <AlertTriangle size={12} className={
                          n.type === 'critical' ? 'text-red-500' : n.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                        } />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100">
                <button className="text-xs text-brand-600 font-medium hover:underline">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">
                {user.prenom[0]}{user.nom[0]}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-800 leading-none">{user.prenom} {user.nom}</p>
                <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', ROLE_BADGE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Connecté en tant que</p>
                  <p className="text-sm font-semibold text-slate-800">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
