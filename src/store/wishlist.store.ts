import { create } from "zustand";
import type { Product } from "@/types";

interface WishlistState {
  items: Product[];
  itemIds: Set<string>;
  setItems: (items: Product[]) => void;
  addItem: (item: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  itemIds: new Set<string>(),

  setItems: (items) =>
    set({
      items,
      itemIds: new Set(items.map((item) => item._id)),
    }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
      itemIds: new Set([...state.itemIds, item._id]),
    })),

  removeItem: (productId) =>
    set((state) => {
      const newIds = new Set(state.itemIds);
      newIds.delete(productId);
      return {
        items: state.items.filter((item) => item._id !== productId),
        itemIds: newIds,
      };
    }),

  isInWishlist: (productId) => get().itemIds.has(productId),

  clearWishlist: () => set({ items: [], itemIds: new Set() }),
}));
