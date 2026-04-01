"use client";
import { X } from "lucide-react";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FormSelect = ({
  name,
  control,
  label,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  className = "bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 data-placeholder:text-gray-400",
  rules = {},
  error = null,
  required = false,
  onChange,
  showClearButton = false,
  width = false,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-600 ml-px">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <Select
                key={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (onChange) {
                    onChange(value);
                  }
                }}
                defaultValue={field.value}
                value={field.value}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn(
                    "w-full hover:bg-gray-50 transition-colors text-[13px]",
                    className,
                    (error || fieldState.invalid) && "border-red-600",
                    "data-placeholder:text-gray-400",
                    showClearButton &&
                      field.value &&
                      width &&
                      "[&_*[data-slot=select-value]]: [&_*[data-slot=select-value]]:max-w-[calc(100%-3.5rem)] [&_*[data-slot=select-value]]:truncate [&_*[data-slot=select-value]]:overflow-hidden [&_*[data-slot=select-value]]:block [&_*[data-slot=select-value]]:whitespace-nowrap",
                    showClearButton &&
                      field.value &&
                      !width &&
                      "**:data-[slot=select-value]:pr-6",
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option, index) => (
                    <SelectItem
                      key={`${option?.value}-${index}`}
                      value={String(option?.value)}
                      className="hover:bg-gray-100 transition-colors text-[13px]"
                    >
                      {option?.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showClearButton && field.value && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    field.onChange("");
                    if (onChange) {
                      onChange("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange("");
                      if (onChange) {
                        onChange("");
                      }
                    }
                  }}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors z-20 pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400",
                    width ? "right-9" : "right-10",
                  )}
                  aria-label="Clear selection"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </span>
              )}
            </div>
            {(error || fieldState.error) && (
              <p className="font-medium text-red-600 relative mt-1 text-xs ms-4">
                {error || fieldState.error?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default FormSelect;
