import { clientAxios } from "@/config/ApiConfig";

export const payFine = async (params) => {
  const { data } = await clientAxios.put("/fines/pay", params);
  return data;
};

export const getFineSummary = async () => {
  const { data } = await clientAxios.get("/fines/summary");
  return data;
};
