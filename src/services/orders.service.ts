import api from "./api";
import type { Order, CreateOrderData, CheckoutSessionResponse } from "@/types";

export const ordersService = {
  // Get orders for the logged-in user
  getUserOrders: async (): Promise<Order[]> => {
    try {
      const { data } = await api.get(`/orders/`);

      // The API might return data directly as array or wrapped in a data property
      if (Array.isArray(data)) {
        return data;
      } else if (data?.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data?.status === "success" && Array.isArray(data.data)) {
        return data.data;
      }

      // If structure is different, try to extract orders
      return data?.orders || data?.data?.orders || [];
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  },

  createCashOrder: async (
    cartId: string,
    orderData: CreateOrderData
  ): Promise<{ status: string; data: Order }> => {
    const { data } = await api.post(`/orders/${cartId}`, orderData);
    return data;
  },

  createCheckoutSession: async (
    cartId: string,
    orderData: CreateOrderData
  ): Promise<CheckoutSessionResponse> => {
    const { data } = await api.post<CheckoutSessionResponse>(
      `/orders/checkout-session/${cartId}?url=${window.location.origin}`,
      orderData
    );
    return data;
  },

  // Add this method to get a specific order by ID
  getOrderById: async (orderId: string): Promise<Order | null> => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      return data?.data || data;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  },
};
