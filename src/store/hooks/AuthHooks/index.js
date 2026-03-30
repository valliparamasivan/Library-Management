import { signIn, forgotPassword, resetPassword, keyValidation } from "@/store/services/AuthServices";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: (params) => signIn(params),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (params) => forgotPassword(params),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (params) => resetPassword(params),
  });
};

export const useKeyValidation = () => {
  return useMutation({
    mutationFn: (params) => keyValidation(params),
  });
};
