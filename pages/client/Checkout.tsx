import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';

function Checkout() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { currentOrder } = useOrder();
  const [tipPercent, setTipPercent] = useState<number>(0);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>('');

  if (!currentOrder) {
    navigate(`/menu/${tableId}`);
    return null;
  }

  const subtotal = currentOrder.total;
  const serviceFee = subtotal * 0.1; // 10% taxa de serviço
  const baseTotal = subtotal + serviceFee;
  const tipAmount = Math.max(0, baseTotal * (tipPercent / 100));
  const splitAmount = splitCount > 1 ? baseTotal / splitCount : baseTotal;
  const parsedCustom = parseFloat(customAmount.replace(',', '.'));
  const amountToPay = !isNaN(parsedCustom) && parsedCustom > 0 ? Math.min(baseTotal, parsedCustom) : splitAmount;
  const totalWithTip = amountToPay + tipAmount;

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
        {/* Resumo da Conta */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Resumo da Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal ({currentOrder.items.length} itens)</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Taxa de serviço (10%)</span>
              <span>R$ {serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="text-gray-900">Total</div>
              <div className="text-orange-600">R$ {baseTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Dividir Conta */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Dividir Conta</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Número de pessoas</span>
              <div className="flex items-center gap-2" role="group" aria-label="Selecionar número de pessoas">
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSplitCount(n)}
                    className={`px-3 py-2 rounded-lg border text-sm ${splitCount===n ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    aria-pressed={splitCount===n}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Sua parte</span>
              <span className="text-gray-900">R$ {splitAmount.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Ou pagar valor personalizado</label>
              <input
                aria-label="Valor personalizado"
                type="text"
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={customAmount}
                onChange={(e)=>setCustomAmount(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gorjeta */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Gorjeta</h2>
          <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Selecionar porcentagem de gorjeta">
            {[0,5,10,15].map((p) => (
              <button
                key={p}
                onClick={()=>setTipPercent(p)}
                className={`px-4 py-2 rounded-lg border text-sm ${tipPercent===p ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                aria-pressed={tipPercent===p}
              >
                {p}%
              </button>
            ))}
            <input
              aria-label="Gorjeta personalizada"
              type="number"
              min={0}
              max={30}
              value={tipPercent}
              onChange={(e)=>setTipPercent(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 w-24 text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-600">
              <span>Gorjeta</span>
              <span>R$ {tipAmount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="text-gray-900">Total do seu pagamento</div>
              <div className="text-orange-600">R$ {totalWithTip.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-gray-900 mb-4">Forma de Pagamento</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/payment/${tableId}?method=pix&amount=${amountToPay.toFixed(2)}&tip=${tipAmount.toFixed(2)}`)}
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
              onClick={() => navigate(`/payment/${tableId}?method=card&amount=${amountToPay.toFixed(2)}&tip=${tipAmount.toFixed(2)}`)}
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
