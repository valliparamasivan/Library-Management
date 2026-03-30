"use client";
import { CustomerCheckbox } from "@/components/ui/customercheckbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";

const FormMultiSelect = ({
  name,
  control,
  label,
  options = [],
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  disabled = false,
  className = "border border-[#D9D9D9] min-h-[44px] rounded-[14px] px-4",
  rules = {},
  error = null,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(null);

  useEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        const { width } = triggerRef.current.getBoundingClientRect();
        setContentWidth(Math.round(width));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (open) {
      if (triggerRef.current) {
        const { width } = triggerRef.current.getBoundingClientRect();
        setContentWidth(Math.round(width));
      }
    } else {
      setQuery("");
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        String(opt?.label ?? "")
          .toLowerCase()
          .includes(q) ||
        String(opt?.value ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [options, query]);

  return (
    <div className="flex flex-col w-full">
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const selectedValues = Array.isArray(field.value) ? field.value : [];
          const selectedCount = selectedValues.length;

          return (
            <>
              <Popover open={open} onOpenChange={setOpen} className="w-full">
                <PopoverTrigger asChild>
                  <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    className={cn(
                      "w-full hover:bg-gray-50  transition-colors text-left flex items-center justify-between h-[44px] bg-white",
                      className,
                      (error || fieldState.invalid) && "border-red-600",
                    )}
                  >
                    <span className={cn("truncate text-sm", selectedCount === 0 ? "text-[#62748e]" : "text-black")}>
                      {selectedCount > 0
                        ? (() => {
                            const selectedOptions = options.filter((opt) => selectedValues.includes(String(opt.value)));
                            const displayOptions = selectedOptions.slice(0, 3);
                            const remainingCount = selectedCount - 3;

                            if (selectedCount <= 3) {
                              return displayOptions.map((opt) => opt.label).join(", ");
                            } else {
                              const displayText = displayOptions.map((opt) => opt.label).join(", ");
                              return `${displayText}${remainingCount > 0 ? ` +${remainingCount} more` : ""}`;
                            }
                          })()
                        : placeholder}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="p-3" align="start" style={{ width: contentWidth || undefined, maxWidth: "calc(100vw - 32px)" }}>
                  <div className="relative mb-3 ">
                    <Search className="w-4 h-4 absolute  left-3 top-1/2 -translate-y-1/2 " />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="h-9 pl-9 rounded-[12px] border border-[#92DEC2] w-full"
                    />
                  </div>

                  <div className="max-h-56 overflow-auto space-y-1">
                    {filteredOptions?.map((option, index) => {
                      const value = String(option?.value);
                      const checked = selectedValues.includes(value);
                      return (
                        <div key={`${value}-${index}`} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-50">
                          <CustomerCheckbox
                            id={`${name}-${value}`}
                            checked={checked}
                            onCheckedChange={(isChecked) => {
                              let next = selectedValues;
                              if (isChecked) {
                                next = [...selectedValues, value];
                              } else {
                                next = selectedValues.filter((v) => v !== value);
                              }
                              field.onChange(next);
                            }}
                            className="cursor-pointer"
                          />
                          <Label htmlFor={`${name}-${value}`} className="cursor-pointer text-sm">
                            {option?.label}
                          </Label>
                        </div>
                      );
                    })}
                    {filteredOptions?.length === 0 && <p className="text-center text-sm text-gray-500 py-6">No results</p>}
                  </div>
                </PopoverContent>
              </Popover>

              {(error || fieldState.error) && <p className="font-medium text-red-600 relative mt-1 text-xs ms-4">{error || fieldState.error?.message}</p>}
            </>
          );
        }}
      />
    </div>
  );
};

export default FormMultiSelect;
