import { create } from "zustand";
import type { Cart, CartItem } from "@/types";

interface CartState {
  cart: Cart | null;
  cartCount: number;
  cartId: string | null;
  setCart: (cart: Cart | null) => void;
  setCartCount: (count: number) => void;
  setCartId: (id: string | null) => void;
  clearCart: () => void;
  updateItemCount: (productId: string, count: number) => void;
  removeItem: (productId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  cartCount: 0,
  cartId: null,

  setCart: (cart) =>
    set({
      cart,
      cartCount: cart?.products.reduce((acc, item) => acc + item.count, 0) || 0,
    }),

  setCartCount: (cartCount) => set({ cartCount }),
  setCartId: (cartId) => set({ cartId }),

  clearCart: () => set({ cart: null, cartCount: 0, cartId: null }),

  updateItemCount: (productId, count) =>
    set((state) => {
      if (!state.cart) return state;
      const products = state.cart.products.map((item) =>
        item.product._id === productId ? { ...item, count } : item
      );
      const totalCartPrice = products.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );
      return {
        cart: { ...state.cart, products, totalCartPrice },
        cartCount: products.reduce((acc, item) => acc + item.count, 0),
      };
    }),

  removeItem: (productId) =>
    set((state) => {
      if (!state.cart) return state;
      const products = state.cart.products.filter(
        (item) => item.product._id !== productId
      );
      const totalCartPrice = products.reduce(
        (acc, item) => acc + item.price * item.count,
        0
      );
      return {
        cart: { ...state.cart, products, totalCartPrice },
        cartCount: products.reduce((acc, item) => acc + item.count, 0),
      };
    }),
}));
