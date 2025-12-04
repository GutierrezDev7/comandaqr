export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  active: boolean;
  variants?: {
    name: string;
    options: { label: string; price: number }[];
  }[];
}

export const categories = [
  { id: 'drinks', name: 'Drinks', icon: '🍹' },
  { id: 'food', name: 'Comidas', icon: '🍔' },
  { id: 'appetizers', name: 'Petiscos', icon: '🍟' },
  { id: 'desserts', name: 'Sobremesas', icon: '🍰' },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Caipirinha',
    description: 'Caipirinha tradicional de limão',
    price: 18.9,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400&h=300&fit=crop',
    active: true,
    variants: [
      {
        name: 'Sabor',
        options: [
          { label: 'Limão', price: 0 },
          { label: 'Morango', price: 2 },
          { label: 'Maracujá', price: 2 },
          { label: 'Kiwi', price: 3 },
        ],
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Cerveja Artesanal',
    description: 'Cerveja IPA gelada',
    price: 15.0,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    active: true,
    variants: [
      {
        name: 'Tipo',
        options: [
          { label: 'IPA', price: 0 },
          { label: 'Pilsen', price: -2 },
          { label: 'Weiss', price: 1 },
        ],
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'Mojito',
    description: 'Mojito refrescante com hortelã',
    price: 22.0,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
    active: true,
  },
  {
    id: 'prod-4',
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer 200g com queijo, alface, tomate e molho especial',
    price: 35.0,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    active: true,
    variants: [
      {
        name: 'Ponto da Carne',
        options: [
          { label: 'Mal Passado', price: 0 },
          { label: 'Ao Ponto', price: 0 },
          { label: 'Bem Passado', price: 0 },
        ],
      },
      {
        name: 'Adicionais',
        options: [
          { label: 'Bacon', price: 5 },
          { label: 'Ovo', price: 3 },
          { label: 'Cheddar Extra', price: 4 },
        ],
      },
    ],
  },
  {
    id: 'prod-5',
    name: 'Pizza Margherita',
    description: 'Pizza tradicional com molho de tomate, muçarela e manjericão',
    price: 45.0,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    active: true,
    variants: [
      {
        name: 'Tamanho',
        options: [
          { label: 'Pequena', price: -10 },
          { label: 'Média', price: 0 },
          { label: 'Grande', price: 15 },
        ],
      },
    ],
  },
  {
    id: 'prod-6',
    name: 'Batata Frita',
    description: 'Batatas fritas crocantes com molho especial',
    price: 18.0,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    active: true,
  },
  {
    id: 'prod-7',
    name: 'Porção de Calabresa',
    description: 'Calabresa acebolada servida com pão de alho',
    price: 28.0,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1625938145312-969f0b959ecd?w=400&h=300&fit=crop',
    active: true,
  },
  {
    id: 'prod-8',
    name: 'Asas de Frango',
    description: '10 unidades de asas crocantes com molho barbecue',
    price: 32.0,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
    active: true,
  },
  {
    id: 'prod-9',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate com sorvete de baunilha',
    price: 16.0,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=300&fit=crop',
    active: true,
  },
  {
    id: 'prod-10',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate quente com sorvete',
    price: 18.0,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
    active: true,
  },
];

export const tables = [
  { id: 'table-1', number: 1, qrCode: 'qr-table-1', status: 'free' as const },
  { id: 'table-2', number: 2, qrCode: 'qr-table-2', status: 'occupied' as const },
  { id: 'table-3', number: 3, qrCode: 'qr-table-3', status: 'free' as const },
  { id: 'table-4', number: 4, qrCode: 'qr-table-4', status: 'occupied' as const },
  { id: 'table-5', number: 5, qrCode: 'qr-table-5', status: 'free' as const },
  { id: 'table-6', number: 6, qrCode: 'qr-table-6', status: 'free' as const },
  { id: 'table-7', number: 7, qrCode: 'qr-table-7', status: 'occupied' as const },
  { id: 'table-8', number: 8, qrCode: 'qr-table-8', status: 'free' as const },
];

export const establishment = {
  name: 'Bar do Zé',
  logo: '🍺',
  description: 'O melhor bar da cidade',
  address: 'Rua das Flores, 123 - Centro',
  phone: '(11) 98765-4321',
};
