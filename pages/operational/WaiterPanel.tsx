import { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { CheckCircle, Clock, Bell } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

function WaiterPanel() {
  const { getAllOrders, updateItemStatus } = useOrder();
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing'>('all');

  const orders = getAllOrders().filter((o) => o.status === 'active');

  // Get all items from all orders
  const allItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order.id,
      tableId: order.tableId,
      customerName: order.customerName,
    }))
  );

  const filteredItems = allItems.filter((item) => {
    if (filter === 'all') return item.status !== 'delivered';
    return item.status === filter;
  });

  const pendingCount = allItems.filter((i) => i.status === 'pending').length;
  const preparingCount = allItems.filter((i) => i.status === 'preparing').length;

  const handleMarkDelivered = (itemId: string) => {
    updateItemStatus(itemId, 'delivered');
  };

  const handleStartPreparing = (itemId: string) => {
    updateItemStatus(itemId, 'preparing');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white mb-2">Painel do Garçom</h1>
              <p className="text-white text-opacity-90">Gerencie os pedidos em tempo real</p>
            </div>
            <div className="size-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bell className="size-6" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-4">
              <div className="text-white text-opacity-90 text-sm mb-1">Pendentes</div>
              <div className="text-white">{pendingCount}</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-4">
              <div className="text-white text-opacity-90 text-sm mb-1">Em Preparo</div>
              <div className="text-white">{preparingCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'pending'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendentes ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('preparing')}
            className={`px-4 py-2 rounded-full transition-colors ${
              filter === 'preparing'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Em Preparo ({preparingCount})
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Tudo em dia!</h3>
            <p className="text-gray-500 text-sm">
              Não há pedidos {filter === 'pending' ? 'pendentes' : filter === 'preparing' ? 'em preparo' : 'ativos'} no momento
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
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
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-gray-900">Mesa {item.tableId.replace('table-', '')}</div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.status === 'pending' ? 'Pendente' : 'Em Preparo'}
                        </span>
                      </div>
                      <h3 className="text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {item.quantity}x • {item.customerName}
                      </p>
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

                  {/* Observations */}
                  {item.observations && (
                    <p className="text-gray-600 text-sm mb-3 bg-yellow-50 p-2 rounded">
                      ⚠️ {item.observations}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleStartPreparing(item.id)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <Clock className="size-4" />
                        Iniciar Preparo
                      </button>
                    )}
                    {item.status === 'preparing' && (
                      <button
                        onClick={() => handleMarkDelivered(item.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors"
                      >
                        <CheckCircle className="size-4" />
                        Marcar como Entregue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(WaiterPanel), { ssr: false });
import dynamic from 'next/dynamic';
