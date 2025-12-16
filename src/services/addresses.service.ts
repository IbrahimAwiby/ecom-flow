import api from "./api";
import type { AddressesResponse, AddAddressData, Address } from "@/types";

export const addressesService = {
  getAll: async (): Promise<AddressesResponse> => {
    const { data } = await api.get<AddressesResponse>("/addresses");
    return data;
  },

  add: async (addressData: AddAddressData): Promise<{ status: string; data: Address[] }> => {
    const { data } = await api.post("/addresses", addressData);
    return data;
  },

  remove: async (addressId: string): Promise<{ status: string; data: Address[] }> => {
    const { data } = await api.delete(`/addresses/${addressId}`);
    return data;
  },
};
