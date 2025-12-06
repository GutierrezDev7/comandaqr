import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/table/:tableId", destination: "/" },
      { source: "/menu/:tableId", destination: "/" },
      { source: "/item/:itemId", destination: "/" },
      { source: "/order/:tableId", destination: "/" },
      { source: "/checkout/:tableId", destination: "/" },
      { source: "/payment/:tableId", destination: "/" },
      { source: "/payment-success/:orderId", destination: "/" },
      { source: "/exit-qr/:orderId", destination: "/" },
      { source: "/security", destination: "/" },
      { source: "/waiter", destination: "/" },
    ];
  },
};

export default nextConfig;
