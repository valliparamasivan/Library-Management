"use client";

import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import FormSelect from "@/components/form/FormSelect";
import { useForm } from "react-hook-form";
import { preserveFiltersInURL } from "@/helpers/URLHelper";
import { X } from "lucide-react";

const InventoryFilter = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      availabilityType: searchParams.get("availabilityType") || "",
      statusType: searchParams.get("statusType") || "",
    },
  });

  const availabilityOptions = [
    { value: "2", label: "Available" },
    { value: "3", label: "Unavailable" },
    { value: "1", label: "All" },
  ];

  const statusOptions = [
    { value: "2", label: "Active" },
    { value: "3", label: "Inactive" },
    { value: "1", label: "All" },
  ];

  const onSubmit = (data) => {
    const filterUpdates = {};
    if (data.availabilityType && data.availabilityType !== "all") {
      filterUpdates.availabilityType = data.availabilityType;
    }
    if (data.statusType && data.statusType !== "all") {
      filterUpdates.statusType = data.statusType;
    }

    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;

    setOpen(false);

    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  // Sync form with URL params when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        availabilityType: searchParams.get("availabilityType") || "",
        statusType: searchParams.get("statusType") || "",
      });
    }
  }, [open, searchParams, reset]);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
  };

  const handleCancel = () => {
    // Clear form fields
    reset({
      availabilityType: "",
      statusType: "",
    });
    
    // Clear URL parameters
    const filterUpdates = {
      availabilityType: "",
      statusType: "",
    };
    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;
    
    setOpen(false);
    
    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <>
      <ButtonWidget
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2"
      >
        <Filter className="w-4 h-4 text-[#00796B]" />
        <span>Filter</span>
      </ButtonWidget>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 border-0">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-200">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Filter
            </DialogTitle>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-4 space-y-6">
              <div>
                <FormSelect
                  control={control}
                  name="availabilityType"
                  label="Availability"
                  placeholder="Select Availability"
                  options={availabilityOptions}
                  className="bg-white border border-gray-300 min-h-[44px] rounded-md px-4"
                />
              </div>

              <div>
                <FormSelect
                  control={control}
                  name="statusType"
                  label="Status"
                  placeholder="Select Status"
                  options={statusOptions}
                  className="bg-white border border-gray-300 min-h-[44px] rounded-md px-4"
                />
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <ButtonWidget
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold h-10 rounded-md"
                >
                  Cancel
                </ButtonWidget>
                <ButtonWidget
                  type="submit"
                  className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white font-semibold h-10 rounded-md border-0"
                >
                  Filter
                </ButtonWidget>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryFilter;

