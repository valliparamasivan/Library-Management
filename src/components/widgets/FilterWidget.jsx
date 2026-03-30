"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { preserveFiltersInURL, removeOnlyFilters } from "@/helpers/URLHelper";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import ButtonWidget from "./ButtonWidget";

const FilterWidget = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(() => {
    const statusParam = searchParams.get("status");
    return statusParam ? statusParam.split("_") : [];
  });

  const statusOptions = [
    { value: "list-all", label: "List All" },
    { value: "deployed", label: "Deployed" },
    { value: "ready-to-deploy", label: "Ready to Deploy" },
    { value: "pending", label: "Pending" },
    { value: "un-deployable", label: "Un-deployable" },
    { value: "byod", label: "BYOD" },
    { value: "archived", label: "Archived" },
    { value: "requestable", label: "Requestable" },
    { value: "due-for-audit", label: "Due for Audit" },
    { value: "due-for-checkin", label: "Due for Checkin" },
  ];

  const filteredStatusOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return statusOptions;
    return statusOptions.filter((status) => status.label.toLowerCase().includes(query) || status.value.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleStatusToggle = (statusValue, e) => {
    e.preventDefault();
    e.stopPropagation();

    const newStatuses = selectedStatuses.includes(statusValue) ? selectedStatuses.filter((status) => status !== statusValue) : [...selectedStatuses, statusValue];

    setSelectedStatuses(newStatuses);

    const filterUpdates = {
      status: newStatuses.length > 0 ? newStatuses.join("_") : null,
    };
    const newParamsString = preserveFiltersInURL(searchParams, filterUpdates);
    const newUrl = `?${newParamsString}`;
    router.replace(newUrl, { scroll: false });
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedStatuses([]);
    setSearchQuery("");

    const newParamsString = removeOnlyFilters(searchParams, ["status"]);
    const newUrl = `?${newParamsString}`;
    router.replace(newUrl, { scroll: false });

    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <ButtonWidget variant="outline" size="sm" className="h-9 px-3 rounded-sm text-gray-600 bg-white hover:bg-gray-50 border border-gray-300  flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Filter</span>
        </ButtonWidget>
      </PopoverTrigger>
      <PopoverContent className="p-3" align="end" style={{ width: "256px", maxWidth: "256px" }}>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Filter by Status</h3>
            <ButtonWidget type="button" variant="outline" size="sm" onClick={handleClearFilters} className="h-6 px-2 text-xs rounded-md">
              Clear
            </ButtonWidget>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#BEC2C4]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search status..."
              className="h-9 pl-9 pr-9 rounded-[12px] border border-[#BEC2C4] w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BEC2C4] hover:text-gray-600 transition-colors" type="button">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-auto space-y-1">
            {filteredStatusOptions.map((status, index) => {
              const checked = selectedStatuses.includes(status.value);
              return (
                <div key={`${status.value}-${index}`} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={checked}
                    onCheckedChange={(_isChecked) => {
                      handleStatusToggle(status.value, { preventDefault: () => {}, stopPropagation: () => {} });
                    }}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`status-${status.value}`} className="cursor-pointer text-sm">
                    {status.label}
                  </Label>
                </div>
              );
            })}
            {filteredStatusOptions.length === 0 && <p className="text-center text-sm text-gray-500 py-6">No status found</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterWidget;
