import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import AdminLayout from '@/components/AdminLayout';
import { tables } from '../../data/mockData';
import { Plus, Download, QrCode, Users } from 'lucide-react';
import QRCodeLib from 'react-qr-code';

function TableManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllOrders } = useOrder();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const orders = getAllOrders();

  const getTableStatus = (tableId: string) => {
    const activeOrder = orders.find(
      (o) => o.tableId === tableId && o.status === 'active'
    );
    return activeOrder ? 'occupied' : 'free';
  };

  const downloadQRCode = (tableId: string, tableNumber: number) => {
    const svg = document.getElementById(`qr-${tableId}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `mesa-${tableNumber}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-gray-900">Mesas</h1>
            <p className="text-gray-600">Gerencie as mesas e QR Codes</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="size-5" />
            Nova Mesa
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="text-gray-900">{tables.length}</div>
              <p className="text-gray-600 text-sm">Total de Mesas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-green-600" />
            </div>
            <div>
              <div className="text-gray-900">
                {tables.filter((t) => getTableStatus(t.id) === 'occupied').length}
              </div>
              <p className="text-gray-600 text-sm">Mesas Ocupadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-gray-600" />
            </div>
            <div>
              <div className="text-gray-900">
                {tables.filter((t) => getTableStatus(t.id) === 'free').length}
              </div>
              <p className="text-gray-600 text-sm">Mesas Livres</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => {
          const status = getTableStatus(table.id);
          const activeOrder = orders.find(
            (o) => o.tableId === table.id && o.status === 'active'
          );

          return (
            <div
              key={table.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div
                className={`p-4 ${
                  status === 'occupied'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <div className="text-white">Mesa {table.number}</div>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {status === 'occupied' ? 'Ocupada' : 'Livre'}
                  </span>
                </div>
                {activeOrder && (
                  <p className="text-white text-sm mt-2 opacity-90">
                    {activeOrder.customerName}
                  </p>
                )}
              </div>

              {/* QR Code */}
              <div className="p-6 flex flex-col items-center">
                <div className="bg-white p-3 rounded-xl border-2 border-gray-100 mb-4">
                  <div id={`qr-${table.id}`}>
                    <QRCodeLib
                      value={`${window.location.origin}/table/${table.id}`}
                      size={120}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full space-y-2">
                  <button
                    onClick={() => downloadQRCode(table.id, table.number)}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="size-4" />
                    Baixar QR Code
                  </button>
                  <button
                    onClick={() => setSelectedTable(table.id)}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <QrCode className="size-4" />
                    Visualizar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code Preview Modal */}
      {selectedTable && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTable(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-900 mb-6 text-center">
              Mesa {tables.find((t) => t.id === selectedTable)?.number}
            </h2>
            <div className="bg-white p-6 rounded-2xl border-4 border-orange-500 flex items-center justify-center mb-6">
              <QRCodeLib
                value={`${window.location.origin}/table/${selectedTable}`}
                size={250}
              />
            </div>
            <p className="text-gray-600 text-center text-sm mb-6">
              Escaneie para acessar a mesa
            </p>
            <button
              onClick={() => setSelectedTable(null)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(TableManagement), { ssr: false });
import dynamic from 'next/dynamic';
