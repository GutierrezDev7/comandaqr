import { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
  variants?: Record<string, string>;
  status: 'pending' | 'preparing' | 'delivered';
  image?: string;
}

export interface Order {
  id: string;
  tableId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'active' | 'paid' | 'closed';
  createdAt: Date;
  paidAt?: Date;
}

interface OrderContextType {
  currentOrder: Order | null;
  orders: Order[];
  addItem: (item: Omit<OrderItem, 'id' | 'status'>) => void;
  removeItem: (itemId: string) => void;
  updateItemStatus: (itemId: string, status: OrderItem['status']) => void;
  createOrder: (tableId: string, customerId: string, customerName: string) => void;
  getOrder: (tableId: string) => Order | null;
  completePayment: (orderId: string) => void;
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const createOrder = (tableId: string, customerId: string, customerName: string) => {
    const existingOrder = orders.find(
      (o) => o.tableId === tableId && o.status === 'active'
    );

    if (existingOrder) {
      setCurrentOrder(existingOrder);
    } else {
      const newOrder: Order = {
        id: 'order-' + Date.now(),
        tableId,
        customerId,
        customerName,
        items: [],
        total: 0,
        status: 'active',
        createdAt: new Date(),
      };
      setOrders((prev) => [...prev, newOrder]);
      setCurrentOrder(newOrder);
    }
  };

  const addItem = (item: Omit<OrderItem, 'id' | 'status'>) => {
    if (!currentOrder) return;

    const newItem: OrderItem = {
      ...item,
      id: 'item-' + Date.now(),
      status: 'pending',
    };

    const updatedOrder = {
      ...currentOrder,
      items: [...currentOrder.items, newItem],
      total: currentOrder.total + item.price * item.quantity,
    };

    setCurrentOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((o) => (o.id === currentOrder.id ? updatedOrder : o))
    );
  };

  const removeItem = (itemId: string) => {
    if (!currentOrder) return;

    const item = currentOrder.items.find((i) => i.id === itemId);
    if (!item || item.status !== 'pending') return;

    const updatedOrder = {
      ...currentOrder,
      items: currentOrder.items.filter((i) => i.id !== itemId),
      total: currentOrder.total - item.price * item.quantity,
    };

    setCurrentOrder(updatedOrder);
    setOrders((prev) =>
      prev.map((o) => (o.id === currentOrder.id ? updatedOrder : o))
    );
  };

  const updateItemStatus = (itemId: string, status: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        items: order.items.map((item) =>
          item.id === itemId ? { ...item, status } : item
        ),
      }))
    );

    if (currentOrder) {
      setCurrentOrder({
        ...currentOrder,
        items: currentOrder.items.map((item) =>
          item.id === itemId ? { ...item, status } : item
        ),
      });
    }
  };

  const getOrder = (tableId: string) => {
    return orders.find((o) => o.tableId === tableId && o.status === 'active') || null;
  };

  const completePayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'paid' as const, paidAt: new Date() } : o
      )
    );
  };

  const getAllOrders = () => orders;

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orders,
        addItem,
        removeItem,
        updateItemStatus,
        createOrder,
        getOrder,
        completePayment,
        getAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
