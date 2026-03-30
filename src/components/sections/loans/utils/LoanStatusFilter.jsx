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
  const currentFilter = typeParam || "1";

  const filterOptions = [
    { label: "All", value: "1" },
    { label: "Checked Out", value: "2" },
    { label: "Checked In", value: "3" },
    { label: "Overdue", value: "4" },
    { label: "Renewed", value: "5" },
  ];

  const handleFilterChange = (value) => {
    const filterUpdates = { type: value === "1" ? undefined : value };
    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `${window.location.pathname}?${newParamsString}`;

    setOpen(false);

    requestAnimationFrame(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  const currentLabel =
    filterOptions.find((opt) => opt.value === currentFilter)?.label ||
    "All";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonWidget
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2"
        >
          <Filter className="w-4 h-4 text-[#00796B]" />
          <span>Filter</span>
          <ChevronDown className="w-4 h-4 text-gray-500 font-normal" />
        </ButtonWidget>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1 border-0 shadow-lg" align="start">
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
