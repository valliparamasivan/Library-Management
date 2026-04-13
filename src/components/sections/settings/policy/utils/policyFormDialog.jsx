"use client";

import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { PolicyFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useReportPolicyCreate, useReportPolicyUpdate } from "@/store/hooks/SettingsHooks";

const PolicyFormDialog = ({ isOpen, onOpenChange, id, policyData }) => {
  console.log("policyData", policyData);
  const router = useRouter();
  const isEditMode = !!id;
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(PolicyFormSchema),
    mode: "onSubmit",
    defaultValues: {
      policyName: "",
      maxBooksAllowed: "",
      loanPeriodDays: "",
      finePerDay: "",
      maxRenewalPerBook: "",
      reservationLimit: "",
      reservationHoldPeriodDays: "",
      active: 0,
    },
  });

  const { mutateAsync: policyCreate } = useReportPolicyCreate();
  const { mutateAsync: policyUpdate } = useReportPolicyUpdate();
  const { showSuccessToast, showErrorToast, setFieldError } = useErrorHandler(setError);

  useEffect(() => {
    if (isOpen && policyData) {
      reset({
        policyName: policyData.policyName,
        maxBooksAllowed: policyData.maxBooksAllowed,
        loanPeriodDays: policyData.loanPeriodDays,
        finePerDay: policyData.finePerDay,
        maxRenewalPerBook: policyData.maxRenewalPerBook,
        reservationLimit: policyData.reservationLimit || "",
        reservationHoldPeriodDays: policyData.reservationHoldPeriodDays || "",
        active: policyData.active ? 1 : 0,
      });
    } else if (isOpen && !id) {
      reset({
        policyName: "",
        maxBooksAllowed: "",
        loanPeriodDays: "",
        finePerDay: "",
        maxRenewalPerBook: "",
        reservationLimit: "",
        reservationHoldPeriodDays: "",
        active: 0,
      });
    }
  }, [isOpen, id, policyData, reset]);

  const handleFormSubmit = async (data) => {
    try {
    
      const payload = {
        policyName: data.policyName,
        maxBooksAllowed: parseInt(data.maxBooksAllowed) || 0,
        loanPeriodDays: parseInt(data.loanPeriodDays) || 0,
        finePerDay: parseFloat(data.finePerDay) || 0,
        maxRenewalPerBook: parseInt(data.maxRenewalPerBook) || 0,
        reservationLimit: parseInt(data.reservationLimit) || 0,
        reservationHoldPeriodDays: parseInt(data.reservationHoldPeriodDays) || 0,
        active: data.active === 1,
      };
      
      const response = isEditMode
        ? await policyUpdate({ ...payload, policyId: policyData?.policyId || id })
        : await policyCreate(payload);
      const successMsg = (typeof response?.data === "string" ? response.data : null)
        || response?.message
        || (isEditMode ? "Policy updated successfully" : "Policy created successfully");
      showSuccessToast(successMsg);
      handleCancel();
      router.refresh();
    } catch (error) {
      setFieldError(error);
      showErrorToast(error);
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
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-xl rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 pt-4 border-b pb-2 border-[#E6E6E6]">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Policy" : "Add Policy"}
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            type="button"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <FormWrapper onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="px-6 overflow-y-auto flex-1 min-h-0 pb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Policy Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormInput control={control} name="policyName" label="Policy Name" placeholder="Enter Policy Name" required />
                </div>
                <FormInput control={control} name="maxBooksAllowed" label="Maximum Books Allowed" placeholder="Enter Count" type="number" required />
                <FormInput control={control} name="loanPeriodDays" label="Loan Period (Days)" placeholder="Enter Days" type="number" required />
                <FormInput control={control} name="finePerDay" label="Fine per Day" placeholder="0.0" type="number" required />
                <FormInput control={control} name="maxRenewalPerBook" label="Max Renewals per Book" placeholder="Enter Count" type="number" required />
                <FormInput control={control} name="reservationLimit" label="Reservation Limit" placeholder="Enter Limit" type="number" />
                <FormInput control={control} name="reservationHoldPeriodDays" label="Hold Period (Days)" placeholder="Enter Days" type="number" />
              </div>
              {isEditMode && <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <FormSwitch
                  control={control}
                  name="active"
                  label="Status"
                  switchPosition="right"
                  labelclassName="text-sm font-medium text-gray-900"
                />
              </div>}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6 pt-4 border-t border-gray-100 shrink-0">
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
              {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyFormDialog;
