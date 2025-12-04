import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useOrder } from '../../contexts/OrderContext';
import { products } from '../../data/mockData';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

function ItemDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('table');
  const navigate = useNavigate();
  const { addItem } = useOrder();

  const product = products.find((p) => p.id === itemId);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  // Calculate total price with variants
  let totalPrice = product.price;
  if (product.variants) {
    product.variants.forEach((variant) => {
      const selectedOption = selectedVariants[variant.name];
      if (selectedOption) {
        const option = variant.options.find((o) => o.label === selectedOption);
        if (option) {
          totalPrice += option.price;
        }
      }
    });
  }

  const handleAddToOrder = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: totalPrice,
      quantity,
      observations: observations || undefined,
      variants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      image: product.image,
    });
    navigate(`/menu/${tableId}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <button
          onClick={() => navigate(`/menu/${tableId}`)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="size-5" />
          Voltar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 relative">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h1 className="text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="text-orange-600">R$ {product.price.toFixed(2)}</div>
          </div>

          {/* Variants */}
          {product.variants?.map((variant) => (
            <div key={variant.name} className="mb-6">
              <h3 className="text-gray-900 mb-3">{variant.name}</h3>
              <div className="space-y-2">
                {variant.options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [variant.name]: option.label,
                      }))
                    }
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedVariants[variant.name] === option.label
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option.label}</span>
                      {option.price !== 0 && (
                        <span className="text-gray-600">
                          {option.price > 0 ? '+' : ''}R$ {option.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Observations */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">Observações</h3>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: sem cebola, ponto da carne..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-orange-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3">Quantidade</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="size-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="size-5" />
              </button>
              <span className="text-gray-900 w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="size-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Plus className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleAddToOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl transition-colors"
          >
            Adicionar à comanda • R$ {(totalPrice * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ItemDetail), { ssr: false });
import dynamic from 'next/dynamic';
