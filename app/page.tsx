"use client";
export const dynamic = "force-dynamic";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrderProvider } from '@/contexts/OrderContext';

// Client Pages
import AccessTable from '@/pages/client/AccessTable';
import Menu from '@/pages/client/Menu';
import ItemDetail from '@/pages/client/ItemDetail';
import OrderSummary from '@/pages/client/OrderSummary';
import Checkout from '@/pages/client/Checkout';
import Payment from '@/pages/client/Payment';
import PaymentSuccess from '@/pages/client/PaymentSuccess';
import ExitQR from '@/pages/client/ExitQR';

// Admin Pages
import AdminLogin from '@/pages/admin/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import ActiveOrders from '@/pages/admin/ActiveOrders';
import OrderDetail from '@/pages/admin/OrderDetail';
import MenuManagement from '@/pages/admin/MenuManagement';
import TableManagement from '@/pages/admin/TableManagement';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';

// Operational Pages
import WaiterPanel from '@/pages/operational/WaiterPanel';
import SecurityValidation from '@/pages/operational/SecurityValidation';

// Other Pages
import NotFound from '@/pages/NotFound';

export default function App() {
  const [mounted] = useState(() => typeof window !== "undefined");
  if (!mounted) return null;
  return (
    <Router>
      <AuthProvider>
        <OrderProvider>
          <Routes>
            {/* Client Routes */}
            <Route path="/table/:tableId" element={<AccessTable />} />
            <Route path="/menu/:tableId" element={<Menu />} />
            <Route path="/item/:itemId" element={<ItemDetail />} />
            <Route path="/order/:tableId" element={<OrderSummary />} />
            <Route path="/checkout/:tableId" element={<Checkout />} />
            <Route path="/payment/:tableId" element={<Payment />} />
            <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
            <Route path="/exit-qr/:orderId" element={<ExitQR />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/orders" element={<ActiveOrders />} />
            <Route path="/admin/order/:orderId" element={<OrderDetail />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/tables" element={<TableManagement />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />

            {/* Operational Routes */}
            <Route path="/waiter" element={<WaiterPanel />} />
            <Route path="/security" element={<SecurityValidation />} />

            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OrderProvider>
      </AuthProvider>
    </Router>
  );
}
