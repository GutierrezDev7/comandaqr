import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { ArrowLeft, Trash2, ShoppingBag, Pencil, Check } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  preparing: { label: 'Em Preparo', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800' },
};

function OrderSummary() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { currentOrder, removeItem, updateItemObservations } = useOrder();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [obsText, setObsText] = useState<string>('');

  if (!currentOrder || currentOrder.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingBag className="size-16 text-gray-400 mb-4" />
        <h2 className="text-gray-600 mb-8">Sua comanda está vazia</h2>
        <button
          onClick={() => navigate(`/menu/${tableId}`)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-colors"
        >
          Ver Cardápio
        </button>
      </div>
    );
  }

  const tableNumber = tableId?.replace('table-', '');

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/menu/${tableId}`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
          <div>
            <h1 className="text-gray-900 mb-1">Minha Comanda</h1>
            <p className="text-gray-600">Mesa {tableNumber}</p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {currentOrder.items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex gap-4">
              {/* Item Image */}
              {item.image && (
                <div className="size-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-gray-900">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Variants */}
                {item.variants && (
                  <div className="mb-2">
                    {Object.entries(item.variants).map(([key, value]) => (
                      <p key={key} className="text-gray-600 text-sm">
                        {key}: {value}
                      </p>
                    ))}
                  </div>
                )}

                {/* Observações */}
                {item.observations && (
                  <p className="text-gray-600 text-sm mb-2">Obs: {item.observations}</p>
                )}
                {item.status !== 'delivered' && (
                  <div className="mb-2">
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={obsText}
                          onChange={(e)=>setObsText(e.target.value)}
                          placeholder="Adicionar observação (ex: sem gelo, pouco sal)"
                          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-sm"
                        />
                        <button
                          onClick={() => {
                            updateItemObservations(item.id, obsText.trim());
                            setEditingId(null);
                            setObsText('');
                          }}
                          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
                        >
                          <Check className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setObsText(item.observations || '');
                        }}
                        className="text-gray-600 hover:text-orange-600 text-sm flex items-center gap-1"
                      >
                        <Pencil className="size-4" />
                        {item.observations ? 'Editar observação' : 'Adicionar observação'}
                      </button>
                    )}
                  </div>
                )}

                {/* Status and Actions */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusConfig[item.status].color
                    }`}
                  >
                    {statusConfig[item.status].label}
                  </span>
                  {item.status === 'pending' && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <div className="text-gray-900">R$ {currentOrder.total.toFixed(2)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/menu/${tableId}`)}
              className="py-3 rounded-xl border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
            >
              Continuar Pedindo
            </button>
            <button
              onClick={() => navigate(`/checkout/${tableId}`)}
              className="py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              Finalizar Comanda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(OrderSummary), { ssr: false });
import dynamic from 'next/dynamic';
