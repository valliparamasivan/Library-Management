"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ButtonWidget from "@/components/widgets/ButtonWidget";

const FILTER_OPTIONS = [
  { label: "All Books", value: "all", apiValue: "ALL" },
  { label: "Available", value: "available", apiValue: "AVAILABLE" },
  { label: "In Transaction", value: "issued", apiValue: "IN_TRANSACTION" },
];

const BookFilter = ({ totalCount = 0, activeFilter = "ALL", onFilterChange }) => {
  const [open, setOpen] = useState(false);

  const activeOption = FILTER_OPTIONS.find((o) => o.apiValue === activeFilter) || FILTER_OPTIONS[0];

  const handleFilterChange = (value) => {
    if (onFilterChange) {
      onFilterChange(value);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonWidget
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-lg bg-white border border-[#00796B] hover:bg-gray-50 text-gray-700 flex items-center gap-2"
        >
          <Filter className="w-4 h-4 text-[#00796B]" />
          <span className="text-sm font-medium text-gray-700">
            {activeOption.label} ({String(totalCount).padStart(2, "0")})
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </ButtonWidget>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1 border border-gray-200 shadow-lg bg-white rounded-lg" align="end">
        <div className="flex flex-col">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleFilterChange(option.value)}
              className={`px-4 py-2 text-sm text-left rounded-md transition-colors ${
                option.apiValue === activeFilter
                  ? "bg-[#00796B]/10 text-[#00796B] font-medium"
                  : "hover:bg-gray-100"
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

export default BookFilter;
