import { clientAxios } from "@/config/ApiConfig";

export const customerSignIn = async (params) => {
  const { data } = await clientAxios.post("/login/customer", params);
  return data;
};

export const customerForgotPassword = async (params) => {
  const { data } = await clientAxios.post("/public/reset-password-mail", params);
  return data;
};

export const customerChangePassword = async (params) => {
  const { data } = await clientAxios.post("/public/reset-password", params);
  return data;
};

export const customerValidateSecurityKey = async (params) => {
  const { data } = await clientAxios.post("/public/validate-security-key", params);
  return data;
};

export const customerProfileUpdate = async (params) => {
  const { data } = await clientAxios.putForm("/profile-settings/profile-update", params);
  return data;
};

export const customerSetGoal = async (params) => {
  const { data } = await clientAxios.putForm("/profile-settings/set-goal", params);
  return data;
};

export const getCustomerNotifications = async () => {
  const { data } = await clientAxios.get("/notification/list");
  return data;
};

export const markNotificationAsRead = async (id) => {
  const { data } = await clientAxios.put(`/notification/mark-read/${id}`);
  return data;
};

export const markAllNotificationsAsRead = async () => {
  const { data } = await clientAxios.put("/notification/mark-all-read");
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await clientAxios.delete(`/notification/delete/${id}`);
  return data;
};

export const deleteAllNotifications = async () => {
  const { data } = await clientAxios.delete("/notification/delete-all");
  return data;
};

export const getCustomerProfileDetails = async () => {
  const { data } = await clientAxios.get("/profile-settings/dashboard");
  return data;
};