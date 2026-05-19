import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Droplet,
  CalendarDays, ClipboardList, Pill, FlaskConical, QrCode,
} from 'lucide-react';
import { patientApi, consultationApi, ordonnanceApi, demandeApi } from '../../services/api';
import type { Patient, Consultation, Ordonnance, DemandeAnalyse } from '../../types';
import { formatDate, formatDateTime, calcAge, STATUT_ORDONNANCE, STATUT_DEMANDE } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { clsx } from 'clsx';

type Tab = 'consultations' | 'ordonnances' | 'analyses';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient]           = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [ordonnances, setOrdonnances]   = useState<Ordonnance[]>([]);
  const [demandes, setDemandes]         = useState<DemandeAnalyse[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<Tab>('consultations');

  useEffect(() => {
    if (!id) return;
    const pid = parseInt(id);
    Promise.all([
      patientApi.getById(pid),
      consultationApi.getByPatient(pid),
      ordonnanceApi.getByPatient(pid),
      demandeApi.getByPatient(pid),
    ]).then(([p, c, o, d]) => {
      setPatient(p); setConsultations(c); setOrdonnances(o); setDemandes(d);
      setLoading(false);
    }).catch(() => navigate('/patients'));
  }, [id, navigate]);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CardSkeleton />
      <div className="lg:col-span-2"><CardSkeleton /></div>
    </div>
  );
  if (!patient) return null;

  const TABS: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'consultations', label: 'Consultations', icon: <ClipboardList size={14} />, count: consultations.length },
    { key: 'ordonnances',   label: 'Ordonnances',   icon: <Pill size={14} />,          count: ordonnances.length   },
    { key: 'analyses',      label: 'Analyses',       icon: <FlaskConical size={14} />,  count: demandes.length      },
  ];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => navigate('/patients')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Retour aux patients
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="card p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-700 mb-3">
                {patient.prenom[0]}{patient.nom[0]}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{patient.nom} {patient.prenom}</h2>
              <p className="text-sm text-slate-500">{calcAge(patient.dateNaissance)} ans</p>
              {patient.groupeSanguin && (
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  <Droplet size={11} /> {patient.groupeSanguin}
                </span>
              )}
            </div>

            {/* Info rows */}
            <div className="space-y-3 text-sm">
              {[
                { icon: <User size={14} />, label: 'NIN', value: patient.nin },
                { icon: <CalendarDays size={14} />, label: 'Naissance', value: formatDate(patient.dateNaissance) },
                { icon: <Phone size={14} />, label: 'Téléphone', value: patient.telephone },
                { icon: <Mail size={14} />, label: 'Email', value: patient.email },
                { icon: <MapPin size={14} />, label: 'Adresse', value: patient.adresse },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5 shrink-0">{row.icon}</span>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">{row.label}</p>
                    <p className="font-medium text-slate-800">{row.value ?? '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Card mock */}
          <div className="card p-4 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold opacity-80">CARTE PATIENT</p>
              <QrCode size={16} className="opacity-60" />
            </div>
            <p className="font-bold">{patient.nom} {patient.prenom}</p>
            <p className="text-xs opacity-70 mt-0.5">NIN: {patient.nin}</p>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-70">
              <span>SanteDigital</span>
              <span>{patient.groupeSanguin ?? 'GS non renseigné'}</span>
            </div>
          </div>
        </div>

        {/* Tabs panel */}
        <div className="lg:col-span-2 card overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 bg-slate-50/50">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={clsx(
                  'flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2',
                  tab === t.key
                    ? 'border-brand-600 text-brand-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700',
                )}
              >
                {t.icon} {t.label}
                <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  tab === t.key ? 'bg-brand-100 text-brand-700' : 'bg-slate-200 text-slate-500')}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5 overflow-y-auto max-h-[480px]">
            {/* Consultations */}
            {tab === 'consultations' && (
              consultations.length === 0 ? (
                <EmptyState title="Aucune consultation" description="Ce patient n'a pas encore eu de consultation" />
              ) : (
                <div className="space-y-3">
                  {consultations.map(c => (
                    <div
                      key={c.consultationId}
                      onClick={() => navigate(`/consultations/${c.consultationId}`)}
                      className="p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">{c.motif}</p>
                          <p className="text-xs text-slate-500">{c.medecinNom} • {formatDateTime(c.dateHeure)}</p>
                        </div>
                        {c.diagnosticCim10 && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded shrink-0">{c.diagnosticCim10}</span>
                        )}
                      </div>
                      {c.compteRendu && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg line-clamp-2">{c.compteRendu}</p>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Ordonnances */}
            {tab === 'ordonnances' && (
              ordonnances.length === 0 ? (
                <EmptyState title="Aucune ordonnance" description="Aucune ordonnance prescrite pour ce patient" />
              ) : (
                <div className="space-y-3">
                  {ordonnances.map(o => {
                    const cfg = STATUT_ORDONNANCE[o.statut];
                    return (
                      <div key={o.ordonnanceId}
                        onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{o.medecinNom}</p>
                          <p className="text-xs text-slate-400">Émis le {formatDate(o.dateEmission)} • Expire le {o.dateExpiration}</p>
                        </div>
                        <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* Analyses */}
            {tab === 'analyses' && (
              demandes.length === 0 ? (
                <EmptyState title="Aucune analyse" description="Aucune demande d'analyse pour ce patient" />
              ) : (
                <div className="space-y-3">
                  {demandes.map(d => {
                    const cfg = STATUT_DEMANDE[d.statut];
                    return (
                      <div key={d.demandeId}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => navigate('/laboratoire')}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{d.typeAnalyse}</p>
                          <p className="text-xs text-slate-400">{formatDate(d.createdAt)}</p>
                        </div>
                        <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
