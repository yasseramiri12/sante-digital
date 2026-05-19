import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Plus, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { demandeApi, resultatApi, patientApi, medecinApi, consultationApi } from '../../services/api';
import type { DemandeAnalyse, ResultatFormData, Patient, Medecin, Consultation } from '../../types';
import { formatDate, STATUT_DEMANDE, ANALYSE_TYPE_OPTIONS } from '../../utils/formatters';

const STATUS_FILTERS = ['Tous', 'EN_ATTENTE', 'EN_COURS', 'TERMINE', 'ANNULE'] as const;

const emptyResultatForm = (): ResultatFormData => ({
  demandeId: 0, valeursJson: '', alerteCritique: false,
});

const DemandeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes]         = useState<DemandeAnalyse[]>([]);
  const [patients, setPatients]         = useState<Patient[]>([]);
  const [medecins, setMedecins]         = useState<Medecin[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [createOpen, setCreateOpen]     = useState(false);
  const [resultatOpen, setResultatOpen] = useState(false);
  const [confirmOpen, setConfirmOpen]   = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<DemandeAnalyse | null>(null);
  const [deleting, setDeleting]         = useState<DemandeAnalyse | null>(null);
  const [createForm, setCreateForm]     = useState({ consultationId: 0, patientId: 0, medecinId: 0, typeAnalyse: '' });
  const [resultatForm, setResultatForm] = useState<ResultatFormData>(emptyResultatForm());
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, p, m, c] = await Promise.all([
        demandeApi.getAll(), patientApi.getAll(), medecinApi.getAll(), consultationApi.getAll(),
      ]);
      setDemandes(d); setPatients(p); setMedecins(m); setConsultations(c);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = statusFilter === 'Tous'
    ? demandes
    : demandes.filter(d => d.statut === statusFilter);

  const handleCreateDemande = async () => {
    if (!createForm.consultationId) { setFormError('Sélectionnez une consultation'); return; }
    if (!createForm.patientId)      { setFormError('Sélectionnez un patient'); return; }
    if (!createForm.medecinId)      { setFormError('Sélectionnez un médecin'); return; }
    if (!createForm.typeAnalyse)    { setFormError('Sélectionnez un type d\'analyse'); return; }
    setSaving(true); setFormError('');
    try {
      await demandeApi.create(createForm);
      toast.success('Demande créée');
      setCreateOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleUpdateStatut = async (d: DemandeAnalyse, statut: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await demandeApi.updateStatut(d.demandeId, statut);
      toast.success(`Statut mis à jour: ${STATUT_DEMANDE[statut as keyof typeof STATUT_DEMANDE]?.label ?? statut}`);
      load();
    } catch (err: unknown) { toast.error((err as Error).message); }
  };

  const openResultat = (d: DemandeAnalyse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDemande(d);
    setResultatForm({ ...emptyResultatForm(), demandeId: d.demandeId });
    setFormError(''); setResultatOpen(true);
  };

  const handleSaveResultat = async () => {
    if (!resultatForm.valeursJson) { setFormError('Les valeurs sont requises'); return; }
    setSaving(true); setFormError('');
    try {
      await resultatApi.create(resultatForm);
      toast.success('Résultat enregistré');
      setResultatOpen(false); load();
    } catch (err: unknown) { setFormError((err as Error).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await demandeApi.delete(deleting.demandeId);
      toast.success('Demande supprimée');
      setConfirmOpen(false); setDeleting(null); load();
    } catch (err: unknown) { toast.error((err as Error).message); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'demandeId', label: '#', width: '60px',
      render: (d: DemandeAnalyse) => <span className="font-mono text-xs text-slate-400">#{d.demandeId}</span> },
    { key: 'typeAnalyse', label: 'Type d\'analyse', sortable: true,
      render: (d: DemandeAnalyse) => (
        <div className="flex items-center gap-2">
          <FlaskConical size={14} className="text-indigo-400 shrink-0" />
          <span className="font-medium text-slate-800">{d.typeAnalyse}</span>
        </div>
      ) },
    { key: 'patientNom', label: 'Patient', sortable: true,
      render: (d: DemandeAnalyse) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-[9px] font-bold text-brand-700">
            {(d.patientNom ?? 'P')[0]}
          </div>
          <span className="text-slate-700">{d.patientNom ?? `#${d.patientId}`}</span>
        </div>
      ) },
    { key: 'medecinNom', label: 'Médecin', sortable: true,
      render: (d: DemandeAnalyse) => <span className="text-slate-600 text-sm">{d.medecinNom ?? `#${d.medecinId}`}</span> },
    { key: 'createdAt', label: 'Date', sortable: true,
      render: (d: DemandeAnalyse) => <span className="text-slate-500 text-sm">{formatDate(d.createdAt)}</span> },
    { key: 'statut', label: 'Statut', sortable: true,
      render: (d: DemandeAnalyse) => {
        const cfg = STATUT_DEMANDE[d.statut as keyof typeof STATUT_DEMANDE];
        return cfg ? <StatusBadge label={cfg.label} color={cfg.color as 'green'} size="sm" /> : <span>{d.statut}</span>;
      } },
    { key: 'actions', label: '', width: '130px',
      render: (d: DemandeAnalyse) => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button onClick={() => navigate(`/laboratoire/${d.demandeId}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Voir">
            <Eye size={14} />
          </button>
          {d.statut === 'EN_ATTENTE' && (
            <button onClick={e => handleUpdateStatut(d, 'EN_COURS', e)}
              className="px-2 py-1 text-[10px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              Démarrer
            </button>
          )}
          {d.statut === 'EN_COURS' && (
            <button onClick={e => openResultat(d, e)}
              className="px-2 py-1 text-[10px] font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              Résultat
            </button>
          )}
          {d.statut !== 'TERMINE' && d.statut !== 'ANNULE' && (
            <button onClick={e => handleUpdateStatut(d, 'ANNULE', e)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Annuler">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ) },
  ];

  return (
    <div>
      <PageHeader
        title="Laboratoire"
        subtitle={`${demandes.length} demande${demandes.length !== 1 ? 's' : ''} d'analyse`}
        action={{ label: 'Nouvelle demande', icon: <Plus size={16} />, onClick: () => { setCreateForm({ consultationId: 0, patientId: 0, medecinId: 0, typeAnalyse: '' }); setFormError(''); setCreateOpen(true); } }}
      />

      {/* Status filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map(s => {
          const active = statusFilter === s;
          const cfg = s !== 'Tous' ? STATUT_DEMANDE[s as keyof typeof STATUT_DEMANDE] : null;
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              {cfg?.label ?? 'Tous'}
              {s !== 'Tous' && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {demandes.filter(d => d.statut === s).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? <TableSkeleton rows={6} cols={7} /> : (
        <DataTable
          data={filtered} columns={columns as never}
          rowKey={d => d.demandeId} searchable
          searchKeys={['typeAnalyse', 'patientNom', 'medecinNom']}
          searchPlaceholder="Rechercher par type, patient, médecin…"
          onRowClick={d => navigate(`/laboratoire/${d.demandeId}`)}
          emptyTitle="Aucune demande d'analyse"
          emptyAction={{ label: 'Nouvelle demande', onClick: () => { setCreateForm({ consultationId: 0, patientId: 0, medecinId: 0, typeAnalyse: '' }); setFormError(''); setCreateOpen(true); } }}
        />
      )}

      {/* Create demande modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)}
        title="Nouvelle demande d'analyse" size="md"
        footer={
          <>
            <button onClick={() => setCreateOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleCreateDemande} className="btn-primary" disabled={saving}>
              {saving ? 'Création…' : 'Créer la demande'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="space-y-4">
          <div>
            <label className="label">Consultation <span className="text-red-500">*</span></label>
            <select aria-label="Consultation" className="input" value={createForm.consultationId || ''} onChange={e => {
              const cid = +e.target.value;
              const c = consultations.find(x => x.consultationId === cid);
              setCreateForm(f => ({ ...f, consultationId: cid, patientId: c?.patientId ?? 0, medecinId: c?.medecinId ?? 0 }));
            }}>
              <option value="">— Sélectionner —</option>
              {consultations.map(c => (
                <option key={c.consultationId} value={c.consultationId}>
                  #{c.consultationId} — {c.patientNom ?? `Patient #${c.patientId}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Patient <span className="text-red-500">*</span></label>
            <select aria-label="Patient" className="input" value={createForm.patientId || ''} onChange={e => setCreateForm(f => ({ ...f, patientId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.nom} {p.prenom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Médecin <span className="text-red-500">*</span></label>
            <select aria-label="Médecin" className="input" value={createForm.medecinId || ''} onChange={e => setCreateForm(f => ({ ...f, medecinId: +e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {medecins.map(m => <option key={m.medecinId} value={m.medecinId}>Dr. {m.nom} {m.prenom}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Type d'analyse <span className="text-red-500">*</span></label>
            <select aria-label="Type d'analyse" className="input" value={createForm.typeAnalyse} onChange={e => setCreateForm(f => ({ ...f, typeAnalyse: e.target.value }))}>
              <option value="">— Sélectionner —</option>
              {ANALYSE_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Résultat modal */}
      <Modal open={resultatOpen} onClose={() => setResultatOpen(false)}
        title={`Résultat — ${selectedDemande?.typeAnalyse}`}
        subtitle={`Demande #${selectedDemande?.demandeId} · ${selectedDemande?.patientNom ?? 'Patient'}`}
        size="md"
        footer={
          <>
            <button onClick={() => setResultatOpen(false)} className="btn-secondary" disabled={saving}>Annuler</button>
            <button onClick={handleSaveResultat} className="btn-primary" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer le résultat'}
            </button>
          </>
        }
      >
        {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
        <div className="space-y-4">
          <div>
            <label className="label">Valeurs JSON <span className="text-red-500">*</span></label>
            <textarea className="input min-h-[120px] font-mono text-sm resize-y"
              value={resultatForm.valeursJson}
              onChange={e => setResultatForm(f => ({ ...f, valeursJson: e.target.value }))}
              placeholder='{"hemoglobine": "12.5 g/dL", "hematocrite": "38%"}' />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only"
                checked={resultatForm.alerteCritique}
                onChange={e => setResultatForm(f => ({ ...f, alerteCritique: e.target.checked }))} />
              <div className={`w-10 h-5 rounded-full transition-colors ${resultatForm.alerteCritique ? 'bg-red-500' : 'bg-slate-200'}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${resultatForm.alerteCritique ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">Alerte critique</span>
            {resultatForm.alerteCritique && (
              <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">Notification envoyée</span>
            )}
          </label>
        </div>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => { setConfirmOpen(false); setDeleting(null); }}
        onConfirm={handleDelete} loading={saving}
        message={`Supprimer la demande #${deleting?.demandeId} (${deleting?.typeAnalyse}) ? Cette action est irréversible.`} />
    </div>
  );
};

export default DemandeListPage;
