import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { CheckCircle, Timer } from 'lucide-react';
import QRCode from 'react-qr-code';

function ExitQR() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getAllOrders } = useOrder();
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  const order = getAllOrders().find((o) => o.id === orderId);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const exitQRData = JSON.stringify({
    orderId: order.id,
    tableId: order.tableId,
    status: 'PAID',
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <h1 className="text-gray-900 mb-2">QR Code de Saída</h1>
            <p className="text-gray-600">
              Apresente este código ao segurança na saída
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-2xl border-4 border-green-500 mb-6 flex items-center justify-center">
            <QRCode value={exitQRData} size={220} />
          </div>

          {/* Status */}
          <div className="bg-green-100 rounded-2xl p-4 mb-6 text-center">
            <div className="text-green-900 mb-1">STATUS: PAGO ✓</div>
            <p className="text-green-700 text-sm">Mesa {order.tableId.replace('table-', '')}</p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Timer className="size-5" />
            <span>
              Válido por: {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Order Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="text-gray-600 text-sm text-center">
              <p>Comanda: {order.id}</p>
              <p className="mt-1">{order.customerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ExitQR), { ssr: false });
import dynamic from 'next/dynamic';
