"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import usePermissions from "@/components/custom-hooks/usePermissions";
import { canViewRoute, getFirstAccessibleRoute } from "@/helpers/PermissionRoutes";

const GUARDED_ROUTES = ["/dashboard", "/inventory", "/circulation", "/loans", "/users", "/settings", "/reports", "/activitylog"];

const SETTINGS_SUB_ROUTES = {
  "/settings/policy": ["Policy", "Settings"],
  "/settings/roles": ["Roles", "Roles & Permissions", "Settings"],
  "/settings/employees": ["Employees", "Settings"],
  "/settings/location": ["Location", "Settings"],
};

const PermissionGuard = ({ children }) => {
  const { permissions, isLoading, hasAnyPermission } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();
  const lastRedirect = useRef("");

  useEffect(() => {
    if (isLoading || permissions.length === 0) return;

    // Check settings sub-routes first
    const settingsSubMatch = Object.keys(SETTINGS_SUB_ROUTES).find((r) => pathname.startsWith(r));
    if (settingsSubMatch) {
      const requiredPerms = SETTINGS_SUB_ROUTES[settingsSubMatch];
      if (!hasAnyPermission(requiredPerms, "view")) {
        // Redirect to first allowed settings tab or first accessible route
        const firstAllowed = Object.entries(SETTINGS_SUB_ROUTES).find(
          ([, perms]) => hasAnyPermission(perms, "view")
        );
        const fallback = firstAllowed ? firstAllowed[0] : getFirstAccessibleRoute(permissions);
        if (!pathname.startsWith(fallback) && lastRedirect.current !== fallback) {
          lastRedirect.current = fallback;
          router.replace(fallback);
        }
        return;
      }
      lastRedirect.current = "";
      return;
    }

    // Check top-level routes
    const matchedRoute = GUARDED_ROUTES.find((r) => pathname.startsWith(r));
    if (!matchedRoute) return;

    if (!canViewRoute(permissions, matchedRoute)) {
      const fallback = getFirstAccessibleRoute(permissions);
      if (!pathname.startsWith(fallback) && lastRedirect.current !== fallback) {
        lastRedirect.current = fallback;
        router.replace(fallback);
      }
    } else {
      lastRedirect.current = "";
    }
  }, [permissions, isLoading, pathname, router, hasAnyPermission]);

  return children;
};

export default PermissionGuard;
