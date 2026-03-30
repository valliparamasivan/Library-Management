"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import FormSelect from "@/components/form/FormSelect";
import ButtonWidget from "./ButtonWidget";
import { useForm } from "react-hook-form";
import { Filter } from "lucide-react";
import { preserveFiltersInURL } from "@/helpers/URLHelper";

const InventoryFilterWidget = ({ languages, bookCategories, bookTypes, publishers }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      bookCategory: searchParams.get("categoryId") || "",
      bookType: searchParams.get("bookTypeId") || "",
      language: searchParams.get("language") || "",
      publisher: searchParams.get("publisher") || "",
      available: searchParams.get("available") || "",
      status: searchParams.get("status") || "",
    },
  });

  const onSubmit = (data) => {
    const filterUpdates = {};
    
    // Map form field names to API parameter names
    if (data.bookCategory && data.bookCategory !== "") {
      filterUpdates.categoryId = data.bookCategory;
    }
    if (data.bookType && data.bookType !== "") {
      filterUpdates.bookTypeId = data.bookType;
    }
    if (data.language && data.language !== "") {
      filterUpdates.language = data.language;
    }
    if (data.publisher && data.publisher !== "") {
      filterUpdates.publisher = data.publisher;
    }
    if (data.available && data.available !== "" && data.available !== "1") {
      filterUpdates.available = data.available;
    }
    if (data.status && data.status !== "" && data.status !== "1") {
      filterUpdates.status = data.status;
    }

    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;

    setIsOpen(false);

    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        bookCategory: searchParams.get("categoryId") || "",
        bookType: searchParams.get("bookTypeId") || "",
        language: searchParams.get("language") || "",
        publisher: searchParams.get("publisher") || "",
        available: searchParams.get("available") || "",
        status: searchParams.get("status") || "",
      });
    }
  }, [isOpen, searchParams, reset]);

  const handleClearFilters = () => {
    // Clear form fields
    reset({
      bookCategory: "",
      bookType: "",
      language: "",
      publisher: "",
      available: "",
      status: "",
    });
    
    // Clear URL parameters
    const filterUpdates = {
      categoryId: "",
      bookTypeId: "",
      language: "",
      publisher: "",
      available: "",
      status: "",
    };
    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;
    
    setIsOpen(false);
    
    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  const bookCategoryOptions = bookCategories?.data?.map((item) => ({
    value: String(item.bookCategoryId),
    label: item.category,
  })) || [];

 
  const languageOptions = languages?.data?.map((item) => ({
    value: item.language,
    label: item.language,
  })) || [];

  const bookTypeOptions = bookTypes?.data?.map((item) => ({
    value: String(item.bookTypeId),
    label: item.type,
  })) || [];
  const publisherOptions = publishers?.data?.map((publisher) => ({
    value: publisher.trim(),
    label: publisher.trim(),
  })) || [];

  const handleOpenChange = (open) => {
    setIsOpen(open);
  };

  const availabilityOptions = [
    { value: "1", label: "All File" },
    { value: "2", label: "Available" },
    { value: "3", label: "Not Available" },
  ];

  const statusOptions = [
    { value: "1", label: "All Files" },
    { value: "2", label: "Active" },
    { value: "3", label: "Inactive" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <ButtonWidget
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-sm text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-2"
        >
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Filter</span>
        </ButtonWidget>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 bg-white">
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900">Filter</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-2">
            <div>
              <FormSelect
                control={control}
                name="bookCategory"
                label="Book Category"
                placeholder="Select Book Category"
                options={bookCategoryOptions}
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="bookType"
                label="Book Type"
                placeholder="Select Book Type"
                options={bookTypeOptions}
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="publisher"
                label="Publisher"
                placeholder="Select Publisher"
                options={publisherOptions}
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="language"
                label="Language"
                placeholder="Select Language"
                options={languageOptions}
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="available"
                label="Availability"
                placeholder="Select Availability"
                options={availabilityOptions}
              />
            </div>
            <div>
              <FormSelect
                control={control}
                name="status"
                label="Status"
                placeholder="Select Status"
                options={statusOptions}
              />
            </div>
          </div>

          <div className="border-t px-6 py-4">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <ButtonWidget
                type="button"
                onClick={handleClearFilters}
                className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold h-10 rounded-md"
              >
                Cancel
              </ButtonWidget>
              <ButtonWidget
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white font-semibold h-10 rounded-md border-0"
              >
                Filter
              </ButtonWidget>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InventoryFilterWidget;

