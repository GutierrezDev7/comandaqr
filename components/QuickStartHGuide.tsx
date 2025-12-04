import { X } from 'lucide-react';

interface QuickStartGuideProps {
  onClose: () => void;
}

export default function QuickStartGuide({ onClose }: QuickStartGuideProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-gray-900">Guia Rápido - ComandaQR</h2>
          <button
            onClick={onClose}
            className="size-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cliente */}
          <div>
            <h3 className="text-orange-600 mb-4">🍺 Para Clientes</h3>
            <div className="space-y-3">
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="mb-2">1. Acesse uma mesa</div>
                <p className="text-gray-600 text-sm">
                  Visite:{' '}
                  <code className="bg-white px-2 py-1 rounded">
                    /table/table-1
                  </code>
                </p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="mb-2">2. Faça login</div>
                <p className="text-gray-600 text-sm">
                  Clique em &quot;Continuar com Google&quot; (simulado)
                </p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="mb-2">3. Faça seu pedido</div>
                <p className="text-gray-600 text-sm">
                  Navegue pelo cardápio e adicione itens à sua comanda
                </p>
              </div>
            </div>
          </div>

          {/* Admin */}
          <div>
            <h3 className="text-blue-600 mb-4">👨‍💼 Para Administradores</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="mb-2">1. Acesse o painel</div>
                <p className="text-gray-600 text-sm">
                  Visite:{' '}
                  <code className="bg-white px-2 py-1 rounded">
                    /admin/login
                  </code>
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="mb-2">2. Credenciais</div>
                <p className="text-gray-600 text-sm mb-1">
                  Email: <code className="bg-white px-2 py-1 rounded">admin@comandaqr.com</code>
                </p>
                <p className="text-gray-600 text-sm">
                  Senha: <code className="bg-white px-2 py-1 rounded">admin123</code>
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="mb-2">3. Gerencie o estabelecimento</div>
                <p className="text-gray-600 text-sm">
                  Acesse comandas, cardápio, mesas e relatórios
                </p>
              </div>
            </div>
          </div>

          {/* Garçom */}
          <div>
            <h3 className="text-green-600 mb-4">🍽️ Para Garçons</h3>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="mb-2">Painel Operacional</div>
              <p className="text-gray-600 text-sm">
                Visite:{' '}
                <code className="bg-white px-2 py-1 rounded">/waiter</code>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Gerencie pedidos pendentes e entregas
              </p>
            </div>
          </div>

          {/* Segurança */}
          <div>
            <h3 className="text-purple-600 mb-4">🔒 Para Segurança</h3>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="mb-2">Sistema de Validação</div>
              <p className="text-gray-600 text-sm">
                Visite:{' '}
                <code className="bg-white px-2 py-1 rounded">/security</code>
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Valide QR Codes de saída dos clientes
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <h3 className="text-gray-900 mb-4">✨ Funcionalidades</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ Login Google OAuth</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ Cardápio Digital</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ Pagamento PIX/Card</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ QR Code Saída</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ Dashboard Real-time</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">✅ Relatórios</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6">
          <button
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors"
          >
            Começar a Usar
          </button>
        </div>
      </div>
    </div>
  );
}
