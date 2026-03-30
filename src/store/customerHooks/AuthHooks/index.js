import { 
  customerSignIn, customerForgotPassword, customerChangePassword, customerValidateSecurityKey, 
  customerProfileUpdate, customerSetGoal, getCustomerProfileDetails, getCustomerNotifications,
  markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications
} from "@/store/customerServices/AuthServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCustomerLogin = () => {
  return useMutation({
    mutationFn: (params) => customerSignIn(params),
  });
};

export const useCustomerForgotPassword = () => {
  return useMutation({
    mutationFn: (params) => customerForgotPassword(params),
  });
};

export const useCustomerChangePassword = () => {
  return useMutation({
    mutationFn: (params) => customerChangePassword(params),
  });
};

export const useCustomerValidateSecurityKey = () => {
  return useMutation({
    mutationFn: (params) => customerValidateSecurityKey(params),
  });
};

export const useCustomerProfileUpdate = () => {
  return useMutation({
    mutationFn: (params) => customerProfileUpdate(params),
  });
};

export const useCustomerSetGoal = () => {
  return useMutation({
    mutationFn: (params) => customerSetGoal(params),
  });
};

export const useCustomerProfileDetails = (options = {}) => {
  return useQuery({
    queryKey: ['customerProfileDetails'],
    queryFn: getCustomerProfileDetails,
    ...options,
  });
};

export const useCustomerNotifications = () => {
  return useQuery({
    queryKey: ['customerNotifications'],
    queryFn: getCustomerNotifications,
  });
};

export const useMarkNotificationRead = () => {
  return useMutation({ mutationFn: (id) => markNotificationAsRead(id) });
};

export const useMarkAllNotificationsRead = () => {
  return useMutation({ mutationFn: () => markAllNotificationsAsRead() });
};

export const useDeleteNotification = () => {
  return useMutation({ mutationFn: (id) => deleteNotification(id) });
};

export const useDeleteAllNotifications = () => {
  return useMutation({ mutationFn: () => deleteAllNotifications() });
};