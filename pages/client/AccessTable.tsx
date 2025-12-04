import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { establishment } from '../../data/mockData';
import { Chrome } from 'lucide-react';

function AccessTable() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { loginWithGoogle, user } = useAuth();
  const { createOrder } = useOrder();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // After login, create order and navigate to menu
      setTimeout(() => {
        if (tableId && user) {
          createOrder(tableId, user.id, user.name);
          navigate(`/menu/${tableId}`);
        }
      }, 100);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // If already logged in, redirect to menu
  if (user && tableId) {
    createOrder(tableId, user.id, user.name);
    navigate(`/menu/${tableId}`);
  }

  const tableNumber = tableId?.replace('table-', '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-6xl mb-4">{establishment.logo}</div>
            <h1 className="text-orange-600 mb-2">{establishment.name}</h1>
            <p className="text-gray-600">Bem-vindo!</p>
          </div>

          {/* Table Info */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-6 mb-8">
            <p className="mb-2">Você está na</p>
            <div>Mesa {tableNumber}</div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-gray-200 hover:border-orange-500 rounded-xl p-4 flex items-center justify-center gap-3 mb-6 transition-all hover:shadow-lg"
          >
            <Chrome className="size-6 text-orange-500" />
            <span>Continuar com Google</span>
          </button>

          {/* Terms */}
          <p className="text-gray-500 text-sm">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-orange-600 hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-orange-600 hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AccessTable), { ssr: false });
import dynamic from 'next/dynamic';
