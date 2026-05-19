import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, User, Stethoscope, CalendarDays, CheckCircle2, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordonnanceApi, dispensationApi } from '../../services/api';
import type { Ordonnance, Dispensation } from '../../types';
import { formatDate, STATUT_ORDONNANCE } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const OrdonnanceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ordonnance, setOrdonnance]     = useState<Ordonnance | null>(null);
  const [dispensations, setDispensations] = useState<Dispensation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [actioning, setActioning]       = useState(false);

  const load = async () => {
    if (!id) return;
    const oid = parseInt(id);
    try {
      const [o, d] = await Promise.all([
        ordonnanceApi.getById(oid),
        dispensationApi.getAll(),
      ]);
      setOrdonnance(o);
      setDispensations(d.filter(x => x.ordonnanceId === oid));
    } catch { navigate('/ordonnances'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const handleClose = async () => {
    if (!ordonnance) return;
    setActioning(true);
    try {
      await ordonnanceApi.close(ordonnance.ordonnanceId);
      toast.success('Ordonnance clôturée (USED)');
      load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setActioning(false); }
  };

  const handleExpire = async () => {
    if (!ordonnance) return;
    setActioning(true);
    try {
      await ordonnanceApi.expire(ordonnance.ordonnanceId);
      toast.success('Ordonnance expirée');
      load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setActioning(false); }
  };

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><CardSkeleton /><CardSkeleton /></div>
  );
  if (!ordonnance) return null;

  const cfg = STATUT_ORDONNANCE[ordonnance.statut];
  const isExpired = new Date(ordonnance.dateExpiration) < new Date();

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/ordonnances')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Retour aux ordonnances
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main info */}
        <div className="card p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Ordonnance #{ordonnance.ordonnanceId}</h2>
              <p className="text-sm text-slate-500 mt-0.5">Consultation #{ordonnance.consultationId}</p>
            </div>
            <StatusBadge label={cfg.label} color={cfg.color as 'green'} />
          </div>

          {[
            { icon: <User size={16} />, label: 'Patient', value: ordonnance.patientNom ?? `#${ordonnance.patientId}` },
            { icon: <Stethoscope size={16} />, label: 'Prescrit par', value: ordonnance.medecinNom ?? `#${ordonnance.medecinId}` },
            { icon: <CalendarDays size={16} />, label: 'Date d\'émission', value: formatDate(ordonnance.dateEmission) },
            { icon: <Clock size={16} />, label: 'Date d\'expiration', value: formatDate(ordonnance.dateExpiration) },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-brand-500 mt-0.5 shrink-0">{row.icon}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{row.label}</p>
                <p className="font-medium text-slate-800 mt-0.5">{row.value}</p>
              </div>
            </div>
          ))}

          {isExpired && ordonnance.statut === 'ACTIVE' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <Clock size={14} className="shrink-0" />
              Cette ordonnance a dépassé sa date d'expiration.
            </div>
          )}

          {/* Actions */}
          {(ordonnance.statut === 'ACTIVE' || ordonnance.statut === 'EN_ATTENTE') && (
            <div className="flex gap-2 pt-2">
              {ordonnance.statut === 'ACTIVE' && (
                <button onClick={handleClose} disabled={actioning}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                  <CheckCircle2 size={14} /> Clôturer (USED)
                </button>
              )}
              <button onClick={handleExpire} disabled={actioning}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">
                <Clock size={14} /> Marquer expirée
              </button>
            </div>
          )}
        </div>

        {/* Dispensations */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-teal-500" />
            <h3 className="font-semibold text-slate-800">Dispensations pharmacie</h3>
          </div>

          {dispensations.length === 0 ? (
            <EmptyState
              title="Aucune dispensation"
              description={
                ordonnance.statut === 'ACTIVE'
                  ? "Cette ordonnance n'a pas encore été dispensée"
                  : "Aucune dispensation enregistrée pour cette ordonnance"
              }
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {dispensations.map(d => (
                <div key={d.dispensationId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-800">Pharmacie #{d.pharmacieId}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      d.interactionsOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {d.interactionsOk ? 'Interactions OK' : 'Interactions NOK'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Dispensé le {formatDate(d.dateDispensation)}</p>
                  {d.observations && (
                    <p className="text-xs text-slate-500 mt-2 bg-white p-2 rounded-lg border border-slate-100">{d.observations}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status history legend */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Cycle de vie d'une ordonnance</p>
        <div className="flex items-center gap-2 flex-wrap">
          {(['EN_ATTENTE', 'ACTIVE', 'USED', 'EXPIRED'] as const).map((s, i) => {
            const c = STATUT_ORDONNANCE[s];
            const isCurrent = ordonnance.statut === s;
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                  isCurrent ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'
                }`}>
                  <StatusBadge label={c.label} color={c.color as 'green'} size="sm" dot />
                  {isCurrent && <span className="text-[10px] text-brand-600 font-semibold">← actuel</span>}
                </div>
                {i < 3 && <span className="text-slate-300">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdonnanceDetailPage;
