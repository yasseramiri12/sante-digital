import type { AuthUser } from '../types';

// ─── Auth Demo Users ───────────────────────────────────────────────────────────
// Used by AuthContext (no auth backend exists yet)

export const MOCK_USERS: AuthUser[] = [
  { id: 1, nom: 'Benali',    prenom: 'Admin',  email: 'admin@sante.ma',          role: 'ADMIN'      },
  { id: 2, nom: 'MANSOURI',  prenom: 'Khalid', email: 'k.mansouri@clinique.ma',  role: 'MEDECIN',    medecinId: 1 },
  { id: 3, nom: 'BENALI',    prenom: 'Hamid',  email: 'hamid.benali@gmail.com',  role: 'PATIENT',    patientId: 1 },
  { id: 4, nom: 'Ouali',     prenom: 'Hassan', email: 'h.ouali@pharma.ma',       role: 'PHARMACIEN', pharmacieId: 1 },
];

// ─── Static chart data (no backend endpoint for these) ────────────────────────

export const CONSULTATIONS_CHART_DATA = [
  { label: 'Lun', value: 8  },
  { label: 'Mar', value: 12 },
  { label: 'Mer', value: 7  },
  { label: 'Jeu', value: 15 },
  { label: 'Ven', value: 11 },
  { label: 'Sam', value: 4  },
  { label: 'Dim', value: 2  },
];

export const ORDONNANCE_STATUS_DATA = [
  { name: 'Active',    value: 3, color: '#10b981' },
  { name: 'Utilisée', value: 1, color: '#3b82f6' },
  { name: 'Expirée',  value: 1, color: '#94a3b8' },
];

export const ANALYSE_TYPE_DATA = [
  { label: 'NFS',        value: 8  },
  { label: 'Glycémie',   value: 12 },
  { label: 'PCR',        value: 5  },
  { label: 'Imagerie',   value: 6  },
  { label: 'Cardiologie',value: 4  },
];
