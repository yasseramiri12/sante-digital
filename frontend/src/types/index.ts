// ─── Domain Types ────────────────────────────────────────────────────────────
// Mirror the Spring Boot entities exactly so wiring the real API later is a
// simple find-and-replace of the api.ts mock implementations.

export interface Patient {
  patientId: number;
  nin: string;
  nom: string;
  prenom: string;
  dateNaissance: string;      // ISO date string "YYYY-MM-DD"
  groupeSanguin?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  carteQrToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Medecin {
  medecinId: number;
  utilisateurId?: number;
  nom: string;
  prenom: string;
  specialite: string;
  numOrdre: string;
  telephone?: string;
  email: string;
  cabinetAdresse?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consultation {
  consultationId: number;
  patientId: number;
  medecinId: number;
  dateHeure: string;          // ISO datetime "YYYY-MM-DDTHH:mm:ss"
  motif: string;
  diagnosticCim10?: string;
  compteRendu?: string;
  createdAt?: string;
  updatedAt?: string;
  // Denormalised for display (joined fields, not in DB)
  patientNom?: string;
  medecinNom?: string;
}

export type StatutOrdonnance = 'EN_ATTENTE' | 'ACTIVE' | 'USED' | 'EXPIRED';

export interface Ordonnance {
  ordonnanceId: number;
  consultationId: number;
  patientId: number;
  medecinId?: number;
  dateEmission?: string;
  dateExpiration: string;
  statut: StatutOrdonnance;
  createdAt?: string;
  updatedAt?: string;
  // Denormalised
  patientNom?: string;
  medecinNom?: string;
}

export type StatutDemande = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';

export interface DemandeAnalyse {
  demandeId: number;
  consultationId: number;
  patientId: number;
  medecinId?: number;
  typeAnalyse: string;
  statut: StatutDemande;
  createdAt?: string;
  updatedAt?: string;
  // Denormalised
  patientNom?: string;
  medecinNom?: string;
}

export interface ResultatAnalyse {
  resultatId: number;
  demandeId: number;
  valeursJson: string;        // JSON string or plain text of measured values
  alerteCritique: boolean;
  fichierUrl?: string;
  datePublication?: string;
  createdAt?: string;
  // Denormalised (not returned by backend — display N/A when absent)
  patientNom?: string;
  typeAnalyse?: string;
}

export interface Pharmacie {
  pharmacieId: number;
  utilisateurId?: number;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  numAutorisation?: string;
  responsable?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Dispensation {
  dispensationId: number;
  ordonnanceId: number;
  pharmacieId: number;
  dateDispensation?: string;
  interactionsOk: boolean;
  pharmacienNom?: string;
  observations?: string;
  createdAt?: string;
  // Denormalised
  pharmacieNom?: string;
  patientNom?: string;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'MEDECIN' | 'PATIENT' | 'PHARMACIEN';

export interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  avatar?: string;
  // Links to domain entity
  medecinId?: number;
  patientId?: number;
  pharmacieId?: number;
}

// ─── API / UI Helper Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// ─── Form DTOs (match Spring Boot DTO fields) ─────────────────────────────────

export type PatientFormData = Omit<Patient, 'patientId' | 'carteQrToken' | 'createdAt' | 'updatedAt'>;
export type MedecinFormData = Omit<Medecin, 'medecinId' | 'utilisateurId' | 'createdAt' | 'updatedAt'>;
export type ConsultationFormData = Omit<Consultation, 'consultationId' | 'createdAt' | 'updatedAt' | 'patientNom' | 'medecinNom'>;
export type OrdonnanceFormData = Pick<Ordonnance, 'consultationId' | 'patientId' | 'dateExpiration'> & { medecinId?: number };
export type DemandeFormData = Pick<DemandeAnalyse, 'consultationId' | 'patientId' | 'typeAnalyse'> & { medecinId?: number };
export type ResultatFormData = Pick<ResultatAnalyse, 'demandeId' | 'valeursJson' | 'alerteCritique'> & { fichierUrl?: string };
export type ResultatAnalyseFormData = ResultatFormData;  // alias
export type PharmacieFormData = Omit<Pharmacie, 'pharmacieId' | 'utilisateurId' | 'createdAt' | 'updatedAt'>;
export type DispensationFormData = Pick<Dispensation, 'ordonnanceId' | 'pharmacieId' | 'interactionsOk'> & {
  observations?: string;
  pharmacienNom?: string;
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalPatients: number;
  totalMedecins: number;
  consultationsAujourdhui: number;
  ordonnancesActives: number;
  demandesEnAttente: number;
  alertesCritiques: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}
