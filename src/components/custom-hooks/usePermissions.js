"use client";
import { usePermissionContext } from "@/providers/PermissionProvider";

const usePermissions = () => {
  const { permissions, isLoading, refetchPermissions } = usePermissionContext();

  const getPermission = (moduleName) => {
    if (!moduleName) return null;
    return permissions.find(
      (p) => p.permissionName?.toLowerCase() === moduleName.toLowerCase()
    ) || null;
  };

  const hasPermission = (moduleName, action = "view") => {
    const perm = getPermission(moduleName);
    if (!perm) return false;
    switch (action) {
      case "view": return !!perm.view;
      case "add": return !!perm.add;
      case "edit": return !!perm.edit;
      case "delete": return !!perm.delete;
      default: return false;
    }
  };

  const hasAnyPermission = (moduleNames, action = "view") => {
    if (!Array.isArray(moduleNames)) return hasPermission(moduleNames, action);
    return moduleNames.some((name) => hasPermission(name, action));
  };

  const canView = (moduleName) => hasPermission(moduleName, "view");
  const canAdd = (moduleName) => hasPermission(moduleName, "add");
  const canEdit = (moduleName) => hasPermission(moduleName, "edit");
  const canDelete = (moduleName) => hasPermission(moduleName, "delete");

  const canAnyView = (moduleNames) => hasAnyPermission(moduleNames, "view");
  const canAnyAdd = (moduleNames) => hasAnyPermission(moduleNames, "add");
  const canAnyEdit = (moduleNames) => hasAnyPermission(moduleNames, "edit");
  const canAnyDelete = (moduleNames) => hasAnyPermission(moduleNames, "delete");

  return {
    permissions, isLoading, refetchPermissions,
    getPermission, hasPermission, hasAnyPermission,
    canView, canAdd, canEdit, canDelete,
    canAnyView, canAnyAdd, canAnyEdit, canAnyDelete,
  };
};

export default usePermissions;
