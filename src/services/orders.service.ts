import api from "./api";
import type { OrdersResponse, Order, CreateOrderData, CheckoutSessionResponse } from "@/types";

export const ordersService = {
  getUserOrders: async (userId: string): Promise<Order[]> => {
    const { data } = await api.get<Order[]>(`/orders/user/${userId}`);
    return data;
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
