/**
 * Maps frontend routes to the permission names that grant view access to them.
 * A route is accessible if ANY of its mapped permissions has view: true.
 *
 * These names must match the `permissionName` values returned by GET /my-permissions.
 */
const ROUTE_TO_PERMISSIONS = {
  "/dashboard": ["dashboard"],
  "/inventory": ["inventory"],
  "/circulation": ["circulation", "active transactions", "circulation check-in", "circulation check-out", "circulation check-in/out"],
  "/loans": ["loans"],
  "/users": ["users"],
  "/settings": ["settings", "roles", "roles & permissions", "policy", "location", "employees"],
  "/reports": ["reports", "report users", "report loans", "report inventory", "report users export", "report loans export", "report inventory export"],
  "/activitylog": ["activity log"],
};

const ROUTE_ORDER = ["/dashboard", "/inventory", "/circulation", "/loans", "/users", "/settings", "/reports", "/activitylog"];

/**
 * Checks if a user has view permission for a given route.
 */
export function canViewRoute(permissions, route) {
  if (!permissions || permissions.length === 0) return true;
  const permNames = ROUTE_TO_PERMISSIONS[route];
  if (!permNames) return true;
  return permNames.some((name) =>
    permissions.some(
      (p) => p.permissionName && p.permissionName.toLowerCase() === name && p.view
    )
  );
}

/**
 * Returns the first route the user has view permission for.
 * Falls back to "/dashboard" if no permissions match.
 */
export function getFirstAccessibleRoute(permissions = []) {
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return "/dashboard";
  }
  for (const route of ROUTE_ORDER) {
    if (canViewRoute(permissions, route)) return route;
  }
  return "/dashboard";
}
