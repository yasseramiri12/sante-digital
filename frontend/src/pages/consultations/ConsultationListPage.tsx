import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardPlus, Eye, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { consultationApi, patientApi, medecinApi } from '../../services/api';
import type { Consultation, ConsultationFormData, Patient, Medecin } from '../../types';
import { formatDateTime } from '../../utils/formatters';

const emptyForm = (): ConsultationFormData => ({
  patientId: 0, medecinId: 0, dateHeure: '', motif: '', diagnosticCim10: '', compteRendu: '',
});

const ConsultationListPage: React.FC = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients]           = useState<Patient[]>([]);
  const [medecins, setMedecins]           = useState<Medecin[]>([]);
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [editing, setEditing]             = useState<Consultation | null>(null);
  const [deleting, setDeleting]           = useState<Consultation | null>(null);
  const [form, setForm]                   = useState<ConsultationFormData>(emptyForm());
  const [saving, setSaving]               = useState(false);
  const [formError, setFormError]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, p, m] = await Promise.all([consultationApi.getAll(), patientApi.getAll(), medecinApi.getAll()]);
      setConsultations(c); setPatients(p); setMedecins(m);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    const now = new Date(); now.setMinutes(0, 0, 0);
    setForm({ ...emptyForm(), dateHeure: now.toISOString().slice(0, 16) });
    setFormError(''); setModalOpen(true);
  };
  const openEdit = (c: Consultation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(c);
    setForm({ patientId: c.patientId, medecinId: c.medecinId,
              dateHeure: c.dateHeure.slice(0, 16), motif: c.motif,
              diagnosticCim10: c.diagnosticCim10 ?? '', compteRendu: c.compteRendu ?? '' });
    setFormError(''); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.patientId) { setFormError('Sélectionnez un patient'); return; }
    if (!form.medecinId) { setFormError('Sélectionnez un médecin'); return; }
    if (!form.dateHeure) { setFormError('Date et heure requises'); return; }
    if (!form.motif)     { setFormError('Le motif est requis'); return; }
    setSaving(true); setFormError('');
    try {
      const data = { ...form, dateHeure: form.dateHeure + ':00' };
      if (editing) { await consultationApi.update(editing.consultationId, data); toast.success('Consultation mise à jour'); }
      else         { await consultationApi.create(data); toast.success('Consultation créée'); }
      setModalOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await consultationApi.delete(deleting.consultationId);
      toast.success('Consultation supprimée');
      setConfirmOpen(false); setDeleting(null); load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'dateHeure', label: 'Date & Heure', sortable: true,
      render: (c: Consultation) => (
        <div>
          <p className="font-medium text-slate-800">{formatDateTime(c.dateHeure)}</p>
        </div>
      ) },
    { key: 'patientNom', label: 'Patient', sortable: true,
      render: (c: Consultation) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
            {(c.patientNom ?? 'P')[0]}
          </div>
          <span className="font-medium text-slate-800">{c.patientNom ?? `#${c.patientId}`}</span>
        </div>
      ) },
    { key: 'medecinNom', label: 'Médecin', sortable: true,
      render: (c: Consultation) => <span className="text-slate-700">{c.medecinNom ?? `#${c.medecinId}`}</span> },
    { key: 'motif', label: 'Motif',
      render: (c: Consultation) => <span className="text-slate-600 text-sm">{c.motif}</span> },
    { key: 'diagnosticCim10', label: 'CIM-10', width: '90px',
      render: (c: Consultation) => c.diagnosticCim10
        ? <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{c.diagnosticCim10}</span>
        : <span className="text-slate-400">—</span> },
    { key: 'actions', label: '', width: '80px',
      render: (c: Consultation) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => navigate(`/consultations/${c.consultationId}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
            <Eye size={14} />
          </button>
          <button onClick={e => openEdit(c, e)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => { setDeleting(c); setConfirmOpen(true); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Consultations"
        subtitle={`${consultations.length} consultation${consultations.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouvelle consultation', icon: <ClipboardPlus size={16} />, onClick: openCreate }}
      />

      {loading ? <TableSkeleton rows={6} cols={6} /> : (
        <DataTable
          data={consultations} columns={columns as never}
          rowKey={c => c.consultationId} searchable
          searchKeys={['patientNom', 'medecinNom', 'motif', 'diagnosticCim10']}
          searchPlaceholder="Rechercher par patient, médecin, motif…"
          onRowClick={c => navigate(`/consultations/${c.consultationId}`)}
          emptyTitle="Aucune consultation"
          emptyAction={{ label: 'Nouvelle consultation', onClick: openCreate }}
        />
      )}

      {/* Form Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la consultation' : 'Nouvelle consultation'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="grid grid-cols-2 gap-4">
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
            <label className="label">Date & Heure <span className="text-red-500">*</span></label>
            <input type="datetime-local" className="input" value={form.dateHeure}
              onChange={e => setForm(f => ({ ...f, dateHeure: e.target.value }))} />
          </div>
          <div>
            <label className="label">Code CIM-10</label>
            <input className="input" value={form.diagnosticCim10 ?? ''} onChange={e => setForm(f => ({ ...f, diagnosticCim10: e.target.value }))}
              placeholder="J06.9" />
          </div>
          <div className="col-span-2">
            <label className="label">Motif <span className="text-red-500">*</span></label>
            <input className="input" value={form.motif} onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
              placeholder="Fièvre et toux persistante" />
          </div>
          <div className="col-span-2">
            <label className="label">Compte rendu</label>
            <textarea className="input min-h-[100px] resize-y" value={form.compteRendu ?? ''}
              onChange={e => setForm(f => ({ ...f, compteRendu: e.target.value }))}
              placeholder="Observations, diagnostic et plan de traitement…" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete} loading={saving}
        message={`Supprimer la consultation de "${deleting?.patientNom}" du ${formatDateTime(deleting?.dateHeure)} ?`} />
    </div>
  );
};

export default ConsultationListPage;
