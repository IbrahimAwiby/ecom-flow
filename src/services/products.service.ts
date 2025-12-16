import api from "./api";
import type { ProductsResponse, ProductResponse } from "@/types";

interface ProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
  category?: string;
  brand?: string;
  keyword?: string;
}

export const productsService = {
  getAll: async (params?: ProductsParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>("/products", { params });
    return data;
  },

  getById: async (id: string): Promise<ProductResponse> => {
    const { data } = await api.get<ProductResponse>(`/products/${id}`);
    return data;
  },
};
