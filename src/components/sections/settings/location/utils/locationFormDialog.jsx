"use client";

import FormInput from "@/components/form/FormInput";
import FormSwitch from "@/components/form/FormSwitch";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { LocationFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useLocationCreate, useLocationUpdate } from "@/store/hooks/SettingsHooks";
import { useRouter } from "next/navigation";

const LocationFormDialog = ({ isOpen, onOpenChange, id, locationData }) => {
  const router = useRouter();
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(LocationFormSchema),
    mode: "onSubmit",
    defaultValues: {
      section: "",
      shelf: "",
      row: "",
      status: 0,
    },
  });

  const { mutateAsync: locationCreate } = useLocationCreate();
  const { mutateAsync: locationUpdate } = useLocationUpdate();
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  useEffect(() => {
    if (isOpen && id && locationData) {
      reset({
        section: locationData.sectionName || "",
        shelf: locationData.shelfName || "",
        row: locationData.rowName || "",
        status: locationData.status ? 1 : 0,
      });
    } else if (isOpen && !id) {
      reset({
        section: "",
        shelf: "",
        row: "",
        status: 0,
      });
    }
  }, [isOpen, id, locationData, reset]);

  const onSubmit = async (data) => {
    try {
      const isEditMode = !!id;
      let payload;
      let response;

      if (isEditMode) {
        payload = {
          locationId: id,
          sectionName: data.section,
          shelfId: locationData?.shelfId || 0,
          shelfName: data.shelf,
          rowId: locationData?.rowId || 0,
          rowName: data.row,
          status: data.status === 1
        };
        response = await locationUpdate(payload);
      } else {
        payload = {
          sectionName: data.section,
          shelves: data.shelf,
          rows: data.row,
          status: true
        };
        response = await locationCreate(payload);
      }

      showSuccessToast(response?.message || "Location saved successfully");
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
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm max-h-[90vh] overflow-y-auto p-4 sm:p-4">
        <DialogHeader className="flex flex-col justify-between pb-0 sm:pb-0">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">{id? "Edit Location" : "Add Location"}</DialogTitle>
          <DialogDescription className="sr-only">{id? "Edit Location" : "Add Location"}</DialogDescription>
        </DialogHeader>
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <div className="py-3 sm:py-4 space-y-4 sm:space-y-4">
            <FormInput 
              control={control} 
              name="section" 
              label="Section" 
              placeholder="Section Name" 
              required 
            />
            <FormInput 
              control={control} 
              name="shelf" 
              label="Shelf" 
              placeholder="Enter Shelf (e.g., 1, 2, 3)" 
              required 
            />
            <FormInput 
              control={control} 
              name="row" 
              label="Row" 
              placeholder="Enter Row (e.g., 1, 2, 3)" 
              required 
            />
            {id && (
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <FormSwitch 
                  control={control} 
                  name="status" 
                  label="Status" 
                  switchPosition="right"
                  labelclassName="text-sm font-medium text-gray-900"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <ButtonWidget type="button" onClick={handleCancel} variant="outline" className="h-10 px-6 sm:px-14 border-[#D9D9D9] hover:bg-gray-50 rounded-sm w-full sm:w-auto">Cancel</ButtonWidget>
            <ButtonWidget type="submit" disabled={isSubmitting} loading={isSubmitting} className="text-white font-bold h-10 px-6 sm:px-14 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90 w-full sm:w-auto">{isSubmitting ? (id ? "Updating..." : "Saving...") : (id ? "Update" : "Save")}</ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default LocationFormDialog;
