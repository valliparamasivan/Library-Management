"use client";

import FormInput from "@/components/form/FormInput";
import FormCheckbox from "@/components/form/FormCheckbox";
import FormSwitch from "@/components/form/FormSwitch";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { RoleFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useRoleCreate, useRoleUpdate, useGetRoleById } from "@/store/hooks/SettingsHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RoleFormDialog = ({ isOpen, onOpenChange, id }) => {
  const router = useRouter();
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(RoleFormSchema),
    mode: "onSubmit",
    defaultValues: {
      roleName: "",
      status: true,
      viewDashboard: false,
      viewBooks: false,
      addBook: false,
      editBook: false,
      deleteBook: false,
      manageRFID: false,
      issueBook: false,
      returnBook: false,
      renewBook: false,
      useScanner: false,
      viewSettings: false,
      editSettings: false,
      deleteSettings: false,
      viewReports: false,
      editReports: false,
      deleteReports: false,
    },
  });

  const { data: roleResponse } = useGetRoleById(id);
  const roleData = roleResponse?.data;

  useEffect(() => {
    if (isOpen && id && roleData) {
      const getPerm = (name) => roleData.permissionAddReqDtoList?.find(p => p.permissionName === name) || {};
      reset({
        roleName: roleData.roleName || "",
        status: roleData.active !== false,
        viewDashboard: getPerm("Dashboard").view || false,
        quickLinks: getPerm("Dashboard").view || false,
        inventory: getPerm("Book Details").view || false,
        viewBooks: getPerm("Book Details").view || false,
        addBook: getPerm("Book Details").add || false,
        editBook: getPerm("Book Details").edit || false,
        deleteBook: getPerm("RFID and Location").view || getPerm("RFID and Location").edit || false,
        manageRFID: getPerm("Active Transactions").view || false, 
        viewTransactions: getPerm("Active Transactions").view || false, 
        actionTransactions: getPerm("Active Transactions").edit || false, 
        useScanner: getPerm("Circulation Check-Out").view || false,
        issueBook: getPerm("Circulation Check-Out").add || false,
        returnBook: getPerm("Circulation Check-In").view || false,
        renewBook: getPerm("Circulation Check-Out").edit || false,
        loanList: getPerm("Loans").view || false,
        loansReturnBook: getPerm("Loans").add || false,
        loansRenewBook: getPerm("Loans").edit || false,
        userList: getPerm("Users").view || false,
        addUser: getPerm("Users").add || getPerm("Users").edit || false,
        viewSettings: getPerm("Policy").view || false,
        editSettings: getPerm("Roles").view || false,
        deleteSettings: getPerm("Employees").view || false,
        addLocation: getPerm("Location").view || false,
        viewReports: getPerm("Report Users").view || getPerm("Report Loans").view || getPerm("Report Inventory").view || false,
        exportReports: getPerm("Report Users Export").view || getPerm("Report Loans Export").view || getPerm("Report Inventory Export").view || false,
        activityLog: getPerm("Activity Log").view || false,
        exportActivityLog: getPerm("Activity Log").edit || false,
      });
    } else if (isOpen && !id) {
      reset({
        roleName: "",
        status: true,
        viewDashboard: false,
        viewBooks: false,
        addBook: false,
        editBook: false,
        deleteBook: false,
        manageRFID: false,
        viewTransactions: false,
        actionTransactions: false,
        issueBook: false,
        returnBook: false,
        renewBook: false,
        loansReturnBook: false,
        loansRenewBook: false,
        useScanner: false,
        viewSettings: false,
        editSettings: false,
        deleteSettings: false,
        viewReports: false,
        editReports: false,
        deleteReports: false,
      });
    }
  }, [isOpen, id, roleData, reset]);

  const { mutateAsync: roleCreate } = useRoleCreate();
  const { mutateAsync: roleUpdate } = useRoleUpdate();
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  const onSubmit = async (data) => {
    try {
      const getPermId = (name) => roleData?.permissionAddReqDtoList?.find(p => p.permissionName === name)?.permissionId || 0;
      const getPermActionId = (name) => roleData?.permissionAddReqDtoList?.find(p => p.permissionName === name)?.permissionActionId || 0;

      const permissionAddReqDtoList = [
        { permissionName: "Dashboard", view: Boolean(data.viewDashboard || data.quickLinks), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Dashboard"), permissionId: getPermId("Dashboard") },
        { permissionName: "Book Details", view: Boolean(data.inventory || data.viewBooks), add: Boolean(data.addBook), edit: Boolean(data.editBook), delete: false, permissionActionId: getPermActionId("Book Details"), permissionId: getPermId("Book Details") },
        { permissionName: "RFID and Location", view: Boolean(data.deleteBook), add: false, edit: Boolean(data.deleteBook), delete: false, permissionActionId: getPermActionId("RFID and Location"), permissionId: getPermId("RFID and Location") },
        { permissionName: "Active Transactions", view: Boolean(data.viewTransactions), add: false, edit: Boolean(data.actionTransactions), delete: false, permissionActionId: getPermActionId("Active Transactions"), permissionId: getPermId("Active Transactions") },
        { permissionName: "Circulation Check-In", view: Boolean(data.returnBook), add: false, edit: Boolean(data.returnBook), delete: false, permissionActionId: getPermActionId("Circulation Check-In"), permissionId: getPermId("Circulation Check-In") },
        { permissionName: "Circulation Check-Out", view: Boolean(data.useScanner), add: Boolean(data.issueBook), edit: Boolean(data.renewBook), delete: false, permissionActionId: getPermActionId("Circulation Check-Out"), permissionId: getPermId("Circulation Check-Out") },
        { permissionName: "Loans", view: Boolean(data.loanList), add: Boolean(data.loansReturnBook), edit: Boolean(data.loansRenewBook), delete: false, permissionActionId: getPermActionId("Loans"), permissionId: getPermId("Loans") },
        { permissionName: "Users", view: Boolean(data.userList), add: Boolean(data.addUser), edit: Boolean(data.addUser), delete: false, permissionActionId: getPermActionId("Users"), permissionId: getPermId("Users") },
        { permissionName: "User Transactions", view: false, add: false, edit: false, delete: false, permissionActionId: getPermActionId("User Transactions"), permissionId: getPermId("User Transactions") },
        { permissionName: "Policy", view: Boolean(data.viewSettings), add: Boolean(data.viewSettings), edit: Boolean(data.viewSettings), delete: false, permissionActionId: getPermActionId("Policy"), permissionId: getPermId("Policy") },
        { permissionName: "Roles", view: Boolean(data.editSettings), add: Boolean(data.editSettings), edit: Boolean(data.editSettings), delete: false, permissionActionId: getPermActionId("Roles"), permissionId: getPermId("Roles") },
        { permissionName: "Employees", view: Boolean(data.deleteSettings), add: Boolean(data.deleteSettings), edit: Boolean(data.deleteSettings), delete: false, permissionActionId: getPermActionId("Employees"), permissionId: getPermId("Employees") },
        { permissionName: "Location", view: Boolean(data.addLocation), add: Boolean(data.addLocation), edit: Boolean(data.addLocation), delete: false, permissionActionId: getPermActionId("Location"), permissionId: getPermId("Location") },
        { permissionName: "Report Users", view: Boolean(data.viewReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Users"), permissionId: getPermId("Report Users") },
        { permissionName: "Report Loans", view: Boolean(data.viewReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Loans"), permissionId: getPermId("Report Loans") },
        { permissionName: "Report Inventory", view: Boolean(data.viewReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Inventory"), permissionId: getPermId("Report Inventory") },
        { permissionName: "Report Users Export", view: Boolean(data.exportReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Users Export"), permissionId: getPermId("Report Users Export") },
        { permissionName: "Report Loans Export", view: Boolean(data.exportReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Loans Export"), permissionId: getPermId("Report Loans Export") },
        { permissionName: "Report Inventory Export", view: Boolean(data.exportReports), add: false, edit: false, delete: false, permissionActionId: getPermActionId("Report Inventory Export"), permissionId: getPermId("Report Inventory Export") },
        { permissionName: "Activity Log", view: Boolean(data.activityLog), add: false, edit: Boolean(data.exportActivityLog), delete: false, permissionActionId: getPermActionId("Activity Log"), permissionId: getPermId("Activity Log") }
      ].filter(p => p.view || p.add || p.edit || p.delete);

      const payload = {
        roleId: id || 0,
        roleName: data.roleName,
        active: Boolean(data.status),
        permissionAddReqDtoList
      };

      const response = id ? await roleUpdate(payload) : await roleCreate(payload);
      showSuccessToast(response?.message || (id ? "Role updated successfully" : "Role created successfully"));
      handleCancel();
      router.refresh();
    } catch (error) {
      setFieldError(error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-4xl rounded-2xl p-0 border-0 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {id ? "Edit Role" : "Add Role"}
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            type="button"
          >
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
                <FormSwitch
                  control={control}
                  name="status"
                  label=""
                  switchPosition="right"
                  className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-3">Role Permissions</h3>
            <div className="p-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Dashboard</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-lg p-2 shrink-0">
                    <FormCheckbox control={control} name="viewDashboard" label="View Dashboard" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-lg p-2 shrink-0"> <FormCheckbox control={control} name="quickLinks" label="Quick Links" containerClassName="m-0" className="bg-white " /></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Inventory</span>
                <div className="flex flex-wrap gap-2">
                <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="inventory" label="View Inventory" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="viewBooks" label="View Books" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="addBook" label="Add Book" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="editBook" label="Edit Book" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="deleteBook" label="RFID & Location" containerClassName="m-0" className="bg-white " />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="viewTransactions" label="View Transactions" containerClassName="m-0" className="bg-white "   />
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="actionTransactions" label="Action Transactions" containerClassName="m-0" className="bg-white "   />
                  </div>
                  
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Circulation</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="useScanner" label="Use Scanner" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="issueBook" label="Issue Book" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="returnBook" label="Return Book" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="renewBook" label="Renew Book" containerClassName="m-0" className="bg-white "/>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Loans</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="loanList" label="Loan List" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="returnBook" label="Return Book" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="renewBook" label="Renew Book" containerClassName="m-0" className="bg-white "/>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Users</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="userList" label="User List" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="addUser" label="Add/Edit User" containerClassName="m-0" className="bg-white "/>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Settings</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="viewSettings" label="View Settings" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="viewSettings" label="Manage Policy" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="editSettings" label="Manage Role" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="deleteSettings" label="Manage Employee" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="addLocation" label="Manage Location" containerClassName="m-0" className="bg-white "/>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4 mb-4 ">
                    <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Reports</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="viewReports" label="View Reports" containerClassName="m-0" className="bg-white "/>
                  </div>
                    <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="exportReports" label="Export" containerClassName="m-0" className="bg-white "/>
                  </div>
                
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#E2E8F0] rounded-lg p-3 pb-4">
                <span className="text-sm font-medium text-[#0F172B] shrink-0 w-24">Activity Log</span>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="activityLog" label="View Activity Log" containerClassName="m-0" className="bg-white "/>
                  </div>
                  <div className="bg-[#00796B0D] border border-[#00796B4D] rounded-md p-2 shrink-0">
                    <FormCheckbox control={control} name="exportActivityLog" label="Export" containerClassName="m-0" className="bg-white "/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pt-6 pb-6">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0"
            >
              {isSubmitting ? (id ? "Updating..." : "Saving...") : (id ? "Update" : "Save")}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormDialog;
