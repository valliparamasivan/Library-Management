"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

const FormTextarea = ({
  name,
  control,
  label,
  placeholder = "",
  disabled = false,
  className = "bg-white border border-[#D9D9D9] min-h-[64px] rounded-sm px-4",
  rules = {},
  error = null,
  rows = 4,
  maxLength,
  required = false,
  showCounter = false,
  prefix = null,
  suffix = null,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </Label>
      )}
      <div className="relative w-full">
        {prefix && <div className="absolute left-3.5 top-3 text-sm text-gray-600 pointer-events-none">{prefix}</div>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <>
              <Textarea
                {...field}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(className, prefix && "pl-10", suffix && "pr-16!", (error || fieldState.invalid) && "border-destructive", showCounter && "pr-14 pb-6")}
                rows={rows}
                maxLength={maxLength}
              />
              {showCounter && maxLength && (
                <span className="pointer-events-none mt-1 text-right  text-xs text-gray-500">
                  {field.value ? String(field.value).length : 0}/{maxLength}
                </span>
              )}
              {(error || fieldState.error) && <p className="font-medium text-red-600 text-xs mt-1 ml-1">{error || fieldState.error?.message}</p>}
            </>
          )}
        />
        {suffix && <div className="absolute right-3 top-3 text-sm text-gray-600 pointer-events-none">{suffix}</div>}
      </div>
    </div>
  );
};

export default FormTextarea;
