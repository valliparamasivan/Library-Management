"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormSelect from "@/components/form/FormSelect";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { useForm, Controller } from "react-hook-form";
import { Filter } from "lucide-react";

const LocationFilterWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            location: "",
        },
    });

    const onSubmit = (data) => {
        console.log("Filter data:", data);
        // Handle filter logic here
        // onOpenChange(false);
    };

    const locationOptions = [
        { value: "Library", label: "Library" },
        { value: "Office", label: "Office" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Other", label: "Other" },
    ];

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            reset({
                location: ""
            });
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <ButtonWidget
                    variant="outline"
                    size="sm"
                    className="h-9 px-2 sm:px-3 rounded-sm text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-1.5 sm:gap-2"
                >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span className="text-xs sm:text-sm text-gray-600">Filter</span>
                </ButtonWidget>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                    <SheetTitle className="text-base sm:text-lg font-semibold text-gray-900">Filter</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 space-y-4 sm:space-y-6">
                        <div>
                            <FormSelect
                                control={control}
                                name="role"
                                label="Location"
                                placeholder="Select Location"
                                options={locationOptions}
                            />
                        </div>
                    </div>

                    <div className="border-t px-4 sm:px-6 py-3 sm:py-4">
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

export default LocationFilterWidget;

