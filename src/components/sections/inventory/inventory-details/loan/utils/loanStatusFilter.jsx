"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { preserveFiltersInURL } from "@/helpers/URLHelper";

const LoanStatusFilter = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const typeParam = searchParams.get("type");
    const currentFilter = typeParam === null ? 1 : parseInt(typeParam, 10);

    const filterOptions = [
        { label: "All Status", value: 1 },
        { label: "Checked-Out", value: 2 },
        { label: "Renewed", value: 3 },
        { label: "Overdue", value: 4 }
    ];

    const handleFilterChange = (value) => {
        const filterUpdates = { type: value };
        const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
        const newUrl = `${window.location.pathname}?${newParamsString}`;

        setOpen(false);

        requestAnimationFrame(() => {
            router.replace(newUrl, { scroll: false });
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ButtonWidget
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2 flex-shrink-0"
                >
                    <Filter className="w-4 h-4 text-[#00796B]" />
                    <span className="text-sm">{filterOptions.find(o => o.value === currentFilter)?.label || "All Status"}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </ButtonWidget>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 border border-gray-200 shadow-lg bg-white rounded-lg" align="start">
                <div className="flex flex-col">
                    {filterOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleFilterChange(option.value)}
                            className={`px-4 py-2 text-sm text-left hover:bg-gray-100 rounded-md transition-colors ${
                                currentFilter === option.value ? "bg-gray-50 font-medium" : ""
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default LoanStatusFilter;
