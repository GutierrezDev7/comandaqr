import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-gray-900 mb-2">Página Não Encontrada</h1>
          <p className="text-gray-600 mb-8">
            Desculpe, a página que você está procurando não existe.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="size-5" />
              Voltar
            </button>
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Home className="size-5" />
              Ir para Início
            </button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-gray-500 text-sm mb-4">Acesso rápido:</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/table/table-1"
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                Cliente
              </a>
              <a
                href="/admin/login"
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                Admin
              </a>
              <a
                href="/waiter"
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                Garçom
              </a>
              <a
                href="/security"
                className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-center rounded-lg text-sm transition-colors"
              >
                Segurança
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(NotFound), { ssr: false });
import dynamic from 'next/dynamic';
