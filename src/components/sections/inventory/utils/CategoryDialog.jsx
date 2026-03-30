"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/form/FormInput";
import FormWrapper from "@/components/form/FormWrapper";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { CategoryFormSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useBookCategoryCreate } from "@/store/hooks/InventoryHooks";

const CategoryDialog = ({ isOpen, onOpenChange, id, categoryData }) => {
  const router = useRouter();
  const isEditMode = !!id;
  const { control, handleSubmit, reset, setError, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(CategoryFormSchema),
    mode: "onSubmit",
    defaultValues: {
      category: "",
    },
  });

  const { mutateAsync: bookCategoryCreate } = useBookCategoryCreate();
  const { showSuccessToast, setFieldError } = useErrorHandler(setError);

  useEffect(() => {
    if (isOpen && categoryData) {
      reset({
        category: categoryData.category || "",
      });
    } else if (isOpen && !id) {
      reset({
        category: "",
      });
    }
  }, [isOpen, id, categoryData, reset]);

  const handleFormSubmit = async (data) => {
    try {
      const payload = {
        bookCategoryId: isEditMode ? (categoryData?.bookCategoryId || id) : 0,
        category: data.category,
        status: true,
      };
      
      const response = await bookCategoryCreate(payload);
      showSuccessToast(response.message);
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
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-lg p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-2">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            type="button"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
          </button>
        </div>

        <FormWrapper onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-2">
            <FormInput
              control={control}
              name="category"
              label="Category"
              placeholder="Enter Category"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-2 mt-4 sm:mt-6">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="w-full sm:w-auto h-10 px-6 sm:px-14 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-sm order-2 sm:order-1"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              className="w-full sm:w-auto text-white font-bold h-10 px-6 sm:px-14 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90 order-1 sm:order-2"
            >
              {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update" : "Save")}
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
