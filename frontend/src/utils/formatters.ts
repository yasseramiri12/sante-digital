import { format, parseISO, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { StatutOrdonnance, StatutDemande } from '../types';

export const formatDate = (iso: string | undefined): string => {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd/MM/yyyy', { locale: fr }); }
  catch { return iso; }
};

export const formatDateTime = (iso: string | undefined): string => {
  if (!iso) return '—';
  try { return format(parseISO(iso), 'dd/MM/yyyy à HH:mm', { locale: fr }); }
  catch { return iso; }
};

export const calcAge = (dob: string): number =>
  differenceInYears(new Date(), parseISO(dob));

export const fullName = (nom: string, prenom: string) => `${nom} ${prenom}`;

export const initials = (nom: string, prenom: string) =>
  `${(prenom[0] ?? '').toUpperCase()}${(nom[0] ?? '').toUpperCase()}`;

// ─── Status labels & colours ──────────────────────────────────────────────────

export const STATUT_ORDONNANCE: Record<StatutOrdonnance, { label: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'yellow' },
  ACTIVE:     { label: 'Active',     color: 'green'  },
  USED:       { label: 'Utilisée',   color: 'blue'   },
  EXPIRED:    { label: 'Expirée',    color: 'gray'   },
};

export const STATUT_DEMANDE: Record<StatutDemande, { label: string; color: string }> = {
  EN_ATTENTE: { label: 'En attente', color: 'yellow' },
  EN_COURS:   { label: 'En cours',   color: 'blue'   },
  TERMINE:    { label: 'Terminée',   color: 'green'  },
  ANNULE:     { label: 'Annulée',    color: 'gray'   },
};

export const GROUPE_SANGUIN_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const SPECIALITE_OPTIONS = [
  'Médecine Générale', 'Cardiologie', 'Pédiatrie', 'Endocrinologie',
  'Neurologie', 'Dermatologie', 'Orthopédie', 'Ophtalmologie',
  'ORL', 'Gynécologie', 'Psychiatrie', 'Urgentologie',
];

export const ANALYSE_TYPE_OPTIONS = [
  'NFS - Numération Formule Sanguine', 'Glycémie à jeun + HbA1c',
  'Bilan lipidique', 'Bilan hépatique', 'Bilan rénal',
  'PCR COVID-19 + Grippe', 'ECG', 'Holter cardiaque 24h',
  'Radiographie thoracique', 'IRM Cérébrale', 'Échographie abdominale',
  'Urine - ECBU', 'Sérologie hépatites',
];

export const truncate = (str: string, n = 60): string =>
  str.length > n ? str.slice(0, n) + '…' : str;
