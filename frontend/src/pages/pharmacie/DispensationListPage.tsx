import React, { useEffect, useState, useCallback } from 'react';
import { Package, Plus, Eye, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { dispensationApi, ordonnanceApi, pharmacieApi } from '../../services/api';
import type { Dispensation, DispensationFormData, Ordonnance, Pharmacie } from '../../types';
import { formatDate, STATUT_ORDONNANCE } from '../../utils/formatters';
import StatusBadge from '../../components/ui/StatusBadge';

const emptyForm = (): DispensationFormData => ({
  ordonnanceId: 0, pharmacieId: 0, observations: '', interactionsOk: true,
});

const DispensationListPage: React.FC = () => {
  const [dispensations, setDispensations] = useState<Dispensation[]>([]);
  const [ordonnances, setOrdonnances]     = useState<Ordonnance[]>([]);
  const [pharmacies, setPharmacies]       = useState<Pharmacie[]>([]);
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [detailOpen, setDetailOpen]       = useState(false);
  const [selected, setSelected]           = useState<Dispensation | null>(null);
  const [form, setForm]                   = useState<DispensationFormData>(emptyForm());
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, o, p] = await Promise.all([
        dispensationApi.getAll(), ordonnanceApi.getAll(), pharmacieApi.getAll(),
      ]);
      setDispensations(d); setOrdonnances(o); setPharmacies(p);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const activeOrdonnances = ordonnances.filter(o => o.statut === 'ACTIVE');

  const handleCreate = async () => {
    if (!form.ordonnanceId) { setFormError('Sélectionnez une ordonnance'); return; }
    if (!form.pharmacieId)  { setFormError('Sélectionnez une pharmacie'); return; }
    setSaving(true); setFormError('');
    try {
      await dispensationApi.create(form);
      toast.success('Dispensation enregistrée — ordonnance clôturée');
      setModalOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const openDetail = (d: Dispensation) => { setSelected(d); setDetailOpen(true); };

  const getOrdonnanceInfo = (id: number) => ordonnances.find(o => o.ordonnanceId === id);
  const getPharmacieName  = (id: number) => pharmacies.find(p => p.pharmacieId === id)?.nom ?? `#${id}`;

  const columns = [
    { key: 'dispensationId', label: '#', width: '60px',
      render: (d: Dispensation) => <span className="font-mono text-xs text-slate-400">#{d.dispensationId}</span> },
    { key: 'ordonnanceId', label: 'Ordonnance', sortable: true,
      render: (d: Dispensation) => {
        const o = getOrdonnanceInfo(d.ordonnanceId);
        return (
          <div>
            <p className="font-medium text-slate-800">Ord. #{d.ordonnanceId}</p>
            {o && <p className="text-xs text-slate-400">{o.patientNom ?? `Patient #${o.patientId}`}</p>}
          </div>
        );
      } },
    { key: 'pharmacieId', label: 'Pharmacie', sortable: true,
      render: (d: Dispensation) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
            <Package size={12} className="text-teal-600" />
          </div>
          <span className="text-slate-700">{getPharmacieName(d.pharmacieId)}</span>
        </div>
      ) },
    { key: 'dateDispensation', label: 'Date', sortable: true,
      render: (d: Dispensation) => <span className="text-slate-600 text-sm">{formatDate(d.dateDispensation)}</span> },
    { key: 'interactionsOk', label: 'Interactions', width: '110px',
      render: (d: Dispensation) => (
        <div className="flex items-center gap-1.5">
          {d.interactionsOk
            ? <><CheckCircle2 size={14} className="text-green-500" /><span className="text-xs text-green-700">Validées</span></>
            : <><XCircle size={14} className="text-red-500" /><span className="text-xs text-red-700">Problème</span></>
          }
        </div>
      ) },
    { key: 'actions', label: '', width: '60px',
      render: (d: Dispensation) => (
        <button onClick={() => openDetail(d)}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
          <Eye size={14} />
        </button>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Dispensations"
        subtitle={`${dispensations.length} dispensation${dispensations.length !== 1 ? 's' : ''} enregistrée${dispensations.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouvelle dispensation', icon: <Plus size={16} />, onClick: () => { setForm(emptyForm()); setFormError(''); setModalOpen(true); } }}
      />

      {/* Info banner */}
      <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2">
        <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
        <p className="text-sm text-teal-800">
          La création d'une dispensation clôture automatiquement l'ordonnance correspondante (statut → USED).
        </p>
      </div>

      {loading ? <TableSkeleton rows={4} cols={6} /> : (
        <DataTable
          data={dispensations} columns={columns as never}
          rowKey={d => d.dispensationId} searchable
          searchKeys={[]}
          searchPlaceholder="Rechercher…"
          onRowClick={openDetail}
          emptyTitle="Aucune dispensation"
          emptyAction={{ label: 'Nouvelle dispensation', onClick: () => { setForm(emptyForm()); setFormError(''); setModalOpen(true); } }}
        />
      )}

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="Nouvelle dispensation" size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleCreate} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer la dispensation'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="space-y-4">
          <div>
            <label className="label">Ordonnance active <span className="text-red-500">*</span></label>
            <select className="input" value={form.ordonnanceId || ''} onChange={e => setForm(f => ({ ...f, ordonnanceId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {activeOrdonnances.map(o => {
                const cfg = STATUT_ORDONNANCE[o.statut];
                return (
                  <option key={o.ordonnanceId} value={o.ordonnanceId}>
                    #{o.ordonnanceId} — {o.patientNom ?? `Patient #${o.patientId}`} ({cfg.label})
                  </option>
                );
              })}
            </select>
            {activeOrdonnances.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Aucune ordonnance active disponible.</p>
            )}
          </div>

          {form.ordonnanceId > 0 && (() => {
            const o = getOrdonnanceInfo(form.ordonnanceId);
            if (!o) return null;
            return (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><span className="font-medium">Patient:</span> {o.patientNom}</p>
                <p><span className="font-medium">Médecin:</span> {o.medecinNom}</p>
                <p><span className="font-medium">Expire le:</span> {formatDate(o.dateExpiration)}</p>
              </div>
            );
          })()}

          <div>
            <label className="label">Pharmacie <span className="text-red-500">*</span></label>
            <select className="input" value={form.pharmacieId || ''} onChange={e => setForm(f => ({ ...f, pharmacieId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {pharmacies.map(p => <option key={p.pharmacieId} value={p.pharmacieId}>{p.nom}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Observations</label>
            <textarea className="input min-h-[80px] resize-y"
              value={form.observations ?? ''}
              onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
              placeholder="Notes sur la dispensation…" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only"
                checked={form.interactionsOk}
                onChange={e => setForm(f => ({ ...f, interactionsOk: e.target.checked }))} />
              <div className={`w-10 h-5 rounded-full transition-colors ${form.interactionsOk ? 'bg-green-500' : 'bg-red-400'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.interactionsOk ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">
              Interactions médicamenteuses vérifiées
            </span>
          </label>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)}
        title={`Dispensation #${selected?.dispensationId}`} size="sm"
        footer={<button onClick={() => setDetailOpen(false)} className="btn-secondary">Fermer</button>}
      >
        {selected && (
          <div className="space-y-3">
            {[
              { label: 'Ordonnance', value: `#${selected.ordonnanceId} — ${getOrdonnanceInfo(selected.ordonnanceId)?.patientNom ?? ''}` },
              { label: 'Pharmacie', value: getPharmacieName(selected.pharmacieId) },
              { label: 'Date', value: formatDate(selected.dateDispensation) },
            ].map(row => (
              <div key={row.label}>
                <p className="text-xs text-slate-400 uppercase tracking-wide">{row.label}</p>
                <p className="font-medium text-slate-800 mt-0.5">{row.value}</p>
              </div>
            ))}
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Interactions</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {selected.interactionsOk
                  ? <><CheckCircle2 size={14} className="text-green-500" /><span className="text-sm text-green-700 font-medium">Validées</span></>
                  : <><XCircle size={14} className="text-red-500" /><span className="text-sm text-red-700 font-medium">Problème détecté</span></>
                }
              </div>
            </div>
            {selected.observations && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Observations</p>
                <p className="text-sm text-slate-700 mt-0.5 bg-slate-50 p-2 rounded-lg">{selected.observations}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DispensationListPage;
