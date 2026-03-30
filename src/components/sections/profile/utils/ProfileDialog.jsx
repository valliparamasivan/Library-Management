"use client";

import FormInput from "@/components/form/FormInput";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Mail, Phone, User, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const ProfileWidget = ({ isOpen, onOpenChange, profileData }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Update form when profileData is provided
  useEffect(() => {
    if (profileData && isOpen) {
      reset({
        name: profileData.name || "",
        email: profileData.emailAddress || "",
        phone: profileData.phoneNo || "",
      });
    }
  }, [profileData, isOpen, reset]);

  const onSubmit = async (data) => {
    // Handle form submission
    console.log("Profile data:", data);
    onOpenChange(false);
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
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-lg rounded-lg p-0 border-0 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Edit User
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="shrink-0 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            type="button"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-gray-500" />
                  Full Name
                  <span className="text-red-600 ml-[-5px]">*</span>
                </label>
                <FormInput
                  control={control}
                  name="name"
                  label=""
                  placeholder="Enter Full Name"
                  required={false}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="phone" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                  <span className="text-red-600 ml-[-5px]">*</span>
                </label>
                <FormInput
                  control={control}
                  name="phone"
                  label=""
                  placeholder="Enter Phone Number"
                  required={false}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                  <span className="text-red-600 ml-[-5px]">*</span>
                </label>
                <FormInput
                  control={control}
                  name="email"
                  label=""
                  placeholder="Enter Email Address"
                  required={false}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6 pt-4 border-t border-gray-200">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0"
            >
              Save
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileWidget;
