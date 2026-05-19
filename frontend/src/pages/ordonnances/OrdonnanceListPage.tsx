import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Eye, Trash2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { ordonnanceApi, patientApi, medecinApi, consultationApi } from '../../services/api';
import type { Ordonnance, OrdonnanceFormData, Patient, Medecin, Consultation } from '../../types';
import { formatDate, STATUT_ORDONNANCE } from '../../utils/formatters';

const emptyForm = (): OrdonnanceFormData => ({
  consultationId: 0, patientId: 0, medecinId: 0, dateExpiration: '',
});

const STATUS_FILTERS = ['Tous', 'EN_ATTENTE', 'ACTIVE', 'USED', 'EXPIRED'] as const;

const OrdonnanceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [ordonnances, setOrdonnances] = useState<Ordonnance[]>([]);
  const [patients, setPatients]       = useState<Patient[]>([]);
  const [medecins, setMedecins]       = useState<Medecin[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [modalOpen, setModalOpen]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting]       = useState<Ordonnance | null>(null);
  const [form, setForm]               = useState<OrdonnanceFormData>(emptyForm());
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, p, m, c] = await Promise.all([
        ordonnanceApi.getAll(), patientApi.getAll(), medecinApi.getAll(), consultationApi.getAll(),
      ]);
      setOrdonnances(o); setPatients(p); setMedecins(m); setConsultations(c);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = statusFilter === 'Tous'
    ? ordonnances
    : ordonnances.filter(o => o.statut === statusFilter);

  const handleCreate = async () => {
    if (!form.consultationId) { setFormError('Sélectionnez une consultation'); return; }
    if (!form.patientId)      { setFormError('Sélectionnez un patient'); return; }
    if (!form.medecinId)      { setFormError('Sélectionnez un médecin'); return; }
    if (!form.dateExpiration) { setFormError('Date d\'expiration requise'); return; }
    setSaving(true); setFormError('');
    try {
      await ordonnanceApi.create(form);
      toast.success('Ordonnance créée');
      setModalOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleClose = async (o: Ordonnance, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await ordonnanceApi.close(o.ordonnanceId);
      toast.success('Ordonnance clôturée');
      load();
    } catch (err: unknown) { toast.error((err as Error).message); }
  };

  const handleExpire = async (o: Ordonnance, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await ordonnanceApi.expire(o.ordonnanceId);
      toast.success('Ordonnance expirée');
      load();
    } catch (err: unknown) { toast.error((err as Error).message); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await ordonnanceApi.delete(deleting.ordonnanceId);
      toast.success('Ordonnance supprimée');
      setConfirmOpen(false); setDeleting(null); load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'ordonnanceId', label: '#', width: '60px',
      render: (o: Ordonnance) => <span className="font-mono text-xs text-slate-400">#{o.ordonnanceId}</span> },
    { key: 'patientNom', label: 'Patient', sortable: true,
      render: (o: Ordonnance) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
            {(o.patientNom ?? 'P')[0]}
          </div>
          <span className="font-medium text-slate-800">{o.patientNom ?? `#${o.patientId}`}</span>
        </div>
      ) },
    { key: 'medecinNom', label: 'Médecin', sortable: true,
      render: (o: Ordonnance) => <span className="text-slate-700">{o.medecinNom ?? `#${o.medecinId}`}</span> },
    { key: 'dateEmission', label: 'Émission', sortable: true,
      render: (o: Ordonnance) => <span className="text-slate-600 text-sm">{formatDate(o.dateEmission)}</span> },
    { key: 'dateExpiration', label: 'Expiration', sortable: true,
      render: (o: Ordonnance) => {
        const expired = new Date(o.dateExpiration) < new Date();
        return (
          <span className={`text-sm ${expired && o.statut === 'ACTIVE' ? 'text-red-500 font-medium' : 'text-slate-600'}`}>
            {formatDate(o.dateExpiration)}
          </span>
        );
      } },
    { key: 'statut', label: 'Statut', sortable: true,
      render: (o: Ordonnance) => {
        const cfg = STATUT_ORDONNANCE[o.statut];
        return <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" />;
      } },
    { key: 'actions', label: '', width: '110px',
      render: (o: Ordonnance) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => navigate(`/ordonnances/${o.ordonnanceId}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Voir">
            <Eye size={14} />
          </button>
          {o.statut === 'ACTIVE' && (
            <button onClick={e => handleClose(o, e)}
              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Clôturer">
              <XCircle size={14} />
            </button>
          )}
          {(o.statut === 'ACTIVE' || o.statut === 'EN_ATTENTE') && (
            <button onClick={e => handleExpire(o, e)}
              className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Expirer">
              <Clock size={14} />
            </button>
          )}
          <button onClick={() => { setDeleting(o); setConfirmOpen(true); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
            <Trash2 size={14} />
          </button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Ordonnances"
        subtitle={`${ordonnances.length} ordonnance${ordonnances.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouvelle ordonnance', icon: <Pill size={16} />, onClick: () => { setForm(emptyForm()); setFormError(''); setModalOpen(true); } }}
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(s => {
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {s === 'Tous' ? 'Tous' : STATUT_ORDONNANCE[s as keyof typeof STATUT_ORDONNANCE]?.label ?? s}
              {s !== 'Tous' && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {ordonnances.filter(o => o.statut === s).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? <TableSkeleton rows={6} cols={7} /> : (
        <DataTable
          data={filtered} columns={columns as never}
          rowKey={o => o.ordonnanceId} searchable
          searchKeys={['patientNom', 'medecinNom']}
          searchPlaceholder="Rechercher par patient, médecin…"
          onRowClick={o => navigate(`/ordonnances/${o.ordonnanceId}`)}
          emptyTitle="Aucune ordonnance"
          emptyAction={{ label: 'Nouvelle ordonnance', onClick: () => { setForm(emptyForm()); setFormError(''); setModalOpen(true); } }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="Nouvelle ordonnance" size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleCreate} className="btn-primary" disabled={saving}>
              {saving ? 'Création…' : 'Créer'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="space-y-4">
          <div>
            <label className="label">Consultation <span className="text-red-500">*</span></label>
            <select className="input" value={form.consultationId || ''} onChange={e => {
              const cid = +e.target.value;
              const c = consultations.find(x => x.consultationId === cid);
              setForm(f => ({ ...f, consultationId: cid, patientId: c?.patientId ?? 0, medecinId: c?.medecinId ?? 0 }));
            }}>
              <option value="">— Sélectionner —</option>
              {consultations.map(c => (
                <option key={c.consultationId} value={c.consultationId}>
                  #{c.consultationId} — {c.patientNom ?? `Patient #${c.patientId}`} ({formatDate(c.dateHeure)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Patient <span className="text-red-500">*</span></label>
            <select className="input" value={form.patientId || ''} onChange={e => setForm(f => ({ ...f, patientId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.nom} {p.prenom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Médecin <span className="text-red-500">*</span></label>
            <select className="input" value={form.medecinId || ''} onChange={e => setForm(f => ({ ...f, medecinId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {medecins.map(m => <option key={m.medecinId} value={m.medecinId}>Dr. {m.nom} {m.prenom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date d'expiration <span className="text-red-500">*</span></label>
            <input type="date" className="input" value={form.dateExpiration}
              onChange={e => setForm(f => ({ ...f, dateExpiration: e.target.value }))}
              min={new Date().toISOString().slice(0, 10)} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete} loading={saving}
        message={`Supprimer l'ordonnance #${deleting?.ordonnanceId} ? Cette action est irréversible.`} />
    </div>
  );
};

export default OrdonnanceListPage;
