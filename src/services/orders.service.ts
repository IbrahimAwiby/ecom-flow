import api from "./api";
import type { Order, CreateOrderData, CheckoutSessionResponse } from "@/types";
import { useAuthStore } from "@/store/auth.store";

export const ordersService = {
  getUserOrders: async (): Promise<Order[]> => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return [];
    const { data } = await api.get(`/orders/user/${userId}`);
    // Handle both array and wrapped response formats
    return Array.isArray(data) ? data : (data?.data || []);
  },

  createCashOrder: async (cartId: string, orderData: CreateOrderData): Promise<{ status: string; data: Order }> => {
    const { data } = await api.post(`/orders/${cartId}`, orderData);
    return data;
  },

  createCheckoutSession: async (cartId: string, orderData: CreateOrderData): Promise<CheckoutSessionResponse> => {
    const { data } = await api.post<CheckoutSessionResponse>(
      `/orders/checkout-session/${cartId}?url=${window.location.origin}`,
      orderData
    );
    return data;
  },
};
