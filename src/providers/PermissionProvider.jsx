"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchMyPermissions } from "@/store/services/PermissionServices";

const PermissionContext = createContext({
  permissions: [],
  isLoading: true,
  refetchPermissions: () => {},
});

export const PERMISSIONS_QUERY_KEY = ["my-permissions"];

export const PermissionProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const isEmployee = status === "authenticated" && session?.user?.role && session?.user?.role !== "User";

  const { data, isLoading, refetch } = useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: fetchMyPermissions,
    enabled: isEmployee,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    retry: 1,
  });

  const permissions = data?.data || [];

  return (
    <PermissionContext.Provider value={{ permissions, isLoading: isEmployee && isLoading, refetchPermissions: refetch }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => useContext(PermissionContext);
