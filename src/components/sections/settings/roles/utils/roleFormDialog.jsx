"use client";

import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { RoleFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useRoleCreate, useRoleUpdate, useGetRoleById, useGetAllRolePermissions } from "@/store/hooks/SettingsHooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PERMISSIONS_QUERY_KEY } from "@/providers/PermissionProvider";

const RoleFormDialog = ({ isOpen, onOpenChange, id }) => {
  const router = useRouter();
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(RoleFormSchema),
    mode: "onSubmit",
    defaultValues: { roleName: "", status: true },
  });

  const [permissions, setPermissions] = useState([]);

  const { data: allPermsResponse } = useGetAllRolePermissions(isOpen);
  const allPermsList = allPermsResponse?.data || [];

  const { data: roleResponse } = useGetRoleById(id);
  const roleData = roleResponse?.data;

  useEffect(() => {
    if (!isOpen || !allPermsList.length) return;

    const buildPerms = (apiPerms) => {
      const apiMap = {};
      if (apiPerms?.length) {
        for (const p of apiPerms) {
          apiMap[p.permissionName] = p;
        }
      }
      return allPermsList.map((master) => {
        const p = apiMap[master.rolePermissionName];
        return {
          permissionName: master.rolePermissionName,
          permissionId: master.rolePermissionId,
          permissionActionId: p?.permissionActionId || 0,
          view: p?.view || false,
          add: p?.add || false,
          edit: p?.edit || false,
          delete: p?.delete || false,
        };
      });
    };

    if (id && roleData) {
      reset({
        roleName: roleData.roleName || "",
        status: roleData.active !== false,
      });
      setPermissions(buildPerms(roleData.permissionAddReqDtoList));
    } else if (!id) {
      reset({ roleName: "", status: true });
      setPermissions(buildPerms([]));
    }
  }, [isOpen, id, roleData, allPermsList, reset]);

  const queryClient = useQueryClient();
  const { mutateAsync: roleCreate } = useRoleCreate();
  const { mutateAsync: roleUpdate } = useRoleUpdate();
  const { showSuccessToast, showErrorToast, setFieldError } = useErrorHandler(setError);

  const togglePermission = (index, field) => {
    setPermissions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: !p[field] } : p))
    );
  };

  const isAllChecked = (field) => permissions.length > 0 && permissions.every((p) => p[field]);
  const isSomeChecked = (field) => permissions.some((p) => p[field]) && !isAllChecked(field);

  const toggleAllForField = (field) => {
    const newValue = !isAllChecked(field);
    setPermissions((prev) => prev.map((p) => ({ ...p, [field]: newValue })));
  };

  const onSubmit = async (data) => {
    try {
      const permissionAddReqDtoList = permissions
        .filter((p) => p.view || p.add || p.edit || p.delete)
        .map((p) => ({
          permissionName: p.permissionName,
          permissionId: p.permissionId,
          permissionActionId: p.permissionActionId,
          view: p.view,
          add: p.add,
          edit: p.edit,
          delete: p.delete,
        }));

      const payload = {
        roleId: id || 0,
        roleName: data.roleName,
        active: Boolean(data.status),
        permissionAddReqDtoList,
      };

      const response = id ? await roleUpdate(payload) : await roleCreate(payload);
      const successMsg = (typeof response?.data === "string" ? response.data : null)
        || response?.message
        || (id ? "Role updated successfully" : "Role created successfully");
      showSuccessToast(successMsg);
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      handleCancel();
      router.refresh();
    } catch (error) {
      setFieldError(error);
      showErrorToast(error);
    }
  };

  const handleCancel = () => {
    reset();
    setPermissions([]);
    onOpenChange(false);
  };

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      reset();
      setPermissions([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-4xl rounded-2xl p-0 border-0 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {id ? "Edit Role" : "Add Role"}
          </DialogTitle>
          <button onClick={handleCancel} className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none" type="button">
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 overflow-y-auto flex-1 min-h-0">
            <div className="mb-4 flex items-end gap-4 w-2/3">
              <div className="flex-1">
                <FormInput control={control} name="roleName" label="Role Name" placeholder="Enter Role Name" required />
              </div>
              <div className="flex-1 flex items-center justify-between border border-[#E2E8F0] rounded-lg p-3">
                <span className="text-sm font-semibold text-gray-900">Status</span>
                <FormSwitch control={control} name="status" label="" switchPosition="right" className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300" />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-3">Role Permissions</h3>
            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden mb-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#E2E8F0]">
                    <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3">Permission</th>
                    <th className="text-center text-xs font-semibold text-gray-700 px-4 py-3 w-20">
                      <div className="flex flex-col items-center gap-1">
                        <span>View</span>
                        <Checkbox checked={isSomeChecked("view") ? "indeterminate" : isAllChecked("view")} onCheckedChange={() => toggleAllForField("view")} />
                      </div>
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-700 px-4 py-3 w-20">
                      <div className="flex flex-col items-center gap-1">
                        <span>Add</span>
                        <Checkbox checked={isSomeChecked("add") ? "indeterminate" : isAllChecked("add")} onCheckedChange={() => toggleAllForField("add")} />
                      </div>
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-700 px-4 py-3 w-20">
                      <div className="flex flex-col items-center gap-1">
                        <span>Edit</span>
                        <Checkbox checked={isSomeChecked("edit") ? "indeterminate" : isAllChecked("edit")} onCheckedChange={() => toggleAllForField("edit")} />
                      </div>
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-700 px-4 py-3 w-20">
                      <div className="flex flex-col items-center gap-1">
                        <span>Delete</span>
                        <Checkbox checked={isSomeChecked("delete") ? "indeterminate" : isAllChecked("delete")} onCheckedChange={() => toggleAllForField("delete")} />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, index) => (
                    <tr key={perm.permissionName} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-gray-50/50">
                      <td className="text-sm text-gray-900 px-4 py-2.5">{perm.permissionName}</td>
                      <td className="text-center px-4 py-2.5">
                        <Checkbox checked={perm.view} onCheckedChange={() => togglePermission(index, "view")} />
                      </td>
                      <td className="text-center px-4 py-2.5">
                        <Checkbox checked={perm.add} onCheckedChange={() => togglePermission(index, "add")} />
                      </td>
                      <td className="text-center px-4 py-2.5">
                        <Checkbox checked={perm.edit} onCheckedChange={() => togglePermission(index, "edit")} />
                      </td>
                      <td className="text-center px-4 py-2.5">
                        <Checkbox checked={perm.delete} onCheckedChange={() => togglePermission(index, "delete")} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pt-6 pb-6">
            <ButtonWidget type="button" onClick={handleCancel} className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md">
              Cancel
            </ButtonWidget>
            <ButtonWidget type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0">
              {isSubmitting ? (id ? "Updating..." : "Saving...") : (id ? "Update" : "Save")}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
