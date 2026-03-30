import { clientAxios } from "@/config/ApiConfig";

export const createUser = async (formData) => {
  const { data } = await clientAxios.post("/createUser", formData, {
    isMultipart: true,
  });
  return data;
};

export const userChangeStatus = async (userId) => {
  const { data } = await clientAxios.put(`/user/changeStatus/${userId}`);
  return data;
};

export const editUser = async (formData) => {
  const { data } = await clientAxios.put("/editUser", formData, {
    isMultipart: true,
  });
  return data;
};
