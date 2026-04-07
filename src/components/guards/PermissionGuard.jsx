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

/**
 * Sub-routes under /inventory/inventory-details/[slug]/* that need
 * their own specific permission check beyond the parent /inventory permission.
 */
const INVENTORY_SUB_ROUTE_MATCHERS = [
  { match: "/book-details", perms: ["Book Details", "Inventory"] },
  { match: "/rfid", perms: ["RFID and Location", "Inventory"] },
  { match: "/location", perms: ["RFID and Location", "Inventory"] },
  { match: "/loan", perms: ["Loans", "Active Transactions", "Inventory"] },
  { match: "/activity-log", perms: ["Activity Log", "Inventory"] },
];

const findInventorySubRouteMatch = (pathname) => {
  if (!pathname.startsWith("/inventory/inventory-details/")) return null;
  return INVENTORY_SUB_ROUTE_MATCHERS.find((entry) => pathname.includes(entry.match)) || null;
};

const PermissionGuard = ({ children }) => {
  const { permissions, isLoading, hasPermission, hasAnyPermission } = usePermissions();
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

    // Check inventory detail sub-routes (Book Details, RFID & Location, Loans, etc.)
    // The specific permission for the sub-page must be granted; the parent /inventory
    // permission alone is NOT enough.
    const inventorySubMatch = findInventorySubRouteMatch(pathname);
    if (inventorySubMatch) {
      // Require the specific sub-page permission (e.g. "Book Details") to be true.
      // The first entry in `perms` is the specific one; the rest are parent fallbacks
      // that we don't honour for sub-page restriction.
      const specificPerm = inventorySubMatch.perms[0];
      if (!hasPermission(specificPerm, "view")) {
        const fallback = getFirstAccessibleRoute(permissions);
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
  }, [permissions, isLoading, pathname, router, hasPermission, hasAnyPermission]);

  return children;
};

export default PermissionGuard;
