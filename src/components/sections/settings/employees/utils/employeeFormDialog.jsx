"use client";

import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { EmployeeFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, SquarePen, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useEmployeeCreate, useEmployeeUpdate } from "@/store/hooks/SettingsHooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EmployeeFormDialog = ({ isOpen, onOpenChange, id, rolesResponse, employeeData }) => {
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(EmployeeFormSchema),
    mode: "onSubmit",
    defaultValues: {
      employeeName: "",
      email: "",
      mobile: "",
      role: "",
      profileImage: null,
      createPassword: "",
      confirmPassword: "",
    },
  });

  const rolesDataArr = rolesResponse?.data?.content || rolesResponse?.data || [];
  const roleOptions = rolesDataArr.map(role => ({
    value: String(role.roleId),
    label: role.roleName,
  }));

  useEffect(() => {
    if (isOpen && id && employeeData) {
      if (employeeData.profileImage || employeeData.profileImg) {
        const imageStr = employeeData.profileImage || employeeData.profileImg;
        setProfileImageUrl(
          imageStr.startsWith("http") ? imageStr : `https://libraryapi.corpfield.com/profile-image/${imageStr}`
        );
      } else {
        setProfileImageUrl(null);
      }

      const mappedRole = rolesDataArr.find(r => r.roleName === employeeData.role);
      const roleIdStr = mappedRole ? String(mappedRole.roleId) : "";
      
      reset({
        employeeName: employeeData.employeeName || "",
        email: employeeData.emailId || "",
        mobile: employeeData.mobileNo || "",
        role: roleIdStr,
        profileImage: null,
        createPassword: "",
        confirmPassword: "",
      });
    } else if (isOpen && !id) {
      setProfileImageUrl(null);
      reset({
        employeeName: "",
        email: "",
        mobile: "",
        role: "",
        profileImage: null,
        createPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, id, employeeData, reset]);

  const { mutateAsync: employeeCreate } = useEmployeeCreate();
  const { mutateAsync: employeeUpdate } = useEmployeeUpdate();
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  const onSubmit = async (data) => {
    try {
      const submittedRoleName = rolesDataArr.find(r => String(r.roleId) === data.role)?.roleName || data.role;
      
      const formData = new FormData();
      formData.append("employeeName", data.employeeName);
      formData.append("emailId", data.email);
      formData.append("mobileNo", data.mobile);
      formData.append("role", submittedRoleName);
      formData.append("active", "true");

      if (data.profileImage instanceof File) {
        formData.append("profileImage", data.profileImage);
      }

      const response = id ? await employeeUpdate({ id, data: formData }) : await employeeCreate(formData);
      showSuccessToast(response?.message || (id ? "Employee updated successfully" : "Employee created successfully"));
      handleCancel();
      router.refresh();
    } catch (error) {
      setFieldError(error);
    }
  };

  const handleCancel = () => {
    reset();
    setProfileImageUrl(null);
    onOpenChange(false);
  };

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      reset();
      setProfileImageUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-2xl rounded-2xl p-0 border-0 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 border-b pb-2 border-[#E6E6E6]">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {id ? "Edit Employee" : "Add Employee"}
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
          <div className="px-6 overflow-y-auto flex-1 min-h-0 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900">Profile Picture</h3>
                <Controller
                  name="profileImage"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const handleUploadClick = () => {
                      document.getElementById("employee-profile-image-upload")?.click();
                    };
                    const handleFileChange = (e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    };
                    return (
                      <div className="flex flex-col items-start">
                        <input
                          type="file"
                          id="employee-profile-image-upload"
                          accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div
                          className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shrink-0"
                          onClick={handleUploadClick}
                        >
                          {value || profileImageUrl ? (
                            <img
                              src={value instanceof File ? URL.createObjectURL(value) : profileImageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className="mt-3 p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-600"
                          title={value || profileImageUrl ? "Change" : "Upload"}
                        >
                          {value || profileImageUrl ? <SquarePen className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Only support .jpg, .png and .svg</p>
                      </div>
                    );
                  }}
                />
              </div>


              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900">Employee Details</h3>
                <div className="space-y-4">
                  <FormInput
                    control={control}
                    name="employeeName"
                    label="Employee Name"
                    placeholder="Enter Employee Name"
                    required
                  />
                  <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Enter Email ID"
                    required
                  />
                  <FormInput
                    control={control}
                    name="mobile"
                    label="Mobile No"
                    placeholder="Enter Mobile No"
                    required
                  />
                  <FormSelect
                    control={control}
                    name="role"
                    label="Role"
                    placeholder="Select Role"
                    options={roleOptions}
                    required
                  />

                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-3 pt-4 border-t border-[#E6E6E6]">
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

export default EmployeeFormDialog;
