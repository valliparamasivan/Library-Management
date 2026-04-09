import {
  customerSignIn, customerRegister, customerForgotPassword, customerChangePassword, customerValidateSecurityKey,
  customerProfileUpdate, customerSetGoal, getCustomerProfileDetails, getCustomerNotifications,
  markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications
} from "@/store/customerServices/AuthServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCustomerLogin = () => {
  return useMutation({
    mutationFn: (params) => customerSignIn(params),
  });
};

export const useCustomerRegister = () => {
  return useMutation({
    mutationFn: (params) => customerRegister(params),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => customerProfileUpdate(params),
    // Refetch the cached profile so consumers like CustomerHeader pick up
    // the new image / name / phone immediately after a successful update.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerProfileDetails'] }),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerNotifications'] }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerNotifications'] }),
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerNotifications'] }),
  });
};

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customerNotifications'] }),
  });
};