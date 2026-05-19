import React, { useEffect, useState, useCallback } from 'react';
import { Building2, Pencil, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { pharmacieApi } from '../../services/api';
import type { Pharmacie, PharmacieFormData } from '../../types';

const emptyForm = (): PharmacieFormData => ({
  nom: '', adresse: '', telephone: '', email: '', responsable: '',
});

const PharmacieListPage: React.FC = () => {
  const [pharmacies, setPharmacies]   = useState<Pharmacie[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing]         = useState<Pharmacie | null>(null);
  const [deleting, setDeleting]       = useState<Pharmacie | null>(null);
  const [form, setForm]               = useState<PharmacieFormData>(emptyForm());
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setPharmacies(await pharmacieApi.getAll()); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setFormError(''); setModalOpen(true); };
  const openEdit   = (p: Pharmacie, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(p);
    setForm({ nom: p.nom, adresse: p.adresse ?? '', telephone: p.telephone ?? '', email: p.email ?? '', responsable: p.responsable ?? '' });
    setFormError(''); setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nom)       { setFormError('Le nom est requis'); return; }
    if (!form.adresse)   { setFormError('L\'adresse est requise'); return; }
    setSaving(true); setFormError('');
    try {
      if (editing) { await pharmacieApi.update(editing.pharmacieId, form); toast.success('Pharmacie mise à jour'); }
      else         { await pharmacieApi.create(form); toast.success('Pharmacie créée'); }
      setModalOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await pharmacieApi.delete(deleting.pharmacieId);
      toast.success('Pharmacie supprimée');
      setConfirmOpen(false); setDeleting(null); load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'nom', label: 'Pharmacie', sortable: true,
      render: (p: Pharmacie) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
            <Building2 size={16} className="text-teal-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{p.nom}</p>
            {p.responsable && <p className="text-xs text-slate-400">{p.responsable}</p>}
          </div>
        </div>
      ) },
    { key: 'adresse', label: 'Adresse',
      render: (p: Pharmacie) => (
        <div className="flex items-start gap-1.5 text-slate-600">
          <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
          <span className="text-sm">{p.adresse ?? '—'}</span>
        </div>
      ) },
    { key: 'telephone', label: 'Téléphone',
      render: (p: Pharmacie) => (
        <div className="flex items-center gap-1.5">
          <Phone size={12} className="text-slate-400" />
          <span className="text-sm text-slate-600">{p.telephone ?? '—'}</span>
        </div>
      ) },
    { key: 'email', label: 'Email',
      render: (p: Pharmacie) => (
        <div className="flex items-center gap-1.5">
          <Mail size={12} className="text-slate-400" />
          <span className="text-sm text-slate-600">{p.email ?? '—'}</span>
        </div>
      ) },
    { key: 'actions', label: 'Actions', width: '80px',
      render: (p: Pharmacie) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={e => openEdit(p, e)}
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => { setDeleting(p); setConfirmOpen(true); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Pharmacies"
        subtitle={`${pharmacies.length} pharmacie${pharmacies.length !== 1 ? 's' : ''} enregistrée${pharmacies.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nouvelle pharmacie', icon: <Building2 size={16} />, onClick: openCreate }}
      />

      {loading ? <TableSkeleton rows={4} cols={5} /> : (
        <DataTable
          data={pharmacies} columns={columns as never}
          rowKey={p => p.pharmacieId} searchable
          searchKeys={['nom', 'adresse', 'responsable', 'email']}
          searchPlaceholder="Rechercher par nom, adresse, responsable…"
          emptyTitle="Aucune pharmacie"
          emptyAction={{ label: 'Nouvelle pharmacie', onClick: openCreate }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la pharmacie' : 'Nouvelle pharmacie'}
        subtitle={editing ? `Modification de ${editing.nom}` : undefined}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleSave} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : editing ? 'Mettre à jour' : 'Créer la pharmacie'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="label">Nom <span className="text-red-500">*</span></label>
            <input className="input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Pharmacie Centrale" />
          </div>
          <div className="col-span-2">
            <label className="label">Adresse <span className="text-red-500">*</span></label>
            <input className="input" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="12 Avenue Hassan II, Casablanca" />
          </div>
          <div>
            <label className="label">Téléphone</label>
            <input className="input" value={form.telephone ?? ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} placeholder="0522001122" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email ?? ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contact@pharmacie.ma" />
          </div>
          <div className="col-span-2">
            <label className="label">Responsable</label>
            <input className="input" value={form.responsable ?? ''} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} placeholder="Dr. Amina TAZI" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete} loading={saving}
        message={`Supprimer "${deleting?.nom}" ? Cette action est irréversible.`} />
    </div>
  );
};

export default PharmacieListPage;
