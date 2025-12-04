import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useOrder } from '../../contexts/OrderContext';
import { QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type ExitData = {
  orderId: string;
  tableId: string;
  status: string;
  timestamp: string;
} | null;

function SecurityValidation() {
  const { getAllOrders } = useOrder();
  const [scannedData, setScannedData] = useState<ExitData>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleScan = () => {
    // Simulate QR code scan
    const orders = getAllOrders();
    const paidOrder = orders.find((o) => o.status === 'paid');

    if (paidOrder) {
      const exitData = {
        orderId: paidOrder.id,
        tableId: paidOrder.tableId,
        status: 'PAID',
        timestamp: new Date().toISOString(),
      };
      setScannedData(exitData);
      setValidationStatus('valid');
    } else {
      setValidationStatus('invalid');
    }

    // Reset after 5 seconds
    setTimeout(() => {
      setScannedData(null);
      setValidationStatus('idle');
    }, 5000);
  };

  const getOrderDetails = () => {
    if (!scannedData) return null;
    return getAllOrders().find((o) => o.id === scannedData.orderId);
  };

  const order = getOrderDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-black bg-opacity-30 p-6 border-b border-gray-700">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-white mb-2">Validação de Saída</h1>
          <p className="text-gray-400">Sistema de segurança - Validação de QR Code</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {validationStatus === 'idle' && (
          <div className="text-center">
            {/* Scanner Button */}
            <div className="mb-8">
              <div className="size-48 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-4 border-white border-opacity-20">
                <QrCode className="size-24 text-white" />
              </div>
              <h2 className="text-white mb-4">Pronto para Escanear</h2>
              <p className="text-gray-400 mb-8">
                Posicione o QR Code do cliente na área de escaneamento
              </p>
              <button
                onClick={handleScan}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg transition-colors"
              >
                Simular Escaneamento
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-white bg-opacity-5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-white mb-4">Instruções</h3>
              <ul className="text-gray-300 text-left space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Solicite ao cliente o QR Code de saída</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Escaneie o código apresentado na tela do celular</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Verifique se o status está como PAGO</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>Libere a saída do cliente após validação</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {validationStatus === 'valid' && order && (
          <div className="text-center animate-in fade-in duration-300">
            {/* Success Icon */}
            <div className="size-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-20 text-white" />
            </div>

            <h2 className="text-green-400 mb-2">✓ Pagamento Confirmado</h2>
            <p className="text-white mb-8">Cliente autorizado a sair</p>

            {/* Order Details */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-left">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 flex items-center gap-2">
                    <CheckCircle className="size-5" />
                    PAGO
                  </span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-gray-400">Mesa:</span>
                  <span className="text-white">
                    {order.tableId.replace('table-', '')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-gray-400">Cliente:</span>
                  <span className="text-white">{order.customerName}</span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white">R$ {(order.total * 1.1).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-left">
                  <span className="text-gray-400">Comanda:</span>
                  <span className="text-white text-sm">{order.id}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setScannedData(null);
                setValidationStatus('idle');
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl transition-colors"
            >
              Liberar Saída
            </button>
          </div>
        )}

        {validationStatus === 'invalid' && (
          <div className="text-center animate-in fade-in duration-300">
            {/* Error Icon */}
            <div className="size-32 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="size-20 text-white" />
            </div>

            <h2 className="text-red-400 mb-2">✗ Pagamento Não Confirmado</h2>
            <p className="text-white mb-8">Cliente NÃO autorizado a sair</p>

            {/* Alert */}
            <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-2xl p-6 backdrop-blur-sm mb-6">
              <div className="flex items-start gap-3 text-left">
                <AlertCircle className="size-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-red-400 mb-2">Atenção</div>
                  <p className="text-gray-300 text-sm">
                    O QR Code escaneado não corresponde a uma comanda paga ou está
                    inválido. Solicite ao cliente que efetue o pagamento antes de sair.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setScannedData(null);
                setValidationStatus('idle');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl transition-colors"
            >
              Escanear Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(SecurityValidation), { ssr: false });
