import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { ArrowLeft, Copy, CheckCircle, CreditCard } from 'lucide-react';
import QRCode from 'react-qr-code';

function Payment() {
  const { tableId } = useParams<{ tableId: string }>();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');
  const amountParam = parseFloat(searchParams.get('amount') || '');
  const tipParam = parseFloat(searchParams.get('tip') || '');
  const navigate = useNavigate();
  const { currentOrder, completePayment } = useOrder();
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      navigate(`/menu/${tableId}`);
    }
  }, [currentOrder, navigate, tableId]);

  const serviceFee = currentOrder ? currentOrder.total * 0.1 : 0;
  const orderTotal = currentOrder ? currentOrder.total + serviceFee : 0;
  const amount = !isNaN(amountParam) && amountParam > 0 ? amountParam : orderTotal;
  const tip = !isNaN(tipParam) && tipParam >= 0 ? tipParam : 0;
  const total = amount + tip;

  // Mock PIX code
  const pixCode = `00020126580014br.gov.bcb.pix0136${currentOrder?.id ?? ''}520400005303986540${total.toFixed(
    2
  )}5802BR5925Bar do Ze6009SAO PAULO62070503***6304`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardPayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      if (currentOrder) {
        completePayment(currentOrder.id);
        navigate(`/payment-success/${currentOrder.id}`);
      }
    }, 2000);
  };

  // Simulate PIX payment detection
  useEffect(() => {
    if (method === 'pix' && currentOrder) {
      const timer = setTimeout(() => {
        completePayment(currentOrder.id);
        navigate(`/payment-success/${currentOrder.id}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [method, currentOrder, completePayment, navigate]);

  if (method === 'pix') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate(`/checkout/${tableId}`)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="size-5" />
              Voltar
            </button>
            <h1 className="text-gray-900">Pagamento via PIX</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-100 mb-4">
                <QRCode value={pixCode} size={200} />
              </div>
              <div className="text-gray-900 mb-2">R$ {total.toFixed(2)}</div>
              <div className="text-gray-600 text-sm mb-2">Subtotal: R$ {amount.toFixed(2)} • Gorjeta: R$ {tip.toFixed(2)}</div>
              <p className="text-gray-600 text-center mb-6">
                Escaneie o QR Code com o app do seu banco
              </p>

              {/* Copy Code */}
              <div className="w-full">
                <p className="text-gray-600 mb-2">Ou copie o código PIX:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixCode}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center gap-2 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="size-5" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="size-5" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <div className="animate-pulse size-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <p className="text-blue-900">Aguardando pagamento...</p>
          </div>
        </div>
      </div>
    );
  }

  // Card Payment
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/checkout/${tableId}`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <h1 className="text-gray-900">Pagamento com Cartão</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Número do Cartão</label>
            <div className="relative">
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                maxLength={19}
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Nome no Cartão</label>
            <input
              type="text"
              placeholder="NOME COMPLETO"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Validade</label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                placeholder="000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                maxLength={4}
              />
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total a pagar</span>
              <div className="text-orange-600">R$ {total.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>Detalhes</span>
              <span>Subtotal: R$ {amount.toFixed(2)} • Gorjeta: R$ {tip.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCardPayment}
            disabled={processing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processing ? 'Processando...' : 'Confirmar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Payment), { ssr: false });
