import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { products, categories } from '../../data/mockData';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

function MenuManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [productList, setProductList] = useState(products);

  if (!user || user.role !== 'admin') {
    navigate('/admin/login');
    return null;
  }

  const filteredProducts = productList.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleProductStatus = (productId: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-gray-900">Cardápio</h1>
            <p className="text-gray-600">Gerencie os produtos do seu cardápio</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="size-5" />
            Adicionar Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Product Image */}
            <div className="aspect-video bg-gray-100 relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {!product.active && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-white px-4 py-2 rounded-full text-sm">
                    Inativo
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="text-orange-600">R$ {product.price.toFixed(2)}</div>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-3">
                  <p className="text-gray-500 text-xs">
                    {product.variants.length} variante{product.variants.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    product.active
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {product.active ? (
                    <>
                      <ToggleRight className="size-5" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="size-5" />
                      Inativo
                    </>
                  )}
                </button>
                <button className="size-10 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                  <Edit className="size-5" />
                </button>
                <button className="size-10 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                  <Trash2 className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <h3 className="text-gray-600 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-500 text-sm">
            Tente ajustar os filtros ou adicione um novo produto
          </p>
        </div>
      )}
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(MenuManagement), { ssr: false });
import dynamic from 'next/dynamic';
