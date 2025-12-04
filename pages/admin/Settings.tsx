import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { establishment } from '../../data/mockData';
import { Save, Upload, CreditCard, Clock, Users } from 'lucide-react';

function Settings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: establishment.name,
    description: establishment.description,
    address: establishment.address,
    phone: establishment.phone,
    openTime: '10:00',
    closeTime: '23:00',
    pixEnabled: true,
    cardEnabled: true,
    serviceFee: 10,
  });

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic here
    alert('Configurações salvas com sucesso!');
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do estabelecimento</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Establishment Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Informações do Estabelecimento</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Logo / Emoji</label>
              <div className="flex items-center gap-4">
                <div className="size-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-4xl">
                  {establishment.logo}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Upload className="size-4" />
                  Alterar
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Nome do Estabelecimento</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Endereço</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="size-6 text-orange-500" />
            <h2 className="text-gray-900">Horário de Funcionamento</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Abertura</label>
              <input
                type="time"
                value={formData.openTime}
                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Fechamento</label>
              <input
                type="time"
                value={formData.closeTime}
                onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="size-6 text-orange-500" />
            <h2 className="text-gray-900">Métodos de Pagamento</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <div className="text-gray-900 mb-1">PIX</div>
                <p className="text-gray-600 text-sm">Pagamento instantâneo via PIX</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pixEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, pixEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <div className="text-gray-900 mb-1">Cartão de Crédito/Débito</div>
                <p className="text-gray-600 text-sm">Aceitar pagamentos com cartão</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cardEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, cardEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Taxa de Serviço (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.serviceFee}
                onChange={(e) =>
                  setFormData({ ...formData, serviceFee: Number(e.target.value) })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="size-6 text-orange-500" />
              <h2 className="text-gray-900">Equipe</h2>
            </div>
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700"
            >
              + Adicionar Usuário
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
              <div>
                <div className="text-gray-900 mb-1">Administrador</div>
                <p className="text-gray-600 text-sm">admin@comandaqr.com</p>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Save className="size-5" />
            Salvar Configurações
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(Settings), { ssr: false });
import dynamic from 'next/dynamic';
