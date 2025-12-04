import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import AdminLayout from '@/components/AdminLayout';
import { Search, Filter, Clock, CheckCircle } from 'lucide-react';

function ActiveOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllOrders } = useOrder();
  const [filter, setFilter] = useState<'all' | 'active' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const orders = getAllOrders();
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && order.status === 'active') ||
      (filter === 'paid' && order.status === 'paid');

    const matchesSearch =
      searchTerm === '' ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getOrderStatusInfo = (order: typeof orders[0]) => {
    const allDelivered = order.items.every((i) => i.status === 'delivered');
    const hasPending = order.items.some((i) => i.status === 'pending');
    const hasPreparing = order.items.some((i) => i.status === 'preparing');

    if (order.status === 'paid') {
      return { label: 'Pago', color: 'bg-green-100 text-green-800' };
    }
    if (allDelivered) {
      return { label: 'Aguardando Pagamento', color: 'bg-purple-100 text-purple-800' };
    }
    if (hasPending) {
      return { label: 'Pedidos Pendentes', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (hasPreparing) {
      return { label: 'Em Preparo', color: 'bg-blue-100 text-blue-800' };
    }
    return { label: 'Ativo', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Comandas</h1>
        <p className="text-gray-600">Gerencie todas as comandas do estabelecimento</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por mesa ou cliente..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-xl transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-3 rounded-xl transition-colors ${
                filter === 'active'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-3 rounded-xl transition-colors ${
                filter === 'paid'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pagas
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Filter className="size-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">Nenhuma comanda encontrada</h3>
            <p className="text-gray-500 text-sm">
              Tente ajustar os filtros ou aguarde novos pedidos
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredOrders.map((order) => {
              const statusInfo = getOrderStatusInfo(order);
              const pendingCount = order.items.filter((i) => i.status === 'pending').length;
              const preparingCount = order.items.filter((i) => i.status === 'preparing')
                .length;
              const deliveredCount = order.items.filter((i) => i.status === 'delivered')
                .length;

              return (
                <div
                  key={order.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/order/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-gray-900">
                          Mesa {order.tableId.replace('table-', '')}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-600">{order.customerName}</p>
                      <p className="text-gray-500 text-sm">
                        {order.items.length} itens • {order.createdAt.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-600">
                        R$ {order.total.toFixed(2)}
                      </div>
                      {order.status === 'paid' && order.paidAt && (
                        <p className="text-green-600 text-sm mt-1">
                          Pago às {order.paidAt.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Status Summary */}
                  {order.status === 'active' && (
                    <div className="flex items-center gap-4 text-sm">
                      {pendingCount > 0 && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Clock className="size-4" />
                          {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                        </div>
                      )}
                      {preparingCount > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Clock className="size-4" />
                          {preparingCount} preparando
                        </div>
                      )}
                      {deliveredCount > 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="size-4" />
                          {deliveredCount} entregue{deliveredCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(ActiveOrders), { ssr: false });
import dynamic from 'next/dynamic';
