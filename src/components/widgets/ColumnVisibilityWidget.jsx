"use client";

import Five from "@/assets/icons/6.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import ButtonWidget from "./ButtonWidget";
import ImageWidget from "./ImageWidget";
import TooltipWidget from "./TooltipWidget";

const ColumnVisibilityWidget = ({
  columns = [],
  isColumnVisible,
  toggleColumnVisibility,
  className = "",
  buttonClassName = "focus:bg-transparent focus:text-accent-foreground",
  contentClassName = "w-64",
  placeholder = "Search columns...",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filteredColumns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return columns;
    return columns.filter(
      (column) =>
        String(column?.label ?? "")
          .toLowerCase()
          .includes(q) ||
        String(column?.key ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [columns, query]);

  const handleColumnToggle = useCallback(
    (columnKey, e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleColumnVisibility(columnKey);
    },
    [toggleColumnVisibility],
  );

  const handleClearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <TooltipWidget key="columnVisibility" content="Column">
        <PopoverTrigger asChild>
          <ButtonWidget
            variant="outline"
            className={cn(
              `h-9 px-3 cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-black p-2 shadow-sm flex-1 sm:flex-none  border-0 text-gray-700${buttonClassName}`,
              className,
            )}
          >
            <ImageWidget src={Five} alt="Icon" className="w-5 h-5" />
            <ChevronDown className="w-4 h-4 text-black" />
          </ButtonWidget>
        </PopoverTrigger>
      </TooltipWidget>

      <PopoverContent className="p-3" align="end" style={{ width: contentClassName || "256px", maxWidth: contentClassName || "256px" }}>
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Column Visibility</h3>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#BEC2C4]" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} className="h-9 pl-9 pr-9 rounded-[12px] border border-[#BEC2C4] w-full" />
            {query && (
              <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BEC2C4] hover:text-gray-600 transition-colors" type="button">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-auto space-y-1">
            {filteredColumns?.map((column, index) => {
              const checked = isColumnVisible(column.key);
              return (
                <div key={`${column.key}-${index}`} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50">
                  <Checkbox
                    id={`column-${column.key}`}
                    checked={checked}
                    onCheckedChange={(_isChecked) => {
                      handleColumnToggle(column.key, { preventDefault: () => {}, stopPropagation: () => {} });
                    }}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={`column-${column.key}`} className="cursor-pointer text-sm">
                    {column.label}
                  </Label>
                </div>
              );
            })}
            {filteredColumns?.length === 0 && <p className="text-center text-sm text-gray-500 py-6">No columns found</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColumnVisibilityWidget;
