"use client";

import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { UserFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, SquarePen, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useCreateUser } from "@/store/hooks/UserHooks";

const UserDialog = ({ isOpen, onOpenChange, id, policyDropdown }) => {
  const router = useRouter();
  const { mutateAsync: submitUser, isPending } = useCreateUser();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const policyOptions =
    policyDropdown?.data?.map((item) => ({
      value: String(item.policyId),
      label: item.policyName,
    })) || [];

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      profileImage: null,
      policy: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("internalUserId", id != null && id !== "" ? String(id) : "0");
      formData.append("status", "true");
      formData.append("userName", data.name || "");
      formData.append("email", data.email || "");
      formData.append("phoneNumber", data.mobile || "");
      formData.append("policyId", data.policy || "");
      if (data.profileImage && data.profileImage instanceof File) {
        formData.append("profileImg", data.profileImage);
      }

      const response = await submitUser(formData);
      showSuccessToast(response?.message ?? "User saved successfully");
      reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      showErrorToast(error?.data?.message ?? error?.message ?? "Could not save user");
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
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-2xl rounded-2xl p-0 border-0 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 border-b pb-2 border-[#E6E6E6]">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {id ? "Edit User" : "Add User"}
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
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    const handleUploadClick = () => {
                      document.getElementById("profile-image-upload")?.click();
                    };
                    const handleFileChange = (e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    };
                    return (
                      <div className="flex flex-col items-start">
                        <input
                          type="file"
                          id="profile-image-upload"
                          accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <div
                          className="w-28 h-28 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors shrink-0"
                          onClick={handleUploadClick}
                        >
                          {value ? (
                            <img
                              src={value instanceof File ? URL.createObjectURL(value) : value}
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
                          title={value ? "Change" : "Upload"}
                        >
                          {value ? <SquarePen className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Only support .jpg, .png and .svg</p>
                        {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
                      </div>
                    );
                  }}
                />
              </div>

              <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900">User Details</h3>
                <div className="space-y-4">
                  <FormInput
                    control={control}
                    name="name"
                    label="Name"
                    placeholder="Enter Name"
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
                    name="policy"
                    label="Policy"
                    placeholder="Select Policy"
                    options={policyOptions}
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
              disabled={isPending}
              className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              disabled={isPending}
              loading={isPending}
              className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0"
            >
              {id ? "Update" : "Save"}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
