import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrder } from '../../contexts/OrderContext';
import { products, categories } from '../../data/mockData';
import { ShoppingCart, Plus } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

function Menu() {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentOrder } = useOrder();
  const [selectedCategory, setSelectedCategory] = useState('drinks');

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory && p.active
  );

  const subtotal = currentOrder?.total || 0;
  const itemCount = currentOrder?.items.length || 0;
  const tableNumber = tableId?.replace('table-', '');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-900">Mesa {tableNumber}</div>
              <p className="text-gray-600 text-sm">{user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-orange-100 overflow-hidden">
                {user?.photo && (
                  <ImageWithFallback
                    src={user.photo}
                    alt={user.name}
                    className="size-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b sticky top-[73px] z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/item/${product.id}?table=${tableId}`)}
            >
              <div className="aspect-video bg-gray-100 relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-orange-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white size-10 rounded-full flex items-center justify-center transition-colors">
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{itemCount} itens</p>
                <div className="text-gray-900">R$ {subtotal.toFixed(2)}</div>
              </div>
              <button
                onClick={() => navigate(`/order/${tableId}`)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="size-5" />
                Ver Comanda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Menu), { ssr: false });
import dynamic from 'next/dynamic';
