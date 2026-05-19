import React, { useEffect, useState, useCallback } from 'react';
import { Stethoscope, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { medecinApi } from '../../services/api';
import type { Medecin, MedecinFormData } from '../../types';
import { SPECIALITE_OPTIONS } from '../../utils/formatters';

const emptyForm = (): MedecinFormData => ({
  nom: '', prenom: '', specialite: '', numOrdre: '', telephone: '', email: '', cabinetAdresse: '',
});

const SPECIALITE_COLORS: Record<string, string> = {
  'Cardiologie': 'text-red-600 bg-red-50', 'Pédiatrie': 'text-blue-600 bg-blue-50',
  'Neurologie': 'text-purple-600 bg-purple-50', 'Endocrinologie': 'text-amber-600 bg-amber-50',
  'Médecine Générale': 'text-green-600 bg-green-50',
};

const MedecinListPage: React.FC = () => {
  const [medecins, setMedecins]       = useState<Medecin[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing]         = useState<Medecin | null>(null);
  const [deleting, setDeleting]       = useState<Medecin | null>(null);
  const [form, setForm]               = useState<MedecinFormData>(emptyForm());
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setMedecins(await medecinApi.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setFormError(''); setModalOpen(true); };
  const openEdit   = (m: Medecin, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(m);
    setForm({ nom: m.nom, prenom: m.prenom, specialite: m.specialite, numOrdre: m.numOrdre,
              telephone: m.telephone ?? '', email: m.email, cabinetAdresse: m.cabinetAdresse ?? '' });
    setFormError(''); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nom)       { setFormError('Le nom est requis'); return; }
    if (!form.prenom)    { setFormError('Le prénom est requis'); return; }
    if (!form.specialite){ setFormError('La spécialité est requise'); return; }
    if (!form.numOrdre)  { setFormError('Le numéro d\'ordre est requis'); return; }
    if (!form.email)     { setFormError('L\'email est requis'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) { await medecinApi.update(editing.medecinId, form); toast.success('Médecin mis à jour'); }
      else         { await medecinApi.create(form);                    toast.success('Médecin créé'); }
      setModalOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await medecinApi.delete(deleting.medecinId);
      toast.success('Médecin supprimé');
      setConfirmOpen(false); setDeleting(null); load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'nom', label: 'Médecin', sortable: true,
      render: (m: Medecin) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">
            {m.prenom[0]}{m.nom[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-800">Dr. {m.nom} {m.prenom}</p>
            <p className="text-xs text-slate-400">{m.email}</p>
          </div>
        </div>
      ) },
    { key: 'specialite', label: 'Spécialité', sortable: true,
      render: (m: Medecin) => (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${SPECIALITE_COLORS[m.specialite] ?? 'text-slate-600 bg-slate-100'}`}>
          {m.specialite}
        </span>
      ) },
    { key: 'numOrdre', label: 'N° Ordre', width: '130px',
      render: (m: Medecin) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{m.numOrdre}</span> },
    { key: 'telephone', label: 'Téléphone',
      render: (m: Medecin) => <span className="text-slate-600">{m.telephone ?? '—'}</span> },
    { key: 'cabinetAdresse', label: 'Cabinet',
      render: (m: Medecin) => <span className="text-slate-500 text-xs">{m.cabinetAdresse ?? '—'}</span> },
    { key: 'actions', label: 'Actions', width: '80px',
      render: (m: Medecin) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={e => openEdit(m, e)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => { setDeleting(m); setConfirmOpen(true); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Médecins"
        subtitle={`${medecins.length} médecin${medecins.length !== 1 ? 's' : ''} enregistré${medecins.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouveau médecin', icon: <Stethoscope size={16} />, onClick: openCreate }}
      />

      {loading ? <TableSkeleton rows={5} cols={6} /> : (
        <DataTable
          data={medecins} columns={columns as never}
          rowKey={m => m.medecinId} searchable
          searchKeys={['nom', 'prenom', 'email', 'specialite', 'numOrdre']}
          searchPlaceholder="Rechercher par nom, spécialité, N° ordre…"
          emptyTitle="Aucun médecin"
          emptyAction={{ label: 'Nouveau médecin', onClick: openCreate }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le médecin' : 'Nouveau médecin'}
        subtitle={editing ? `Modification de Dr. ${editing.prenom} ${editing.nom}` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer le médecin'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nom <span className="text-red-500">*</span></label>
            <input className="input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value.toUpperCase() }))} placeholder="MANSOURI" />
          </div>
          <div>
            <label className="label">Prénom <span className="text-red-500">*</span></label>
            <input className="input" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Khalid" />
          </div>
          <div>
            <label className="label">Spécialité <span className="text-red-500">*</span></label>
            <select className="input" value={form.specialite} onChange={e => setForm(f => ({ ...f, specialite: e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {SPECIALITE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">N° Ordre <span className="text-red-500">*</span></label>
            <input className="input" value={form.numOrdre} onChange={e => setForm(f => ({ ...f, numOrdre: e.target.value }))}
              placeholder="ORD-CARD-001" disabled={!!editing} />
          </div>
          <div>
            <label className="label">Email <span className="text-red-500">*</span></label>
            <input type="email" className="input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone ?? ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="label">Adresse du cabinet</label>
            <input className="input" value={form.cabinetAdresse ?? ''} onChange={e => setForm(f => ({ ...f, cabinetAdresse: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete} loading={saving}
        message={`Supprimer Dr. "${deleting?.prenom} ${deleting?.nom}" ? Cette action est irréversible.`} />
    </div>
  );
};

export default MedecinListPage;
