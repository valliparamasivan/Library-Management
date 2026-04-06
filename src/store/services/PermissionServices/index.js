import { clientAxios } from "@/config/ApiConfig";

export const fetchMyPermissions = async () => {
  const { data } = await clientAxios.get("/my-permissions");
  return data;
};
