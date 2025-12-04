import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { CheckCircle } from 'lucide-react';

function PaymentSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getAllOrders } = useOrder();

  const order = getAllOrders().find((o) => o.id === orderId);

  if (!order) {
    return null;
  }

  const serviceFee = order.total * 0.1;
  const total = order.total + serviceFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="size-12 text-green-600" />
          </div>

          <h1 className="text-green-600 mb-2">Pagamento Aprovado!</h1>
          <p className="text-gray-600 mb-8">
            Seu pagamento foi processado com sucesso
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mesa</span>
                <span className="text-gray-900">
                  {order.tableId.replace('table-', '')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cliente</span>
                <span className="text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Comanda</span>
                <span className="text-gray-900 text-sm">{order.id}</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <div className="text-gray-900">Total Pago</div>
                <div className="text-green-600">R$ {total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/exit-qr/${orderId}`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl mb-4 transition-colors"
          >
            Gerar QR de Saída
          </button>

          <p className="text-gray-500 text-sm">
            Apresente o QR Code de saída na porta
          </p>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PaymentSuccess), { ssr: false });
import dynamic from 'next/dynamic';
