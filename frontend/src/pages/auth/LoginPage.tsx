import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const DEMO_ROLES: { role: UserRole; label: string; email: string; desc: string; color: string }[] = [
  { role: 'ADMIN',      label: 'Administrateur', email: 'admin@sante.ma',          desc: 'Accès complet',        color: 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700' },
  { role: 'MEDECIN',    label: 'Médecin',         email: 'k.mansouri@clinique.ma', desc: 'Dr. MANSOURI Khalid',  color: 'border-blue-200   bg-blue-50   hover:bg-blue-100   text-blue-700'   },
  { role: 'PATIENT',    label: 'Patient',          email: 'hamid.benali@gmail.com', desc: 'BENALI Hamid',         color: 'border-green-200  bg-green-50  hover:bg-green-100  text-green-700'  },
  { role: 'PHARMACIEN', label: 'Pharmacien',       email: 'h.ouali@pharma.ma',      desc: 'Hassan Ouali',         color: 'border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700' },
];

const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Email requis'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (err: unknown) {
      toast.error((err as Error).message ?? 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    toast.success(`Connecté en tant que ${role}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4 shadow-xl">
            <Heart size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SanteDigital</h1>
          <p className="text-slate-400 text-sm mt-1">Système de Santé Digital Intégré</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Connexion</h2>
          <p className="text-sm text-slate-500 mb-6">Entrez vos identifiants pour accéder à votre espace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.ma"
                className="input"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Zap size={11} className="text-amber-400" />
              Accès démo rapide
            </div>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Quick login buttons */}
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ROLES.map(({ role, label, email: e, desc, color }) => (
              <button
                key={role}
                onClick={() => handleQuickLogin(role)}
                className={clsx(
                  'text-left p-3 rounded-xl border-2 transition-all duration-150 cursor-pointer',
                  color,
                )}
              >
                <p className="text-xs font-bold">{label}</p>
                <p className="text-[10px] opacity-75 mt-0.5 truncate">{desc}</p>
                <p className="text-[9px] opacity-50 mt-0.5 truncate">{e}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            Prototype — données fictives uniquement
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
