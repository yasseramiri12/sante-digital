import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, User, Stethoscope, FileText, Hash, Pill, FlaskConical } from 'lucide-react';
import { consultationApi, ordonnanceApi, demandeApi } from '../../services/api';
import type { Consultation, Ordonnance, DemandeAnalyse } from '../../types';
import { formatDateTime, STATUT_ORDONNANCE, STATUT_DEMANDE } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [ordonnances, setOrdonnances]   = useState<Ordonnance[]>([]);
  const [demandes, setDemandes]         = useState<DemandeAnalyse[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!id) return;
    const cid = parseInt(id);
    Promise.all([
      consultationApi.getById(cid),
      ordonnanceApi.getAll(),
      demandeApi.getAll(),
    ]).then(([c, o, d]) => {
      setConsultation(c);
      setOrdonnances(o.filter(x => x.consultationId === cid));
      setDemandes(d.filter(x => x.consultationId === cid));
      setLoading(false);
    }).catch(() => navigate('/consultations'));
  }, [id, navigate]);

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>;
  if (!consultation) return null;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/consultations')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Retour aux consultations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main info */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-lg text-slate-900">Détails de la consultation</h2>

          {[
            { icon: <CalendarDays size={16} />, label: 'Date & heure', value: formatDateTime(consultation.dateHeure) },
            { icon: <User size={16} />, label: 'Patient', value: consultation.patientNom ?? `#${consultation.patientId}` },
            { icon: <Stethoscope size={16} />, label: 'Médecin', value: consultation.medecinNom ?? `#${consultation.medecinId}` },
            { icon: <Hash size={16} />, label: 'CIM-10', value: consultation.diagnosticCim10 },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-brand-500 mt-0.5 shrink-0">{row.icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{row.label}</p>
                <p className="font-medium text-slate-800 mt-0.5">{row.value ?? '—'}</p>
              </div>
            </div>
          ))}

          {/* Motif */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Motif</p>
            <p className="text-sm text-amber-900">{consultation.motif}</p>
          </div>

          {/* Compte rendu */}
          {consultation.compteRendu && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-400" />
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compte rendu</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                {consultation.compteRendu}
              </p>
            </div>
          )}
        </div>

        {/* Side: Ordonnances + Demandes */}
        <div className="space-y-4">
          {/* Ordonnances */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill size={16} className="text-blue-500" />
                <h3 className="font-semibold text-slate-800">Ordonnances</h3>
              </div>
              <button onClick={() => navigate('/ordonnances')}
                className="text-xs text-brand-600 hover:underline">Voir tout</button>
            </div>
            {ordonnances.length === 0 ? (
              <EmptyState title="Aucune ordonnance" description="Aucune ordonnance pour cette consultation" className="py-6" />
            ) : (
              <div className="space-y-2">
                {ordonnances.map(o => {
                  const cfg = STATUT_ORDONNANCE[o.statut];
                  return (
                    <div key={o.ordonnanceId}
                      onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 cursor-pointer transition-colors border border-transparent hover:border-brand-200">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Ordonnance #{o.ordonnanceId}</p>
                        <p className="text-xs text-slate-400">Expire: {o.dateExpiration}</p>
                      </div>
                      <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Demandes d'analyse */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical size={16} className="text-indigo-500" />
                <h3 className="font-semibold text-slate-800">Analyses demandées</h3>
              </div>
              <button onClick={() => navigate('/laboratoire')}
                className="text-xs text-brand-600 hover:underline">Voir tout</button>
            </div>
            {demandes.length === 0 ? (
              <EmptyState title="Aucune analyse" description="Aucune demande d'analyse pour cette consultation" className="py-6" />
            ) : (
              <div className="space-y-2">
                {demandes.map(d => {
                  const cfg = STATUT_DEMANDE[d.statut];
                  return (
                    <div key={d.demandeId}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.typeAnalyse}</p>
                        <p className="text-xs text-slate-400">#{d.demandeId}</p>
                      </div>
                      <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;
