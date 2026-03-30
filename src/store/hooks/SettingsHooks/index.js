"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { policyCreate, policyUpdate, locationCreate, locationUpdate, roleCreate, roleUpdate, getRoleById, employeeCreate, employeeUpdate } from "@/store/services/SettingsServices";

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
    return useMutation({
      mutationFn: (params) => roleCreate(params),
    });
};

export const useRoleUpdate = () => {
    return useMutation({
      mutationFn: (params) => roleUpdate(params),
    });
};

export const useGetRoleById = (id) => {
    return useQuery({
      queryKey: ["getRoleById", id],
      queryFn: () => getRoleById(id),
      enabled: !!id,
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
