import dynamic from 'next/dynamic';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import AdminLayout from '@/components/AdminLayout';
import { Download, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { categories } from '../../data/mockData';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

function Reports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllOrders } = useOrder();

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const orders = getAllOrders();
  const paidOrders = orders.filter((o) => o.status === 'paid');

  // Calculate metrics
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total * 1.1, 0);
  const totalOrders = paidOrders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = paidOrders.reduce((sum, o) => sum + o.items.length, 0);

  // Orders by category
  const categoryData = categories.map((cat) => {
    const itemsInCategory = paidOrders.reduce((sum, order) => {
      return (
        sum +
        order.items.filter(() => {
          return true;
        }).length
      );
    }, 0);

    return {
      name: cat.name,
      value: itemsInCategory,
    };
  });

  // Hourly sales (mock data for demo)
  const hourlySales = [
    { hour: '10h', value: 250 },
    { hour: '11h', value: 380 },
    { hour: '12h', value: 520 },
    { hour: '13h', value: 680 },
    { hour: '14h', value: 450 },
    { hour: '15h', value: 320 },
    { hour: '16h', value: 280 },
    { hour: '17h', value: 420 },
    { hour: '18h', value: 750 },
    { hour: '19h', value: 920 },
    { hour: '20h', value: 1150 },
    { hour: '21h', value: 980 },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-gray-900">Relatórios</h1>
            <p className="text-gray-600">Análise de desempenho e vendas</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
            <Download className="size-5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="size-6 text-green-600" />
            </div>
            <div>
              <div className="text-gray-900">R$ {totalRevenue.toFixed(2)}</div>
              <p className="text-gray-600 text-sm">Faturamento Total</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-900">{totalOrders}</div>
              <p className="text-gray-600 text-sm">Total de Comandas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-6 text-purple-600" />
            </div>
            <div>
              <div className="text-gray-900">R$ {avgTicket.toFixed(2)}</div>
              <p className="text-gray-600 text-sm">Ticket Médio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-orange-600" />
            </div>
            <div>
              <div className="text-gray-900">{totalItems}</div>
              <p className="text-gray-600 text-sm">Itens Vendidos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hourly Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Vendas por Horário</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Pedidos por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-gray-900">Comandas Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Mesa</th>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Cliente</th>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Itens</th>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Total</th>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Horário</th>
                <th className="px-6 py-3 text-left text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">
                    Mesa {order.tableId.replace('table-', '')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 text-gray-900">
                    R$ {(order.total * 1.1).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.createdAt.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status === 'paid' ? 'Pago' : 'Ativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(Reports), { ssr: false });
