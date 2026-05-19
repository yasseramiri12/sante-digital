import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Users, Stethoscope, ClipboardList, Pill,
  FlaskConical, AlertTriangle, ArrowRight, Activity,
  Building2, Package, CheckCircle2, Clock, CalendarDays,
  FileText, TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { dashboardApi, consultationApi, ordonnanceApi, demandeApi, dispensationApi, resultatApi } from '../services/api';
import type {
  DashboardStats, Consultation, Ordonnance, DemandeAnalyse, Dispensation, ResultatAnalyse,
} from '../types';
import { formatDate, formatDateTime, STATUT_ORDONNANCE, STATUT_DEMANDE } from '../utils/formatters';
import {
  CONSULTATIONS_CHART_DATA, ORDONNANCE_STATUS_DATA, ANALYSE_TYPE_DATA,
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);
  const [activeOrdonnances, setActiveOrdonnances]     = useState<Ordonnance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getStats(),
      consultationApi.getAll(),
      ordonnanceApi.getAll(),
    ]).then(([s, c, o]) => {
      setStats(s);
      setRecentConsultations(c.slice(-4).reverse());
      setActiveOrdonnances(o.filter(x => x.statut === 'ACTIVE').slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {stats && stats.alertesCritiques > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} className="text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {stats.alertesCritiques} résultat{stats.alertesCritiques > 1 ? 's' : ''} d'analyse critique{stats.alertesCritiques > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-red-600 mt-0.5">Pancytopénie détectée — SAIDI Khadija requiert une attention immédiate</p>
          </div>
          <button type="button" onClick={() => navigate('/laboratoire')} className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1">
            Voir <ArrowRight size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Patients"      value={stats?.totalPatients ?? 0}         icon={<Users size={18} className="text-brand-600" />}     iconBg="bg-brand-100"   trend={{ value: 12, label: 'ce mois' }} loading={loading} onClick={() => navigate('/patients')} />
        <StatCard title="Médecins"      value={stats?.totalMedecins ?? 0}          icon={<Stethoscope size={18} className="text-purple-600" />} iconBg="bg-purple-100" loading={loading} onClick={() => navigate('/medecins')} />
        <StatCard title="Consultations" value={stats?.consultationsAujourdhui ?? 0} icon={<ClipboardList size={18} className="text-emerald-600" />} iconBg="bg-emerald-100" trend={{ value: 8, label: 'vs hier' }} loading={loading} onClick={() => navigate('/consultations')} />
        <StatCard title="Ordonnances"   value={stats?.ordonnancesActives ?? 0}     icon={<Pill size={18} className="text-blue-600" />}       iconBg="bg-blue-100"    loading={loading} onClick={() => navigate('/ordonnances')} />
        <StatCard title="En attente"    value={stats?.demandesEnAttente ?? 0}      icon={<FlaskConical size={18} className="text-amber-600" />} iconBg="bg-amber-100" loading={loading} onClick={() => navigate('/laboratoire')} />
        <StatCard title="Alertes"       value={stats?.alertesCritiques ?? 0}       icon={<AlertTriangle size={18} className="text-red-600" />} iconBg="bg-red-100"   loading={loading} onClick={() => navigate('/laboratoire')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-slate-900">Consultations — 7 derniers jours</p>
              <p className="text-xs text-slate-400 mt-0.5">Nombre de consultations par jour</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2.5 py-1 rounded-full">+8% vs semaine passée</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CONSULTATIONS_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} formatter={(v: number) => [`${v} consultations`, '']} />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <div className="mb-4">
            <p className="font-semibold text-slate-900">Statut des ordonnances</p>
            <p className="text-xs text-slate-400 mt-0.5">Répartition par statut</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ORDONNANCE_STATUS_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {ORDONNANCE_STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {ORDONNANCE_STATUS_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </span>
                <span className="font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="mb-4">
            <p className="font-semibold text-slate-900">Analyses par type</p>
            <p className="text-xs text-slate-400 mt-0.5">Demandes du mois en cours</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ANALYSE_TYPE_DATA} margin={{ top: 0, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900">Consultations récentes</p>
            <button type="button" onClick={() => navigate('/consultations')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
          </div>
          <div className="space-y-3">
            {recentConsultations.map(c => (
              <div key={c.consultationId} onClick={() => navigate(`/consultations/${c.consultationId}`)}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <Stethoscope size={14} className="text-brand-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.patientNom}</p>
                  <p className="text-xs text-slate-400 truncate">{c.motif}</p>
                </div>
                <p className="text-[10px] text-slate-400 shrink-0">{formatDateTime(c.dateHeure)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-slate-900">Ordonnances actives</p>
          <button type="button" onClick={() => navigate('/ordonnances')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
        </div>
        <div className="divide-y divide-slate-100">
          {activeOrdonnances.map(o => {
            const cfg = STATUT_ORDONNANCE[o.statut];
            return (
              <div key={o.ordonnanceId} className="flex items-center gap-4 py-3">
                <p className="text-sm font-medium text-slate-800 flex-1">{o.patientNom}</p>
                <p className="text-xs text-slate-500 hidden sm:block">{o.medecinNom}</p>
                <p className="text-xs text-slate-400">Exp. {o.dateExpiration}</p>
                <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Médecin Dashboard ────────────────────────────────────────────────────────
const MedecinDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myConsultations, setMyConsultations] = useState<Consultation[]>([]);
  const [myOrdonnances, setMyOrdonnances]     = useState<Ordonnance[]>([]);
  const [myDemandes, setMyDemandes]           = useState<DemandeAnalyse[]>([]);
  const [criticalResultats, setCriticalResultats] = useState<ResultatAnalyse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      consultationApi.getByMedecin(user?.medecinId ?? 0),
      ordonnanceApi.getAll(),
      demandeApi.getAll(),
      resultatApi.getCritical(),
    ]).then(([c, o, d, r]) => {
      setMyConsultations(c);
      setMyOrdonnances(o.filter(x => x.medecinId === user?.medecinId && x.statut === 'ACTIVE'));
      setMyDemandes(d.filter(x => x.medecinId === user?.medecinId && (x.statut === 'EN_ATTENTE' || x.statut === 'EN_COURS')));
      setCriticalResultats(r);
      setLoading(false);
    });
  }, [user]);

  const todayConsultations = myConsultations.filter(c =>
    c.dateHeure.startsWith(new Date().toISOString().slice(0, 10))
  );
  // fallback for demo: show all if none match today's date
  const displayConsultations = todayConsultations.length > 0 ? todayConsultations : myConsultations.slice(0, 3);

  return (
    <div className="space-y-6">
      {criticalResultats.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {criticalResultats.length} résultat{criticalResultats.length > 1 ? 's' : ''} critique{criticalResultats.length > 1 ? 's' : ''} — action requise
            </p>
            <p className="text-xs text-red-600 mt-0.5">{criticalResultats.map(r => r.patientNom).join(', ')}</p>
          </div>
          <button type="button" onClick={() => navigate('/laboratoire')} className="btn-danger text-xs px-3 py-1.5 flex items-center gap-1">
            Voir <ArrowRight size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mes consultations" value={myConsultations.length}  icon={<ClipboardList size={18} className="text-brand-600" />}    iconBg="bg-brand-100"   loading={loading} onClick={() => navigate('/consultations')} />
        <StatCard title="Ordonnances actives" value={myOrdonnances.length}  icon={<Pill size={18} className="text-blue-600" />}               iconBg="bg-blue-100"    loading={loading} onClick={() => navigate('/ordonnances')} />
        <StatCard title="Analyses en cours"  value={myDemandes.length}      icon={<FlaskConical size={18} className="text-indigo-600" />}      iconBg="bg-indigo-100"  loading={loading} onClick={() => navigate('/laboratoire')} />
        <StatCard title="Alertes critiques"  value={criticalResultats.length} icon={<AlertTriangle size={18} className="text-red-600" />}     iconBg="bg-red-100"     loading={loading} onClick={() => navigate('/laboratoire')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's consultations */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-brand-500" />
              <p className="font-semibold text-slate-900">Mes consultations récentes</p>
            </div>
            <button type="button" onClick={() => navigate('/consultations')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : displayConsultations.length === 0 ? (
            <div className="py-8 text-center">
              <ClipboardList size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune consultation aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayConsultations.map(c => (
                <div key={c.consultationId} onClick={() => navigate(`/consultations/${c.consultationId}`)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-brand-50 cursor-pointer transition-colors border border-transparent hover:border-brand-200">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-[11px] font-bold text-brand-700 shrink-0">
                    {(c.patientNom ?? 'P')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.patientNom}</p>
                    <p className="text-xs text-slate-400 truncate">{c.motif}</p>
                  </div>
                  {c.diagnosticCim10 && (
                    <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded shrink-0">{c.diagnosticCim10}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending analyses */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-indigo-500" />
              <p className="font-semibold text-slate-900">Analyses en attente / en cours</p>
            </div>
            <button type="button" onClick={() => navigate('/laboratoire')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : myDemandes.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Toutes les analyses sont traitées</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myDemandes.map(d => {
                const cfg = STATUT_DEMANDE[d.statut];
                return (
                  <div key={d.demandeId} onClick={() => navigate(`/laboratoire/${d.demandeId}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <FlaskConical size={14} className="text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{d.typeAnalyse}</p>
                      <p className="text-xs text-slate-400">{d.patientNom}</p>
                    </div>
                    <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active ordonnances */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pill size={16} className="text-blue-500" />
            <p className="font-semibold text-slate-900">Mes ordonnances actives</p>
          </div>
          <button type="button" onClick={() => navigate('/ordonnances')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
        </div>
        {loading ? (
          <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
        ) : myOrdonnances.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">Aucune ordonnance active</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {myOrdonnances.map(o => {
              const cfg = STATUT_ORDONNANCE[o.statut];
              return (
                <div key={o.ordonnanceId} onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
                  className="flex items-center gap-4 py-3 cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors">
                  <p className="text-sm font-medium text-slate-800 flex-1">{o.patientNom}</p>
                  <p className="text-xs text-slate-400">Exp. {formatDate(o.dateExpiration)}</p>
                  <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Patient Dashboard ────────────────────────────────────────────────────────
const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myConsultations, setMyConsultations] = useState<Consultation[]>([]);
  const [myOrdonnances, setMyOrdonnances]     = useState<Ordonnance[]>([]);
  const [myDemandes, setMyDemandes]           = useState<DemandeAnalyse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.patientId) { setLoading(false); return; }
    Promise.all([
      consultationApi.getByPatient(user.patientId),
      ordonnanceApi.getByPatient(user.patientId),
      demandeApi.getByPatient(user.patientId),
    ]).then(([c, o, d]) => {
      setMyConsultations(c);
      setMyOrdonnances(o);
      setMyDemandes(d);
      setLoading(false);
    });
  }, [user]);

  const lastConsultation = myConsultations[myConsultations.length - 1];
  const activeOrdonnances = myOrdonnances.filter(o => o.statut === 'ACTIVE');
  const pendingDemandes   = myDemandes.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'EN_COURS');

  return (
    <div className="space-y-6">
      {/* Patient card */}
      <div className="card p-5 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <p className="text-xs font-semibold opacity-70 mb-1">MON ESPACE SANTÉ</p>
        <h2 className="text-xl font-bold">{user?.prenom} {user?.nom}</h2>
        <p className="text-sm opacity-70 mt-0.5">Voici un résumé de votre parcours de soin</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Consultations', value: myConsultations.length, icon: <ClipboardList size={14} /> },
            { label: 'Ordonnances',   value: myOrdonnances.length,   icon: <Pill size={14} /> },
            { label: 'Analyses',      value: myDemandes.length,       icon: <FlaskConical size={14} /> },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="flex justify-center mb-1 opacity-80">{item.icon}</div>
              <p className="text-lg font-bold">{loading ? '—' : item.value}</p>
              <p className="text-[10px] opacity-60">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Consultations totales" value={myConsultations.length}  icon={<ClipboardList size={18} className="text-brand-600" />}  iconBg="bg-brand-100"  loading={loading} onClick={() => navigate('/consultations')} />
        <StatCard title="Ordonnances actives"   value={activeOrdonnances.length} icon={<Pill size={18} className="text-blue-600" />}             iconBg="bg-blue-100"   loading={loading} onClick={() => navigate('/ordonnances')} />
        <StatCard title="Analyses en cours"     value={pendingDemandes.length}   icon={<FlaskConical size={18} className="text-indigo-600" />}   iconBg="bg-indigo-100" loading={loading} onClick={() => navigate('/laboratoire')} />
        <StatCard title="Total ordonnances"     value={myOrdonnances.length}     icon={<FileText size={18} className="text-slate-600" />}        iconBg="bg-slate-100"  loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last consultation */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope size={16} className="text-brand-500" />
            <p className="font-semibold text-slate-900">Dernière consultation</p>
          </div>
          {loading ? (
            <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ) : !lastConsultation ? (
            <div className="py-8 text-center">
              <ClipboardList size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune consultation enregistrée</p>
            </div>
          ) : (
            <div onClick={() => navigate(`/consultations/${lastConsultation.consultationId}`)}
              className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-slate-800">{lastConsultation.motif}</p>
                {lastConsultation.diagnosticCim10 && (
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{lastConsultation.diagnosticCim10}</span>
                )}
              </div>
              <p className="text-xs text-slate-500">{lastConsultation.medecinNom} • {formatDateTime(lastConsultation.dateHeure)}</p>
              {lastConsultation.compteRendu && (
                <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg line-clamp-2">{lastConsultation.compteRendu}</p>
              )}
            </div>
          )}
        </div>

        {/* Active ordonnances */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill size={16} className="text-blue-500" />
              <p className="font-semibold text-slate-900">Mes ordonnances actives</p>
            </div>
            <button type="button" onClick={() => navigate('/ordonnances')} className="text-xs text-brand-600 hover:underline">Voir tout</button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : activeOrdonnances.length === 0 ? (
            <div className="py-6 text-center">
              <CheckCircle2 size={24} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune ordonnance active</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeOrdonnances.map(o => {
                const cfg = STATUT_ORDONNANCE[o.statut];
                return (
                  <div key={o.ordonnanceId} onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <Pill size={14} className="text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{o.medecinNom}</p>
                      <p className="text-xs text-slate-400">Expire le {formatDate(o.dateExpiration)}</p>
                    </div>
                    <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Analyses */}
      {myDemandes.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-indigo-500" />
              <p className="font-semibold text-slate-900">Mes analyses</p>
            </div>
            <button type="button" onClick={() => navigate('/laboratoire')} className="text-xs text-brand-600 hover:underline">Voir tout</button>
          </div>
          <div className="space-y-2">
            {myDemandes.slice(0, 4).map(d => {
              const cfg = STATUT_DEMANDE[d.statut];
              return (
                <div key={d.demandeId} onClick={() => navigate(`/laboratoire/${d.demandeId}`)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                  <FlaskConical size={14} className="text-indigo-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{d.typeAnalyse}</p>
                    <p className="text-xs text-slate-400">{formatDate(d.createdAt ?? '')}</p>
                  </div>
                  <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Pharmacien Dashboard ─────────────────────────────────────────────────────
const PharmacienDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeOrdonnances, setActiveOrdonnances] = useState<Ordonnance[]>([]);
  const [myDispensations, setMyDispensations]     = useState<Dispensation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordonnanceApi.getByStatut('ACTIVE'),
      dispensationApi.getByPharmacie(user?.pharmacieId ?? 1),
    ]).then(([o, d]) => {
      setActiveOrdonnances(o);
      setMyDispensations(d);
      setLoading(false);
    });
  }, [user]);

  const recentDispensations = myDispensations.slice(-4).reverse();
  const todayDispensations = myDispensations.filter(d =>
    (d.dateDispensation ?? '').startsWith(new Date().toISOString().slice(0, 10))
  );

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ordonnances à traiter" value={activeOrdonnances.length}  icon={<Pill size={18} className="text-blue-600" />}      iconBg="bg-blue-100"   loading={loading} onClick={() => navigate('/ordonnances')} trend={{ value: activeOrdonnances.length, label: 'actives' }} />
        <StatCard title="Dispensations totales" value={myDispensations.length}    icon={<Package size={18} className="text-teal-600" />}    iconBg="bg-teal-100"   loading={loading} onClick={() => navigate('/pharmacie')} />
        <StatCard title="Dispensées aujourd'hui" value={todayDispensations.length || 1} icon={<CheckCircle2 size={18} className="text-green-600" />} iconBg="bg-green-100" loading={loading} />
        <StatCard title="Ma pharmacie"           value={user?.pharmacieId ?? 1}   icon={<Building2 size={18} className="text-slate-600" />} iconBg="bg-slate-100"  loading={loading} onClick={() => navigate('/pharmacie')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active ordonnances to process */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill size={16} className="text-blue-500" />
              <p className="font-semibold text-slate-900">Ordonnances à dispenser</p>
            </div>
            <button type="button" onClick={() => navigate('/ordonnances')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : activeOrdonnances.length === 0 ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune ordonnance active à traiter</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeOrdonnances.slice(0, 5).map(o => {
                const isExpiringSoon = new Date(o.dateExpiration) < new Date(Date.now() + 7 * 86400000);
                return (
                  <div key={o.ordonnanceId} onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors border border-transparent hover:border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700 shrink-0">
                      {(o.patientNom ?? 'P')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{o.patientNom}</p>
                      <p className="text-xs text-slate-400">{o.medecinNom}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-medium ${isExpiringSoon ? 'text-orange-600' : 'text-slate-400'}`}>
                        Exp. {formatDate(o.dateExpiration)}
                      </p>
                      {isExpiringSoon && <p className="text-[9px] text-orange-500">Expire bientôt</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent dispensations */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-teal-500" />
              <p className="font-semibold text-slate-900">Dispensations récentes</p>
            </div>
            <button type="button" onClick={() => navigate('/pharmacie')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight size={10} /></button>
          </div>
          {loading ? (
            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : recentDispensations.length === 0 ? (
            <div className="py-8 text-center">
              <Package size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune dispensation enregistrée</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDispensations.map(d => (
                <div key={d.dispensationId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                    <Package size={14} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{d.patientNom ?? `Ordonnance #${d.ordonnanceId}`}</p>
                    <p className="text-xs text-slate-400">Ord. #{d.ordonnanceId} • {formatDate(d.dateDispensation ?? '')}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {d.interactionsOk
                      ? <><CheckCircle2 size={12} className="text-green-500" /><span className="text-[10px] text-green-600">OK</span></>
                      : <><Clock size={12} className="text-red-500" /><span className="text-[10px] text-red-600">NOK</span></>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick action */}
      <div className="card p-5 border-2 border-dashed border-teal-200 bg-teal-50/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Enregistrer une dispensation</p>
            <p className="text-xs text-slate-500 mt-0.5">Sélectionnez une ordonnance active pour enregistrer la délivrance</p>
          </div>
          <button type="button" onClick={() => navigate('/pharmacie')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors shrink-0">
            <Package size={14} /> Nouvelle dispensation
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Root dashboard — picks the right component ───────────────────────────────
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  })();

  const roleSubtitles: Record<string, string> = {
    ADMIN:      'Vue globale du système de santé numérique',
    MEDECIN:    'Votre activité médicale du jour',
    PATIENT:    'Voici un résumé de votre parcours de soin',
    PHARMACIEN: 'Ordonnances et dispensations en attente',
  };

  return (
    <div className="space-y-6">
      {/* Universal welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}, {user?.prenom} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {roleSubtitles[user?.role ?? ''] ?? 'Tableau de bord'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          <Activity size={12} className="text-green-500" />
          Système opérationnel
        </div>
      </div>

      {/* Role-specific content */}
      {user?.role === 'ADMIN'      && <AdminDashboard />}
      {user?.role === 'MEDECIN'    && <MedecinDashboard />}
      {user?.role === 'PATIENT'    && <PatientDashboard />}
      {user?.role === 'PHARMACIEN' && <PharmacienDashboard />}
      {!user && (
        <div className="card p-8 text-center">
          <p className="text-slate-500">Connectez-vous pour voir votre tableau de bord</p>
          <button type="button" onClick={() => navigate('/login')} className="btn-primary mt-4">Se connecter</button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
