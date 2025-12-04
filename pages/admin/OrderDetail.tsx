import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  preparing: { label: 'Em Preparo', color: 'bg-blue-100 text-blue-800', icon: Clock },
  delivered: { label: 'Entregue', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllOrders, updateItemStatus } = useOrder();

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const order = getAllOrders().find((o) => o.id === orderId);

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-gray-600 mb-4">Comanda não encontrada</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-orange-600 hover:text-orange-700"
          >
            Voltar para comandas
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleStatusChange = (itemId: string, newStatus: 'pending' | 'preparing' | 'delivered') => {
    updateItemStatus(itemId, newStatus);
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="size-5" />
          Voltar
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">
              Mesa {order.tableId.replace('table-', '')}
            </h1>
            <p className="text-gray-600">{order.customerName}</p>
            <p className="text-gray-500 text-sm mt-1">
              Abertura: {order.createdAt.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-orange-600">R$ {order.total.toFixed(2)}</div>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                order.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {order.status === 'paid' ? 'Pago' : 'Ativo'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-gray-900">Itens da Comanda</h2>
            </div>
            <div className="divide-y">
              {order.items.map((item) => {
                const StatusIcon = statusConfig[item.status].icon;
                return (
                  <div key={item.id} className="p-6">
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
                        <h3 className="text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.quantity}x R$ {item.price.toFixed(2)} = R${' '}
                          {(item.price * item.quantity).toFixed(2)}
                        </p>

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
                          <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded">
                            Obs: {item.observations}
                          </p>
                        )}

                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                              statusConfig[item.status].color
                            }`}
                          >
                            <StatusIcon className="size-4" />
                            {statusConfig[item.status].label}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        {order.status === 'active' && (
                          <div className="flex gap-2">
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleStatusChange(item.id, 'preparing')}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                              >
                                Iniciar Preparo
                              </button>
                            )}
                            {item.status === 'preparing' && (
                              <button
                                onClick={() => handleStatusChange(item.id, 'delivered')}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                              >
                                Marcar como Entregue
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Taxa de serviço (10%)</span>
                <span>R$ {(order.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <div className="text-gray-900">Total</div>
                <div className="text-orange-600">
                  R$ {(order.total * 1.1).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Histórico</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="size-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">Comanda aberta</p>
                  <p className="text-gray-500 text-xs">
                    {order.createdAt.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              {order.paidAt && (
                <div className="flex gap-3">
                  <div className="size-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">Pagamento confirmado</p>
                    <p className="text-gray-500 text-xs">
                      {order.paidAt.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {order.status === 'active' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 mb-4">Ações</h3>
              <button className="w-full py-3 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                Fechar Comanda Manualmente
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(OrderDetail), { ssr: false });
import dynamic from 'next/dynamic';
