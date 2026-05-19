import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, Pencil, Trash2, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { patientApi } from '../../services/api';
import type { Patient, PatientFormData } from '../../types';
import { formatDate, calcAge, GROUPE_SANGUIN_OPTIONS } from '../../utils/formatters';

const BLOOD_COLORS: Record<string, 'red' | 'blue' | 'green' | 'orange' | 'purple'> = {
  'O+': 'red', 'O-': 'red', 'A+': 'blue', 'A-': 'blue',
  'B+': 'green', 'B-': 'green', 'AB+': 'purple', 'AB-': 'purple',
};

const emptyForm = (): PatientFormData => ({
  nin: '', nom: '', prenom: '', dateNaissance: '', groupeSanguin: '',
  telephone: '', email: '', adresse: '',
});

const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing]         = useState<Patient | null>(null);
  const [deleting, setDeleting]       = useState<Patient | null>(null);
  const [form, setForm]               = useState<PatientFormData>(emptyForm());
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setPatients(await patientApi.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setFormError(''); setModalOpen(true); };
  const openEdit   = (p: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(p);
    setForm({ nin: p.nin, nom: p.nom, prenom: p.prenom, dateNaissance: p.dateNaissance,
              groupeSanguin: p.groupeSanguin ?? '', telephone: p.telephone ?? '',
              email: p.email ?? '', adresse: p.adresse ?? '' });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nin)  { setFormError('Le NIN est requis'); return; }
    if (!form.nom)  { setFormError('Le nom est requis'); return; }
    if (!form.prenom) { setFormError('Le prénom est requis'); return; }
    if (!form.dateNaissance) { setFormError('La date de naissance est requise'); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Format email invalide'); return;
    }
    setSaving(true); setFormError('');
    try {
      if (editing) {
        await patientApi.update(editing.patientId, form);
        toast.success('Patient mis à jour');
      } else {
        await patientApi.create(form);
        toast.success('Patient créé');
      }
      setModalOpen(false);
      load();
    } catch (err: unknown) {
      setFormError((err as Error).message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await patientApi.delete(deleting.patientId);
      toast.success('Patient supprimé');
      setConfirmOpen(false);
      setDeleting(null);
      load();
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'nin',    label: 'NIN',    sortable: true, width: '120px',
      render: (p: Patient) => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{p.nin}</span> },
    { key: 'nom',    label: 'Nom complet', sortable: true,
      render: (p: Patient) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">
            {p.prenom[0]}{p.nom[0]}
          </div>
          <div>
            <p className="font-medium text-slate-800">{p.nom} {p.prenom}</p>
            <p className="text-xs text-slate-400">{p.email ?? '—'}</p>
          </div>
        </div>
      ) },
    { key: 'dateNaissance', label: 'Âge', sortable: true, width: '100px',
      render: (p: Patient) => (
        <div>
          <p className="text-sm">{calcAge(p.dateNaissance)} ans</p>
          <p className="text-xs text-slate-400">{formatDate(p.dateNaissance)}</p>
        </div>
      ) },
    { key: 'groupeSanguin', label: 'Groupe', width: '80px',
      render: (p: Patient) => p.groupeSanguin
        ? <StatusBadge label={p.groupeSanguin} color={BLOOD_COLORS[p.groupeSanguin] ?? 'gray'} dot={false} size="sm" />
        : <span className="text-slate-400">—</span> },
    { key: 'telephone', label: 'Téléphone', width: '120px',
      render: (p: Patient) => <span className="text-slate-600">{p.telephone ?? '—'}</span> },
    { key: 'actions', label: 'Actions', width: '110px',
      render: (p: Patient) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => navigate(`/patients/${p.patientId}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Voir">
            <Eye size={14} />
          </button>
          <button onClick={e => openEdit(p, e)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Modifier">
            <Pencil size={14} />
          </button>
          <button onClick={e => { e.stopPropagation(); setDeleting(p); setConfirmOpen(true); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
            <Trash2 size={14} />
          </button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} patient${patients.length !== 1 ? 's' : ''} enregistré${patients.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouveau patient', icon: <UserPlus size={16} />, onClick: openCreate }}
      />

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <DataTable
          data={patients}
          columns={columns as never}
          rowKey={p => p.patientId}
          searchable
          searchKeys={['nin', 'nom', 'prenom', 'email', 'telephone']}
          searchPlaceholder="Rechercher par NIN, nom, email…"
          onRowClick={p => navigate(`/patients/${p.patientId}`)}
          emptyTitle="Aucun patient"
          emptyDescription="Commencez par enregistrer votre premier patient"
          emptyAction={{ label: 'Nouveau patient', onClick: openCreate }}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le patient' : 'Nouveau patient'}
        subtitle={editing ? `Modification de ${editing.prenom} ${editing.nom}` : 'Remplissez les informations du patient'}
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer le patient'}
            </button>
          </>
        }
      >
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">NIN <span className="text-red-500">*</span></label>
            <input className="input" value={form.nin} onChange={e => setForm(f => ({ ...f, nin: e.target.value }))}
              placeholder="AB123456" disabled={!!editing} />
            {editing && <p className="text-xs text-slate-400 mt-1">Le NIN ne peut pas être modifié</p>}
          </div>
          <div>
            <label className="label">Groupe sanguin</label>
            <select className="input" value={form.groupeSanguin ?? ''} onChange={e => setForm(f => ({ ...f, groupeSanguin: e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {GROUPE_SANGUIN_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Nom <span className="text-red-500">*</span></label>
            <input className="input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value.toUpperCase() }))} placeholder="BENALI" />
          </div>
          <div>
            <label className="label">Prénom <span className="text-red-500">*</span></label>
            <input className="input" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} placeholder="Hamid" />
          </div>
          <div>
            <label className="label">Date de naissance <span className="text-red-500">*</span></label>
            <input type="date" className="input" value={form.dateNaissance}
              onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))} />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone ?? ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="0600000000" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="patient@email.com" />
          </div>
          <div className="col-span-2">
            <label className="label">Adresse</label>
            <input className="input" value={form.adresse ?? ''} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="12 Rue des Fleurs, Casablanca" />
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete}
        message={`Êtes-vous sûr de vouloir supprimer le patient "${deleting?.prenom} ${deleting?.nom}" ? Cette action est irréversible.`}
        loading={saving}
      />
    </div>
  );
};

export default PatientListPage;
