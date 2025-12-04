import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import AdminLayout from '@/components/AdminLayout';
import {
  Users,
  DollarSign,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllOrders } = useOrder();

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const orders = getAllOrders();
  const activeOrders = orders.filter((o) => o.status === 'active');
  const todayRevenue = orders.reduce((sum, o) => {
    if (o.status === 'paid') {
      return sum + o.total * 1.1; // Including 10% service fee
    }
    return sum;
  }, 0);
  const pendingItems = activeOrders.reduce(
    (sum, o) => sum + o.items.filter((i) => i.status === 'pending').length,
    0
  );
  const avgTicket = orders.length > 0 ? todayRevenue / orders.filter((o) => o.status === 'paid').length : 0;

  const stats = [
    {
      title: 'Faturamento Hoje',
      value: `R$ ${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12%',
    },
    {
      title: 'Mesas Ativas',
      value: activeOrders.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      trend: `${activeOrders.length} ocupadas`,
    },
    {
      title: 'Pedidos Pendentes',
      value: pendingItems.toString(),
      icon: ClipboardList,
      color: 'bg-orange-500',
      trend: 'Requer atenção',
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${avgTicket.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: '+8%',
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral em tempo real</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} size-12 rounded-xl flex items-center justify-center`}>
                <stat.icon className="size-6 text-white" />
              </div>
              <span className="text-green-600 text-sm">{stat.trend}</span>
            </div>
            <div className="text-gray-900 mb-1">{stat.value}</div>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Comandas Ativas</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-orange-600 hover:text-orange-700"
            >
              Ver todas
            </button>
          </div>
        </div>
        <div className="divide-y">
          {activeOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma comanda ativa no momento
            </div>
          ) : (
            activeOrders.slice(0, 5).map((order) => {
              const pendingCount = order.items.filter((i) => i.status === 'pending').length;
              const preparingCount = order.items.filter((i) => i.status === 'preparing').length;
              const deliveredCount = order.items.filter((i) => i.status === 'delivered').length;

              return (
                <div
                  key={order.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/order/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-gray-900 mb-1">
                        Mesa {order.tableId.replace('table-', '')}
                      </div>
                      <p className="text-gray-600 text-sm">{order.customerName}</p>
                    </div>
                    <div className="text-orange-600">
                      R$ {order.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="size-4" />
                        {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                      </div>
                    )}
                    {preparingCount > 0 && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <ClipboardList className="size-4" />
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
import dynamic from 'next/dynamic';
