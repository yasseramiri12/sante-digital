import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, User, Stethoscope, CalendarDays, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { demandeApi, resultatApi } from '../../services/api';
import type { DemandeAnalyse, ResultatAnalyse } from '../../types';
import { formatDate, formatDateTime, STATUT_DEMANDE } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import { CardSkeleton } from '../../components/ui/Skeleton';

const DemandeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demande, setDemande]   = useState<DemandeAnalyse | null>(null);
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!id) return;
    const did = parseInt(id);
    Promise.all([
      demandeApi.getById(did),
      resultatApi.getByDemande(did).catch(() => null),
    ]).then(([d, r]) => {
      setDemande(d);
      setResultat(r);
    }).catch(() => navigate('/laboratoire'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUpdateStatut = async (statut: string) => {
    if (!demande) return;
    try {
      await demandeApi.updateStatut(demande.demandeId, statut);
      toast.success(`Statut mis à jour`);
      const updated = await demandeApi.getById(demande.demandeId);
      setDemande(updated);
    } catch (err: unknown) { toast.error((err as Error).message); }
  };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>
  );
  if (!demande) return null;

  const cfg = STATUT_DEMANDE[demande.statut as keyof typeof STATUT_DEMANDE];

  let parsedValues: Record<string, string> | null = null;
  if (resultat?.valeursJson) {
    try { parsedValues = JSON.parse(resultat.valeursJson); } catch { /* plain text */ }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/laboratoire')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Retour au laboratoire
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demande info */}
        <div className="card p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FlaskConical size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900">{demande.typeAnalyse}</h2>
                <p className="text-sm text-slate-500">Demande #{demande.demandeId}</p>
              </div>
            </div>
            {cfg && <StatusBadge label={cfg.label} color={cfg.color as 'green'} />}
          </div>

          {[
            { icon: <User size={16} />, label: 'Patient', value: demande.patientNom ?? `#${demande.patientId}` },
            { icon: <Stethoscope size={16} />, label: 'Prescrit par', value: demande.medecinNom ?? `#${demande.medecinId}` },
            { icon: <CalendarDays size={16} />, label: 'Date de demande', value: formatDate(demande.createdAt) },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-brand-500 mt-0.5 shrink-0">{row.icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{row.label}</p>
                <p className="font-medium text-slate-800 mt-0.5">{row.value}</p>
              </div>
            </div>
          ))}

          {/* Status transitions */}
          {demande.statut !== 'TERMINE' && demande.statut !== 'ANNULE' && (
            <div className="pt-2 flex gap-2 flex-wrap">
              {demande.statut === 'EN_ATTENTE' && (
                <button onClick={() => handleUpdateStatut('EN_COURS')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  <FlaskConical size={14} /> Démarrer l'analyse
                </button>
              )}
              <button onClick={() => handleUpdateStatut('ANNULE')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors">
                Annuler la demande
              </button>
            </div>
          )}
        </div>

        {/* Résultat */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-green-500" />
            <h3 className="font-semibold text-slate-800">Résultat d'analyse</h3>
          </div>

          {!resultat ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <FlaskConical size={32} className="text-slate-200 mb-3" />
              <p className="font-medium text-slate-500">
                {demande.statut === 'EN_COURS' ? 'Analyse en cours…' : 'Aucun résultat disponible'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {demande.statut === 'EN_COURS'
                  ? 'Le résultat sera affiché dès qu\'il sera enregistré'
                  : 'Le résultat sera disponible une fois l\'analyse terminée'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {resultat.alerteCritique && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={14} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">Alerte critique — notification envoyée au médecin</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Valeurs</p>
                {parsedValues ? (
                  <div className="space-y-1.5">
                    {Object.entries(parsedValues).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg">
                        <span className="text-xs font-medium text-slate-600 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-semibold text-slate-900 font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl font-mono whitespace-pre-wrap">
                    {resultat.valeursJson ?? 'N/A'}
                  </pre>
                )}
              </div>

              <p className="text-xs text-slate-400">
                Résultat enregistré le {formatDateTime(resultat.createdAt)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Workflow steps */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Progression</p>
        <div className="flex items-center gap-0">
          {(['EN_ATTENTE', 'EN_COURS', 'TERMINE'] as const).map((s, i) => {
            const c = STATUT_DEMANDE[s];
            const isCurrent = demande.statut === s;
            const isPast = (['EN_ATTENTE', 'EN_COURS', 'TERMINE'] as const).indexOf(demande.statut as never) > i;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isCurrent ? 'bg-brand-50 border border-brand-200' :
                  isPast ? 'opacity-60' : 'opacity-30'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isPast ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPast ? '✓' : i + 1}
                  </div>
                  <StatusBadge label={c.label} color={c.color as 'green'} size="sm" dot={false} />
                </div>
                {i < 2 && <div className={`h-px w-6 ${isPast ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemandeDetailPage;
