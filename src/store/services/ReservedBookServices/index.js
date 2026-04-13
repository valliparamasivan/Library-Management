import { clientAxios } from "@/config/ApiConfig";

export const checkoutReservedBook = async (reserveId) => {
  const { data } = await clientAxios.post(`/admin/reserved/checkout?reserveId=${reserveId}`);
  return data;
};
