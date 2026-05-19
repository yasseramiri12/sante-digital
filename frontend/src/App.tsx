import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientListPage from './pages/patients/PatientListPage';
import PatientDetailPage from './pages/patients/PatientDetailPage';
import MedecinListPage from './pages/medecins/MedecinListPage';
import ConsultationListPage from './pages/consultations/ConsultationListPage';
import ConsultationDetailPage from './pages/consultations/ConsultationDetailPage';
import OrdonnanceListPage from './pages/ordonnances/OrdonnanceListPage';
import OrdonnanceDetailPage from './pages/ordonnances/OrdonnanceDetailPage';
import DemandeListPage from './pages/laboratoire/DemandeListPage';
import DemandeDetailPage from './pages/laboratoire/DemandeDetailPage';
import PharmaciePage from './pages/pharmacie/PharmaciePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="patients" element={<PatientListPage />} />
          <Route path="patients/:id" element={<PatientDetailPage />} />

          <Route path="medecins" element={<MedecinListPage />} />

          <Route path="consultations" element={<ConsultationListPage />} />
          <Route path="consultations/:id" element={<ConsultationDetailPage />} />

          <Route path="ordonnances" element={<OrdonnanceListPage />} />
          <Route path="ordonnances/:id" element={<OrdonnanceDetailPage />} />

          <Route path="laboratoire" element={<DemandeListPage />} />
          <Route path="laboratoire/:id" element={<DemandeDetailPage />} />

          <Route path="pharmacie" element={<PharmaciePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
