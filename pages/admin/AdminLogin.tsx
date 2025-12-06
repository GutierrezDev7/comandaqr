import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { establishment } from '../../data/mockData';
import QuickStartGuide from '../../components/QuickStartHGuide';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{establishment.logo}</div>
            <h1 className="text-gray-900 mb-2">ComandaQR</h1>
            <p className="text-gray-600">Painel Administrativo</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-900 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comandaqr.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <LogIn className="size-5" />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

          <div className="text-center">
            <a href="#" className="text-orange-600 hover:underline text-sm">
              Esqueci minha senha
            </a>
          </div>
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="text-gray-600 hover:text-orange-600 text-sm"
            >
              Guia Rápido
            </button>
          </div>
        </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-500 text-sm text-center mb-2">
              Credenciais de demonstração:
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm">
              <p className="text-gray-700 mb-1">
                <strong>Email:</strong> admin@comandaqr.com
              </p>
              <p className="text-gray-700">
                <strong>Senha:</strong> admin123
              </p>
            </div>
          </div>

          {/* Quick Access */}
          <div className="mt-4">
            <p className="text-gray-500 text-sm text-center mb-3">
              Ou acesse outras áreas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/table/table-1"
                className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                👤 Cliente
              </a>
              <a
                href="/waiter"
                className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                🍽️ Garçom
              </a>
            </div>
          </div>
        </div>
      </div>
      {showGuide && <QuickStartGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdminLogin), { ssr: false });
import dynamic from 'next/dynamic';
