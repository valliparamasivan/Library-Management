"use client";

import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ActivityFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      bookCategory: "",
      bookType: "",
      language: "",
      rfidTagged: false,
      rfidUntagged: false,
    },
  });

  const onSubmit = (data) => {
    console.log("Filter data:", data);
  };

  const userOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Doe", label: "Jane Doe" },
    { value: "Jim Doe", label: "Jim Doe" },
    { value: "Jill Doe", label: "Jill Doe" },
    { value: "Jack Doe", label: "Jack Doe" },
    { value: "Jill Doe", label: "Jill Doe" },
  ];  


  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Mandarin", label: "Mandarin" },
    { value: "Italian", label: "Italian" },
  ];

  const loanStatusOptions =[
    {value:"due",label:"Due"},
    {value:"overdue",label:"OverDue"}
  ]

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      reset({
        bookCategory: "",
        bookType: "",
        language: "",
        rfidTagged: false,
        rfidUntagged: false,
      });
    }
  };

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
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900">Filter</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            <div>
              <FormSelect
                control={control}
                name="user"
                label="User"
                placeholder="Select User Category"
                options={userOptions}
              />
            </div>

            <div>
              <FormInput
                control={control}
                name="Title"
                label="Title"
                placeholder="Enter Title"
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="isbn"
                label="ISBN"
                placeholder="Select Isbn"
                options={languageOptions}
              />
            </div>

            <div>
              <FormSelect
                control={control}
                name="Loan Status"
                label="Loan Status"
                placeholder="Select Loan Status"
                options={loanStatusOptions}
              />
            </div>
          </div>

          <div className="border-t px-6 py-4">
            <ButtonWidget
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full text-white font-bold h-10 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90"
            >
              Filter
            </ButtonWidget>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityFilter;

