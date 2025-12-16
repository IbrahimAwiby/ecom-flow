import api from "./api";
import type { WishlistResponse, AddToWishlistResponse } from "@/types";

export const wishlistService = {
  getWishlist: async (): Promise<WishlistResponse> => {
    const { data } = await api.get<WishlistResponse>("/wishlist");
    return data;
  },

  addToWishlist: async (productId: string): Promise<AddToWishlistResponse> => {
    const { data } = await api.post<AddToWishlistResponse>("/wishlist", { productId });
    return data;
  },

  removeFromWishlist: async (productId: string): Promise<AddToWishlistResponse> => {
    const { data } = await api.delete<AddToWishlistResponse>(`/wishlist/${productId}`);
    return data;
  },
};
