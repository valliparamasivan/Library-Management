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

const TransactionStatusFilter = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusParam = searchParams.get("status");
  const currentFilter = statusParam || "all-status";

  const filterOptions = [
    { label: "All Status", value: "all-status" },
    { label: "Checked-Out", value: "Checked-Out" },
    { label: "Renewed", value: "Renewed" },
    { label: "Check-In", value: "Check-In" },
    { label: "Overdue", value: "Overdue" },
  ];

  const handleFilterChange = (value) => {
    const filterUpdates = { status: value };
    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;

    setOpen(false);

    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  const currentLabel = filterOptions.find((opt) => opt.value === currentFilter)?.label || "All Status";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonWidget
          variant="outline"
          size="sm"
          className="h-9 px-3 sm:px-4 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2 flex-shrink-0"
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </ButtonWidget>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1 border-0 shadow-lg rounded-lg" align="start">
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

export default TransactionStatusFilter;
