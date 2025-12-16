import api from "./api";
import type { BrandsResponse, BrandResponse } from "@/types";

export const brandsService = {
  getAll: async (): Promise<BrandsResponse> => {
    const { data } = await api.get<BrandsResponse>("/brands");
    return data;
  },

  getById: async (id: string): Promise<BrandResponse> => {
    const { data } = await api.get<BrandResponse>(`/brands/${id}`);
    return data;
  },
};
