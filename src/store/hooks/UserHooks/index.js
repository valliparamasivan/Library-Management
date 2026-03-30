import { useMutation } from "@tanstack/react-query";
import { createUser, userChangeStatus, editUser } from "@/store/services/UserServices";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (formData) => createUser(formData),
  });
};

export const useUserChangeStatus = () => {
  return useMutation({
    mutationFn: (userId) => userChangeStatus(userId),
  });
};

export const useEditUser = () => {
  return useMutation({
    mutationFn: (formData) => editUser(formData),
  });
};
