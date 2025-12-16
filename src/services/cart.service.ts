import api from "./api";
import type { CartResponse, AddToCartResponse } from "@/types";

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const { data } = await api.get<CartResponse>("/cart");
    return data;
  },

  addToCart: async (productId: string): Promise<AddToCartResponse> => {
    const { data } = await api.post<AddToCartResponse>("/cart", { productId });
    return data;
  },

  updateQuantity: async (productId: string, count: number): Promise<CartResponse> => {
    const { data } = await api.put<CartResponse>(`/cart/${productId}`, { count });
    return data;
  },

  removeItem: async (productId: string): Promise<CartResponse> => {
    const { data } = await api.delete<CartResponse>(`/cart/${productId}`);
    return data;
  },

  clearCart: async (): Promise<{ message: string }> => {
    const { data } = await api.delete("/cart");
    return data;
  },
};
