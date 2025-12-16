import api from "./api";
import type { CategoriesResponse, CategoryResponse, SubcategoriesResponse } from "@/types";

export const categoriesService = {
  getAll: async (): Promise<CategoriesResponse> => {
    const { data } = await api.get<CategoriesResponse>("/categories");
    return data;
  },

  getById: async (id: string): Promise<CategoryResponse> => {
    const { data } = await api.get<CategoryResponse>(`/categories/${id}`);
    return data;
  },

  getSubcategories: async (categoryId: string): Promise<SubcategoriesResponse> => {
    const { data } = await api.get<SubcategoriesResponse>(`/categories/${categoryId}/subcategories`);
    return data;
  },
};
