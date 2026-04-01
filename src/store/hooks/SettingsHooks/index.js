"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { policyCreate, policyUpdate, locationCreate, locationUpdate, roleCreate, roleUpdate, getRoleById, changeRoleStatus, getAllRolePermissions, employeeCreate, employeeUpdate, changeEmployeeStatus } from "@/store/services/SettingsServices";

export const useReportPolicyCreate = () => {
    return useMutation({
      mutationFn: (params) => policyCreate(params),
    });
};

export const useReportPolicyUpdate = () => {
    return useMutation({
      mutationFn: (params) => policyUpdate(params),
    });
};

export const useEmployeeCreate = () => {
    return useMutation({
      mutationFn: (params) => employeeCreate(params),
    });
};

export const useEmployeeUpdate = () => {
    return useMutation({
      mutationFn: (params) => employeeUpdate(params),
    });
};

export const useRoleCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (params) => roleCreate(params),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getRoleById"] }),
    });
};

export const useRoleUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (params) => roleUpdate(params),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getRoleById"] }),
    });
};

export const useChangeRoleStatus = () => {
    return useMutation({
      mutationFn: (roleId) => changeRoleStatus(roleId),
    });
};

export const useGetRoleById = (id) => {
    return useQuery({
      queryKey: ["getRoleById", id],
      queryFn: () => getRoleById(id),
      enabled: !!id,
    });
};

export const useGetAllRolePermissions = (enabled) => {
    return useQuery({
      queryKey: ["allRolePermissions"],
      queryFn: () => getAllRolePermissions(),
      enabled: !!enabled,
    });
};

export const useChangeEmployeeStatus = () => {
    return useMutation({
      mutationFn: (employeeId) => changeEmployeeStatus(employeeId),
    });
};

export const useLocationCreate = () => {
    return useMutation({
      mutationFn: (params) => locationCreate(params),
    });
};

export const useLocationUpdate = () => {
    return useMutation({
      mutationFn: (params) => locationUpdate(params),
    });
};
