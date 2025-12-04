import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';

function Checkout() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { currentOrder } = useOrder();

  if (!currentOrder) {
    navigate(`/menu/${tableId}`);
    return null;
  }

  const serviceFee = currentOrder.total * 0.1; // 10% service fee
  const total = currentOrder.total + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/order/${tableId}`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <h1 className="text-gray-900">Finalizar Comanda</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Resumo da Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal ({currentOrder.items.length} itens)</span>
              <span>R$ {currentOrder.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Taxa de serviço (10%)</span>
              <span>R$ {serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="text-gray-900">Total</div>
              <div className="text-orange-600">R$ {total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-gray-900 mb-4">Forma de Pagamento</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/payment/${tableId}?method=pix`)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4"
            >
              <div className="size-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Smartphone className="size-6 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-900">PIX</div>
                <p className="text-gray-600 text-sm">Pagamento instantâneo</p>
              </div>
            </button>

            <button
              onClick={() => navigate(`/payment/${tableId}?method=card`)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center gap-4"
            >
              <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="size-6 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-900">Cartão de Crédito/Débito</div>
                <p className="text-gray-600 text-sm">Visa, Mastercard, Elo</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Checkout), { ssr: false });
import dynamic from 'next/dynamic';
