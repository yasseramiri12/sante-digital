import axios from 'axios';
import type {
  Patient, Medecin, Consultation, Ordonnance,
  DemandeAnalyse, ResultatAnalyse, Pharmacie, Dispensation,
  PatientFormData, MedecinFormData, ConsultationFormData,
  OrdonnanceFormData, DemandeFormData, ResultatFormData,
  PharmacieFormData, DispensationFormData, DashboardStats,
} from '../types';

// All requests go to /api — proxied by Vite to http://localhost:8080/api
const http = axios.create({ baseURL: '/api' });

// Unwrap axios error message from Spring Boot GlobalExceptionHandler response
const err = (e: unknown): never => {
  if (axios.isAxiosError(e)) {
    const msg = (e.response?.data as { message?: string })?.message ?? e.message;
    throw new Error(msg);
  }
  throw e;
};

// ─── Patient ──────────────────────────────────────────────────────────────────

export const patientApi = {
  getAll: (): Promise<Patient[]> =>
    http.get<Patient[]>('/patients').then(r => r.data).catch(err),

  getById: (id: number): Promise<Patient> =>
    http.get<Patient>(`/patients/${id}`).then(r => r.data).catch(err),

  getByNin: (nin: string): Promise<Patient> =>
    http.get<Patient>(`/patients/nin/${nin}`).then(r => r.data).catch(err),

  create: (data: PatientFormData): Promise<Patient> =>
    http.post<Patient>('/patients', data).then(r => r.data).catch(err),

  update: (id: number, data: PatientFormData): Promise<Patient> =>
    http.put<Patient>(`/patients/${id}`, data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/patients/${id}`).then(() => undefined).catch(err),
};

// ─── Medecin ──────────────────────────────────────────────────────────────────

export const medecinApi = {
  getAll: (): Promise<Medecin[]> =>
    http.get<Medecin[]>('/medecins').then(r => r.data).catch(err),

  getById: (id: number): Promise<Medecin> =>
    http.get<Medecin>(`/medecins/${id}`).then(r => r.data).catch(err),

  getByNumOrdre: (numOrdre: string): Promise<Medecin> =>
    http.get<Medecin>(`/medecins/numOrdre/${numOrdre}`).then(r => r.data).catch(err),

  create: (data: MedecinFormData): Promise<Medecin> =>
    http.post<Medecin>('/medecins', data).then(r => r.data).catch(err),

  update: (id: number, data: MedecinFormData): Promise<Medecin> =>
    http.put<Medecin>(`/medecins/${id}`, data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/medecins/${id}`).then(() => undefined).catch(err),
};

// ─── Consultation ─────────────────────────────────────────────────────────────

export const consultationApi = {
  getAll: (): Promise<Consultation[]> =>
    http.get<Consultation[]>('/consultations').then(r => r.data).catch(err),

  getById: (id: number): Promise<Consultation> =>
    http.get<Consultation>(`/consultations/${id}`).then(r => r.data).catch(err),

  getByPatient: (patientId: number): Promise<Consultation[]> =>
    http.get<Consultation[]>(`/consultations/patient/${patientId}`).then(r => r.data).catch(err),

  getByMedecin: (medecinId: number): Promise<Consultation[]> =>
    http.get<Consultation[]>(`/consultations/medecin/${medecinId}`).then(r => r.data).catch(err),

  create: (data: ConsultationFormData): Promise<Consultation> =>
    http.post<Consultation>('/consultations', data).then(r => r.data).catch(err),

  update: (id: number, data: ConsultationFormData): Promise<Consultation> =>
    http.put<Consultation>(`/consultations/${id}`, data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/consultations/${id}`).then(() => undefined).catch(err),
};

// ─── Ordonnance ───────────────────────────────────────────────────────────────

export const ordonnanceApi = {
  getAll: (): Promise<Ordonnance[]> =>
    http.get<Ordonnance[]>('/ordonnances').then(r => r.data).catch(err),

  getById: (id: number): Promise<Ordonnance> =>
    http.get<Ordonnance>(`/ordonnances/${id}`).then(r => r.data).catch(err),

  getByPatient: (patientId: number): Promise<Ordonnance[]> =>
    http.get<Ordonnance[]>(`/ordonnances/patient/${patientId}`).then(r => r.data).catch(err),

  getByStatut: (statut: string): Promise<Ordonnance[]> =>
    http.get<Ordonnance[]>(`/ordonnances/statut/${statut}`).then(r => r.data).catch(err),

  create: (data: OrdonnanceFormData): Promise<Ordonnance> =>
    http.post<Ordonnance>('/ordonnances', data).then(r => r.data).catch(err),

  close: (id: number): Promise<Ordonnance> =>
    http.put<Ordonnance>(`/ordonnances/${id}/close`).then(r => r.data).catch(err),

  expire: (id: number): Promise<Ordonnance> =>
    http.put<Ordonnance>(`/ordonnances/${id}/expire`).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/ordonnances/${id}`).then(() => undefined).catch(err),
};

// ─── Demande Analyse ──────────────────────────────────────────────────────────

export const demandeApi = {
  getAll: (): Promise<DemandeAnalyse[]> =>
    http.get<DemandeAnalyse[]>('/laboratoire/demandes').then(r => r.data).catch(err),

  getById: (id: number): Promise<DemandeAnalyse> =>
    http.get<DemandeAnalyse>(`/laboratoire/demandes/${id}`).then(r => r.data).catch(err),

  getByPatient: (patientId: number): Promise<DemandeAnalyse[]> =>
    http.get<DemandeAnalyse[]>(`/laboratoire/demandes/patient/${patientId}`).then(r => r.data).catch(err),

  getByStatut: (statut: string): Promise<DemandeAnalyse[]> =>
    http.get<DemandeAnalyse[]>(`/laboratoire/demandes/statut/${statut}`).then(r => r.data).catch(err),

  create: (data: DemandeFormData): Promise<DemandeAnalyse> =>
    http.post<DemandeAnalyse>('/laboratoire/demandes', data).then(r => r.data).catch(err),

  updateStatut: (id: number, statut: string): Promise<DemandeAnalyse> =>
    http.put<DemandeAnalyse>(`/laboratoire/demandes/${id}/statut`, statut, {
      headers: { 'Content-Type': 'text/plain' },
    }).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/laboratoire/demandes/${id}`).then(() => undefined).catch(err),
};

// ─── Resultat Analyse ─────────────────────────────────────────────────────────

export const resultatApi = {
  getAll: (): Promise<ResultatAnalyse[]> =>
    http.get<ResultatAnalyse[]>('/laboratoire/resultats').then(r => r.data).catch(err),

  getById: (id: number): Promise<ResultatAnalyse> =>
    http.get<ResultatAnalyse>(`/laboratoire/resultats/${id}`).then(r => r.data).catch(err),

  getByDemande: (demandeId: number): Promise<ResultatAnalyse> =>
    http.get<ResultatAnalyse>(`/laboratoire/resultats/demande/${demandeId}`).then(r => r.data).catch(err),

  getCritical: (): Promise<ResultatAnalyse[]> =>
    http.get<ResultatAnalyse[]>('/laboratoire/resultats/alerte/true').then(r => r.data).catch(err),

  create: (data: ResultatFormData): Promise<ResultatAnalyse> =>
    http.post<ResultatAnalyse>('/laboratoire/resultats', data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/laboratoire/resultats/${id}`).then(() => undefined).catch(err),
};

// ─── Pharmacie ────────────────────────────────────────────────────────────────

export const pharmacieApi = {
  getAll: (): Promise<Pharmacie[]> =>
    http.get<Pharmacie[]>('/pharmacie').then(r => r.data).catch(err),

  getById: (id: number): Promise<Pharmacie> =>
    http.get<Pharmacie>(`/pharmacie/${id}`).then(r => r.data).catch(err),

  create: (data: PharmacieFormData): Promise<Pharmacie> =>
    http.post<Pharmacie>('/pharmacie', data).then(r => r.data).catch(err),

  update: (id: number, data: PharmacieFormData): Promise<Pharmacie> =>
    http.put<Pharmacie>(`/pharmacie/${id}`, data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/pharmacie/${id}`).then(() => undefined).catch(err),
};

// ─── Dispensation ─────────────────────────────────────────────────────────────

export const dispensationApi = {
  getAll: (): Promise<Dispensation[]> =>
    http.get<Dispensation[]>('/pharmacie/dispensations').then(r => r.data).catch(err),

  getById: (id: number): Promise<Dispensation> =>
    http.get<Dispensation>(`/pharmacie/dispensations/${id}`).then(r => r.data).catch(err),

  getByPharmacie: (pharmacieId: number): Promise<Dispensation[]> =>
    http.get<Dispensation[]>(`/pharmacie/dispensations/pharmacie/${pharmacieId}`).then(r => r.data).catch(err),

  getByOrdonnance: (ordonnanceId: number): Promise<Dispensation> =>
    http.get<Dispensation>(`/pharmacie/dispensations/ordonnance/${ordonnanceId}`).then(r => r.data).catch(err),

  create: (data: DispensationFormData): Promise<Dispensation> =>
    http.post<Dispensation>('/pharmacie/dispensations', data).then(r => r.data).catch(err),

  delete: (id: number): Promise<void> =>
    http.delete(`/pharmacie/dispensations/${id}`).then(() => undefined).catch(err),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
// No backend endpoint — computed from parallel real API calls

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const [patients, medecins, consultations, ordonnances, demandes, resultats] =
      await Promise.all([
        patientApi.getAll(),
        medecinApi.getAll(),
        consultationApi.getAll(),
        ordonnanceApi.getAll(),
        demandeApi.getAll(),
        resultatApi.getAll(),
      ]);

    const today = new Date().toISOString().slice(0, 10);

    return {
      totalPatients:           patients.length,
      totalMedecins:           medecins.length,
      consultationsAujourdhui: consultations.filter(c => c.dateHeure.startsWith(today)).length,
      ordonnancesActives:      ordonnances.filter(o => o.statut === 'ACTIVE').length,
      demandesEnAttente:       demandes.filter(d => d.statut === 'EN_ATTENTE').length,
      alertesCritiques:        resultats.filter(r => r.alerteCritique).length,
    };
  },
};
