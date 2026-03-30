import { clientAxios } from "@/config/ApiConfig";

export const signIn = async (params) => {
  const { data } = await clientAxios.post("/login/employee", params);
  return data;
};

export const forgotPassword = async (params) => {
  const { data } = await clientAxios.post("/public/reset-password-mail", params);
  return data;
};

export const resetPassword = async (params) => {
  const { data } = await clientAxios.post("/public/reset-password", params);
  return data;
};

export const keyValidation = async (params) => {
  const { data } = await clientAxios.post("/public/validate-security-key", params);
  return data;
};
